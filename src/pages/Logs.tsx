import React, { useState, useMemo } from "react";
import AppLayout from "../components/Layout";
import { Download, Filter, TerminalSquare } from "lucide-react";
import { format } from "date-fns";

type LogLevel = "INFO" | "WARN" | "ERROR" | "SYSTEM";

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
}

function generateLogs(count = 50): LogEntry[] {
  const sources = [
    "Core Engine",
    "Auth Gateway",
    "GIS Sync",
    "Ingestion Service",
    "Database",
  ];
  const messages = [
    "User authenticated successfully.",
    "Spatial boundary polygons loaded for Sector 3.",
    "Geospatial parcel sync completed with 0 errors.",
    "Risk prediction model run completed.",
    "Dispute alert triggered on Parcel #1042.",
    "State land database sync established.",
    "Automated backup snapshot verified.",
    "Batch upload processing complete: 48 records merged.",
  ];
  const logs: LogEntry[] = [];
  const baseTime = new Date().getTime();
  for (let i = 0; i < count; i++) {
    const isError = Math.random() > 0.9;
    const isWarn = !isError && Math.random() > 0.7;
    const level: LogLevel = isError
      ? "ERROR"
      : isWarn
      ? "WARN"
      : Math.random() > 0.8
      ? "SYSTEM"
      : "INFO";
    logs.push({
      id: `log_${count - i}`,
      timestamp: new Date(baseTime - i * 1500000 * Math.random()).toISOString(),
      level,
      source: sources[Math.floor(Math.random() * sources.length)],
      message: isError
        ? "Timeout connecting to external GIS service."
        : isWarn
        ? "High memory usage detected on GIS render worker."
        : messages[Math.floor(Math.random() * messages.length)],
    });
  }
  return logs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

const systemLogs = generateLogs(80);

export default function LogsPage() {
  const [filterLevel, setFilterLevel] = useState<LogLevel | "ALL">("ALL");

  const filteredLogs = useMemo(() => {
    if (filterLevel === "ALL") return systemLogs;
    return systemLogs.filter((log) => log.level === filterLevel);
  }, [filterLevel]);

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "INFO":
        return "text-[#24613b] dark:text-[#7fba96] bg-[#eef5f0] dark:bg-[#18261e] border-[#cbe1d3] dark:border-[#274031]";
      case "WARN":
        return "text-[#a86927] dark:text-[#dfa364] bg-[#fdf6ec] dark:bg-[#2c2217] border-[#eddac2] dark:border-[#4d3a24]";
      case "ERROR":
        return "text-[#a63529] dark:text-[#e47668] bg-[#fbf0ee] dark:bg-[#2c1d1a] border-[#edd2ce] dark:border-[#4d2823]";
      case "SYSTEM":
        return "text-[#5a412f] dark:text-[#c49870] bg-[#f7f0e9] dark:bg-[#261d16] border-[#dfcfc2] dark:border-[#423123]";
      default:
        return "text-[#58615a] bg-[#f0eee8] border-[#dedad1]";
    }
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8,timestamp,level,source,message\n" +
      filteredLogs
        .map((l) => `"${l.timestamp}","${l.level}","${l.source}","${l.message}"`)
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "system_audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-[#e5e2da] dark:border-[#212c24]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#181c19] dark:text-[#eff3ef] flex items-center gap-2">
              <TerminalSquare className="w-5 h-5 text-[#1f4230] dark:text-[#82c499]" />
              <span>System Logs</span>
            </h1>
            <p className="text-xs text-[#58615a] dark:text-[#95a398] mt-0.5">
              Live audit trail of background workers, sync events, and model runs.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1f4230] hover:bg-[#163324] text-white text-xs font-semibold rounded transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Logs</span>
            </button>
          </div>
        </div>

        {/* Log Viewer Card */}
        <div className="flex-1 rounded-lg border border-[#e5e2da] dark:border-[#222f26] bg-white dark:bg-[#121914] flex flex-col overflow-hidden shadow-2xs">
          {/* Toolbar */}
          <div className="p-2.5 border-b border-[#e5e2da] dark:border-[#212c24] flex justify-between items-center bg-[#faf9f6] dark:bg-[#101612]">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#58615a]" />
              <span className="text-xs text-[#58615a] dark:text-[#95a398]">Filter by level:</span>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-[#181c19] dark:text-[#eff3ef] border-none focus:ring-0 cursor-pointer outline-none"
              >
                <option value="ALL">All Levels</option>
                <option value="INFO">INFO</option>
                <option value="WARN">WARN</option>
                <option value="ERROR">ERROR</option>
                <option value="SYSTEM">SYSTEM</option>
              </select>
            </div>

            <div className="text-xs text-[#58615a] dark:text-[#95a398] font-mono">
              {filteredLogs.length} events
            </div>
          </div>

          {/* Log Stream */}
          <div className="flex-1 overflow-y-auto bg-[#0d130f] text-[#d6ded8] p-3 font-mono text-xs divide-y divide-[#17221a]">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 py-1.5 hover:bg-[#131d17] transition-colors"
              >
                <div className="text-[#728578] flex-shrink-0 w-36 tabular-nums text-[11px]">
                  {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                </div>
                <div className="flex-shrink-0 w-14">
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold border tracking-wider ${getLevelColor(
                      log.level
                    )}`}
                  >
                    {log.level}
                  </span>
                </div>
                <div
                  className="text-[#c79c6d] flex-shrink-0 w-28 truncate text-[11px]"
                  title={log.source}
                >
                  [{log.source}]
                </div>
                <div className="text-[#e1ebe4] flex-1 break-words leading-relaxed text-[11px]">
                  {log.message}
                </div>
              </div>
            ))}

            {filteredLogs.length === 0 && (
              <div className="py-10 text-center text-[#728578] font-sans text-xs">
                No logs match the selected filter.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
