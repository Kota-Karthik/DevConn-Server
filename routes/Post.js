import express from "express";
const router = express.Router();
import {
    newPost
} from "../Controllers/Post.js";


router.post("/newPost/:id", newPost);


export default router;
