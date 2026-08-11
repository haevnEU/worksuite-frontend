import React, { useEffect, useMemo, useState } from "react";
import { LogEntry } from "../models/log.model.ts";
import { consoleInterceptor } from "../services/ConsoleInterceptor.ts";
import { LogType } from "../types/log.types.ts";
import { LogHeader } from "../components/log/LogHeader.tsx";
import { LogFilterBar } from "../components/log/LogFilterBar.tsx";
import { LogTerminalView } from "../components/log/LogTerminalView.tsx";

export const LogPage: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<"all" | LogType>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    consoleInterceptor.init();
    setLogs(consoleInterceptor.getBuffer());

    const unsubscribe = consoleInterceptor.subscribe((newLog) => {
      setLogs((prev) => [...prev.slice(-499), newLog]);
    });
    return () => unsubscribe();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      let matchesLevel = false;

      if (selectedLevel === "all") {
        matchesLevel = true;
      } else if (selectedLevel === "info") {
        matchesLevel = log.type === "info" || log.type === "log";
      } else {
        matchesLevel = log.type === selectedLevel;
      }

      const matchesSearch =
        !searchTerm.trim() ||
        log.message.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesLevel && matchesSearch;
    });
  }, [logs, selectedLevel, searchTerm]);

  const handleClear = () => {
    consoleInterceptor.clear();
    setLogs([]);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `app_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 font-sans text-slate-100 max-w-full">
      <LogHeader onExport={handleExportJSON} onClear={handleClear} />

      <LogFilterBar
        searchTerm={searchTerm}
        selectedLevel={selectedLevel}
        onSearchChange={setSearchTerm}
        onLevelSelect={setSelectedLevel}
      />

      <LogTerminalView
        logs={logs}
        filteredLogs={filteredLogs}
        copiedId={copiedId}
        onCopy={handleCopy}
      />
    </div>
  );
};
