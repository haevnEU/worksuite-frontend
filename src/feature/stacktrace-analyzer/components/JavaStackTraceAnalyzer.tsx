import React, { useEffect, useState } from "react";
import { Filter, Layers, Package, Settings2 } from "lucide-react";
import type { IdeConfig, ParsedStackTrace } from "../models/stacktrace.model";
import { HistoryDropdownInput } from "../../../shared/components/HistoryDropdownInput";
import { RootCauseBanner } from "./RootCauseBanner";
import { IdeSettingsModal } from "./IdeSettingsModal";
import { ExceptionChainSection } from "./ExceptionChainSection";

interface JavaStackTraceAnalyzerProps {
  analysis: ParsedStackTrace;
  onClear: () => void;
}

const STORAGE_KEY_PACKAGE_HISTORY = "worktool_stacktrace_package_history";
const STORAGE_KEY_PATH_HISTORY = "worktool_stacktrace_basepath_history";
const STORAGE_KEY_IDE_CONFIG = "worktool_stacktrace_ide_config";
const MAX_HISTORY = 10;

const DEFAULT_IDE_CONFIG: IdeConfig = {
  target: "idea",
  projectBasePath: "",
};

export const JavaStackTraceAnalyzer: React.FC<JavaStackTraceAnalyzerProps> = ({
  analysis,
  onClear,
}) => {
  const [onlyProjectCode, setOnlyProjectCode] = useState(false);
  const [packageFilter, setPackageFilter] = useState("");
  const [packageHistory, setPackageHistory] = useState<string[]>([]);

  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [showIdeModal, setShowIdeModal] = useState(false);
  const [ideConfig, setIdeConfig] = useState<IdeConfig>(DEFAULT_IDE_CONFIG);

  useEffect(() => {
    try {
      const storedPkg = localStorage.getItem(STORAGE_KEY_PACKAGE_HISTORY);
      if (storedPkg) setPackageHistory(JSON.parse(storedPkg));

      const storedPaths = localStorage.getItem(STORAGE_KEY_PATH_HISTORY);
      if (storedPaths) setPathHistory(JSON.parse(storedPaths));

      const storedIde = localStorage.getItem(STORAGE_KEY_IDE_CONFIG);
      if (storedIde) setIdeConfig(JSON.parse(storedIde));
    } catch {}
  }, []);

  const savePackageToHistory = (pkg: string) => {
    const trimmed = pkg.trim();
    if (!trimmed) return;
    setPackageHistory((prev) => {
      const updated = [trimmed, ...prev.filter((i) => i !== trimmed)].slice(
        0,
        MAX_HISTORY,
      );
      localStorage.setItem(
        STORAGE_KEY_PACKAGE_HISTORY,
        JSON.stringify(updated),
      );
      return updated;
    });
  };

  const savePathToHistory = (path: string) => {
    const trimmed = path.trim();
    if (!trimmed) return;
    setPathHistory((prev) => {
      const updated = [trimmed, ...prev.filter((i) => i !== trimmed)].slice(
        0,
        MAX_HISTORY,
      );
      localStorage.setItem(STORAGE_KEY_PATH_HISTORY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateIdeConfig = (updates: Partial<IdeConfig>) => {
    setIdeConfig((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEY_IDE_CONFIG, JSON.stringify(updated));
      return updated;
    });
  };

  const rootCause =
    analysis.exceptions.length > 0
      ? analysis.exceptions[analysis.exceptions.length - 1]
      : null;

  return (
    <div className="space-y-4 font-sans text-slate-200">
      {rootCause && (
        <RootCauseBanner
          rootCause={rootCause}
          depth={analysis.exceptions.length}
          rawText={analysis.rawText}
          onClear={onClear}
        />
      )}

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 bg-[#10192c]/80 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-xs font-bold text-white">
            Exception Stack Chain
          </span>
          <span className="text-xs text-slate-400 font-mono">
            ({analysis.exceptions.length} Exceptions parsed)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-full sm:w-72">
            <HistoryDropdownInput
              value={packageFilter}
              onChange={setPackageFilter}
              onSelectHistory={(pkg) => {
                setPackageFilter(pkg);
                savePackageToHistory(pkg);
              }}
              onClearHistory={() => {
                setPackageHistory([]);
                localStorage.removeItem(STORAGE_KEY_PACKAGE_HISTORY);
              }}
              history={packageHistory}
              placeholder="Filter package (e.g. de.haevn)..."
              historyTitle="Recent Packages"
              icon={<Package className="w-3.5 h-3.5" />}
              activeColorClass="text-rose-300 focus:border-rose-500"
            />
          </div>

          <button
            type="button"
            onClick={() => setOnlyProjectCode((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer shrink-0 ${
              onlyProjectCode
                ? "bg-blue-600/20 border-blue-500/50 text-blue-300"
                : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-white"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Hide Frameworks</span>
          </button>

          <button
            type="button"
            onClick={() => setShowIdeModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-800 bg-[#0b111e] text-slate-400 hover:text-white transition cursor-pointer shrink-0"
          >
            <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>IDE Setup ({ideConfig.target.toUpperCase()})</span>
          </button>
        </div>
      </div>

      {/* Exception Chunks */}
      <div className="space-y-4">
        {analysis.exceptions.map((exc, excIndex) => (
          <ExceptionChainSection
            key={exc.id}
            exception={exc}
            index={excIndex}
            onlyProjectCode={onlyProjectCode}
            packageFilter={packageFilter}
            ideConfig={ideConfig}
          />
        ))}
      </div>

      <IdeSettingsModal
        isOpen={showIdeModal}
        onClose={() => setShowIdeModal(false)}
        config={ideConfig}
        onUpdateConfig={updateIdeConfig}
        pathHistory={pathHistory}
        onSavePathToHistory={savePathToHistory}
        onClearPathHistory={() => {
          setPathHistory([]);
          localStorage.removeItem(STORAGE_KEY_PATH_HISTORY);
        }}
      />
    </div>
  );
};
