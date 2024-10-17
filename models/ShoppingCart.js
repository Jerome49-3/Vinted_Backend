const mongoose = require("mongoose");

const ShoppingCart = mongoose.model("ShoppingCart", {
  product_name: {
    type: String,
    maxLength: 50,
    required: true,
  },
  product_price: {
    type: Number,
    max: 100000,
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
  },
});
module.exports = ShoppingCart;
