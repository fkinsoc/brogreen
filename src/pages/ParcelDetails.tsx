import React, { useMemo, useState, useEffect } from "react";
import AppLayout from "../components/Layout";
import { staticParcels } from "../lib/data";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import MapView from "../components/ParcelMap";

export default function ParcelDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const id = params.id as string;
  const parcel = useMemo(() => staticParcels.find((p) => p.id === id), [id]);

  const [aiInsight, setAiInsight] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (!parcel) return;
    async function fetchAiInsight() {
      setLoadingAi(true);
      try {
        const response = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `Analyze the risk for this land parcel: Risk Level: ${parcel.riskLevel} (${parcel.riskScore}/100), Legal Status: ${parcel.legalDisputeStatus}, Compensation: ${parcel.compensationStatus}, Main Risk Factor: ${parcel.topRiskFactors[0]?.factor || "None"}. Provide a concise 2-sentence tactical recommendation on how to mitigate this specific risk and avoid schedule delays.`,
            systemPrompt:
              "You are an expert real estate acquisition analyst. Give practical, direct advice without buzzwords.",
          }),
        });
        const data = await response.json();
        if (data.text) setAiInsight(data.text);
      } catch (e) {
        console.error("Failed to fetch AI insight", e);
      } finally {
        setLoadingAi(false);
      }
    }
    fetchAiInsight();
  }, [parcel]);

  if (!parcel) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-lg font-semibold text-[#181c19] dark:text-[#eff3ef]">
            Parcel Not Found
          </h2>
          <p className="text-xs text-[#58615a] dark:text-[#95a398] mt-1">
            The requested parcel identifier "{id}" does not exist.
          </p>
          <button
            onClick={() => navigate("/parcels")}
            className="mt-4 px-3.5 py-1.5 bg-[#1f4230] text-white text-xs font-semibold rounded-xs hover:bg-[#163324] transition-colors"
          >
            Back to Parcels List
          </button>
        </div>
      </AppLayout>
    );
  }

  const isHighRisk = parcel.riskLevel === "High";
  const isMediumRisk = parcel.riskLevel === "Medium";

  const getRiskBadge = () => {
    if (isHighRisk) {
      return "text-[#a63529] dark:text-[#e47668] bg-[#fbf0ee] dark:bg-[#2c1d1a] border-[#edd2ce] dark:border-[#4d2823]";
    }
    if (isMediumRisk) {
      return "text-[#a86927] dark:text-[#dfa364] bg-[#fdf6ec] dark:bg-[#2c2217] border-[#eddac2] dark:border-[#4d3a24]";
    }
    return "text-[#24613b] dark:text-[#7fba96] bg-[#eef5f0] dark:bg-[#18261e] border-[#cbe1d3] dark:border-[#274031]";
  };

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#58615a] dark:text-[#95a398]">
          <Link to="/parcels" className="hover:text-[#181c19] dark:hover:text-white">
            Land Parcels
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50" />
          <span className="font-semibold text-[#181c19] dark:text-[#eff3ef]">
            {parcel.id}
          </span>
        </div>

        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#e5e2da] dark:border-[#212c24]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-xs border border-[#dcd7cd] dark:border-[#2b3a30] text-[#58615a] dark:text-[#95a398] hover:bg-[#eeebe3] dark:hover:bg-[#1c2720] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181c19] dark:text-[#eff3ef]">
                  Parcel {parcel.id}
                </h1>
                <span className={`px-2 py-0.5 rounded-xs text-xs font-semibold border ${getRiskBadge()}`}>
                  {parcel.riskLevel} Risk ({parcel.riskScore}/100)
                </span>
              </div>
              <p className="text-xs text-[#58615a] dark:text-[#95a398] mt-0.5">
                Survey No. {parcel.surveyNumber} · {parcel.village}, {parcel.district}
              </p>
            </div>
          </div>

          <div className="text-xs text-[#58615a] dark:text-[#95a398] flex items-center gap-2">
            <span>Stage:</span>
            <span className="font-semibold text-[#181c19] dark:text-[#eff3ef]">
              {parcel.currentAcquisitionStage}
            </span>
          </div>
        </div>

        {/* AI Tactical Recommendation */}
        <div className="p-3.5 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] flex items-start gap-3">
          <div className="w-6 h-6 rounded-xs bg-[#eaf3ed] dark:bg-[#1c2c22] text-[#1f4230] dark:text-[#82c499] flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">
            AI
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#181c19] dark:text-[#eff3ef]">
              Tactical Acquisition Recommendation
            </div>
            <p className="text-xs text-[#444d46] dark:text-[#b4c0b6] mt-0.5 leading-relaxed">
              {loadingAi
                ? "Analyzing survey data and calculating optimal intervention route..."
                : aiInsight ||
                  parcel.recommendedAction ||
                  "Ensure joint measurement confirmation with revenue officers to avoid boundary disputes."}
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26]">
            <div className="text-[11px] text-[#58615a] dark:text-[#95a398]">Area</div>
            <div className="text-lg font-bold font-mono text-[#181c19] dark:text-[#eff3ef] mt-1">
              {parcel.areaAcres} Acres
            </div>
          </div>

          <div className="p-3 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26]">
            <div className="text-[11px] text-[#58615a] dark:text-[#95a398]">Predicted Delay</div>
            <div className="text-lg font-bold font-mono text-[#a86927] dark:text-[#dfa364] mt-1">
              +{parcel.predictedDelayDays} Days
            </div>
          </div>

          <div className="p-3 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26]">
            <div className="text-[11px] text-[#58615a] dark:text-[#95a398]">Delay Probability</div>
            <div className="text-lg font-bold font-mono text-[#181c19] dark:text-[#eff3ef] mt-1">
              {parcel.delayProbability}%
            </div>
          </div>

          <div className="p-3 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26]">
            <div className="text-[11px] text-[#58615a] dark:text-[#95a398]">Primary Landowner</div>
            <div className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef] truncate mt-1">
              {parcel.landOwner}
            </div>
          </div>
        </div>

        {/* Two-Column Details & GIS Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Detailed Attributes */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] space-y-3">
              <h3 className="text-xs font-semibold text-[#181c19] dark:text-[#eff3ef] uppercase tracking-wider pb-2 border-b border-[#eeebe3] dark:border-[#1d2920]">
                Cadastral & Legal Status
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[#58615a] dark:text-[#95a398] block">Legal Dispute:</span>
                  <span className="font-semibold text-[#181c19] dark:text-[#eff3ef]">
                    {parcel.legalDisputeStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[#58615a] dark:text-[#95a398] block">Compensation:</span>
                  <span className="font-semibold text-[#181c19] dark:text-[#eff3ef]">
                    {parcel.compensationStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[#58615a] dark:text-[#95a398] block">Ownership Check:</span>
                  <span className="font-semibold text-[#181c19] dark:text-[#eff3ef]">
                    {parcel.ownershipVerificationStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[#58615a] dark:text-[#95a398] block">Documentation:</span>
                  <span className="font-semibold text-[#181c19] dark:text-[#eff3ef]">
                    {parcel.documentationStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Contributing Risk Drivers */}
            <div className="p-4 rounded-xs bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] space-y-3">
              <h3 className="text-xs font-semibold text-[#181c19] dark:text-[#eff3ef] uppercase tracking-wider pb-2 border-b border-[#eeebe3] dark:border-[#1d2920]">
                Contributing Risk Drivers
              </h3>

              <div className="space-y-2.5">
                {parcel.topRiskFactors.map((rf, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span className="text-[#181c19] dark:text-[#eff3ef] font-medium">
                        {rf.factor}
                      </span>
                      <span className="font-mono text-[#a86927] dark:text-[#dfa364]">
                        {rf.contribution}% contribution
                      </span>
                    </div>
                    <div className="w-full bg-[#eeeae0] dark:bg-[#1d2820] h-1.5 overflow-hidden">
                      <div
                        className="bg-[#a86927] h-1.5"
                        style={{ width: `${rf.contribution}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GIS Map View */}
          <div className="lg:col-span-5 rounded-xs border border-[#e5e2da] dark:border-[#222f26] bg-[#101712] overflow-hidden min-h-[300px] flex flex-col">
            <div className="p-3 border-b border-[#212c24] bg-[#111813] text-xs font-semibold text-[#eff3ef]">
              Spatial Cadastral Overlay
            </div>
            <div className="flex-1 relative">
              <MapView
                parcel={parcel}
                allParcels={[parcel]}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
