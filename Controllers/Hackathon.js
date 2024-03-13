import mongoose from "mongoose";
import Hackathon from "../model/hackathonModel";

export const newHackathon =async(req,res)=>{
   try{
    const {hackathonLink,techStackRequired,numberOfTeammatesRequired,deadline}=req.body;
    const postedBy=req.params.id;
    const newHack=await Hackathon.create({
        hackathonLink,
        techStackRequired,
        numberOfTeammatesRequired,
        deadline,
        postedBy
    });
    if (!newHack) {
        throw new Error("Failed to add new hackathon!!");
      }
      res.status(201).json({
        newHack
      });  
   }catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
    return { error: "Internal server error !!" };
  }
}