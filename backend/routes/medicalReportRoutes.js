import express from "express";
import multer from "multer";
import {
  uploadMedicalReport,
  getMedicalReports,
  testPdfParse,
} from "../controllers/medicalReportController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Protected routes - require authentication
router.post(
  "/upload-medical-report",
  protect,
  upload.single("medicalReport"),
  uploadMedicalReport
);
router.get("/medical-reports", protect, getMedicalReports); // Changed to get from user context
router.post("/test-pdf-parse", upload.single("testPdf"), testPdfParse);

export default router;
