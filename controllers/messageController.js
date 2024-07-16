const Message=require('../models/messageModel');
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const asyncHandler = require("express-async-handler");

const sendMessage=asyncHandler(async(req,res)=>{
    const {chatId,content}=req.body;
    if(!chatId || !content){
        return res.status(400).json("Please Fill all the feilds");
    }
    try{
        var chat=await Chat.findById(chatId);
        if(!chat){
            return res.status(400).json("Chat doesn't exist.");
        }
        const isUserPresentInChat=chat.users.some(userId=>userId.equals(req.user._id));
        if(!isUserPresentInChat){
            return res.status(400).json("User doesn't exist in chat.");
        }
        var newMessage={
            chat:chatId,
            sender:req.user._id,
            content:content,
        }

        var message=await Message.create(newMessage);
        message=await message.populate("sender","name profilePic");
        message=await message.populate("chat");
        message=await User.populate(message,{
            path:"chat.users",
            select:"name profilePic email"
        })
        await Chat.findByIdAndUpdate(chatId,{
            latestMessage:message._id,
        });

        res.status(200).json(message);
    }catch(error){
        res.status(400).json(error.message);
    }
   

})

const getAllMessages=asyncHandler(async(req,res)=>{
    
})
module.exports={
    sendMessage,
    getAllMessages,
};
