const mongoose = require("mongoose");

const Offer = mongoose.model("Offer", {
  product_name: {
    type: String,
    maxLength: 50,
    required: true,
  },
  product_description: {
    type: String,
    maxLength: 500,
    required: true,
  },
  product_price: {
    type: Number,
    max: 100000,
    required: true,
  },
  product_details: Array,
  product_image: Object,
  product_pictures: Array,
  offer_solded: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = Offer;
