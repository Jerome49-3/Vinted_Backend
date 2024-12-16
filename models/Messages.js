const mongoose = require("mongoose");

const Messages = mongoose.model("Messages", {
  message: {
    type: String,
    maxLength: 500,
    required: true,
  },
  date: {
    type: String,
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = Messages;
