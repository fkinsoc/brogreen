import React, { useState, useMemo } from "react";
import AppLayout from "../components/Layout";
import { staticParcels, RiskLevel } from "../lib/data";
import { Filter } from "lucide-react";
import MapView from "../components/ParcelMap";
import { useTranslation } from "../lib/i18n";

export default function GISMapPage() {
  const { t } = useTranslation();
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "All">("All");

  const filteredParcels = useMemo(() => {
    if (riskFilter === "All") return staticParcels;
    return staticParcels.filter((p) => p.riskLevel === riskFilter);
  }, [riskFilter]);

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#e5e2da] dark:border-[#212c24]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181c19] dark:text-[#eff3ef]">
              {t('map.title')}
            </h1>
            <p className="text-xs text-[#58615a] dark:text-[#95a398] mt-0.5">
              {t('map.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-[#151e18] border border-[#dcd7cd] dark:border-[#2b3a30] px-3 py-1.5 rounded-xs">
            <Filter className="h-3.5 w-3.5 text-[#58615a]" />
            <span className="text-xs text-[#58615a] dark:text-[#95a398]">{t('map.filter')}</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-[#181c19] dark:text-[#eff3ef] border-none focus:ring-0 cursor-pointer outline-none"
            >
              <option value="All">{t('map.allParcels')} ({staticParcels.length})</option>
              <option value="High">{t('parcels.filterHigh')} Risk Only</option>
              <option value="Medium">{t('parcels.filterMedium')} Risk Only</option>
              <option value="Low">{t('parcels.filterLow')} Risk Only</option>
            </select>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 rounded-xs border border-[#e5e2da] dark:border-[#222f26] bg-[#101712] flex flex-col overflow-hidden relative">
          {/* Legend: Opaque, crisp, no blur, no drop shadows */}
          <div className="absolute top-3 right-3 z-10 bg-[#151e18] border border-[#28372d] p-3 rounded-xs text-xs">
            <div className="font-semibold text-[#eff3ef] mb-2 pb-1 border-b border-[#202b23]">
              {t('map.riskLegend')}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-none bg-[#a63529]" />
                <span className="text-[#d3ded5]">{t('map.highRiskLegend')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-none bg-[#a86927]" />
                <span className="text-[#d3ded5]">{t('map.medRiskLegend')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-none bg-[#24613b]" />
                <span className="text-[#d3ded5]">{t('map.lowRiskLegend')}</span>
              </div>
            </div>
            <div className="mt-2.5 pt-1.5 border-t border-[#202b23] text-[11px] text-[#8c9c90]">
              Showing {filteredParcels.length} plots
            </div>
          </div>

          <MapView allParcels={filteredParcels} />
        </div>
      </div>
    </AppLayout>
  );
}
