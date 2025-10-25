import { useState, useCallback } from "react";
import { genomicsAPI } from "../lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card2";
import { Button } from "../components/ui/button2.tsx";
import { toast } from "sonner";
import {
  Upload as UploadIcon,
  FileText,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { UploadResponse } from "../types";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  const validateAndSetFile = (selectedFile: File) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validTypes = [".csv", ".vcf"];
    const fileExtension = selectedFile.name
      .substring(selectedFile.name.lastIndexOf("."))
      .toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      toast.error("Invalid file type. Please upload a CSV or VCF file.");
      return;
    }

    if (selectedFile.size > maxSize) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    setFile(selectedFile);
    setUploadResult(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    try {
      const result = await genomicsAPI.uploadFile(file);
      setUploadResult(result);
      toast.success("File analyzed successfully!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const getRiskColor = (probability: string) => {
    const p = probability.toLowerCase();
    if (p.includes("high")) return "text-destructive";
    if (p.includes("medium") || p.includes("moderate")) return "text-warning";
    return "text-accent";
  };

  return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold mb-2">Upload Genomic Data</h1>
          <p className="text-muted-foreground">
            Upload your CSV or VCF files for risk analysis
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
            <CardDescription>
              Upload genomic data files (CSV or VCF format, max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer hover:border-primary ${
                isDragging ? "border-primary bg-primary/5" : "border-border"
              }`}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <input
                id="file-input"
                type="file"
                accept=".csv,.vcf"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <UploadIcon className="w-8 h-8 text-primary" />
                </div>

                {file ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2 text-primary">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="font-medium">Drag and drop your file here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="flex-1"
              >
                {isUploading ? "Analyzing..." : "Upload and Analyze"}
              </Button>

              {file && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null);
                    setUploadResult(null);
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {uploadResult && (
          <Card className="animate-scale-in">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <CardTitle>Analysis Results</CardTitle>
              </div>
              <CardDescription>
                {uploadResult.identifiedRisks.length} risk factors identified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {uploadResult.identifiedRisks.map((risk, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-lg space-y-2 hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle
                        className={`w-5 h-5 ${getRiskColor(risk.probability)}`}
                      />
                      <h4 className="font-semibold">{risk.risk_name}</h4>
                    </div>
                    <span
                      className={`text-sm font-medium ${getRiskColor(
                        risk.probability
                      )}`}
                    >
                      {risk.probability}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{risk.reason}</p>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/risks")}
              >
                View All Risk Results
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
  );
}
