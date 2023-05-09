const express = require("express");
const verifyToken = require("../utils/VerifyToken");
const { sendMessage, allMessages } = require("../controllers/msgController");

const router = express.Router();

router.post("/", verifyToken, sendMessage);
router.get("/:chatId", verifyToken, allMessages);

module.exports = router;
