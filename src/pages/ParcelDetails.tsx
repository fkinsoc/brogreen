import React, { useMemo, useState, useEffect } from "react";
import AppLayout from "../components/Layout";
import { staticParcels } from "../lib/data";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  FileText,
  Scale,
  User,
  Calendar,
  Clock,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
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
            className="mt-4 px-3.5 py-1.5 bg-[#1f4230] text-white text-xs font-semibold rounded-md shadow-2xs hover:bg-[#163324] transition-colors"
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
              className="p-1 rounded border border-[#dcd7cd] dark:border-[#2b3a30] text-[#58615a] dark:text-[#95a398] hover:bg-[#eeebe3] dark:hover:bg-[#1c2720] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181c19] dark:text-[#eff3ef]">
                  Parcel {parcel.id}
                </h1>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getRiskBadge()}`}>
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
        <div className="p-3.5 rounded-lg bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] shadow-2xs flex items-start gap-3">
          <div className="w-6 h-6 rounded-md bg-[#eaf3ed] dark:bg-[#1c2c22] text-[#1f4230] dark:text-[#82c499] flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-semibold">
            AI
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#181c19] dark:text-[#eff3ef]">
              Risk Assessment & Recommendation
            </div>
            <p className="text-xs text-[#4d564f] dark:text-[#abb6ad] mt-0.5 leading-relaxed">
              {loadingAi
                ? "Synthesizing mitigation strategy..."
                : aiInsight ||
                  `Title objections on record for survey ${parcel.surveyNumber}. Convene conciliation session with registered owners to prevent a ${parcel.predictedDelayDays}-day delay on the corridor timeline.`}
            </p>
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Metadata & Map */}
          <div className="lg:col-span-8 space-y-4">
            {/* Metadata Card */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] shadow-2xs">
              <h3 className="text-xs font-semibold text-[#181c19] dark:text-[#eff3ef] uppercase tracking-wider mb-3 pb-2 border-b border-[#eeebe3] dark:border-[#1d2920]">
                Property Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div>
                    <span className="text-[#6e7770] dark:text-[#8c9c90] block text-[11px]">Location</span>
                    <span className="font-medium text-[#181c19] dark:text-[#eff3ef]">
                      {parcel.village}, {parcel.district}, {parcel.state}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6e7770] dark:text-[#8c9c90] block text-[11px]">Survey Number & Area</span>
                    <span className="font-medium text-[#181c19] dark:text-[#eff3ef]">
                      {parcel.surveyNumber} · {parcel.areaAcres} Acres
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6e7770] dark:text-[#8c9c90] block text-[11px]">Registered Owner</span>
                    <span className="font-medium text-[#181c19] dark:text-[#eff3ef]">
                      {parcel.landOwner} ({parcel.numberOfOwners} owner{parcel.numberOfOwners > 1 ? "s" : ""})
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[#6e7770] dark:text-[#8c9c90] block text-[11px]">Legal Dispute</span>
                    <span className={`font-medium ${parcel.legalDisputeStatus === "Active Case" ? "text-[#a63529]" : "text-[#181c19] dark:text-[#eff3ef]"}`}>
                      {parcel.legalDisputeStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6e7770] dark:text-[#8c9c90] block text-[11px]">Compensation Status</span>
                    <span className="font-medium text-[#181c19] dark:text-[#eff3ef]">
                      {parcel.compensationStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6e7770] dark:text-[#8c9c90] block text-[11px]">Timeline</span>
                    <span className="font-medium text-[#181c19] dark:text-[#eff3ef]">
                      Started: {format(new Date(parcel.acquisitionStartDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <div className="rounded-lg bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] shadow-2xs overflow-hidden">
              <div className="p-3 border-b border-[#eeebe3] dark:border-[#1d2920] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#181c19] dark:text-[#eff3ef]">
                  Geographic Location
                </span>
                <span className="text-[11px] font-mono text-[#6e7770] dark:text-[#8c9c90]">
                  {parcel.lat.toFixed(4)}, {parcel.lng.toFixed(4)}
                </span>
              </div>
              <div className="h-[320px]">
                <MapView parcel={parcel} />
              </div>
            </div>
          </div>

          {/* Right: Risk Model Analysis */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-4 rounded-lg bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] shadow-2xs">
              <h3 className="text-xs font-semibold text-[#181c19] dark:text-[#eff3ef] uppercase tracking-wider mb-3 pb-2 border-b border-[#eeebe3] dark:border-[#1d2920]">
                Predicted Delay
              </h3>

              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs text-[#58615a] dark:text-[#95a398]">Overrun Estimate:</span>
                <span className="text-2xl font-bold font-mono text-[#a86927] dark:text-[#e0a262]">
                  +{parcel.predictedDelayDays} days
                </span>
              </div>

              <div className="text-xs space-y-2 pt-2 border-t border-[#eeebe3] dark:border-[#1d2920]">
                <div className="flex justify-between">
                  <span className="text-[#6e7770] dark:text-[#8c9c90]">Delay Probability:</span>
                  <span className="font-semibold text-[#181c19] dark:text-[#eff3ef] font-mono">
                    {parcel.delayProbability}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7770] dark:text-[#8c9c90]">Composite Risk Index:</span>
                  <span className="font-semibold text-[#181c19] dark:text-[#eff3ef] font-mono">
                    {parcel.riskScore}/100
                  </span>
                </div>
              </div>
            </div>

            {/* Factor breakdown */}
            <div className="p-4 rounded-lg bg-white dark:bg-[#141d17] border border-[#e5e2da] dark:border-[#222f26] shadow-2xs">
              <h3 className="text-xs font-semibold text-[#181c19] dark:text-[#eff3ef] uppercase tracking-wider mb-3 pb-2 border-b border-[#eeebe3] dark:border-[#1d2920]">
                Risk Factor Breakdown
              </h3>

              <div className="space-y-3">
                {parcel.topRiskFactors.map((factor, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#363e38] dark:text-[#d3ded5]">
                        {factor.factor}
                      </span>
                      <span className="font-mono text-[#6e7770] dark:text-[#8c9c90]">
                        {factor.contribution}%
                      </span>
                    </div>
                    <div className="w-full bg-[#eeeae0] dark:bg-[#1f2b23] h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          idx === 0
                            ? "bg-[#a63529]"
                            : idx === 1
                            ? "bg-[#a86927]"
                            : "bg-[#1f4230]"
                        }`}
                        style={{ width: `${factor.contribution}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended action */}
            <div className="p-4 rounded-lg bg-[#faf9f6] dark:bg-[#121914] border border-[#e5e2da] dark:border-[#222f26] shadow-2xs">
              <h3 className="text-xs font-semibold text-[#181c19] dark:text-[#eff3ef] uppercase tracking-wider mb-2">
                Recommended Action
              </h3>
              <p className="text-xs text-[#4d564f] dark:text-[#abb6ad] leading-relaxed mb-3">
                {parcel.recommendedAction}
              </p>
              <button
                onClick={() => alert(`Status logged for parcel ${parcel.id}`)}
                className="w-full py-2 bg-[#1f4230] hover:bg-[#163324] text-white text-xs font-semibold rounded-md shadow-2xs transition-colors"
              >
                Mark Action as In-Progress
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
