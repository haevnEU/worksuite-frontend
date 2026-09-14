import React from "react";
import { AlertTriangle, CheckSquare } from "lucide-react";
import type { ReviewChecklistState } from "../models/mrReview.model";

interface ReviewChecklistSectionProps {
  checklist: ReviewChecklistState;
  onChange: (updated: Partial<ReviewChecklistState>) => void;
}

export const ReviewChecklistSection: React.FC<ReviewChecklistSectionProps> = ({
  checklist,
  onChange,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-blue-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Review Checkliste
          </h2>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Qualitäts-Gates
        </span>
      </div>

      <div className="space-y-4 text-xs">
        {/* Basis-Gates */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pb-1 border-b border-slate-800/40">
            Funktionalität & Qualität
          </span>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checklist.styleguide}
              onChange={(e) => onChange({ styleguide: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span className="text-slate-200">Styleguide ist eingehalten</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checklist.unitTestsPresent}
              onChange={(e) => onChange({ unitTestsPresent: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span className="text-slate-200">Unit Tests sind vorhanden</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checklist.acceptanceCriteriaFound}
              onChange={(e) =>
                onChange({ acceptanceCriteriaFound: e.target.checked })
              }
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <div className="flex items-center gap-2">
              <span className="text-slate-200">
                Die Akzeptanzkriterien sind wiederfindbar
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded">
                BLOCKER
              </span>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checklist.acceptanceCriteriaVerified}
              onChange={(e) =>
                onChange({ acceptanceCriteriaVerified: e.target.checked })
              }
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span className="text-slate-200">Die AK sind überprüft</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checklist.documentationPresent}
              onChange={(e) =>
                onChange({ documentationPresent: e.target.checked })
              }
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span className="text-slate-200">
              Es ist eine klare und verständliche Javadoc/JSDoc vorhanden
            </span>
          </label>
        </div>

        {/* Code-Hygiene & Best Practices */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block pb-1 border-b border-slate-800/40">
            Code-Hygiene & Standards
          </span>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checklist.modernLanguageFeatures}
              onChange={(e) =>
                onChange({ modernLanguageFeatures: e.target.checked })
              }
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span className="text-slate-200">
              Verwendung moderner Sprach-Features
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checklist.noOverEngineering}
              onChange={(e) =>
                onChange({ noOverEngineering: e.target.checked })
              }
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span className="text-slate-200">
              Keine premature Optimizations / Over-Engineering
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checklist.noHardcodedSecrets}
              onChange={(e) =>
                onChange({ noHardcodedSecrets: e.target.checked })
              }
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span className="text-slate-200">
              Keine Hardcoded Secrets / Credentials
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checklist.noDeadCodeOrDebug}
              onChange={(e) =>
                onChange({ noDeadCodeOrDebug: e.target.checked })
              }
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span className="text-slate-200">
              Keine toten Codefragmente & Debug-Überbleibsel
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={checklist.resourceLeakHygiene}
              onChange={(e) =>
                onChange({ resourceLeakHygiene: e.target.checked })
              }
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span className="text-slate-200">
              Resource Leak Hygiene (AutoCloseable / Streams)
            </span>
          </label>
        </div>

        {/* CI/CD Pipeline Gate */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={checklist.itestsPassed}
                onChange={(e) => onChange({ itestsPassed: e.target.checked })}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <span className="text-slate-200">
                  Die itests CI/CD-Pipeline lief erfolgreich durch
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                  OVERRIDABLE BLOCKER
                </span>
              </div>
            </label>

            {!checklist.itestsPassed && (
              <button
                type="button"
                onClick={() =>
                  onChange({ itestsOverridden: !checklist.itestsOverridden })
                }
                className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                  checklist.itestsOverridden
                    ? "bg-amber-600/30 border-amber-500/40 text-amber-300"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200"
                }`}
              >
                {checklist.itestsOverridden
                  ? "Override aktiv"
                  : "Override setzen"}
              </button>
            )}
          </div>

          {!checklist.itestsPassed && checklist.itestsOverridden && (
            <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-xl space-y-1.5 animate-in fade-in duration-150">
              <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Begründung für Pipeline-Override:
              </span>
              <input
                type="text"
                value={checklist.itestsOverrideReason}
                onChange={(e) =>
                  onChange({ itestsOverrideReason: e.target.value })
                }
                placeholder="z.B. Flaky Test im AuthService, Issue #482 angelegt..."
                className="w-full bg-[#0b111e] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
