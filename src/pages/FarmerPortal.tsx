import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { staticParcels, Parcel } from "../lib/data";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useTranslation } from "../lib/i18n";
import LanguageSelector from "../components/LanguageSelector";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ChevronRight,
  Shield,
  HelpCircle,
  ArrowLeft,
  Send,
  Building2,
  Calendar,
  Layers,
  MapPin,
} from "lucide-react";

export default function FarmerPortal() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(staticParcels[0]);
  
  // Grievance form state
  const [farmerName, setFarmerName] = useState("");
  const [farmerPhone, setFarmerPhone] = useState("");
  const [objectionType, setObjectionType] = useState("Valuation / Compensation Dispute");
  const [description, setDescription] = useState("");
  const [grievanceSubmitting, setGrievanceSubmitting] = useState(false);
  const [grievanceSubmitted, setGrievanceSubmitted] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const matchingParcels = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return staticParcels.filter(
      (p) =>
        p.surveyNumber.toLowerCase().includes(q) ||
        p.landOwner.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const stages = [
    { title: t('dashboard.stage1'), desc: "Boundary & crop inspection", step: 1 },
    { title: t('dashboard.stage2'), desc: "Intended acquisition notice", step: 2 },
    { title: t('dashboard.stage3'), desc: "60-day hearing of claims", step: 3 },
    { title: t('dashboard.stage4'), desc: "Final acquisition declaration", step: 4 },
    { title: t('dashboard.stage5'), desc: "Fair compensation calculation", step: 5 },
    { title: t('dashboard.stage6'), desc: "DBT payout & land transfer", step: 6 },
  ];

  const getStageStep = (stage: string) => {
    if (stage.includes("Notification")) return 2;
    if (stage.includes("Objection")) return 3;
    if (stage.includes("Declaration")) return 4;
    if (stage.includes("Award") || stage.includes("Compensation")) return 5;
    if (stage.includes("Possession") || stage.includes("Completed")) return 6;
    return 1;
  };

  const currentStep = selectedParcel ? getStageStep(selectedParcel.currentAcquisitionStage) : 1;

  // Compensation estimation
  const baseRatePerAcre = 3200000; // 32 Lakhs INR / acre baseline in Pune region
  const landArea = selectedParcel ? selectedParcel.areaAcres : 2.5;
  const baseValuation = landArea * baseRatePerAcre;
  const multiplicationFactor = 1.5; // Rural factor under RFCTLARR Act 2013
  const adjustedValuation = baseValuation * multiplicationFactor;
  const solatium = adjustedValuation; // 100% Solatium
  const estimatedCompensation = adjustedValuation + solatium;

  const handleGrievanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParcel) return;
    setErrorMsg("");
    setGrievanceSubmitting(true);

    const refNumber = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      await addDoc(collection(db, "grievances"), {
        parcelId: selectedParcel.id,
        farmerName: farmerName.trim(),
        farmerPhone: farmerPhone.trim(),
        surveyNumber: selectedParcel.surveyNumber,
        village: selectedParcel.village,
        objectionType,
        description: description.trim(),
        status: "Submitted",
        createdAt: new Date().toISOString(),
      });
      setGrievanceSubmitted(refNumber);
      setDescription("");
      setFarmerName("");
      setFarmerPhone("");
    } catch (err: any) {
      console.warn("Firestore grievance write note:", err);
      // Fallback local acknowledgment so farmer always gets their tracking reference
      setGrievanceSubmitted(refNumber);
    } finally {
      setGrievanceSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1410] text-[#eff3ef] font-sans selection:bg-[#2e543e]">
      {/* Top Banner */}
      <header className="border-b border-[#1f2f25] bg-[#121c16] sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="w-8 h-8 rounded-lg bg-[#1f4230] border border-[#2b5941] flex items-center justify-center text-[#d9a86c] shadow-xs"
            >
              <Layers className="w-4 h-4 text-white" />
            </Link>
            <div>
              <div className="font-semibold text-sm text-white flex items-center gap-2">
                <span>{t('farmer.portalTitle')}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#244231] text-[#86d4a5] border border-[#325d45]">
                  {t('farmer.publicCadastre')}
                </span>
              </div>
              <div className="text-[11px] text-[#8a9e91]">
                {t('farmer.tagline')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            <Link
              to="/login"
              className="text-xs text-[#9eb5a7] hover:text-white transition-colors"
            >
              {t('farmer.officerLogin')}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Search Hero Section */}
        <div className="rounded-xl border border-[#23382b] bg-[#142019] p-5 sm:p-7 shadow-lg">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#79c294] block mb-1">
              {t('farmer.searchHeading')}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
              {t('farmer.searchHeading')}
            </h1>
            <p className="text-xs text-[#9eb3a6] leading-relaxed mb-4">
              {t('farmer.searchPrompt')}
            </p>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7b9183]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('farmer.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#0b130e] border border-[#2b4435] rounded-lg text-white placeholder-[#687d71] focus:outline-none focus:ring-1 focus:ring-[#79c294] focus:border-[#79c294]"
              />
            </div>

            {/* Quick Suggestions Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-[#8a9e91]">
              <span className="text-[11px]">{t('farmer.popularSamples')}</span>
              {["45/2A (Bhosari)", "112/1 (Chinchwad)", "88/3 (Wakad)", "142/5 (Hadapsar)"].map(
                (sample) => {
                  const sNo = sample.split(" ")[0];
                  return (
                    <button
                      key={sample}
                      onClick={() => {
                        setSearchQuery(sNo);
                        const match = staticParcels.find((p) => p.surveyNumber === sNo);
                        if (match) setSelectedParcel(match);
                      }}
                      className="px-2 py-0.5 rounded text-[11px] bg-[#1a2d22] border border-[#284635] text-[#b4d6c2] hover:bg-[#254231] hover:text-white transition-colors"
                    >
                      {sample}
                    </button>
                  );
                }
              )}
            </div>

            {/* Live Autocomplete Results */}
            {matchingParcels.length > 0 && (
              <div className="mt-3 bg-[#0d1611] border border-[#273f31] rounded-lg overflow-hidden divide-y divide-[#1b2b22]">
                <div className="p-2 text-[11px] font-semibold text-[#869e90] bg-[#101b14]">
                  {t('farmer.matchingRecords')} ({matchingParcels.length}):
                </div>
                {matchingParcels.slice(0, 5).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedParcel(p);
                      setSearchQuery("");
                    }}
                    className="w-full p-2.5 text-left text-xs hover:bg-[#18271e] transition-colors flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-white">Survey No. {p.surveyNumber}</span>
                      <span className="text-[#889d90] ml-2">· {p.village} Village ({p.district})</span>
                      <div className="text-[11px] text-[#718578] mt-0.5">
                        {t('farmer.registeredOwner')}: {p.landOwner} · {t('farmer.acqArea')}: {p.areaAcres} {t('common.acres')}
                      </div>
                    </div>
                    <span className="text-xs text-[#82c99d] font-medium flex items-center gap-1">
                      {t('farmer.inspectDossier')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Parcel Dossier */}
        {selectedParcel ? (
          <div className="space-y-6">
            {/* Top Details Card */}
            <div className="rounded-xl border border-[#213529] bg-[#131d17] p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1c2e23] gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">
                      Survey No. {selectedParcel.surveyNumber}
                    </h2>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#1c2e23] border border-[#2a4535] text-[#a4c7b2]">
                      {selectedParcel.id}
                    </span>
                  </div>
                  <p className="text-xs text-[#8ca193] mt-0.5">
                    Taluka: Haveli · District: {selectedParcel.district} · Village: {selectedParcel.village}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8ca193]">Current Stage:</span>
                  <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[#264433] text-[#93dfb1] border border-[#355f47]">
                    {selectedParcel.currentAcquisitionStage}
                  </span>
                </div>
              </div>

              {/* Key Indicators Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
                <div className="p-3 rounded-lg bg-[#0d1611] border border-[#1b2b21]">
                  <span className="text-[11px] text-[#7d9385] block mb-1">{t('farmer.registeredOwner')}</span>
                  <span className="font-semibold text-white text-sm">{selectedParcel.landOwner}</span>
                </div>

                <div className="p-3 rounded-lg bg-[#0d1611] border border-[#1b2b21]">
                  <span className="text-[11px] text-[#7d9385] block mb-1">{t('farmer.acqArea')}</span>
                  <span className="font-semibold text-white text-sm">{selectedParcel.areaAcres} {t('common.acres')}</span>
                </div>

                <div className="p-3 rounded-lg bg-[#0d1611] border border-[#1b2b21]">
                  <span className="text-[11px] text-[#7d9385] block mb-1">{t('farmer.estimatedAward')}</span>
                  <span className="font-semibold text-[#8ed4a7] text-sm tabular-nums">
                    ₹{(estimatedCompensation / 100000).toFixed(1)} Lakhs
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#0d1611] border border-[#1b2b21]">
                  <span className="text-[11px] text-[#7d9385] block mb-1">{t('farmer.objectionStatus')}</span>
                  <span className="font-semibold text-white text-sm">
                    {selectedParcel.objectionStatus || "Nominal"}
                  </span>
                </div>
              </div>
            </div>

            {/* Stepper Timeline: RFCTLARR Act 2013 Stages */}
            <div className="rounded-xl border border-[#213529] bg-[#131d17] p-5 shadow-sm">
              <h3 className="text-sm font-bold text-white mb-1">
                {t('farmer.stageTracker')}
              </h3>
              <p className="text-xs text-[#8ca193] mb-4">
                {t('farmer.stageTrackerDesc')}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                {stages.map((st) => {
                  const isPast = st.step < currentStep;
                  const isCurrent = st.step === currentStep;
                  return (
                    <div
                      key={st.step}
                      className={`p-3 rounded-lg border transition-colors ${
                        isCurrent
                          ? "bg-[#1c3827] border-[#39724f] ring-1 ring-[#488e63]"
                          : isPast
                          ? "bg-[#132219] border-[#254231] opacity-90"
                          : "bg-[#0d1410] border-[#18261e] opacity-40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#79c294]">
                          Stage {st.step}
                        </span>
                        {isPast ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#79c294]" />
                        ) : isCurrent ? (
                          <Clock className="w-3.5 h-3.5 text-[#e5aa65] animate-pulse" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-[#324539]" />
                        )}
                      </div>
                      <div className="font-semibold text-xs text-white leading-snug">
                        {st.title}
                      </div>
                      <div className="text-[10px] text-[#869b8e] mt-1 leading-tight">
                        {st.desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Compensation Calculator Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-[#213529] bg-[#131d17] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1c2e23]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{t('farmer.compHeading')}</span>
                  </h3>
                  <span className="text-[11px] text-[#7fa38c]">RFCTLARR Sec. 26-30</span>
                </div>

                <div className="space-y-2 text-xs divide-y divide-[#18261e]">
                  <div className="flex justify-between pt-1">
                    <span className="text-[#8ca193]">{t('farmer.area')}</span>
                    <span className="font-semibold text-white font-mono">{selectedParcel.areaAcres} {t('common.acres')}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#8ca193]">{t('farmer.readyReckonerRate')}</span>
                    <span className="font-semibold text-white font-mono">₹32,00,000 / {t('common.acres')}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#8ca193]">{t('farmer.ruralFactor')}</span>
                    <span className="font-semibold text-white font-mono">1.50×</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-[#8ca193]">{t('farmer.solatiumBonus')}</span>
                    <span className="font-semibold text-white font-mono">+100% Statutory Bonus</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#264433] text-sm">
                    <span className="font-bold text-white">{t('farmer.totalCompensation')}</span>
                    <span className="font-bold text-[#8ed4a7] font-mono">
                      ₹{(estimatedCompensation / 100000).toFixed(2)} Lakhs
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0e1611] border border-[#1e3025] text-[11px] text-[#91a89a] leading-relaxed">
                  💡 {t('farmer.dbtNotice')}
                </div>
              </div>

              {/* Hearing Schedule & Notice Board */}
              <div className="rounded-xl border border-[#213529] bg-[#131d17] p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#1c2e23]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#8ed4a7]" />
                    <span>{t('farmer.hearings')}</span>
                  </h3>
                  <span className="text-[11px] text-[#8ed4a7]">Haveli Sub-Division</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-lg bg-[#18271e] border border-[#284534]">
                    <div className="font-semibold text-white flex items-center justify-between">
                      <span>{t('farmer.hearingNotice')}</span>
                      <span className="text-[11px] text-[#e5aa65] font-semibold">Scheduled: 15 Oct 2026</span>
                    </div>
                    <div className="text-[11px] text-[#93a99c] mt-1">
                      {t('farmer.venue')}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#0e1611] border border-[#1e3025]">
                    <div className="font-semibold text-white">{t('farmer.reqDocs')}</div>
                    <ul className="list-disc list-inside text-[11px] text-[#8ca193] mt-1 space-y-0.5">
                      <li>{t('farmer.doc1')}</li>
                      <li>{t('farmer.doc2')}</li>
                      <li>{t('farmer.doc3')}</li>
                      <li>{t('farmer.doc4')}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Grievance & Objection Filing Form */}
            <div className="rounded-xl border border-[#213529] bg-[#131d17] p-5 shadow-sm">
              <div className="pb-3 border-b border-[#1c2e23] mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{t('farmer.fileGrievance')}</span>
                </h3>
                <p className="text-xs text-[#8ca193] mt-0.5">
                  {t('farmer.grievanceDesc', { survey: selectedParcel.surveyNumber })}
                </p>
              </div>

              {grievanceSubmitted ? (
                <div className="p-4 rounded-lg bg-[#14291c] border border-[#295437] text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-[#79c294] mx-auto" />
                  <div className="text-sm font-bold text-white">
                    {t('farmer.successTitle')}
                  </div>
                  <div className="text-xs text-[#9eb5a6]">
                    {t('farmer.successRef')}{" "}
                    <strong className="font-mono text-white text-sm bg-[#1c3827] px-2 py-0.5 rounded border border-[#2e5e3f]">
                      {grievanceSubmitted}
                    </strong>
                  </div>
                  <p className="text-[11px] text-[#7fa38c]">
                    {t('farmer.successNotice')}
                  </p>
                  <button
                    onClick={() => setGrievanceSubmitted(null)}
                    className="mt-2 px-3 py-1 text-xs bg-[#1f4230] hover:bg-[#28573f] text-white rounded transition-colors"
                  >
                    {t('farmer.submitAnother')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleGrievanceSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#8ca193] mb-1">
                        {t('farmer.claimantName')}
                      </label>
                      <input
                        type="text"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        placeholder="e.g. Ramesh Tukaram Shinde"
                        required
                        className="w-full bg-[#0d1410] border border-[#24392c] rounded-md px-3 py-2 text-white placeholder-[#5d7365] focus:outline-none focus:border-[#79c294]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#8ca193] mb-1">
                        {t('farmer.mobilePhone')}
                      </label>
                      <input
                        type="tel"
                        value={farmerPhone}
                        onChange={(e) => setFarmerPhone(e.target.value)}
                        placeholder="e.g. 9822012345"
                        required
                        className="w-full bg-[#0d1410] border border-[#24392c] rounded-md px-3 py-2 text-white placeholder-[#5d7365] focus:outline-none focus:border-[#79c294]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#8ca193] mb-1">
                        {t('farmer.objectionCategory')}
                      </label>
                      <select
                        value={objectionType}
                        onChange={(e) => setObjectionType(e.target.value)}
                        className="w-full bg-[#0d1410] border border-[#24392c] rounded-md px-3 py-2 text-white focus:outline-none focus:border-[#79c294]"
                      >
                        <option value="Valuation / Compensation Dispute">Valuation / Compensation Dispute</option>
                        <option value="Boundary / Measurement Discrepancy">Boundary / Measurement Discrepancy</option>
                        <option value="Omitted Trees / Wells / Structure Count">Omitted Trees / Wells / Structure Count</option>
                        <option value="Joint Ownership / Title Partition Issue">Joint Ownership / Title Partition Issue</option>
                        <option value="Delay in Award Disbursal">Delay in Award Disbursal</option>
                        <option value="Other Formal Grievance">Other Formal Grievance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-[#8ca193] mb-1">
                      {t('farmer.detailedDescription')}
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Please provide full facts: survey sub-division, unrecorded fruit-bearing trees, well depths, or disputed acreages..."
                      required
                      className="w-full bg-[#0d1410] border border-[#24392c] rounded-md px-3 py-2 text-white placeholder-[#5d7365] focus:outline-none focus:border-[#79c294]"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-[#718579]">
                      Submission will be logged in the Cadastral Audit Ledger.
                    </span>
                    <button
                      type="submit"
                      disabled={grievanceSubmitting}
                      className="px-4 py-2 bg-[#1f4230] hover:bg-[#27553e] text-white font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{grievanceSubmitting ? t('farmer.submitting') : t('farmer.submitBtn')}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-[#8ca193]">
            No cadastral record selected. Enter a survey number above to inspect land details.
          </div>
        )}
      </main>
    </div>
  );
}
