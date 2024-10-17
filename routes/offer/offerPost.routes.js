const express = require("express");
const router = express.Router();
const Offer = require("../../models/Offer.js");
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const convertToBase64 = require("../../utils/convertToBase64.js");

router.post(
  "/offer/publish",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    console.log("je suis sur  la route in /offer/publish");
    console.log("req.user in /offer/publish:", req.user);

    // console.log("req:", req);
    try {
      const { title, description, price, condition, city, brand, size, color } =
        req.body;
      console.log(
        "title in /offer/publish:",
        title,
        "\n",
        "description in /offer/publish:",
        description,
        "\n",
        "price in /offer/publish:",
        price,
        "\n",
        "condition in /offer/publish:",
        condition,
        "\n",
        "city in /offer/publish:",
        city,
        "\n",
        "brand in /offer/publish:",
        brand,
        "\n",
        "size in /offer/publish:",
        size,
        "\n",
        "color in /offer/publish:",
        color
      );
      if (req.body !== undefined) {
        console.log(
          "req.user.id in /offer/publish:",
          req.user.id,
          "req.user.account.username in /offer/publish:",
          req.user.account.username
        );
        const newOffer = new Offer({
          product_name: title,
          product_description: description,
          product_price: price,
          product_details: [
            { MARQUE: brand },
            { TAILLE: size },
            { ÉTAT: condition },
            { COULEUR: color },
            { EMPLACEMENT: city },
          ],
          owner: req.user,
        });
        console.log("newOffer before Save:", newOffer);
        try {
          //**** verifier la précense de req.files.pîctures ****//
          console.log("req.files before if /offer/publish:", "\n", req.files);
          console.log(
            "req.files.pictures before if /offer/publish:",
            "\n",
            req.files.pictures
          );
          if (req.files !== null && req.files.pictures !== 0) {
            const arrayPictures = Array.isArray(req.files.pictures);
            console.log(
              "arrayPictures after if req.files !== null && req.files.pictures !== 0 on /offer/publish:",
              arrayPictures
            );
            if (arrayPictures !== false) {
              for (let i = 0; i < req.files.pictures.length; i++) {
                console.log(
                  "req.files.pictures[i] after for in /offer/publish:",
                  "\n",
                  req.files.pictures[i]
                );
                if (req.files.pictures[i].size < 10485760) {
                  console.log(
                    "req.files.pictures[i].size after for in /offer/publish::",
                    req.files.pictures[i].size
                  );
                  //**** je stocke req.files.pictures dans une constante ****//
                  const picUpload = req.files.pictures;
                  console.log("picUpload:", picUpload);
                  //**** pour chaque image convertir en base64 et envoyer les envoyer les images à cloudinary ****//
                  const arrayOfPromises = picUpload.map((picture) => {
                    console.log("picture:", picture);
                    return cloudinary.uploader.upload(
                      convertToBase64(picture),
                      {
                        folder: "vinted/offers/" + newOffer._id,
                      }
                    );
                  });
                  //**** attendre le fin de l'upload pour tous les fichiers et les stocker dans une constante ****//
                  const result = await Promise.all(arrayOfPromises);
                  console.log("resultPromise:", result);
                  //**** stocker les informations des images dans req ****//
                  req.uploadMultiFile = result;
                  console.log(
                    "req.uploadMultiFile in /publish:",
                    req.uploadMultiFile
                  );
                } else {
                  res.status(400).json({
                    message:
                      " one/many image size too large, max: 10485760 bytes. Please compress your file. You can do it here for example: https://compressor.io/",
                  });
                }
              }
            } else if (arrayPictures === false) {
              if (req.files.pictures.size < 10485760) {
                console.log(
                  "req.files.pictures.size after if in /offer/publish::",
                  req.files.pictures.size
                );
                //**** on convertit le buffer (données en language binaire, temporaire pour être utilisé) de l'image en base64 pour etre compris par cloudinary ****//
                const result = await cloudinary.uploader.upload(
                  convertToBase64(req.files.pictures),
                  {
                    folder: "vinted/offers/" + newOffer._id,
                  }
                );
                console.log("resultnotPromise:", result);
                //**** je stocke les données de la conversion en base64 du buffer de l'image dans req ****//
                req.uploadOneFile = result;
                console.log(
                  "req.uploadOneFile in /publish:",
                  req.uploadOneFile
                );
              } else {
                res.status(400).json({
                  message:
                    "image size too large, max: 10485760 bytes. Please compress your file. You can do it here for example: https://compressor.io/",
                });
              }
            }
          } else {
            return res
              .status(400)
              .json({ message: "bad request, please check your input" });
          }
        } catch (error) {
          //**** si le try echoue (erreur server), on retourne une erreur ****//
          console.log("error:", error, "\n", "error.message:", error.message);
        }
        console.log("newOffer._id:", newOffer._id);
        newOffer.product_image = req.uploadOneFile;
        newOffer.product_pictures = req.uploadMultiFile;
        await newOffer.save();
        console.log("newOffer after Save:", newOffer);
        return res.status(200).json({ newOffer, message: "produit crée" });
      } else {
        res.status(400).json({ message: "aucune valeur dans les champs" });
      }
    } catch (error) {
      console.log(error);
      console.log(error.status);
      return res.status(500).json({ message: error.message });
    }
  }
);
module.exports = router;
