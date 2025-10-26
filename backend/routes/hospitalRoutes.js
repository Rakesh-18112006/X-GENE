import express from "express";
import { getNearbyHospitals } from "../controllers/hospitalController.js";

const router = express.Router();

router.post("/nearby-hospitals", getNearbyHospitals);

export default router;
