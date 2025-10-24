import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Profile Section
    fullname: { type: String },
    dob: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    bloodgroup: { type: String },
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
