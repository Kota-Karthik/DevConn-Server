import mongoose from "mongoose";
import Post from "../model/postModel.js";

export const newPost = async (req,res)=>{
    try{
        const postedBy=req.params.id;
        const description=req.body.description;

        const post = await Post.create({
            postedBy,
            description
        })
        if (!post) {
            throw new Error("Failed to create post");
          }
          res.status(201).json({
            description
          });  
    }catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
        return { error: "Internal server error !!" };
      }
}