const jwt = require("jsonwebtoken");
const User = require("../models/user");
const createError = require("./Error");

const verifyToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.SK);

      req.user = await User.findById(decoded.id).select("-password");

      // console.log(req.user);

      next();
    } catch (error) {
      next(error);
    }
  } else {
    return next(createError(401, "Not authorized, no token!"));
  }
};

module.exports = verifyToken;
