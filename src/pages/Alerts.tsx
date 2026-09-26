import React, { useMemo, useState } from "react";
import AppLayout from "../components/Layout";
import { staticParcels, Parcel } from "../lib/data";
import {
  AlertTriangle,
  Clock,
  Scale,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../lib/i18n";

type AlertType = "HIGH_RISK" | "LEGAL_DISPUTE" | "LONG_DELAY" | "DOCUMENTATION";

interface Alert {
  id: string;
  parcel: Parcel;
  type: AlertType;
  title: string;
  message: string;
  status: "New" | "Under Review" | "Resolved" | "Escalated";
  timestamp: string;
}

export default function AlertsPage() {
  const { t } = useTranslation();
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const initialAlerts = useMemo(() => {
    const generated: Alert[] = [];
    const baseDate = new Date("2026-09-02T12:00:00Z").getTime();
    staticParcels.forEach((p, index) => {
      const timestamp = new Date(baseDate - index * 3600000).toISOString();
      let status: Alert["status"] =
        index % 5 === 0
          ? "Under Review"
          : index % 11 === 0
          ? "Escalated"
          : "New";

      if (p.riskScore > 80) {
        generated.push({
          id: `ALT-${p.id}-1`,
          parcel: p,
          type: "HIGH_RISK",
          title: "High Risk Threshold Exceeded",
          message: `Risk score reached ${p.riskScore}/100. Conciliation between survey teams and owners recommended.`,
          status,
          timestamp,
        });
      }
      if (p.legalDisputeStatus === "Active Case") {
        generated.push({
          id: `ALT-${p.id}-2`,
          parcel: p,
          type: "LEGAL_DISPUTE",
          title: "Active Legal Dispute Pending",
          message:
            "Title dispute active in local revenue court. Compensation payment on hold pending resolution.",
          status: index % 3 === 0 ? "Under Review" : "New",
          timestamp,
        });
      }
      if (p.predictedDelayDays > 60) {
        generated.push({
          id: `ALT-${p.id}-3`,
          parcel: p,
          type: "LONG_DELAY",
          title: "Significant Milestone Delay Projected",
          message: `Projected possession delay of +${p.predictedDelayDays} days threatens project delivery schedule.`,
          status,
          timestamp,
        });
      }
    });
    return generated.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, []);

  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  const filteredAlerts = alerts.filter(
    (a) => filterStatus === "All" || a.status === filterStatus
  );

  const handleUpdateStatus = (id: string, newStatus: Alert["status"]) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case "HIGH_RISK":
        return <AlertTriangle className="w-4 h-4 text-[#a63529]" />;
      case "LEGAL_DISPUTE":
        return <Scale className="w-4 h-4 text-[#a86927]" />;
      case "LONG_DELAY":
        return <Clock className="w-4 h-4 text-[#5a412f]" />;
      case "DOCUMENTATION":
        return <FileText className="w-4 h-4 text-[#24613b]" />;
    }
  };

  const getStatusBadge = (status: Alert["status"]) => {
    switch (status) {
      case "New":
        return "text-[#a63529] dark:text-[#e47668] bg-[#fbf0ee] dark:bg-[#2c1d1a] border-[#edd2ce] dark:border-[#4d2823]";
      case "Under Review":
        return "text-[#a86927] dark:text-[#dfa364] bg-[#fdf6ec] dark:bg-[#2c2217] border-[#eddac2] dark:border-[#4d3a24]";
      case "Escalated":
        return "text-[#5a412f] dark:text-[#c49870] bg-[#f7f0e9] dark:bg-[#261d16] border-[#dfcfc2] dark:border-[#423123]";
      case "Resolved":
        return "text-[#24613b] dark:text-[#7fba96] bg-[#eef5f0] dark:bg-[#18261e] border-[#cbe1d3] dark:border-[#274031]";
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-full space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#e5e2da] dark:border-[#212c24]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181c19] dark:text-[#eff3ef]">
              {t('alerts.title')}
            </h1>
            <p className="text-xs text-[#58615a] dark:text-[#95a398] mt-0.5">
              {t('alerts.subtitle')}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center p-0.5 bg-[#eeeae0] dark:bg-[#1a251e] rounded-md border border-[#dedad1] dark:border-[#25342a] self-start sm:self-auto">
            {["All", "New", "Under Review", "Escalated", "Resolved"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-[#1f4230] text-white shadow-2xs font-semibold"
                    : "text-[#58615a] dark:text-[#95a398] hover:text-[#181c19] dark:hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto space-y-3 pb-6">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17] p-4 shadow-2xs flex flex-col sm:flex-row gap-3.5 hover:border-[#cfc9be] dark:hover:border-[#314236] transition-colors"
              >
                <div className="w-8 h-8 rounded-md bg-[#f6f5f0] dark:bg-[#18231c] border border-[#e2ded5] dark:border-[#26352b] flex items-center justify-center flex-shrink-0">
                  {getAlertIcon(alert.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef]">
                          {alert.title}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getStatusBadge(
                            alert.status
                          )}`}
                        >
                          {alert.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#58615a] dark:text-[#95a398] mt-0.5 font-mono">
                        <Link
                          to={`/parcels/${alert.parcel.id}`}
                          className="font-medium text-[#1f4230] dark:text-[#82c499] hover:underline"
                        >
                          {alert.parcel.id}
                        </Link>
                        <span>·</span>
                        <span>Survey {alert.parcel.surveyNumber}</span>
                        <span>·</span>
                        <span>{alert.parcel.village}</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#6e7770] dark:text-[#8c9c90] font-mono whitespace-nowrap self-start">
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-xs text-[#444d46] dark:text-[#b4c0b6] mt-2 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-[#f0ece5] dark:border-[#1d2720] flex flex-wrap items-center gap-2">
                    <Link
                      to={`/parcels/${alert.parcel.id}`}
                      className="px-2.5 py-1 bg-[#1f4230] hover:bg-[#163324] text-white text-xs font-medium rounded transition-colors shadow-2xs"
                    >
                      View Parcel
                    </Link>

                    {alert.status !== "Escalated" && (
                      <button
                        onClick={() => handleUpdateStatus(alert.id, "Escalated")}
                        className="px-2.5 py-1 border border-[#dcd7cd] dark:border-[#2b3a30] text-[#5a412f] dark:text-[#d69f6e] hover:bg-[#f6f5f0] dark:hover:bg-[#1c2720] text-xs font-medium rounded transition-colors"
                      >
                        Escalate
                      </button>
                    )}

                    {alert.status === "New" && (
                      <button
                        onClick={() => handleUpdateStatus(alert.id, "Under Review")}
                        className="px-2.5 py-1 border border-[#dcd7cd] dark:border-[#2b3a30] text-[#24613b] dark:text-[#7fba96] hover:bg-[#f6f5f0] dark:hover:bg-[#1c2720] text-xs font-medium rounded transition-colors"
                      >
                        Reviewing
                      </button>
                    )}

                    {alert.status !== "Resolved" && (
                      <button
                        onClick={() => handleUpdateStatus(alert.id, "Resolved")}
                        className="px-2 py-1 text-xs text-[#6e7770] dark:text-[#8c9c90] hover:text-[#181c19] dark:hover:text-white"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#141d17]">
              <CheckCircle2 className="w-8 h-8 mb-2 text-[#24613b]" />
              <div className="text-sm font-semibold text-[#181c19] dark:text-[#eff3ef]">
                No warnings found
              </div>
              <p className="text-xs text-[#58615a] dark:text-[#95a398] mt-0.5">
                No active warnings match filter "{filterStatus}".
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
