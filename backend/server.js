import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import cors from "cors";
import hospitalRoutes from "./routes/hospitalRoutes.js";
import preventionRoutes from "./routes/preventionRoutes.js";
import lifestyleRoutes from "./routes/lifestyleRoutes.js";
import medicalReportRoutes from "./routes/medicalReportRoutes.js";
import driftPatternRoutes from "./routes/driftPatternRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import path from "path";

dotenv.config();
connectDB();

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Create uploads directory
import fs from "fs";
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.get("/", (req, res) => {
  res.send("AURA Backend is running 🚀");
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1", uploadRoutes);
app.use("/api", hospitalRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/prevention", preventionRoutes);
app.use("/api/lifestyle", lifestyleRoutes);
app.use("/api/medical", medicalReportRoutes);
app.use("/api/drift", driftPatternRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
