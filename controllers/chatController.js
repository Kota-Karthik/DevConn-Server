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
      res.status(400).json(error.message);
    }
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    var chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmins", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name profilePic email"
    })
    res.status(201).json(chats);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.groupName) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .json("More than 2 users are required to form a group chat");
  }

  users.push(req.user);
  var admins = [];
  admins.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.groupName,
      users: users,
      isGroupChat: true,
      groupAdmins: admins,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmins", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  if (!chatId || !chatName) {
    return res.status(400).json("Please Fill all the feilds");
  }
  try {
    const chat = await Chat.findByIdAndUpdate(chatId, { chatName: chatName }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmins", "-password");
    if (!chat) {
      res.status(400).json("chat not found!");
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;
  if (!chatId || !userId) {
    return res.status(400).json("Please Fill all the feilds");
  }
  try {
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmins", "-password");
    if (!chat) {
      res.status(400).json("chat not found!");
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).json("Please fill all the fields.");
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json("Chat doesn't exist.");
    }

    const isAdmin = chat.groupAdmins.some(adminId => adminId.equals(req.user._id));
    if (!isAdmin) {
      return res.status(403).json("You aren't the admin of the group.");
    }

    const isUserInGroup = chat.users.some(userIdInGroup => userIdInGroup.equals(userId));
    if (!isUserInGroup) {
      return res.status(404).json("User doesn't exist in the group.");
    }

    if(req.user._id==userId){
      return res.status(404).json("You can't remove yourself from group (you can leave the group instead)!");
    }
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmins", "-password");

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const leaveGroup = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json("Please fill all the fields.");
  }

  try {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json("Chat doesn't exist.");
    }

    const isUserInGroup = chat.users.some(userIdInGroup => userIdInGroup.equals(req.user._id));
    if (!isUserInGroup) {
      return res.status(404).json("User doesn't exist in the group.");
    }

    const isAdmin = chat.groupAdmins.some(adminId => adminId.equals(req.user._id));

    // Check if the user is the last admin
    const isLastAdmin = isAdmin && chat.groupAdmins.length === 1;

    let updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: req.user._id, ...(isAdmin && { groupAdmins: req.user._id }) }
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmins", "-password");

    if (isLastAdmin && updatedChat.users.length > 0) {
      const newAdmin = updatedChat.users[0];
      updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          $push: { groupAdmins: newAdmin._id }
        },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmins", "-password");
    }

    res.status(200).json(updatedChat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
const makeAdmin = asyncHandler(async (req, res) => {
  // Implement makeAdmin logic
});

const removeAdmin = asyncHandler(async (req, res) => {
  // Implement removeAdmin logic
});

const changeGroupName = asyncHandler(async (req, res) => {
  // Implement changeGroupName logic
});


module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  leaveGroup,
  makeAdmin,
  removeAdmin,
  changeGroupName,
};
