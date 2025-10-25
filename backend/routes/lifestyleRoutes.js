import express from "express";
import {
  analyzeLifestyle,
  getLifestyleHistory,
} from "../controllers/lifestyleController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/analyze-lifestyle", protect, analyzeLifestyle);
router.get("/lifestyle-history/:userId", protect, getLifestyleHistory);

export default router;
