const express = require("express");
const router = express.Router();
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload");
const CryptoJS = require("crypto-js");
const { message } = require("statuses");
const jwt = require("jsonwebtoken");
const passwordValidator = require("../../utils/passwordValidation");

//models

const User = require("../../models/User");

router.post("/login", fileUpload(), async (req, res) => {
  console.log("je suis sur la route /login");
  try {
    const { password, email } = req.body;
    if (
      password !== undefined &&
      password !== null &&
      email !== undefined &&
      email !== null
    ) {
      // passwordValidator(password);
      const user = await User.findOne({ email: email });
      if (user) {
        console.log("user in /login:", user);
        const pwdHash = SHA256(password + user.salt).toString(encBase64);
        // console.log("pwdHash:", pwdHash, "\n", "user.salt:", user.salt);
        //if the password entered in input are the same of password record in database
        if (pwdHash === user.hash) {
          console.log("pwdHash:", pwdHash, "\n", "user.hash:", user.hash);
          // if the becomeAdmin key in database are True (first connection)
          if (user.becomeAdmin === true) {
            console.log(
              "user.isAdmin in /login:",
              user.isAdmin,
              "\n",
              "user.becomeAdmin in /login:",
              user.becomeAdmin,
              "\n",
              "user.token in /login",
              user.token
            );
            //I change the value of isAdmin key to true and change the value of becomeAdmin to false.
            user.isAdmin = true;
            user.becomeAdmin = false;
            const token = jwt.sign(
              {
                _id: user.id,
                account: user.account,
                isAdmin: user.isAdmin,
                newsletter: user.newsletter,
              },
              process.env.SRV_KEY_SECRET
            );
            console.log("token JWT after if in /login", token);
            user.token = token;
            await user.save();
            console.log(
              "user.isAdmin after user.save() in /login:",
              user.isAdmin,
              "\n",
              "user.becomeAdmin after user.save() in /login:",
              user.becomeAdmin
            );
            return res.status(200).json(token);
            // else if isAdmin and becomeAdmin are false, i send the token whithout change.
          } else if ((user.isAdmin && user.becomeAdmin) === false) {
            // console.log("user after else in /login:", user);
            const token = jwt.sign(
              {
                _id: user.id,
                account: user.account,
                isAdmin: user.isAdmin,
                newsletter: user.newsletter,
              },
              process.env.SRV_KEY_SECRET
            );
            user.token = token;
            await user.save();
            console.log("token JWT after else in /login:", token);
            return res.status(200).json(token);
          }
        } else {
          return res.status(400).json({
            message: "Oops, something went wrong: please check your input.",
          });
        }
      } else {
        return res.status(400).json({ message: "Bad request " });
      }
    }
  } catch (error) {
    console.log("error in catch:", error);
    return res.status(500).json({ message: "somethings went wrong" });
  }
});

module.exports = router;
