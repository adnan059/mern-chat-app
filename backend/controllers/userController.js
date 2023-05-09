const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("../utils/Error");

// register
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, pic } = req.body;
    const hashedPswd = await bcrypt.hash(password, 6);

    const newUser = new User({
      name,
      email,
      password: hashedPswd,
      pic,
    });

    const savedUser = await newUser.save();

    const { _id } = savedUser._doc;

    const token = jwt.sign({ id: _id }, process.env.SK, { expiresIn: "1h" });

    res.status(201).json({ ...savedUser._doc, token });
  } catch (error) {
    next(error);
  }
};

// login
const authUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    const isValidPswd = await bcrypt.compare(req.body.password, user.password);

    if (!isValidPswd) {
      return next(createError(403, "wrong email or password!"));
    }

    const { password, name, _id, ...otherDetails } = user._doc;

    const token = jwt.sign({ id: _id }, process.env.SK, { expiresIn: "1h" });

    res.status(201).json({ ...otherDetails, _id, name, token });
  } catch (error) {
    next(error);
  }
};

// all users
// /api/user?search=rahim
const allUsers = async (req, res, next) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  try {
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  registerUser,
  authUser,
  allUsers,
};
