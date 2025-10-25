import express from 'express';
import multer from 'multer';
import { handleUpload } from '../controllers/uploadController.js';
import { getUserRiskResults } from '../controllers/uploadController.js';
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configure Multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /csv|vcf/;
    const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('File must be CSV or VCF'));
  },
});

// POST /api/upload - Handle file upload and ML prediction
router.post('/upload', protect, upload.single('file'), handleUpload);

router.get("/risk-results/my", protect, getUserRiskResults);

export default router;