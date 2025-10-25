import express from "express";
import {
  getGoogleAuthUrl,
  handleGoogleCallback,
  fetchFitnessData,
} from "../controllers/googleFitController.js";

const router = express.Router();

// Google Fit OAuth routes
router.get("/auth/google", getGoogleAuthUrl);
router.get("/auth/google/callback", handleGoogleCallback);
router.get("/fetch-data", fetchFitnessData);

export default router;
