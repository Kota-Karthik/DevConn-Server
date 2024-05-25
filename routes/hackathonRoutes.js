import { newHackathon } from "../Controllers/hackathonController.js";
import express from "express";
const router = express.Router();

router.post("/newHackathon/:userId", newHackathon);

export default router;
