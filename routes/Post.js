import express from "express";
const router = express.Router();
import {
    newPost,
    likePost,
    commentPost
} from "../Controllers/Post.js";


router.post("/newPost/:id", newPost);
router.patch("/likePost/:userId/:postId",likePost);
router.patch("/commentPost/:userId/:postId",commentPost);


export default router;
