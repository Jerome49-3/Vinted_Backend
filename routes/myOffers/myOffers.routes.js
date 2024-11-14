const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated.js");

//models
const Offer = require("../../models/Offer.js");
const User = require("../../models/User.js");

router.get("/myOffers", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /mysales");
  const user = req.user;
  console.log("user on /myOffers:", user);
  const userOffers = await Offer.find({ owner: user });
  console.log("userOffers on /myOffers:", userOffers);
  const userId = user.id;
  let arrUserOffers = [];
  for (let i = 0; i < userOffers.length; i++) {
    const el = userOffers[i];
    console.log("el:", el);
    const userId = el.owner;
    // console.log("userId in /offers:", userId);
    // console.log("typeof userId in /offers:", typeof userId);
    // const userIdIsValid = mongoose.isValidObjectId(userId);
    // console.log("userIdIsValid in /offers:", userIdIsValid);
    const ownerFind = await User.findById(userId).select("account");
    // console.log("ownerFind in for in /offers:", ownerFind);
    arrUserOffers.push({
      _id: el._id,
      product_name: el.product_name,
      product_description: el.product_description,
      product_price: el.product_price,
      product_details: el.product_details,
      product_image: el.product_image,
      product_pictures: el.product_pictures,
      offer_solded: el.offer_solded,
      owner: ownerFind,
    });
  }
  console.log("arrUserOffers on /myOffers:", arrUserOffers);
  res.status(200).json(arrUserOffers);
});

module.exports = router;
