import { 
    newHackathon
    } from "../Controllers/Hack";
import express from "express";
const router = express.Router();

router.post("/newHackathon/:userId", newHackathon);


export default router;
