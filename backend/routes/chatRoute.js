const express = require("express");
const verifyToken = require("../utils/VerifyToken");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatController");

const router = express.Router();

router.get("/", verifyToken, fetchChats);
router.post("/", verifyToken, accessChat);
router.post("/group", verifyToken, createGroupChat);
router.put("/rename", verifyToken, renameGroup);
router.put("/groupremove", verifyToken, removeFromGroup);
router.put("/groupadd", verifyToken, addToGroup);

module.exports = router;
