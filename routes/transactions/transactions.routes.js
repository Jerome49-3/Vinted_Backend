const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/isAuthenticated.js");

//models
const Transactions = require("../../models/Transactions.js");

router.get("/transactions", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /transactions");
  const transactions = await Transactions.find();
  console.log("transactions in /transactions:", transactions);
  return res.status(200).json(transactions);
});

router.get("/transactions/:id", isAuthenticated, async (req, res) => {
  console.log("je suis sur la route /transactions/:id");
  const transId = req.params.id;
  console.log("transId in /transactions/:id:", transId);
  const transactions = await Transactions.findById(transId);
  console.log("transactions in /transactions:", transactions);
  return res.status(200).json(transactions);
});

module.exports = router;
