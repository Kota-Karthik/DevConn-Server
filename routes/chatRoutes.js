const express = require("express");
const {protect} = require("../middlewares/authMiddleware");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
  leaveGroup,
  makeAdmin,
  removeAdmin,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/accessChat",protect, accessChat);
router.get("/fetchChats", protect, fetchChats);
router.post("/createGroupChat", protect, createGroupChat);
router.patch("/renameGroup", protect, renameGroup);
router.patch("/addToGroup", protect, addToGroup);
router.patch("/removeFromGroup", protect, removeFromGroup);
router.patch("/leaveGroup",protect,leaveGroup);
router.patch("/makeAdmin",protect,makeAdmin);
router.patch("/removeAdmin",protect,removeAdmin);


module.exports = router;
