const express = require("express");
const router = express.Router();
const isAuthenticated = require("../../middleware/isAuthenticated.js");
const moment = require("moment/moment.js");

//models
const User = require("../../models/User");

router.get("/users", isAuthenticated, async (req, res) => {
  // console.log("req.user:", req.user);
  const date = moment().format("l");
  // console.log("date in /users:", date);

  // return res.status(200).json({ message: "je suis sur la route /users" });
  try {
    const users = await User.find();
    // console.log("users in /users:", users);
    let lastUsers = [];
    for (let i = 0; i < users.length; i++) {
      const el = users[i];
      // console.log("el:", el);
      lastUsers.push({
        username: el.account.username,
        avatar: el.account.avatar,
        email: el.email,
        newsletter: el.newsletter,
        date: el.date,
        isAdmin: el.isAdmin,
        id: el._id,
        token: el.token,
      });
    }
    res.status(200).json(lastUsers);
  } catch (error) {
    console.log("error in catch:", error);
    return res.status(400).json({ message: "somethings went wrong" });
  }
});

router.get("/users/:id", isAuthenticated, async (req, res) => {
  // console.log("req.user:", req.user);
  const userId = req.params.id;
  // console.log("userId:", userId);
  // return res.status(200).json({ message: "je suis sur la route /users" });
  if (userId !== undefined) {
    try {
      const user = await User.findById(userId);
      // console.log("user in /users:id:", user);
      res.status(200).json({
        username: user.account.username,
        avatar: user.account.avatar,
        email: user.email,
        newsletter: user.newsletter,
        date: user.date,
        isAdmin: user.isAdmin,
        id: user._id,
      });
    } catch (error) {
      console.log("error in catch:", error);
      return res.status(400).json({ message: "somethings went wrong" });
    }
  } else {
    return res.status(400).json({ message: "Bad request" });
  }
});

module.exports = router;
