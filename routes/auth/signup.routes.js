const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const { SHA256 } = require("crypto-js");
const encBase64 = require("crypto-js/enc-base64");
const fileUpload = require("express-fileupload");
const moment = require("moment/moment.js");
const CryptoJS = require("crypto-js");
// const bcrypt = require('bcrypt');
// const saltRounds = 16;
const jwt = require("jsonwebtoken");
const Mailgun = require("mailgun.js");
const formData = require("form-data");
const generateCode = require("../../utils/generateCode");

//config mailgun
const mailgun = new Mailgun(formData);
const mgClient = mailgun.client({
  username: process.env.MAILGUN_USERNAME,
  key: process.env.MAILGUN_API_KEY,
});

//models
const User = require("../../models/User");

router.post("/signup", fileUpload(), async (req, res) => {
  console.log("je suis sur la route /signup");
  const { password, username, email, newsletter } = req.body;
  // console.log(
  //   "password in signup:",
  //   password,
  //   "\n",
  //   "username in signup:",
  //   username,
  //   "\n",
  //   "email in signup:",
  //   email,
  //   "\n",
  //   "newsletter in signup:",
  //   newsletter
  // );
  //si le champ username est vide, renvoyer un status Http400
  if (username.length === 0) {
    return res
      .status(400)
      .json({ message: "un champ du formulaire est manquant" });
  }
  //si le mot de passe est differend d'undefined
  if (password !== undefined && email !== undefined) {
    const userfindWithEmail = await User.findOne({ email: email });
    // console.log("userfindWithEmail in signup:", userfindWithEmail);
    if (userfindWithEmail) {
      return res
        .status(400)
        .json({ message: "email already exist: please login" });
    } else {
      try {
        // si password est egale à confirmPassword
        if (password) {
          //génerer le salt hash, token
          const salt = uid2(16);
          // console.log("salt in signup:", salt);
          const hash = SHA256(password + salt).toString(encBase64);
          // console.log("hash in signup:", hash);
          // const hash = await bcrypt.hash(password, 16);
          // console.log("hash in signup:", hash);
          // si le hash, token different de null
          const date = moment().format("DD MMM YYYY");
          console.log("date in /users:", date);
          if (hash !== null && hash !== undefined) {
            if (req.body !== undefined) {
              const newUser = new User({
                email: email,
                account: {
                  username: username,
                },
                newsletter: newsletter,
                hash: hash,
                salt: salt,
                date: date,
              });
              // const userObj = {
              //   _id: newUser.id,
              //   account: newUser.account,
              //   isAdmin: newUser.isAdmin,
              //   newsletter: newUser.newsletter,
              // };
              // // console.log("userObj:", userObj);
              // const token = CryptoJS.AES.encrypt(
              //   JSON.stringify(userObj),
              //   process.env.SRV_KEY_SECRET
              // ).toString();

              // console.log("token in /signup:", token);
              console.log("newUser in /signup:", newUser);
              // newUser.token = token;
              const code = generateCode(6);
              console.log("code in /signup:", code);
              console.log("typeof code in /signup:", typeof code);
              newUser.code = code;
              await newUser.save();
              const admin = `The negociator or The Tibo`;
              const subject = "Welcome to Vintaid, my replica of Vinted";
              const message = `Welcome ${username}, Here your code: ${code}, copy him and tape it at input for verifying your email, please`;
              const messageHtml = `
                  <p>Welcome ${username},</p>
                  <p>Welcome ${username}, Here your code: ${code}, copy him and tape it at input for verifying your email, please</p>
                  <br>
                  <p>Best regards,</p>
                  <p><strong>${admin}, The Vintaid Administrator has never tord ^_^ </strong></p>`;

              const response = await mgClient.messages.create(
                process.env.MAILGUN_SANDBOX,
                {
                  from: process.env.EMAIL_TO_ME,
                  to: `${username} <${email}>`,
                  subject: subject,
                  text: message,
                  html: messageHtml,
                }
              );
              console.log("responseMailgun on /signup:", response);
              return res.status(200).json({
                data: "Merci de confirmer votre email, en entrant le code recu par mail, possiblement dans vos spams ^_^",
              });
            }
          } else {
            return res
              .status(400)
              .json({ message: "les mots de passe ne correspondent pas" });
          }
        }
      } catch (error) {
        console.log(error);
        console.log(error.message);
        console.log(error.status);
      }
    }
  }
});

module.exports = router;
