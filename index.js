//************ CONFIG DOTENV *****************//
require("dotenv").config();

//************ CONFIG EXPRESS *****************//
const express = require("express");
const app = express();
app.use(express.json());

//************ CONFIG MONGOOSE *****************//
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI);

//************ CONFIG CORS *****************//
const cors = require("cors");
app.use(cors());

//************ CONFIG STRIPE *****************//
const stripe = require("stripe")(process.env.STRIPE_KEY_SECRET);

//************ CONFIG CLOUDINARY *****************//
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

//************ CONFIG WEBSOCKET *****************//
const WebSocket = require("ws");
const http = require("http");

// Création du serveur HTTP avant son utilisation
const server = http.createServer(app);
// console.log(`server:`, server);
const wss = new WebSocket.Server({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`)
    .pathname;

  if (pathname.startsWith("/messages/")) {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on("connection", (connection, request) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`)
    .pathname;
  const offerId = pathname.split("/")[2]; // Récupère l'ID de l'offre
  console.log(`Nouvelle connexion WebSocket pour l'offre ${offerId}`);

  connection.on("message", (message) => {
    try {
      const parsedMessage = JSON.parse(message);
      console.log(`Message reçu pour l'offre ${offerId}:`, parsedMessage);

      // Répercuter le message à tous les clients connectés à cette offre
      wss.clients.forEach((client) => {
        if (client !== connection && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ offerId, ...parsedMessage }));
        }
      });
    } catch (error) {
      console.error("Erreur lors du traitement du message:", error);
    }
  });

  connection.on("close", () => {
    console.log(`Connexion WebSocket fermée pour l'offre ${offerId}`);
  });
});

//************ CONFIG ROUTES *****************//
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
const myOffers = require("./routes/myOffers/myOffers.routes");
const mypurchases = require("./routes/mypurchases/mypurchases.routes");
const messagesPost = require("./routes/messages/messagesPost.routes.js");

//************ CALL ROUTES *****************//
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
app.use(myOffers);
app.use(mypurchases);
app.use(messagesPost);

//************ BASIC ROUTES *****************//
app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ message: "welcome to my replica of the vinted website" });
});

app.all("*", (req, res) => {
  console.log("all routes");
  res.status(404).json({ message: "All routes" });
});

// Utilisation correcte de server.listen après sa déclaration
server.listen(process.env.PORT, () => {
  console.log("Server started on port:", process.env.PORT);
});
