import React, { useState, useMemo, useEffect } from "react";
import AppLayout from "../components/Layout";
import { staticParcels, RiskLevel, Parcel } from "../lib/data";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "../lib/i18n";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function ParcelsPage() {
  const [parcels, setParcels] = useState<Parcel[]>(staticParcels);
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "All">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 15;

  useEffect(() => {
    const q = searchParams.get("q") || searchParams.get("search") || "";
    if (q !== searchTerm) {
      setSearchTerm(q);
      setCurrentPage(1);
    }
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    if (value.trim()) {
      setSearchParams({ q: value.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    setSearchParams({});
  };

  const [newParcel, setNewParcel] = useState({
    id: `LA-MH-${Math.floor(Math.random() * 9000) + 1000}`,
    surveyNumber: "",
    village: "",
    district: "Pune",
    landOwner: "",
    areaAcres: "",
    currentAcquisitionStage: "Initial Notification",
  });

  const filteredParcels = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    return parcels.filter((p) => {
      const matchesSearch =
        !term ||
        p.id.toLowerCase().includes(term) ||
        p.landOwner.toLowerCase().includes(term) ||
        p.village.toLowerCase().includes(term) ||
        p.surveyNumber.toLowerCase().includes(term) ||
        p.district.toLowerCase().includes(term) ||
        p.currentAcquisitionStage.toLowerCase().includes(term);
      const matchesRisk = riskFilter === "All" || p.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    });
  }, [searchTerm, riskFilter, parcels]);

  const totalPages = Math.ceil(filteredParcels.length / itemsPerPage);
  const paginatedParcels = filteredParcels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case "High":
        return "text-[#a63529] dark:text-[#e47668] bg-[#fbf0ee] dark:bg-[#2c1d1a] border-[#edd2ce] dark:border-[#4d2823]";
      case "Medium":
        return "text-[#a86927] dark:text-[#dfa364] bg-[#fdf6ec] dark:bg-[#2c2217] border-[#eddac2] dark:border-[#4d3a24]";
      case "Low":
        return "text-[#24613b] dark:text-[#7fba96] bg-[#eef5f0] dark:bg-[#18261e] border-[#cbe1d3] dark:border-[#274031]";
      default:
        return "text-[#657067] bg-[#f0eee8] border-[#dedad1]";
    }
  };

  const handleAddParcel = (e: React.FormEvent) => {
    e.preventDefault();
    const parcelToAdd: Parcel = {
      ...newParcel,
      areaAcres: parseFloat(newParcel.areaAcres) || 0,
      state: "Maharashtra",
      numberOfOwners: 1,
      ownershipVerificationStatus: "Pending",
      documentationStatus: "Incomplete",
      compensationStatus: "Pending",
      legalDisputeStatus: "None",
      objectionStatus: "None",
      approvalStatus: "Pending",
      encroachmentStatus: "None",
      acquisitionStartDate: new Date().toISOString(),
      expectedCompletionDate: new Date().toISOString(),
      riskScore: 25,
      riskLevel: "Low",
      delayProbability: 15,
      predictedDelayDays: 0,
      topRiskFactors: [{ factor: "Standard survey verification", contribution: 100 }],
      recommendedAction: "Proceed with joint measurement survey.",
      lat: 18.5204 + (Math.random() - 0.5) * 0.1,
      lng: 73.8567 + (Math.random() - 0.5) * 0.1,
    } as Parcel;

    setParcels([parcelToAdd, ...parcels]);
    setIsAddModalOpen(false);
    setNewParcel({
      ...newParcel,
      id: `LA-MH-${Math.floor(Math.random() * 9000) + 1000}`,
      surveyNumber: "",
      village: "",
      landOwner: "",
      areaAcres: "",
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-4">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#e5e2da] dark:border-[#212c24]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181c19] dark:text-[#eff3ef]">
              {t('parcels.title')}
            </h1>
            <p className="text-xs text-[#58615a] dark:text-[#95a398] mt-0.5">
              {t('parcels.subtitle')}
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1f4230] hover:bg-[#163324] text-white text-xs font-semibold rounded-md transition-colors shadow-2xs self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('parcels.registerBtn')}</span>
          </button>
        </div>

        {/* Data Table Container */}
        <div className="rounded-lg border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17] shadow-2xs flex flex-col flex-1 overflow-hidden">
          {/* Filter Bar */}
          <div className="p-3 border-b border-[#e5e2da] dark:border-[#212c24] bg-[#faf9f6] dark:bg-[#121914] flex flex-col sm:flex-row gap-3 justify-between items-center">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#828c84]" />
              <input
                type="text"
                placeholder={t('parcels.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-[#18231c] border border-[#dcd7cd] dark:border-[#2b3a30] rounded-md text-[#181c19] dark:text-[#eff3ef] placeholder-[#828c84] focus:outline-none focus:ring-1 focus:ring-[#1f4230] focus:border-[#1f4230]"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  title="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#828c84] hover:text-white p-0.5 rounded cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Stats and Segmented Filter Control */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-[11px] text-[#6e7770] dark:text-[#8c9c90] hidden md:inline">
                {t('parcels.showingCount', { count: filteredParcels.length, total: parcels.length })}
              </span>

              <div className="flex items-center p-0.5 bg-[#eeeae0] dark:bg-[#1a251e] rounded-md border border-[#dedad1] dark:border-[#25342a]">
                {(["All", "High", "Medium", "Low"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setRiskFilter(lvl);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                      riskFilter === lvl
                        ? "bg-[#1f4230] text-white shadow-2xs font-semibold"
                        : "text-[#58615a] dark:text-[#95a398] hover:text-[#181c19] dark:hover:text-white"
                    }`}
                  >
                    {lvl === "All"
                      ? t('parcels.filterAll')
                      : lvl === "High"
                      ? t('parcels.filterHigh')
                      : lvl === "Medium"
                      ? t('parcels.filterMedium')
                      : t('parcels.filterLow')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-xs text-left whitespace-nowrap">
              <thead className="text-[11px] font-semibold text-[#6e7770] dark:text-[#8c9c90] uppercase tracking-wider bg-[#f8f8f5] dark:bg-[#111813] border-b border-[#e5e2da] dark:border-[#212c24] sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3">{t('parcels.colId')}</th>
                  <th className="px-4 py-3">{t('parcels.colSurvey')}</th>
                  <th className="px-4 py-3">{t('parcels.colVillage')}</th>
                  <th className="px-4 py-3">{t('parcels.colOwner')}</th>
                  <th className="px-4 py-3">{t('parcels.colArea')}</th>
                  <th className="px-4 py-3">{t('parcels.colStage')}</th>
                  <th className="px-4 py-3">{t('parcels.colRisk')}</th>
                  <th className="px-4 py-3 text-right">{t('parcels.colActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f2efe8] dark:divide-[#1a251e]">
                {paginatedParcels.length > 0 ? (
                  paginatedParcels.map((parcel) => (
                    <tr
                      key={parcel.id}
                      className="hover:bg-[#f9f8f5] dark:hover:bg-[#19241d] transition-colors"
                    >
                      <td className="px-4 py-2.5 font-medium font-mono text-[#181c19] dark:text-[#eff3ef]">
                        <Link
                          to={`/parcels/${parcel.id}`}
                          className="text-[#1f4230] dark:text-[#82c499] hover:underline"
                        >
                          {parcel.id}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-[#58615a] dark:text-[#95a398]">
                        {parcel.surveyNumber}
                      </td>
                      <td className="px-4 py-2.5 text-[#3e4640] dark:text-[#c4cec6]">
                        {parcel.village}, {parcel.district}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-[#181c19] dark:text-[#eff3ef]">
                        {parcel.landOwner}
                      </td>
                      <td className="px-4 py-2.5 font-mono tabular-nums text-[#58615a] dark:text-[#95a398]">
                        {parcel.areaAcres}
                      </td>
                      <td className="px-4 py-2.5 text-[#4a544c] dark:text-[#b4c0b6]">
                        {parcel.currentAcquisitionStage}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${getRiskColor(
                            parcel.riskLevel
                          )}`}
                        >
                          <span className="font-mono tabular-nums">
                            {parcel.riskLevel} ({parcel.riskScore})
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Link
                          to={`/parcels/${parcel.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1f4230] dark:text-[#82c499] hover:bg-[#eeebe3] dark:hover:bg-[#1f2c22] rounded transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t('parcels.viewDossier')}</span>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-[#7a857c] bg-[#faf9f6] dark:bg-[#121914]"
                    >
                      No parcels matched the filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-3 border-t border-[#e5e2da] dark:border-[#212c24] bg-[#faf9f6] dark:bg-[#121914] flex items-center justify-between text-xs text-[#58615a] dark:text-[#95a398]">
            <div>
              Showing{" "}
              <strong className="text-[#181c19] dark:text-[#eff3ef] font-mono">
                {(currentPage - 1) * itemsPerPage + 1}
              </strong>{" "}
              to{" "}
              <strong className="text-[#181c19] dark:text-[#eff3ef] font-mono">
                {Math.min(currentPage * itemsPerPage, filteredParcels.length)}
              </strong>{" "}
              of{" "}
              <strong className="text-[#181c19] dark:text-[#eff3ef] font-mono">
                {filteredParcels.length}
              </strong>{" "}
              records
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                aria-label="Previous Page"
                className="p-1.5 rounded border border-[#dcd7cd] dark:border-[#2b3a30] text-[#58615a] dark:text-[#95a398] hover:bg-[#eeebe3] dark:hover:bg-[#1d2720] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 tabular-nums">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                aria-label="Next Page"
                className="p-1.5 rounded border border-[#dcd7cd] dark:border-[#2b3a30] text-[#58615a] dark:text-[#95a398] hover:bg-[#eeebe3] dark:hover:bg-[#1d2720] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Parcel Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-2xs p-4">
            <motion.div
              initial={{ scale: 0.97, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.97, opacity: 0, y: 10 }}
              className="bg-white dark:bg-[#151e18] border border-[#e5e2da] dark:border-[#28372d] rounded-lg p-5 w-full max-w-md shadow-xl"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#e5e2da] dark:border-[#212c24]">
                <div>
                  <h2 className="text-base font-bold text-[#181c19] dark:text-[#eff3ef]">
                    Register Land Parcel
                  </h2>
                  <p className="text-xs text-[#58615a] dark:text-[#95a398]">
                    Enter parcel and survey details.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-[#828c84] hover:text-[#181c19] dark:hover:text-white p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddParcel} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#58615a] dark:text-[#95a398] mb-1">
                      Assigned ID
                    </label>
                    <input
                      type="text"
                      value={newParcel.id}
                      disabled
                      className="w-full bg-[#f4f3ef] dark:bg-[#101712] border border-[#dcd7cd] dark:border-[#28372d] rounded px-3 py-1.5 text-xs font-mono text-[#828c84] cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#58615a] dark:text-[#95a398] mb-1">
                      Survey Number *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. SY-48/3"
                      value={newParcel.surveyNumber}
                      onChange={(e) =>
                        setNewParcel({ ...newParcel, surveyNumber: e.target.value })
                      }
                      className="w-full bg-white dark:bg-[#18231c] border border-[#dcd7cd] dark:border-[#28372d] rounded px-3 py-1.5 text-xs text-[#181c19] dark:text-[#eff3ef] focus:ring-1 focus:ring-[#1f4230] focus:border-[#1f4230] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#58615a] dark:text-[#95a398] mb-1">
                    Landowner Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Full name of registered owner"
                    value={newParcel.landOwner}
                    onChange={(e) =>
                      setNewParcel({ ...newParcel, landOwner: e.target.value })
                    }
                    className="w-full bg-white dark:bg-[#18231c] border border-[#dcd7cd] dark:border-[#28372d] rounded px-3 py-1.5 text-xs text-[#181c19] dark:text-[#eff3ef] focus:ring-1 focus:ring-[#1f4230] focus:border-[#1f4230] outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#58615a] dark:text-[#95a398] mb-1">
                      Village *
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Hinjewadi"
                      value={newParcel.village}
                      onChange={(e) =>
                        setNewParcel({ ...newParcel, village: e.target.value })
                      }
                      className="w-full bg-white dark:bg-[#18231c] border border-[#dcd7cd] dark:border-[#28372d] rounded px-3 py-1.5 text-xs text-[#181c19] dark:text-[#eff3ef] focus:ring-1 focus:ring-[#1f4230] focus:border-[#1f4230] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#58615a] dark:text-[#95a398] mb-1">
                      Area (Acres) *
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 5.2"
                      value={newParcel.areaAcres}
                      onChange={(e) =>
                        setNewParcel({ ...newParcel, areaAcres: e.target.value })
                      }
                      className="w-full bg-white dark:bg-[#18231c] border border-[#dcd7cd] dark:border-[#28372d] rounded px-3 py-1.5 text-xs text-[#181c19] dark:text-[#eff3ef] focus:ring-1 focus:ring-[#1f4230] focus:border-[#1f4230] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#e5e2da] dark:border-[#212c24] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-3.5 py-1.5 text-xs text-[#58615a] dark:text-[#95a398] hover:text-[#181c19] dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#1f4230] hover:bg-[#163324] text-white text-xs font-semibold rounded transition-colors shadow-2xs"
                  >
                    Save Parcel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
