const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const stripe = require("stripe")(process.env.STRIPE_KEY_SECRET);
const moment = require("moment/moment.js");

//models
const User = require("../../models/User.js");
const Offer = require("../../models/Offer.js");
const Transactions = require("../../models/Transactions.js");
// const ShoppingCart = require("../../models/ShoppingCart.js");

router.post("/payment", isAuthenticated, fileUpload(), async (req, res) => {
  console.log("je suis sur la route /payment");
  // console.log("req.user in /payment:", req.user);
  const { product_title, amount, product_id, product_price } = req.body;
  // console.log(
  //   "product_title in /payment",
  //   product_title,
  //   "\n",
  //   "amount in /payment:",
  //   amount,
  //   "\n",
  //   "product_price in /payment:",
  //   product_price,
  //   "\n",
  //   "product_id in /payment:",
  //   product_id,
  // );
  if (product_title && amount && product_id !== undefined) {
    const offers = await Offer.findById(product_id);
    // console.log("offers in /payment:", offers);
    // console.log("offers.product_price in /payment:", offers.product_price);
    if (product_price === Number(offers.product_price).toFixed(2)) {
      // console.log(
      //   "Number(offers.product_price).toFixed(2) in /payment:",
      //   Number(offers.product_price).toFixed(2)
      // );
      // console.log("product_price /payment", product_price);
      // console.log("product_price === Number(offers.product_price).toFixed(2)");
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          //montant transaction
          amount: amount,
          currency: "eur",
          description: product_title,
        });
        console.log("paymentIntent in /payment:", paymentIntent);
        if (paymentIntent.client_secret) {
          console.log(
            "paymentIntent.client_secret in /payment:",
            paymentIntent.client_secret
          );
          res.status(200).json(paymentIntent);
        } else {
          res.status(400).json({ message: error.message });
        }
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    }
  } else {
    res.status(400).json({ message: "oups, something went wrong" });
  }
});

module.exports = router;
