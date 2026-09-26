import React, { useMemo, useState, useEffect } from "react";
import AppLayout from "../components/Layout";
import { staticParcels } from "../lib/data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  AlertTriangle,
  Clock,
  ShieldAlert,
  Map as MapIcon,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../lib/i18n";

// Enterprise Earth Palette (No Neon, No Vibe-Coded Fluff)
const THEME = {
  highRisk: "#a63529", // Terracotta Crimson
  mediumRisk: "#a86927", // Warm Amber Sienna
  lowRisk: "#24613b", // Deep Forest Green
  walnut: "#5a412f", // Muted Walnut Brown
  gridLine: "#e5e2da",
  gridLineDark: "#26332c",
};

export default function Dashboard() {
  const parcels = staticParcels;
  const { t } = useTranslation();

  const stats = useMemo(() => {
    const total = parcels.length;
    const acquired = parcels.filter(
      (p) => p.currentAcquisitionStage === "Taking Possession"
    ).length;
    const highRisk = parcels.filter((p) => p.riskLevel === "High").length;
    const mediumRisk = parcels.filter((p) => p.riskLevel === "Medium").length;
    const lowRisk = parcels.filter((p) => p.riskLevel === "Low").length;
    const totalDelayDays = parcels.reduce(
      (acc, p) => acc + p.predictedDelayDays,
      0
    );
    const avgDelay = Math.round(totalDelayDays / total);
    let activeIssues = 0;
    parcels.forEach((p) => {
      if (p.legalDisputeStatus === "Active Case") activeIssues++;
      if (p.compensationStatus === "Pending") activeIssues++;
      if (p.ownershipVerificationStatus === "Disputed") activeIssues++;
    });
    return { total, acquired, highRisk, mediumRisk, lowRisk, avgDelay, activeIssues };
  }, [parcels]);

  const [aiSummary, setAiSummary] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    async function fetchAiSummary() {
      setLoadingAi(true);
      try {
        const response = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Based on the following stats: Total Parcels: ${stats.total}, High Risk: ${stats.highRisk}, Avg Delay: ${stats.avgDelay} days, Active Issues: ${stats.activeIssues}. Summarize the project health in 2 clear, pragmatic sentences for an engineering director.`,
            systemPrompt:
              "You are an expert infrastructure risk analyst. Be direct and objective.",
          }),
        });
        const data = await response.json();
        if (data.text) setAiSummary(data.text);
      } catch (e) {
        console.error("Failed to fetch AI summary", e);
      } finally {
        setLoadingAi(false);
      }
    }
    fetchAiSummary();
  }, [stats]);

  const riskDistributionData = useMemo(
    () => [
      { name: "Low Risk", value: stats.lowRisk, color: THEME.lowRisk },
      { name: "Medium Risk", value: stats.mediumRisk, color: THEME.mediumRisk },
      { name: "High Risk", value: stats.highRisk, color: THEME.highRisk },
    ],
    [stats]
  );

  const issueCategoryData = useMemo(() => {
    let legal = 0;
    let compensation = 0;
    let documentation = 0;
    let ownership = 0;
    let encroachment = 0;
    parcels.forEach((p) => {
      if (p.legalDisputeStatus === "Active Case") legal++;
      if (p.compensationStatus === "Pending") compensation++;
      if (p.documentationStatus === "Incomplete") documentation++;
      if (p.ownershipVerificationStatus === "Disputed") ownership++;
      if (p.encroachmentStatus === "Major") encroachment++;
    });
    return [
      { name: "Legal Disputes", count: legal },
      { name: "Compensation", count: compensation },
      { name: "Incomplete Docs", count: documentation },
      { name: "Title Disputes", count: ownership },
      { name: "Encroachment", count: encroachment },
    ].sort((a, b) => b.count - a.count);
  }, [parcels]);

  const stageData = useMemo(() => {
    const stages = [
      "Initial Notification",
      "Survey",
      "Hearing of Objections",
      "Declaration",
      "Award Enquiry",
      "Taking Possession",
    ];
    return stages.map((stage) => ({
      name: stage.split(" ")[0],
      fullName: stage,
      parcels: parcels.filter((p) => p.currentAcquisitionStage === stage).length,
    }));
  }, [parcels]);

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#e5e2da] dark:border-[#212c24]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181c19] dark:text-[#eff3ef]">
              {t('dashboard.title')}
            </h1>
            <p className="text-xs text-[#58615a] dark:text-[#95a398] mt-0.5">
              {t('dashboard.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/map"
              className="px-3 py-1.5 text-xs font-medium text-[#181c19] dark:text-[#eff3ef] bg-white dark:bg-[#151e18] border border-[#dcd7cd] dark:border-[#2b3a30] rounded-xs hover:bg-[#f6f5f0] dark:hover:bg-[#1c2720] transition-colors flex items-center gap-1.5"
            >
              <MapIcon className="w-3.5 h-3.5 text-[#37634b]" />
              <span>{t('nav.gisMap')}</span>
            </Link>
            <Link
              to="/parcels"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1f4230] hover:bg-[#163324] rounded-xs transition-colors flex items-center gap-1.5"
            >
              <span>{t('nav.parcels')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* AI Insight Bar */}
        <div className="p-3.5 rounded-xs bg-white dark:bg-[#141d17] border border-[#e2ded5] dark:border-[#233127] flex items-start gap-3">
          <div className="w-6 h-6 rounded-xs bg-[#eaf3ed] dark:bg-[#1c2c22] text-[#1f4230] dark:text-[#82c499] flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">
            AI
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#181c19] dark:text-[#eff3ef] mb-0.5">
              Automated Risk Digest
            </div>
            <p className="text-xs text-[#4d564f] dark:text-[#abb6ad] leading-relaxed">
              {loadingAi
                ? "Analyzing latest statutory stages and dispute patterns..."
                : aiSummary ||
                  "Title heir disputes in Hinjewadi and Wakad are causing an estimated 27-day milestone overrun. Priority conciliation recommended for high-risk parcels to prevent construction schedule slippage."}
            </p>
          </div>
        </div>

        {/* Core KPI Metrics (No colored left stripes, no drop shadows, no soft corners) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26]">
            <div className="text-xs font-medium text-[#657067] dark:text-[#8c9c90]">
              {t('dashboard.totalParcels')}
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[#181c19] dark:text-[#eff3ef] tabular-nums">
                {stats.total}
              </span>
              <span className="text-xs text-[#58615a] dark:text-[#95a398]">
                ({stats.acquired} {t('dashboard.acquired').toLowerCase()})
              </span>
            </div>
            <div className="mt-2 text-[11px] text-[#58615a] dark:text-[#8e9c91]">
              1,280.4 total acres under acquisition
            </div>
          </div>

          <div className="p-3.5 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26]">
            <div className="text-xs font-medium text-[#657067] dark:text-[#8c9c90] flex items-center justify-between">
              <span>{t('dashboard.highRisk')}</span>
              <AlertTriangle className="w-3.5 h-3.5 text-[#a63529]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[#a63529] dark:text-[#e47668] tabular-nums">
                {stats.highRisk}
              </span>
              <span className="text-xs text-[#58615a] dark:text-[#95a398]">
                of {stats.total}
              </span>
            </div>
            <div className="mt-2 text-[11px] text-[#a63529] dark:text-[#e47668]">
              Critical attention required
            </div>
          </div>

          <div className="p-3.5 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26]">
            <div className="text-xs font-medium text-[#657067] dark:text-[#8c9c90] flex items-center justify-between">
              <span>{t('dashboard.avgDelay')}</span>
              <Clock className="w-3.5 h-3.5 text-[#a86927]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-bold font-mono text-[#181c19] dark:text-[#eff3ef] tabular-nums">
                +{stats.avgDelay}
              </span>
              <span className="text-xs text-[#58615a] dark:text-[#95a398] ml-1">{t('dashboard.days')}</span>
            </div>
            <div className="mt-2 text-[11px] text-[#6e503a] dark:text-[#c49870]">
              Baseline milestone overrun
            </div>
          </div>

          <div className="p-3.5 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26]">
            <div className="text-xs font-medium text-[#657067] dark:text-[#8c9c90] flex items-center justify-between">
              <span>Active Issues</span>
              <ShieldAlert className="w-3.5 h-3.5 text-[#1f4230]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[#181c19] dark:text-[#eff3ef] tabular-nums">
                {stats.activeIssues}
              </span>
              <span className="text-xs text-[#58615a] dark:text-[#95a398]">open cases</span>
            </div>
            <div className="mt-2 text-[11px] text-[#58615a] dark:text-[#8e9c91]">
              Legal & compensation disputes
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* Stage Progression Bar Chart */}
          <div className="lg:col-span-8 p-3.5 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eeebe3] dark:border-[#1d2920]">
              <div>
                <h3 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef]">
                  Parcels by Acquisition Stage
                </h3>
                <p className="text-xs text-[#6e7770] dark:text-[#8c9c90]">
                  Progression across the 6 statutory acquisition milestones
                </p>
              </div>
            </div>

            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stageData}
                  margin={{ top: 8, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="2 2"
                    stroke="#e8e5dc"
                    className="dark:opacity-15"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#768278"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#768278"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
                    contentStyle={{
                      backgroundColor: "#131c16",
                      borderColor: "#28392d",
                      borderRadius: "0px",
                      color: "#eff3ef",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="parcels"
                    fill="#1f4230"
                    radius={[0, 0, 0, 0]}
                    maxBarSize={42}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Tier Donut */}
          <div className="lg:col-span-4 p-3.5 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eeebe3] dark:border-[#1d2920]">
              <div>
                <h3 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef]">
                  Risk Classification
                </h3>
                <p className="text-xs text-[#6e7770] dark:text-[#8c9c90]">
                  Portfolio breakdown
                </p>
              </div>
            </div>

            <div className="flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="48%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "#131c16",
                      borderColor: "#28392d",
                      borderRadius: "0px",
                      color: "#eff3ef",
                      fontSize: "12px",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={32}
                    wrapperStyle={{ fontSize: "11px", color: "#667268" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Bottom Section: Primary Friction Categories & Watchlist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* Causes of Delay */}
          <div className="lg:col-span-5 p-3.5 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] flex flex-col">
            <div className="pb-3 mb-3 border-b border-[#eeebe3] dark:border-[#1d2920]">
              <h3 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef]">
                Bottleneck Frequency by Issue
              </h3>
              <p className="text-xs text-[#6e7770] dark:text-[#8c9c90]">
                Active roadblocks reported across surveyed plots
              </p>
            </div>

            <div className="space-y-3 my-auto">
              {issueCategoryData.map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#363e38] dark:text-[#d3ded5] font-medium">
                      {item.name}
                    </span>
                    <span className="font-mono text-[#6e7770] dark:text-[#95a398]">
                      {item.count} plots
                    </span>
                  </div>
                  <div className="w-full bg-[#eeeae0] dark:bg-[#1d2820] h-1.5 overflow-hidden">
                    <div
                      className="bg-[#5a412f] dark:bg-[#8c674b] h-1.5"
                      style={{
                        width: `${Math.min((item.count / 30) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Watchlist Data Table */}
          <div className="lg:col-span-7 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] overflow-hidden flex flex-col">
            <div className="p-3.5 border-b border-[#eeebe3] dark:border-[#1d2920] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef]">
                  High-Priority Watchlist
                </h3>
                <p className="text-xs text-[#6e7770] dark:text-[#8c9c90]">
                  Parcels requiring urgent conciliation or legal resolution
                </p>
              </div>
              <Link
                to="/parcels"
                className="text-xs font-semibold text-[#1f4230] dark:text-[#82c499] hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] font-semibold text-[#6e7770] dark:text-[#8c9c90] uppercase tracking-wider bg-[#f8f8f5] dark:bg-[#111813] border-b border-[#eeebe3] dark:border-[#1d2920]">
                  <tr>
                    <th className="px-4 py-2.5">Parcel</th>
                    <th className="px-4 py-2.5">Village</th>
                    <th className="px-4 py-2.5">Risk Score</th>
                    <th className="px-4 py-2.5">Predicted Delay</th>
                    <th className="px-4 py-2.5">Primary Factor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2efe8] dark:divide-[#1a251e]">
                  {parcels
                    .filter((p) => p.riskLevel === "High")
                    .sort((a, b) => b.riskScore - a.riskScore)
                    .slice(0, 5)
                    .map((parcel) => (
                      <tr
                        key={parcel.id}
                        className="hover:bg-[#f9f8f5] dark:hover:bg-[#19241d] transition-colors"
                      >
                        <td className="px-4 py-2.5 font-medium font-mono">
                          <Link
                            to={`/parcels/${parcel.id}`}
                            className="text-[#1f4230] dark:text-[#82c499] hover:underline"
                          >
                            {parcel.id}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 text-[#4a544c] dark:text-[#cad6cd]">
                          {parcel.village}
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-mono font-semibold text-[#a63529] dark:text-[#e47668]">
                            {parcel.riskScore}/100
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-[#a86927] dark:text-[#d69f6e] font-mono">
                          +{parcel.predictedDelayDays}d
                        </td>
                        <td
                          className="px-4 py-2.5 text-[#58615a] dark:text-[#95a398] truncate max-w-[130px]"
                          title={parcel.topRiskFactors[0]?.factor}
                        >
                          {parcel.topRiskFactors[0]?.factor || "Documentation"}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
