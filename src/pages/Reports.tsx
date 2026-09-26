import React, { useState } from "react";
import AppLayout from "../components/Layout";
import {
  FileText,
  Download,
  BarChart2,
  PieChart as PieChartIcon,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { staticParcels } from "../lib/data";
import Markdown from "react-markdown";

export default function ReportsPage() {
  const [generatingAiReport, setGeneratingAiReport] = useState(false);
  const [aiReportContent, setAiReportContent] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleGenerateAiReport = async () => {
    setShowModal(true);
    setGeneratingAiReport(true);
    setAiReportContent("");

    const highRiskCount = staticParcels.filter(
      (p) => p.riskLevel === "High"
    ).length;
    const avgDelay = Math.round(
      staticParcels.reduce((acc, p) => acc + p.predictedDelayDays, 0) /
        staticParcels.length
    );
    const activeDisputes = staticParcels.filter(
      (p) => p.legalDisputeStatus === "Active Case"
    ).length;

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate an executive land acquisition progress summary based on these statistics: Total Parcels: ${staticParcels.length}, High Risk Parcels: ${highRiskCount}, Average Predicted Delay: ${avgDelay} days, Active Legal Disputes: ${activeDisputes}. Include: 1. Executive Summary, 2. Key Delay Drivers, 3. Recommended Actions. Keep it crisp, factual, and professional.`,
          systemPrompt:
            "You are a professional project manager for infrastructure land acquisitions.",
        }),
      });
      const data = await response.json();
      if (data.text) {
        setAiReportContent(data.text);
      }
    } catch (e) {
      console.error("Failed to generate report", e);
      setAiReportContent("Report generation failed. Please verify API status.");
    } finally {
      setGeneratingAiReport(false);
    }
  };

  const reports = [
    {
      id: 1,
      name: "Monthly Acquisition Risk Assessment",
      date: "Oct 01, 2026",
      type: "PDF",
      size: "2.4 MB",
    },
    {
      id: 2,
      name: "Q3 Delay Predictions & Interventions",
      date: "Sep 28, 2026",
      type: "PDF",
      size: "1.8 MB",
    },
    {
      id: 3,
      name: "High-Risk Parcels Detailed Extract",
      date: "Sep 25, 2026",
      type: "CSV",
      size: "412 KB",
    },
    {
      id: 4,
      name: "Legal Disputes & Objection Status",
      date: "Sep 20, 2026",
      type: "PDF",
      size: "3.1 MB",
    },
  ];

  const handleDownload = (name: string) => {
    const csvContent = "data:text/csv;charset=utf-8,Report,Timestamp,Status\n" + `${name},${new Date().toISOString()},Generated\n`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${name.toLowerCase().replace(/\\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout>
      <div className="space-y-4 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#e5e2da] dark:border-[#212c24]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181c19] dark:text-[#eff3ef]">
              Reports & Exports
            </h1>
            <p className="text-xs text-[#58615a] dark:text-[#95a398] mt-0.5">
              Generate and download project summaries, extracts, and status digests.
            </p>
          </div>

          <button
            onClick={handleGenerateAiReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1f4230] hover:bg-[#163324] text-white text-xs font-semibold rounded-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>Generate Executive Summary</span>
          </button>
        </div>

        {/* 2-Column Summary Panel (Avoiding 3 feature cards in a row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xs bg-[#eef5f0] dark:bg-[#18261e] border border-[#cbe1d3] dark:border-[#274031] flex items-center justify-center text-[#1f4230] dark:text-[#82c499] mb-2.5">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef] mb-1">
                Cadastral Progression Audit
              </h3>
              <p className="text-xs text-[#58615a] dark:text-[#95a398] leading-relaxed">
                Breakdown of notifications, award determinations, and possession stages across all 15 administrative sectors.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#eeebe3] dark:border-[#1d2920] text-xs font-semibold text-[#1f4230] dark:text-[#82c499]">
              Updated daily with revenue records
            </div>
          </div>

          <div className="p-3.5 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xs bg-[#fdf6ec] dark:bg-[#2c2217] border border-[#eddac2] dark:border-[#4d3a24] flex items-center justify-center text-[#a86927] dark:text-[#dfa364] mb-2.5">
                <PieChartIcon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef] mb-1">
                Litigation & Solatium Risk Digest
              </h3>
              <p className="text-xs text-[#58615a] dark:text-[#95a398] leading-relaxed">
                Detailed view into dispute frequency, title heir contestations, and court objection impacts on corridor delivery.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#eeebe3] dark:border-[#1d2920] text-xs font-semibold text-[#a86927] dark:text-[#dfa364]">
              Bi-weekly statutory review
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="rounded-xs border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17] overflow-hidden">
          <div className="p-3.5 border-b border-[#e5e2da] dark:border-[#212c24] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef]">
              Generated Reports
            </h2>
            <span className="text-xs text-[#6e7770] dark:text-[#8c9c90]">
              {reports.length} files available
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[11px] font-semibold text-[#6e7770] dark:text-[#8c9c90] uppercase tracking-wider bg-[#f8f8f5] dark:bg-[#111813] border-b border-[#e5e2da] dark:border-[#212c24]">
                <tr>
                  <th className="px-4 py-2.5">Report Name</th>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Format</th>
                  <th className="px-4 py-2.5 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2efe8] dark:divide-[#1a251e]">
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-[#f9f8f5] dark:hover:bg-[#19241d] transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-[#181c19] dark:text-[#eff3ef]">
                      {report.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-[#58615a] dark:text-[#95a398]">
                      {report.date}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-xs bg-[#f4f3ef] dark:bg-[#1c2720] text-[#58615a] dark:text-[#b4c0b6] border border-[#dedad1] dark:border-[#29382d]">
                        {report.type} · {report.size}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDownload(report.name)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1f4230] hover:bg-[#163324] text-white rounded-xs text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal (No liquid glass backdrop-blur, no soft radius, no drop shadow) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-[#151e18] border border-[#28372d] rounded-xs w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="p-3.5 border-b border-[#212c24] flex items-center justify-between bg-[#111813]">
              <h2 className="text-sm font-semibold text-[#eff3ef]">
                Executive Project Summary
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-[#1f2c22] rounded-xs text-[#828c84] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1 text-xs text-[#d3ded5] leading-relaxed">
              {generatingAiReport ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-xs text-[#95a398]">
                    Synthesizing cadastral risk analytics...
                  </p>
                </div>
              ) : (
                <div className="prose prose-invert max-w-none text-xs">
                  <Markdown>{aiReportContent}</Markdown>
                </div>
              )}
            </div>

            {!generatingAiReport && aiReportContent && (
              <div className="p-3 border-t border-[#212c24] bg-[#111813] flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 bg-[#1f4230] hover:bg-[#163324] text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
