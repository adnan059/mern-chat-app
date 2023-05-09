const express = require("express");

const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userController");
const verifyToken = require("../utils/VerifyToken");

const router = express.Router();

router.get("/", verifyToken, allUsers);
router.post("/", registerUser);
router.post("/login", authUser);

module.exports = router;
