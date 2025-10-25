import axios from "axios";
import FormData from "form-data";
import csv from "csv-parser";
import VCF from "@gmod/vcf";
import { Readable } from "stream";

const FLASK_URL = "http://localhost:8000"; 

// Parse CSV or VCF file (for validation or preprocessing)
export const parseFile = async (buffer, fileName) => {
  try {
    const ext = fileName.toLowerCase().split(".").pop();

    if (ext === "csv") {
      const results = [];
      const stream = Readable.from(buffer.toString());
      return new Promise((resolve, reject) => {
        stream
          .pipe(csv())
          .on("data", (row) => results.push(row))
          .on("end", () => {
            console.log(`Parsed CSV: ${results.length} rows`);
            resolve({ type: "csv", data: results });
          })
          .on("error", (err) => reject(err));
      });
    } else if (ext === "vcf") {
      const vcfText = buffer.toString("utf8");
      const lines = vcfText.split("\n");
      const header = lines.filter((line) => line.startsWith("#")).join("\n");
      const parser = new VCF({ header });
      const sampleLine = lines.find((line) => !line.startsWith("#"));
      const variant = sampleLine ? parser.parseLine(sampleLine) : null;
      console.log("Parsed VCF: Sample variant:", variant);
      return { type: "vcf", data: variant || {} };
    } else {
      throw new Error("Unsupported file type");
    }
  } catch (error) {
    throw new Error(`File parsing failed: ${error.message}`);
  }
};

// Send file to Flask /predict_risk endpoint
export const sendToFlask = async (buffer, fileName) => {
  try {
    const formData = new FormData();
    formData.append("file", buffer, fileName); // Buffer as file

    const response = await axios.post(`${FLASK_URL}/predict_risk`, formData, {
      headers: {
        ...formData.getHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // Expected: { risk_score: number, message: string }
  } catch (error) {
    throw new Error(
      `Flask API call failed: ${error.response?.data?.error || error.message}`
    );
  }
};


