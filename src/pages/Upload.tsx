import React, { useState } from "react";
import AppLayout from "../components/Layout";
import {
  UploadCloud,
  CheckCircle2,
  Download,
  AlertCircle,
} from "lucide-react";
import Papa from "papaparse";

export default function DataUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 180);

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setTimeout(() => {
          clearInterval(interval);
          setProgress(100);
          setUploading(false);
          setResult({
            totalRows: results.data.length,
            errors: results.errors.length,
            validRows: results.data.length - results.errors.length,
          });
        }, 1200);
      },
      error: (error) => {
        clearInterval(interval);
        setUploading(false);
        console.error(error);
      },
    });
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,parcel_id,survey_no,area_acres,village,district,ownership_status,legal_dispute,compensation_status,acquisition_stage\nLA-MH-3001,SY-12/1A,4.5,Bhosari,Pune,Verified,None,Paid,Survey\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "parcel_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="pb-3 border-b border-[#e5e2da] dark:border-[#212c24]">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181c19] dark:text-[#eff3ef]">
            Data Upload
          </h1>
          <p className="text-xs text-[#58615a] dark:text-[#95a398] mt-0.5">
            Upload parcel datasets, survey schedules, and legal records to sync with the database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Main Ingestion Dropzone */}
          <div className="md:col-span-8 space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xs p-8 flex flex-col items-center justify-center text-center transition-colors ${
                file
                  ? "border-[#1f4230] bg-[#eef5f0] dark:bg-[#152219]"
                  : "border-[#dcd7cd] dark:border-[#2a382f] bg-white dark:bg-[#141d17]"
              }`}
            >
              <div className="w-10 h-10 rounded-xs bg-[#f4f3ef] dark:bg-[#1a251e] flex items-center justify-center text-[#1f4230] dark:text-[#82c499] mb-3">
                <UploadCloud className="w-5 h-5" />
              </div>

              <h3 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef] mb-1">
                {file ? file.name : "Select or Drop CSV / Excel Spreadsheet"}
              </h3>
              <p className="text-xs text-[#58615a] dark:text-[#95a398] mb-4">
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB`
                  : "Supports standard .csv and .xlsx cadastral extracts up to 25MB"}
              </p>

              {!file && (
                <label className="px-3.5 py-1.5 bg-[#1f4230] hover:bg-[#163324] text-white text-xs font-semibold rounded-xs cursor-pointer transition-colors">
                  Browse Files
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
              )}

              {file && !uploading && !result && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleUpload}
                    className="px-3.5 py-1.5 bg-[#1f4230] hover:bg-[#163324] text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                  >
                    Process File
                  </button>
                  <button
                    onClick={() => setFile(null)}
                    className="px-3 py-1.5 border border-[#dcd7cd] dark:border-[#2a382f] text-[#58615a] dark:text-[#95a398] hover:bg-[#eeebe3] dark:hover:bg-[#1a251e] text-xs font-medium rounded-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Pipeline progress */}
            {uploading && (
              <div className="rounded-xs border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17] p-4">
                <div className="flex justify-between items-center text-xs font-semibold text-[#181c19] dark:text-[#eff3ef] mb-2">
                  <span>Validating & Merging Records</span>
                  <span className="font-mono">{progress}%</span>
                </div>
                <div className="w-full bg-[#eeeae0] dark:bg-[#1a251e] h-1.5 overflow-hidden">
                  <div
                    className="bg-[#1f4230] dark:bg-[#37634b] h-1.5 transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Result Box */}
            {result && (
              <div className="rounded-xs border border-[#cbe1d3] dark:border-[#274031] bg-[#eef5f0] dark:bg-[#142018] p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#24613b]" />
                  <div className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef]">
                    Upload Complete
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white dark:bg-[#17241c] p-2.5 rounded-xs border border-[#cbe1d3] dark:border-[#274031]">
                    <div className="text-[10px] text-[#58615a] dark:text-[#95a398] uppercase">
                      Total Rows
                    </div>
                    <div className="text-lg font-bold font-mono text-[#181c19] dark:text-[#eff3ef]">
                      {result.totalRows}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#17241c] p-2.5 rounded-xs border border-[#cbe1d3] dark:border-[#274031]">
                    <div className="text-[10px] text-[#58615a] dark:text-[#95a398] uppercase">
                      Valid
                    </div>
                    <div className="text-lg font-bold font-mono text-[#24613b] dark:text-[#7fba96]">
                      {result.validRows}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#17241c] p-2.5 rounded-xs border border-[#cbe1d3] dark:border-[#274031]">
                    <div className="text-[10px] text-[#58615a] dark:text-[#95a398] uppercase">
                      Errors
                    </div>
                    <div className="text-lg font-bold font-mono text-[#a63529] dark:text-[#e47668]">
                      {result.errors}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#cbe1d3] dark:border-[#274031] flex justify-end">
                  <button
                    onClick={() => {
                      setResult(null);
                      setFile(null);
                      setProgress(0);
                    }}
                    className="text-xs font-semibold text-[#1f4230] dark:text-[#82c499] hover:underline cursor-pointer"
                  >
                    Upload Another File →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Info: Schema */}
          <div className="md:col-span-4 space-y-3">
            <div className="rounded-xs border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17] p-4">
              <h3 className="text-xs font-semibold text-[#181c19] dark:text-[#eff3ef] uppercase tracking-wider mb-2">
                Supported Columns
              </h3>
              <p className="text-xs text-[#58615a] dark:text-[#95a398] mb-3 leading-relaxed">
                Include the following standard fields:
              </p>

              <ul className="space-y-1 text-xs font-mono text-[#444d46] dark:text-[#abb6ad]">
                <li>• parcel_id</li>
                <li>• survey_no</li>
                <li>• area_acres</li>
                <li>• ownership_status</li>
                <li>• legal_dispute</li>
                <li>• compensation_status</li>
                <li>• acquisition_stage</li>
              </ul>

              <button
                onClick={handleDownloadTemplate}
                className="mt-4 w-full inline-flex items-center justify-center gap-1.5 py-1.5 border border-[#dcd7cd] dark:border-[#2b3a30] text-[#181c19] dark:text-[#eff3ef] hover:bg-[#f6f5f0] dark:hover:bg-[#1c2720] text-xs font-medium rounded-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample CSV</span>
              </button>
            </div>

            <div className="rounded-xs border border-[#dedad1] dark:border-[#222f26] bg-[#faf9f6] dark:bg-[#121914] p-3.5 flex gap-2.5 text-xs text-[#58615a] dark:text-[#95a398]">
              <AlertCircle className="w-4 h-4 text-[#a86927] flex-shrink-0 mt-0.5" />
              <div>
                Uploaded data is validated client-side and verified before updating cadastral database records.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
