require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
mongoose.connect(process.env.MONGODB_URI);
const cloudinary = require("cloudinary").v2;
const stripe = require("stripe")(process.env.STRIPE_KEY_SECRET);
//**** npx nodemon index.js ****//

//***routes****//
const signupRoutes = require("./routes/auth/signup.routes");
const confirmEmail = require("./routes/auth/confirmEmail.routes");
const loginRoutes = require("./routes/auth/login.routes");
const offerPost = require("./routes/offer/offerPost.routes");
const offerGet = require("./routes/offer/offerGet.routes");
const payment = require("./routes/payment/payment.routes");
const confirmPayment = require("./routes/payment/confirmPayment.routes");
const users = require("./routes/users/users");
const transactions = require("./routes/transactions/transactions.routes");
const usersPutDel = require("./routes/users/usersPutDel");
const mysales = require("./routes/mysales/mysales.routes");
const mypurchases = require("./routes/mypurchases/mypurchases.routes");
// const offerPutDel = require("./routes/offer/offerPutDel.routes");

//appel des routes//
app.use(cors());
app.use("/user", signupRoutes);
app.use("/user", confirmEmail);
app.use("/user", loginRoutes);
app.use(offerPost);
app.use(offerGet);
app.use(payment);
app.use(confirmPayment);
app.use(users);
app.use(usersPutDel);
app.use(transactions);
app.use(mysales);
app.use(mypurchases);
// app.use(offerPutDel);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ message: "welcome to my replica of the vinted website" });
});

app.all("*", (req, res) => {
  console.log("all routes");
  res.status(404).json({ message: "All routes" });
});
app.listen(process.env.PORT, () => {
  console.log("server started:" + "", process.env.PORT);
});
