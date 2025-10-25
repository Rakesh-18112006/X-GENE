import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Download, Trash2, Eye } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { medicalService  } from '../services/api';
import toast from 'react-hot-toast';

export default function MedicalReports() {
  const [uploading, setUploading] = useState(false);
  const [reports, setReports] = useState<any[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setUploading(true);
    try {
      const result = await medicalService.uploadReport(file);
      setReports([result, ...reports]);
      toast.success('Report uploaded successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-2"
        >
          Medical Reports
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-[#a0a3bd]"
        >
          Upload and manage your medical documents
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card glass>
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gradient-to-br from-[#00d9ff]/20 to-[#0099ff]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-[#00d9ff]" />
            </div>
            <h3 className="text-xl font-bold mb-2">Upload Medical Report</h3>
            <p className="text-[#a0a3bd] mb-6">
              Upload your medical reports in PDF format for AI-powered analysis
            </p>
            <label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
              <Button variant="primary" size="lg" disabled={uploading} isLoading={uploading}>
                {uploading ? 'Uploading...' : 'Choose File'}
              </Button>
            </label>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card hover>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#00d9ff]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#00d9ff]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold mb-1 truncate">Blood Test Results</h3>
                  <p className="text-sm text-[#a0a3bd]">Uploaded {index + 1} days ago</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[#2a2d3a] flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1c24] hover:bg-[#20222d] border border-[#2a2d3a] rounded-lg transition-all duration-300">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1c24] hover:bg-[#20222d] border border-[#2a2d3a] rounded-lg transition-all duration-300">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download</span>
                </button>
                <button className="px-4 py-2 bg-[#ff3366]/10 hover:bg-[#ff3366]/20 border border-[#ff3366]/30 rounded-lg transition-all duration-300">
                  <Trash2 className="w-4 h-4 text-[#ff3366]" />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
