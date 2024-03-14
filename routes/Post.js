import express from "express";
import { verifyAccessToken } from "../utils/generateToken.js";
const router = express.Router();
import {
    newPost,
    likePost,
    commentPost,
    unLikePost
} from "../Controllers/Post.js";


router.post("/newPost/:userId",verifyAccessToken, newPost);
router.patch("/likePost/:userId/:postId",verifyAccessToken,likePost);
router.patch("/unLikePost/:userId/:postId",verifyAccessToken,unLikePost);
router.patch("/commentPost/:userId/:postId",verifyAccessToken,commentPost);


export default router;
