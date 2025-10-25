import express from "express";
import { personalizedPrevention } from "../controllers/preventionController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/personalized-prevention", protect, personalizedPrevention);

export default router;
