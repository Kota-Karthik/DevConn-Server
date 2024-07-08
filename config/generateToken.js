const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const generateToken= (id)=>{
    const USER_TYPE=process.env.USER_TYPE;
    return jwt.sign({id,USER_TYPE},process.env.JWT_SECRET,{
        expiresIn:"30d",
    })
}

module.exports = generateToken;