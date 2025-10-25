import express from "express";
import {
  analyzeDriftPatterns,
  getDriftHistory,
} from "../controllers/driftPatternController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/analyze-drift-patterns", protect, analyzeDriftPatterns);
router.get("/drift-history/:userId", protect,  getDriftHistory);

export default router;
