const express = require("express");
const {protect} = require("../middlewares/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/accessChat",protect, accessChat);
router.get("/fetchChats", protect, fetchChats);
router.post("/createGroupChat", protect, createGroupChat);
router.patch("/renameGroup", protect, renameGroup);
router.patch("/removeFromGroup", protect, removeFromGroup);
router.patch("/addToGroup", protect, addToGroup);

module.exports = router;
