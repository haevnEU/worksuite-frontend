import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  ExternalLink,
  Filter,
  FolderCode,
  History,
  Layers,
  Package,
  Settings2,
  X,
} from "lucide-react";
import {
  IdeConfig,
  IdeTarget,
  ParsedStackTrace,
} from "../../models/stacktraceAnalyzer.model";
import { buildIdeUrl } from "../../utils/ideUrl.util";

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
  const [isPackageHistoryOpen, setIsPackageHistoryOpen] = useState(false);

  // Base-Path State & Historie
  const [pathHistory, setPathHistory] = useState<string[]>([]);
  const [isPathHistoryOpen, setIsPathHistoryOpen] = useState(false);

  const [showIdeSettings, setShowIdeSettings] = useState(false);
  const [ideConfig, setIdeConfig] = useState<IdeConfig>(DEFAULT_IDE_CONFIG);
  const [collapsedCauses, setCollapsedCauses] = useState<
    Record<string, boolean>
  >({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const storedPkg = localStorage.getItem(STORAGE_KEY_PACKAGE_HISTORY);
      if (storedPkg) setPackageHistory(JSON.parse(storedPkg));

      const storedPaths = localStorage.getItem(STORAGE_KEY_PATH_HISTORY);
      if (storedPaths) setPathHistory(JSON.parse(storedPaths));

      const storedIde = localStorage.getItem(STORAGE_KEY_IDE_CONFIG);
      if (storedIde) setIdeConfig(JSON.parse(storedIde));
    } catch {
      // Storage fallback
    }
  }, []);

  const savePathToHistory = (path: string) => {
    const trimmed = path.trim();
    if (!trimmed) return;

    setPathHistory((prev) => {
      const updated = [
        trimmed,
        ...prev.filter((item) => item !== trimmed),
      ].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(STORAGE_KEY_PATH_HISTORY, JSON.stringify(updated));
      } catch {
        // Ignorieren
      }
      return updated;
    });
  };

  const updateIdeConfig = (updates: Partial<IdeConfig>) => {
    setIdeConfig((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEY_IDE_CONFIG, JSON.stringify(updated));
      } catch {
        // Ignorieren
      }
      return updated;
    });
  };

  const savePackageToHistory = (pkg: string) => {
    const trimmed = pkg.trim();
    if (!trimmed) return;

    setPackageHistory((prev) => {
      const updated = [
        trimmed,
        ...prev.filter((item) => item !== trimmed),
      ].slice(0, MAX_HISTORY);
      try {
        localStorage.setItem(
          STORAGE_KEY_PACKAGE_HISTORY,
          JSON.stringify(updated),
        );
      } catch {
        // Ignorieren
      }
      return updated;
    });
  };

  const toggleCause = (id: string) => {
    setCollapsedCauses((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(analysis.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rootCause =
    analysis.exceptions.length > 0
      ? analysis.exceptions[analysis.exceptions.length - 1]
      : null;

  return (
    <div className="space-y-4 font-sans text-slate-200">
      {/* Root Cause Banner */}
      {rootCause && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 shadow-lg backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                  Root Cause Identified
                </span>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono">
                  {analysis.exceptions.length > 1
                    ? `Depth: ${analysis.exceptions.length} Caused-by chains`
                    : "Single Exception"}
                </span>
              </div>
              <h2 className="text-sm font-bold text-white font-mono break-all">
                {rootCause.exceptionClass}
              </h2>
              {rootCause.message && (
                <p className="text-xs text-rose-200/90 font-mono mt-1 break-words">
                  {rootCause.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <button
              type="button"
              onClick={handleCopyRaw}
              className="px-3 py-1.5 rounded-lg bg-[#0b111e] hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copied Raw" : "Copy Raw"}</span>
            </button>
            <button
              type="button"
              onClick={onClear}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Filter & Toolbar */}
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
          {/* Package Filter Input mit Dropdown */}
          <div className="relative flex-1 sm:w-72">
            <div className="relative flex items-center">
              <Package className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={packageFilter}
                onChange={(e) => setPackageFilter(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    savePackageToHistory(packageFilter);
                    setIsPackageHistoryOpen(false);
                  }
                }}
                onBlur={() => {
                  if (packageFilter.trim()) savePackageToHistory(packageFilter);
                }}
                onFocus={() => {
                  if (packageHistory.length > 0) setIsPackageHistoryOpen(true);
                }}
                placeholder="Filter package (e.g. de.haevn)..."
                className="w-full bg-[#0b111e] border border-slate-800 rounded-xl pl-9 pr-14 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono transition"
              />

              <div className="absolute right-2 flex items-center gap-1">
                {packageFilter && (
                  <button
                    type="button"
                    onClick={() => setPackageFilter("")}
                    className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}

                {packageHistory.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsPackageHistoryOpen((prev) => !prev)}
                    className={`p-1 rounded text-slate-400 hover:text-slate-200 transition cursor-pointer ${
                      isPackageHistoryOpen ? "text-rose-400 bg-slate-800" : ""
                    }`}
                    title="Recent Package Filters"
                  >
                    <History className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Dropdown Package History */}
            {isPackageHistoryOpen && packageHistory.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsPackageHistoryOpen(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#0b111e] border border-slate-800 rounded-xl shadow-2xl z-30 overflow-hidden text-xs">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#10192c] border-b border-slate-800 text-[11px] font-semibold text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Recent Packages
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPackageHistory([]);
                        localStorage.removeItem(STORAGE_KEY_PACKAGE_HISTORY);
                      }}
                      className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/40 font-mono">
                    {packageHistory.map((pkg) => (
                      <div
                        key={pkg}
                        onClick={() => {
                          setPackageFilter(pkg);
                          savePackageToHistory(pkg);
                          setIsPackageHistoryOpen(false);
                        }}
                        className={`px-3 py-2 flex items-center justify-between cursor-pointer transition hover:bg-slate-800/60 ${
                          packageFilter === pkg
                            ? "bg-rose-950/40 text-rose-300 font-semibold"
                            : "text-slate-300"
                        }`}
                      >
                        <span className="truncate">{pkg}</span>
                        {packageFilter === pkg && (
                          <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
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
            onClick={() => setShowIdeSettings((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer shrink-0 ${
              showIdeSettings
                ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300"
                : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-white"
            }`}
            title="Configure IDE Path & Integration"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>IDE Setup ({ideConfig.target.toUpperCase()})</span>
          </button>
        </div>
      </div>

      {/* Aufklappbare IDE Einstellungen mit BasePath History */}
      {showIdeSettings && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>IDE Deep-Linking & Source Roots</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Auto-appends{" "}
              <code className="text-indigo-300">/src/main/java</code> if omitted
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-semibold">
                Target Editor
              </label>
              <select
                value={ideConfig.target}
                onChange={(e) =>
                  updateIdeConfig({ target: e.target.value as IdeTarget })
                }
                className="w-full bg-[#10192c] border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="idea">IntelliJ IDEA (idea://)</option>
                <option value="vscode">VS Code (vscode://)</option>
              </select>
            </div>

            {/* Base Path Input mit Historie */}
            <div className="space-y-1 md:col-span-2 relative">
              <label className="text-[11px] text-slate-400 font-semibold flex items-center justify-between">
                <span>
                  Project Base Path (Folder above or with /src/main/java)
                </span>
                {pathHistory.length > 0 && (
                  <span className="text-[10px] text-slate-500 font-normal">
                    {pathHistory.length} saved in history
                  </span>
                )}
              </label>

              <div className="relative flex items-center">
                <FolderCode className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={ideConfig.projectBasePath}
                  onChange={(e) =>
                    updateIdeConfig({ projectBasePath: e.target.value })
                  }
                  onFocus={() => {
                    if (pathHistory.length > 0) setIsPathHistoryOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      savePathToHistory(ideConfig.projectBasePath);
                      setIsPathHistoryOpen(false);
                    }
                  }}
                  onBlur={() => {
                    if (ideConfig.projectBasePath.trim()) {
                      savePathToHistory(ideConfig.projectBasePath);
                    }
                  }}
                  placeholder="e.g. /home/user/workspace/work-suite oder C:\workspace\work-suite"
                  className="w-full bg-[#10192c] border border-slate-800 rounded-xl pl-9 pr-14 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />

                <div className="absolute right-2 flex items-center gap-1">
                  {ideConfig.projectBasePath && (
                    <button
                      type="button"
                      onClick={() => updateIdeConfig({ projectBasePath: "" })}
                      className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {pathHistory.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setIsPathHistoryOpen((prev) => !prev)}
                      className={`p-1 rounded text-slate-400 hover:text-slate-200 transition cursor-pointer ${
                        isPathHistoryOpen ? "text-indigo-400 bg-slate-800" : ""
                      }`}
                      title="Select Recent Project Path"
                    >
                      <History className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Path History Dropdown */}
              {isPathHistoryOpen && pathHistory.length > 0 && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setIsPathHistoryOpen(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#10192c] border border-slate-800 rounded-xl shadow-2xl z-30 overflow-hidden text-xs">
                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#0b111e] border-b border-slate-800 text-[11px] font-semibold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Recent Project Roots
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPathHistory([]);
                          localStorage.removeItem(STORAGE_KEY_PATH_HISTORY);
                        }}
                        className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/40 font-mono">
                      {pathHistory.map((p) => (
                        <div
                          key={p}
                          onClick={() => {
                            updateIdeConfig({ projectBasePath: p });
                            savePathToHistory(p);
                            setIsPathHistoryOpen(false);
                          }}
                          className={`px-3 py-2 flex items-center justify-between cursor-pointer transition hover:bg-slate-800/60 ${
                            ideConfig.projectBasePath === p
                              ? "bg-indigo-950/40 text-indigo-300 font-semibold"
                              : "text-slate-300"
                          }`}
                        >
                          <span className="truncate">{p}</span>
                          {ideConfig.projectBasePath === p && (
                            <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exception Chunks */}
      <div className="space-y-4">
        {analysis.exceptions.map((exc, excIndex) => {
          const isCollapsed = !!collapsedCauses[exc.id];

          const filteredFrames = exc.frames.filter((frame) => {
            if (onlyProjectCode && !frame.isProjectCode) return false;
            if (
              packageFilter.trim() &&
              !frame.className
                .toLowerCase()
                .includes(packageFilter.trim().toLowerCase())
            ) {
              return false;
            }
            return true;
          });

          return (
            <div
              key={exc.id}
              className="bg-[#10192c]/80 border border-slate-800 rounded-xl overflow-hidden shadow-md backdrop-blur"
            >
              <div
                onClick={() => toggleCause(exc.id)}
                className="p-3.5 bg-[#0b111e]/90 border-b border-slate-800 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border font-mono ${
                          exc.isCausedBy
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                            : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                        }`}
                      >
                        {exc.isCausedBy
                          ? `Caused by #${excIndex}`
                          : "Initial Exception"}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">
                        {exc.exceptionClass}
                      </span>
                    </div>
                    {exc.message && (
                      <p className="text-xs text-slate-300 font-mono mt-1 break-all">
                        {exc.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {filteredFrames.length} / {exc.frames.length} frames
                  </span>
                </div>
              </div>

              {!isCollapsed && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead className="bg-[#10192c] border-b border-slate-800/80 text-[11px] text-slate-400 uppercase font-sans font-bold">
                      <tr>
                        <th className="py-2 px-3 w-12 text-center">#</th>
                        <th className="py-2 px-4">Method & Class</th>
                        <th className="py-2 px-4 w-72">Source File & IDE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {filteredFrames.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-6 text-center text-xs text-slate-500 font-sans italic"
                          >
                            No stack frames matched the active filter.
                          </td>
                        </tr>
                      ) : (
                        filteredFrames.map((frame, frameIdx) => {
                          const isPackageMatch =
                            packageFilter.trim() !== "" &&
                            frame.className
                              .toLowerCase()
                              .includes(packageFilter.trim().toLowerCase());

                          const ideUrl = buildIdeUrl(frame, ideConfig);

                          return (
                            <tr
                              key={frame.id}
                              className={`transition-colors hover:bg-slate-800/30 ${
                                isPackageMatch
                                  ? "bg-rose-950/20 text-white font-semibold"
                                  : frame.isProjectCode
                                    ? "bg-blue-950/20 text-white"
                                    : "text-slate-400"
                              }`}
                            >
                              <td className="py-2 px-3 text-center text-[10px] text-slate-500 border-r border-slate-800/40">
                                {frameIdx + 1}
                              </td>
                              <td className="py-2 px-4 space-y-0.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {isPackageMatch ? (
                                    <span className="px-1.5 py-0.2 rounded bg-rose-600/30 text-rose-300 border border-rose-500/40 text-[9px] font-sans font-bold uppercase">
                                      Internal Match
                                    </span>
                                  ) : frame.isProjectCode ? (
                                    <span className="px-1.5 py-0.2 rounded bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[9px] font-sans font-bold uppercase">
                                      Project Code
                                    </span>
                                  ) : null}
                                  <span className="text-slate-200 break-all">
                                    {frame.className}
                                  </span>
                                  <span className="text-blue-400">
                                    .{frame.methodName}()
                                  </span>
                                </div>
                              </td>
                              <td className="py-2 px-4 text-[11px] whitespace-nowrap border-l border-slate-800/40 text-slate-400">
                                {frame.isNative ? (
                                  <span className="italic text-slate-500">
                                    Native Method
                                  </span>
                                ) : frame.fileName ? (
                                  <div className="flex items-center justify-between gap-2">
                                    <span>
                                      {frame.fileName}
                                      {frame.lineNumber && (
                                        <strong className="text-indigo-300 font-bold">
                                          :{frame.lineNumber}
                                        </strong>
                                      )}
                                    </span>

                                    {ideUrl && (
                                      <a
                                        href={ideUrl}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700 hover:border-indigo-500/50 transition cursor-pointer text-[10px] font-sans font-semibold"
                                        title={`Open in ${
                                          ideConfig.target === "idea"
                                            ? "IntelliJ IDEA"
                                            : "VS Code"
                                        }`}
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                        <span>
                                          {ideConfig.target === "idea"
                                            ? "IDEA"
                                            : "VS Code"}
                                        </span>
                                      </a>
                                    )}
                                  </div>
                                ) : (
                                  "Unknown Source"
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
