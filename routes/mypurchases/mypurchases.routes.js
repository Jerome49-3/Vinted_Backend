const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated.js");

//models
const Offer = require("../../models/Offer.js");
const User = require("../../models/User");

router.get("/mypurchases/:id", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /mypurchases");
  const id = req.params.id;
  console.log("id on /mypurchases:", id);

  try {
    const offerSolded = await Offer.find({ owner: id });
    console.log("offerSolded on /mypurchases:", offerSolded);
    return res.status(200).json(offerSolded);
  } catch (error) {
    console.log("error on /mypurchases:", error);
  }
});

module.exports = router;
