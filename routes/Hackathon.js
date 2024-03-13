import express from "express";
import { newHackathon } from "../Controllers/OTP.js";
const router = express.Router();

router.post("/newHackathon/:id", newHackathon);


export default router;
