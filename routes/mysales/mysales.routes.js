const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const isAuthenticated = require("../../middleware/isAuthenticated.js");

//models
const Transactions = require("../../models/Transactions.js");

router.get("/mysales", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /mysales");
});

module.exports = router;
