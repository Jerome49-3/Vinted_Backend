const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Mailgun = require("mailgun.js");
const fileUpload = require("express-fileupload");

//models
const User = require("../../models/User");

router.post("/confirmemail", fileUpload(), async (req, res) => {
  console.log("je suis sur la route /confirmemail");
  const { code } = req.body;
  console.log("code:", code);

  if (code) {
    const user = await User.findOne({ code: code });
    console.log("code in /confirmemail:", code);
    console.log("user in /confirmemail:", user);
    if (user) {
      if (code === user.code) {
        const token = jwt.sign(
          {
            _id: user.id,
            account: user.account,
            isAdmin: user.isAdmin,
            newsletter: user.newsletter,
          },
          process.env.SRV_KEY_SECRET
        );
        user.emailIsConfirmed = true;
        user.token = token;
        await user.save();

        return res.status(200).json({
          message:
            "Merci votre email est bien confirmé, vous aller être redirigé vers la route /publish",
          token: token,
        });
      }
    }
  } else {
    return res.status(400).json({ message: "Oups, somthing went wrong" });
  }
});

module.exports = router;
