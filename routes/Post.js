import express from "express";
const router = express.Router();
import {
    newPost,
    likePost,
    commentPost,
    unLikePost
} from "../Controllers/Post.js";


router.post("/newPost/:id", newPost);
router.patch("/likePost/:userId/:postId",likePost);
router.patch("/unLikePost/:userId/:postId",unLikePost);
router.patch("/commentPost/:userId/:postId",commentPost);


export default router;
