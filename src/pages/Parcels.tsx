import React, { useState, useMemo, useEffect } from "react";
import AppLayout from "../components/Layout";
import { staticParcels, RiskLevel, Parcel } from "../lib/data";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "../lib/i18n";
import {
  Search,
  Eye,
  Plus,
  X,
} from "lucide-react";

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
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1f4230] hover:bg-[#163324] text-white text-xs font-semibold rounded-xs transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('parcels.registerBtn')}</span>
          </button>
        </div>

        {/* Data Table Container */}
        <div className="rounded-xs border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17] flex flex-col flex-1 overflow-hidden">
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
                className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-[#18231c] border border-[#dcd7cd] dark:border-[#2b3a30] rounded-xs text-[#181c19] dark:text-[#eff3ef] placeholder-[#828c84] focus:outline-none focus:border-[#1f4230]"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  title="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#828c84] hover:text-white p-0.5 rounded-xs cursor-pointer"
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

              <div className="flex items-center p-0.5 bg-[#eeeae0] dark:bg-[#1a251e] rounded-xs border border-[#dedad1] dark:border-[#25342a]">
                {(["All", "High", "Medium", "Low"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setRiskFilter(lvl);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors cursor-pointer ${
                      riskFilter === lvl
                        ? "bg-[#1f4230] text-white font-semibold"
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
                          className={`inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-medium border ${getRiskColor(
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
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1f4230] dark:text-[#82c499] hover:bg-[#eeebe3] dark:hover:bg-[#1f2c22] rounded-xs transition-colors"
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
                      className="px-4 py-8 text-center text-xs text-[#6e7770] dark:text-[#8c9c90]"
                    >
                      No land parcels found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-[#e5e2da] dark:border-[#212c24] flex items-center justify-between bg-[#faf9f6] dark:bg-[#121914] text-xs">
              <span className="text-[#6e7770] dark:text-[#8c9c90]">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2.5 py-1 rounded-xs border border-[#dcd7cd] dark:border-[#2b3a30] text-[#181c19] dark:text-[#eff3ef] disabled:opacity-40 hover:bg-[#f6f5f0] dark:hover:bg-[#1c2720] transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2.5 py-1 rounded-xs border border-[#dcd7cd] dark:border-[#2b3a30] text-[#181c19] dark:text-[#eff3ef] disabled:opacity-40 hover:bg-[#f6f5f0] dark:hover:bg-[#1c2720] transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="bg-[#141d17] border border-[#26372c] rounded-xs max-w-md w-full p-5 text-xs text-white">
              <div className="flex items-center justify-between pb-3 border-b border-[#212e25] mb-4">
                <h3 className="text-sm font-bold text-white">Register Land Parcel</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-[#8c9c90] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddParcel} className="space-y-3">
                <div>
                  <label className="block text-[11px] text-[#8c9c90] mb-1">
                    Survey / Gat Number *
                  </label>
                  <input
                    type="text"
                    value={newParcel.surveyNumber}
                    onChange={(e) =>
                      setNewParcel({ ...newParcel, surveyNumber: e.target.value })
                    }
                    placeholder="e.g. 142/3B"
                    required
                    className="w-full bg-[#0d1410] border border-[#2b3b30] rounded-xs px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#79c294]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#8c9c90] mb-1">
                    Village *
                  </label>
                  <input
                    type="text"
                    value={newParcel.village}
                    onChange={(e) =>
                      setNewParcel({ ...newParcel, village: e.target.value })
                    }
                    placeholder="e.g. Wakad"
                    required
                    className="w-full bg-[#0d1410] border border-[#2b3b30] rounded-xs px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#79c294]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#8c9c90] mb-1">
                    Registered Landowner Name *
                  </label>
                  <input
                    type="text"
                    value={newParcel.landOwner}
                    onChange={(e) =>
                      setNewParcel({ ...newParcel, landOwner: e.target.value })
                    }
                    placeholder="e.g. Sopan Patil"
                    required
                    className="w-full bg-[#0d1410] border border-[#2b3b30] rounded-xs px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#79c294]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#8c9c90] mb-1">
                    Acquisition Area (Acres) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newParcel.areaAcres}
                    onChange={(e) =>
                      setNewParcel({ ...newParcel, areaAcres: e.target.value })
                    }
                    placeholder="e.g. 2.75"
                    required
                    className="w-full bg-[#0d1410] border border-[#2b3b30] rounded-xs px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#79c294]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#212e25]">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-3 py-1.5 border border-[#2b3b30] text-[#8c9c90] hover:text-white rounded-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#1f4230] hover:bg-[#28573f] text-white font-semibold rounded-xs"
                  >
                    Save Parcel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
