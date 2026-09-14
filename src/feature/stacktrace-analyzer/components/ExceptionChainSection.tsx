import React, { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import type { ExceptionNode, IdeConfig } from "../models/stacktrace.model";
import { buildIdeUrl } from "../utils/stacktrace.util";

interface ExceptionChainSectionProps {
  exception: ExceptionNode;
  index: number;
  onlyProjectCode: boolean;
  packageFilter: string;
  ideConfig: IdeConfig;
}

export const ExceptionChainSection: React.FC<ExceptionChainSectionProps> =
  React.memo(
    ({ exception, index, onlyProjectCode, packageFilter, ideConfig }) => {
      const [isCollapsed, setIsCollapsed] = useState(false);

      const filteredFrames = exception.frames.filter((frame) => {
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
        <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl overflow-hidden shadow-md backdrop-blur">
          <div
            onClick={() => setIsCollapsed((prev) => !prev)}
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
                      exception.isCausedBy
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    }`}
                  >
                    {exception.isCausedBy
                      ? `Caused by #${index}`
                      : "Initial Exception"}
                  </span>
                  <span className="text-xs font-bold text-white font-mono">
                    {exception.exceptionClass}
                  </span>
                </div>
                {exception.message && (
                  <p className="text-xs text-slate-300 font-mono mt-1 break-all">
                    {exception.message}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] text-slate-400 font-mono">
                {filteredFrames.length} / {exception.frames.length} frames
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
    },
  );

ExceptionChainSection.displayName = "ExceptionChainSection";
