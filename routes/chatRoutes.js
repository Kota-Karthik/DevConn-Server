const express=require("express");
const protect=require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/accessChat",protect,accessChat);
router.get("/fetchChats",protect,fetchChats);
router.post("/createGroupChat",protect,createGroupChat);
router.put("/renameGroup",protect,renameGroup);
router.put("/removeFromGroup",protect,removeFromGroup);
router.put("/addToGroup",protect,addToGroup);

module.exports=(router);