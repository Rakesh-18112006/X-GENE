import express from "express";
import { chatWithDoctor } from "../controllers/chatController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/message", protect, chatWithDoctor);

export default router;
