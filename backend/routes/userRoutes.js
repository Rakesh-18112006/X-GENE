import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  saveProfile,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.post("/profile", protect, saveProfile); 

export default router;
