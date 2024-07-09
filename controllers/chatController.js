const Chat = require("../models/chatModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json("userId param not sent with the request!");
    return;
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name profilePic email",
  });

  if (isChat.length > 0) {
    res.status(200).json(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    } catch (error) {
      res.status(400).json(error);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
    try{
      var chats=await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
      .populate("users","-password")
      .populate("groupAdmins","-password")
      .populate("latestMessage")
      .sort({updatedAt:-1})

      chats=await User.populate(chats,{
        path:"latestMessage.sender",
        select:"name profilePic email"
      })
      res.status(201).json(chats);
    }catch(error){
      res.status(400).json(error);
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
  // Implement createGroupChat logic
});

const renameGroup = asyncHandler(async (req, res) => {
  // Implement renameGroup logic
});

const removeFromGroup = asyncHandler(async (req, res) => {
  // Implement removeFromGroup logic
});

const addToGroup = asyncHandler(async (req, res) => {
  // Implement addToGroup logic
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
