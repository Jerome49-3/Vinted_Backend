const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const moment = require("moment/moment.js");
const fileUpload = require("express-fileupload");
const { Resend } = require("resend");
// console.log("resend:", Resend);
const resend = new Resend(process.env.RESEND_API_KEY);
const uid2 = require("uid2");

//models
const Offer = require("../../models/Offer.js");
const User = require("../../models/User.js");
const Messages = require("../../models/Messages.js");

router.post(
  "/messages/:OfferID",
  isAuthenticated,
  fileUpload(),
  async (req, res) => {
    console.log("Je suis sur la route /messages");
    const offerId = req.params.OfferID;
    // console.log("offerId:", offerId);
    const offer = await Offer.findById(offerId);
    // console.log("offer:", offer);
    const findSeller = await User.findById(offer.owner).select("email");
    console.log("findSeller.email:", findSeller.email);
    const { newMessage } = req.body;
    // console.log("newMessage:", newMessage);
    const buyer = req.user;
    // console.log("buyer:", buyer);
    const date = moment().locale("fr").format("L");
    console.log("date:", date);
    console.log("typeof date:", typeof date);
    const newMessages = new Messages({
      message: newMessage,
      date: date,
      owner: buyer,
      offer: offer,
    });
    console.log("newMessages:", newMessages);
    const savedMessage = await newMessages.save();
    if (savedMessage) {
      const numCid = uid2(16);
      const emailSend = await resend.emails.send({
        from: process.env.EMAIL_TO_ME,
        to: `${findSeller.email}`,
        subject: "you are a new message",
        html: `<strong>${newMessage}</strong>
        <br/>
        <img src="https://asset.cloudinary.com/djk45mwhr/541c8e8e80be1d96723c0cdff209c5bf" alt="bannière idev4u" width="600" height="300" />`,
      });
    }
    console.log("savedMessage:", savedMessage);

    res.status(200).json(Messages);
  }
);
module.exports = router;
