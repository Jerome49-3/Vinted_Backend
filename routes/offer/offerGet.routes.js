const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//models
const Offer = require("../../models/Offer");
const User = require("../../models/User");

router.get("/offers", async (req, res) => {
  console.log("je suis sur la route /offers");
  const { title, priceMin, priceMax, sort, page } = req.query;
  console.log(
    "req.query.title:",
    req.query.title,
    "\n",
    "req.query.priceMin:",
    req.query.priceMin,
    "\n",
    "req.query.priceMax:",
    req.query.priceMax,
    "\n",
    "req.query.sort:",
    req.query.sort
  );
  let ownerFind;
  let filter = {};
  let select = "";
  let skipNum = 0;
  let filterSort = {};
  let limitNum = 0;

  try {
    if (
      req.query.title ||
      req.query.priceMin ||
      req.query.priceMax ||
      req.query.sort !== undefined
    ) {
      // select = "product_name product_price -_id";
      // console.log('page:', page)
      if (
        title !== undefined ||
        priceMin !== undefined ||
        priceMax !== undefined ||
        sort === "price-desc" ||
        sort === "price-asc" ||
        page !== undefined ||
        page !== 0
      ) {
        filter.product_name = new RegExp(title, "i");
        console.log("filter.product_name:", filter.product_name);
      }
      if (priceMin !== undefined) {
        filter.product_price = { ...filter.product_price, $gte: priceMin };
      }
      if (priceMax !== undefined) {
        filter.product_price = { ...filter.product_price, $lte: priceMax };
      }
      if (sort === "price-desc") {
        filterSort.product_price = -1;
        console.log("price-desc:", filterSort);
      }
      if (sort === "price-asc") {
        filterSort.product_price = 1;
        console.log("price-asc:", filterSort);
      }
      //si page est différend de undefined et strictement supérieur à 0
      if (page !== undefined || page !== 0) {
        let limitNum = 3;
        skipPage = page - 1;
        skipNum = skipPage * limitNum;
      }
      // console.log(
      //   "skipPage",
      //   skipPage,
      //   "skipNum:",
      //   skipNum,
      //   "limitNum:",
      //   limitNum
      // );
      const offers = await Offer.find(filter)
        .sort(filterSort)
        .limit(limitNum)
        .skip(skipNum);
      // .select(select);
      console.log("offers in /offers:", offers);
      const offersWithOwner = await Promise.all(
        offers.map(async (offer) => {
          const owner = await User.findById(offer.owner).select("account");
          return {
            ...offer._doc,
            owner,
          };
        })
      );

      return res.status(200).json(offersWithOwner);
    } else {
      // console.log("ok");
      const newOffers = await Offer.find();
      // console.log("offers in /offers:", offers);
      let offers = [];
      // const getOffer = await Offer.find().select("product_name product_price -_id");
      // console.log("newOffers in /offers:", newOffers);
      for (let i = 0; i < newOffers.length; i++) {
        const el = newOffers[i];
        console.log("el:", el);
        const userId = el.owner;
        // console.log("userId in /offers:", userId);
        // console.log("typeof userId in /offers:", typeof userId);
        // const userIdIsValid = mongoose.isValidObjectId(userId);
        // console.log("userIdIsValid in /offers:", userIdIsValid);
        const ownerFind = await User.findById(userId).select("account");
        // console.log("ownerFind in for in /offers:", ownerFind);
        offers.push({
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
      console.log("offers in /offers:", offers);
      return res.status(200).json(offers);
    }
  } catch (error) {
    console.log("error:", error, "\n", "error.message:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

router.get("/offers/:id", async (req, res) => {
  console.log("je suis sur la route /offers/:id");
  const offerId = req.params.id;
  // console.log("offerId in /offers/:id", offerId);

  const offerIdIsValid = mongoose.isValidObjectId(offerId);
  // console.log("offerIdIsValid in /offers/:id:", offerIdIsValid);
  if (offerId !== undefined && offerIdIsValid !== false) {
    try {
      const offer = await Offer.findById(offerId);
      // console.log("offerId after findbyid in /offers/:id:", offerId);
      console.log("offer in /offers/:id:", offer);
      if (offer) {
        let detailsObj = {};
        const userId = offer.owner;
        // console.log("userId in /offers/:id:", userId);
        const ownerFind = await User.findById(userId).select("account");
        // console.log("ownerFind after findbyid in /offers/:id:", ownerFind);
        // const offerDetails = offer.product_details;
        // console.log("offerDetails:", offerDetails);
        return res.status(200).json({
          product_name: offer.product_name,
          product_description: offer.product_description,
          product_price: offer.product_price,
          product_details: offer.product_details,
          product_image: offer.product_image,
          product_pictures: offer.product_pictures,
          product_id: offer._id,
          owner: ownerFind,
        });
      }
    } catch (error) {
      console.log("error:", error, "\n", "error.message:", error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(400).json({ message: "bad request" });
  }
});

module.exports = router;
