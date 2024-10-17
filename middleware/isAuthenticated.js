const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  // console.log(
  //   "req.headers.authorization in isAuthenticated:",
  //   req.headers.authorization
  // );
  //si headers token d'authorization
  if (!req.headers.authorization) {
    return res.status(403).json({ message: "forbidden" });
  } else {
    const auth = req.headers.authorization.replace("Bearer ", "");
    if (auth) {
      // console.log("authMiddleware:", auth);
      //chercher l'user par le token
      const user = await User.findOne({
        token: auth,
      }).select("account");
      // console.log("userMiddleware:", user);
      //si pas d'user
      if (!user) {
        return res
          .status(401)
          .json({ error: "Unathorized by isAuthenticated" });
      } else {
        req.user = user;
        // console.log("req.userMiddleware:", req.user);
        return next();
      }
    }
  }
};

module.exports = isAuthenticated;
