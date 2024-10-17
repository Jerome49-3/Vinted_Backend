const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const convertToBase64 = require("../utils/convertToBase64");
const isFileToUpload = async (req, res, next) => {
  try {
    // console.log("req.files.pictures before if:", "\n", req.files);
    if (req.files !== undefined || req.files.pictures !== 0) {
      //**** stocker req.files.pîctures ds une variable ****//
      const pictureToUpload = req.files.pictures;
      // console.log("pictureToUpload:", pictureToUpload);
      const arrayPictures = Array.isArray(pictureToUpload);
      // console.log("arrayPictures:", arrayPictures);
      if (arrayPictures === false) {
        const result = await cloudinary.uploader.upload(
          convertToBase64(pictureToUpload)
        );
        // console.log("resultnotPromise:", result);
        req.uploadOneFile = result;
        // console.log("coucouIFResult:", req.uploadOneFile);
        return next();
      } else if (arrayPictures === true) {
        console.log(
          "req.files.pictures after else if:",
          "\n",
          req.files.pictures
        );
        // console.log(
        //   "req.files.pictures after else if:",
        //   "\n",
        //   req.files.pictures
        // );
        const picUpload = req.files.pictures;
        // console.log("picturesToUpload:", picUpload);
        const arrayOfPromises = picUpload.map((picture) => {
          return cloudinary.uploader.upload(convertToBase64(picture));
        });
        const result = await Promise.all(arrayOfPromises);
        // console.log("resultPromise:", result);
        req.uploadMultiFile = result;
        // console.log("coucouIFResult:", req.uploadMultiFile);
        return next();
      }
    } else {
      return res.status(400).json({ message: "bad request" });
    }
  } catch (error) {
    console.log("error.message:", "\n", error.message);
    res.status(500).json({ message: error.message });
  }
};
module.exports = isFileToUpload;
