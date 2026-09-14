import React, { useState } from "react";
import { Code, Eye, FileText } from "lucide-react";
import { CopyButton } from "../../../shared/components/CopyButton";
import type { ReviewState } from "../models/mrReview.model";

interface ReviewPreviewSectionProps {
  rawMarkdown: string;
  state: ReviewState;
}

export const ReviewPreviewSection: React.FC<ReviewPreviewSectionProps> = ({
  rawMarkdown,
  state,
}) => {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("preview");

  const validPositive = state.positiveFeedback
    .map((i) => i.trim())
    .filter(Boolean);
  const validNegative = state.negativeFeedback
    .map((i) => i.trim())
    .filter(Boolean);
  const validBlockers = state.blockers.map((i) => i.trim()).filter(Boolean);

  const checklistItems = [
    {
      label: "Styleguide ist eingehalten",
      checked: state.checklist.styleguide,
    },
    {
      label: `Die itests CI/CD-Pipeline lief erfolgreich durch${
        state.checklist.itestsOverridden ? " (Override aktiv)" : ""
      }`,
      checked: state.checklist.itestsPassed,
    },
    {
      label: "Unit Tests sind vorhanden",
      checked: state.checklist.unitTestsPresent,
    },
    {
      label: "Die Akzeptanzkriterien sind wiederfindbar",
      checked: state.checklist.acceptanceCriteriaFound,
    },
    {
      label: "Die AK sind überprüft",
      checked: state.checklist.acceptanceCriteriaVerified,
    },
    {
      label: "Es ist eine klare und verständliche Javadoc/JSDoc vorhanden",
      checked: state.checklist.documentationPresent,
    },
    {
      label: "Verwendung moderner Sprach-Features",
      checked: state.checklist.modernLanguageFeatures,
    },
    {
      label: "Keine premature Optimizations / Over-Engineering",
      checked: state.checklist.noOverEngineering,
    },
    {
      label: "Keine Hardcoded Secrets / Credentials",
      checked: state.checklist.noHardcodedSecrets,
    },
    {
      label: "Keine toten Codefragmente & Debug-Überbleibsel",
      checked: state.checklist.noDeadCodeOrDebug,
    },
    {
      label: "Resource Leak Hygiene (AutoCloseable / Streams)",
      checked: state.checklist.resourceLeakHygiene,
    },
  ];

  return (
    <div className="sticky top-6 space-y-3">
      {/* Tab Switcher & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-[#0b111e] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              viewMode === "preview"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              viewMode === "edit"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Raw (RO)</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-500">
          GitLab/GitHub Markdown
        </span>
      </div>

      <div className="relative group bg-[#0b111e] border border-slate-800 rounded-2xl min-h-[550px] max-h-[750px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        <div className="absolute top-3 right-3 z-10">
          <CopyButton
            textToCopy={rawMarkdown}
            title="Markdown kopieren"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer shadow-md inline-flex items-center justify-center"
          />
        </div>

        {viewMode === "edit" ? (
          <div className="p-5 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
            {rawMarkdown}
          </div>
        ) : (
          <div className="p-6 space-y-6 text-xs text-slate-200 leading-relaxed font-sans">
            {/* Prolog */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-1.5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                Review-Übersicht
              </h3>
              <p className="text-slate-300 italic">
                Ich habe das Review durchgeführt und habe mich auf folgende
                Punkte konzentriert: Clean Code, Wartbarkeit, Testbarkeit,
                Sicherheit sowie die Einhaltung unserer Dokumentations- und
                Architekturstandards.
              </p>
            </div>

            {/* Checkliste */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800/60 pb-1">
                Checkliste
              </h4>
              <ul className="space-y-1.5 font-mono text-xs">
                {checklistItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] ${
                        item.checked
                          ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold"
                          : "bg-slate-800/40 border-slate-700 text-slate-600"
                      }`}
                    >
                      {item.checked ? "✓" : ""}
                    </span>
                    <span
                      className={
                        item.checked ? "text-slate-200" : "text-slate-400"
                      }
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Positives Feedback */}
            <div className="space-y-2">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] border-b border-slate-800/60 pb-1">
                Positives Feedback
              </h4>
              <p className="text-slate-400 text-[11px]">
                Besonders gut gefiel mir:
              </p>
              {validPositive.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-200">
                  {validPositive.map((item, i) => (
                    <li key={i} className="break-words">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic">
                  Keine Anmerkungen erfasst.
                </p>
              )}
            </div>

            {/* Negatives Feedback */}
            <div className="space-y-2">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] border-b border-slate-800/60 pb-1">
                Verbesserungspotenzial & Anmerkungen
              </h4>
              <p className="text-slate-400 text-[11px]">
                Folgende Punkte sollten noch angepasst oder überdacht werden:
              </p>
              {validNegative.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-200">
                  {validNegative.map((item, i) => (
                    <li key={i} className="break-words">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic">
                  Keine offenen Anmerkungen.
                </p>
              )}
            </div>

            {/* Fazit & Status */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800/60 pb-1">
                Fazit & Status
              </h4>

              {validBlockers.length > 0 ? (
                <div className="p-3.5 bg-rose-950/30 border border-rose-800/50 rounded-xl space-y-2 text-rose-200">
                  <p className="font-bold text-rose-300">
                    Folgende Blocker verhindern aktuell ein Approval:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    {validBlockers.map((b, i) => (
                      <li key={i} className="break-words font-medium">
                        {b}
                      </li>
                    ))}
                  </ul>

                  {state.checklist.itestsOverridden &&
                    state.checklist.itestsOverrideReason.trim() && (
                      <div className="pt-2 mt-2 border-t border-rose-800/30 text-[11px] text-amber-300/90 font-mono">
                        <strong>Pipeline-Hinweis:</strong>{" "}
                        {state.checklist.itestsOverrideReason.trim()}
                      </div>
                    )}

                  <p className="text-[11px] text-rose-400 pt-1">
                    Bitte behebe die Blocker vor dem nächsten Review.
                  </p>
                </div>
              ) : (
                <div
                  className={`p-3.5 rounded-xl border space-y-2 ${
                    state.isTentativeApproval
                      ? "bg-indigo-950/30 border-indigo-800/50 text-indigo-200"
                      : "bg-emerald-950/30 border-emerald-800/50 text-emerald-200"
                  }`}
                >
                  {state.checklist.itestsOverridden &&
                    state.checklist.itestsOverrideReason.trim() && (
                      <div className="p-2 bg-[#0b111e]/80 border border-amber-800/50 rounded-lg text-[11px] text-amber-300 font-mono mb-2">
                        <strong>Pipeline-Hinweis:</strong>{" "}
                        {state.checklist.itestsOverrideReason.trim()}
                      </div>
                    )}

                  {state.isTentativeApproval ? (
                    <p className="font-medium">
                      Die offenen Anmerkungen sind keine kritischen, daher
                      erteile ich mein Approval. Bei einfachen Änderungen ist
                      kein erneutes Approval notwendig.
                    </p>
                  ) : (
                    <p className="font-medium">
                      Alle Kriterien sind erfüllt und die CI/CD-Pipeline läuft
                      erfolgreich durch, hierdurch ergibt sich kein Blocker und
                      ich erteile mein Approval.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
