import React, { useState } from "react";
import { Code, Eye } from "lucide-react";
import { CopyButton } from "../../../shared/components/CopyButton";
import type { TicketHandoverState } from "../models/ticketHandover.model";
import { formatRecipient } from "../utils/ticketHandoverTemplate.util";

interface TicketHandoverPreviewSectionProps {
  rawTextile: string;
  state: TicketHandoverState;
}

export const TicketHandoverPreviewSection: React.FC<
  TicketHandoverPreviewSectionProps
> = ({ rawTextile, state }) => {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("preview");

  const recipient = formatRecipient(
    state.recipientName,
    state.recipientCompany,
  );
  const hasBlockers = state.criticalHintsCount > 0 || !state.pipelinePassed;

  return (
    <div className="sticky top-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-[#0b111e] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              viewMode === "preview"
                ? "bg-emerald-600 text-white shadow-xs"
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
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Raw (RO)</span>
          </button>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Redmine Textile Format
        </span>
      </div>

      <div className="relative group bg-[#0b111e] border border-slate-800 rounded-2xl min-h-[500px] max-h-[750px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        <div className="absolute top-3 right-3 z-10">
          <CopyButton
            textToCopy={rawTextile}
            title="Copy Textile"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer shadow-md inline-flex items-center justify-center"
          />
        </div>

        {viewMode === "edit" ? (
          <div className="p-5 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
            {rawTextile}
          </div>
        ) : (
          <div className="p-6 space-y-4 text-xs text-slate-200 leading-relaxed font-sans">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                Redmine Comment
              </span>
            </div>

            <p className="font-semibold text-slate-300">
              Hi <span className="text-emerald-400 font-mono">{recipient}</span>
              ,
            </p>

            {state.scenario === "to-review" && (
              <p className="text-slate-300">
                Ich habe ein Review für dich, kannst du dieses bitte
                durchführen. In GitLab findest du die Details dazu.
              </p>
            )}

            {state.scenario === "back-to-dev" && (
              <div className="space-y-2 text-slate-300">
                <p>ich habe das Review für dich durchgeführt.</p>

                {(state.hintsCount > 0 || state.criticalHintsCount > 0) && (
                  <div className="space-y-0.5 pt-1">
                    {state.hintsCount > 0 && (
                      <p>
                        Ich habe {state.hintsCount}{" "}
                        {state.hintsCount === 1 ? "Hinweis" : "Hinweise"}{" "}
                        hinterlassen.
                      </p>
                    )}
                    {state.criticalHintsCount > 0 && (
                      <p className="text-rose-300 font-medium">
                        Ich habe {state.criticalHintsCount} kritische{" "}
                        {state.criticalHintsCount === 1
                          ? "Hinweis"
                          : "Hinweise"}{" "}
                        hinterlassen.
                      </p>
                    )}
                  </div>
                )}

                <p className="pt-1">
                  CI/CD-Pipeline:{" "}
                  <span
                    className={`font-bold ${
                      state.pipelinePassed
                        ? "text-emerald-400"
                        : "text-rose-400"
                    }`}
                  >
                    {state.pipelinePassed ? "SUCCEED" : "FAILED"}
                  </span>
                </p>

                <div className="pt-2">
                  {hasBlockers ? (
                    <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-xl text-rose-200">
                      Es gibt{" "}
                      <span className="text-rose-400 font-bold">Blocker</span>{" "}
                      die zu beheben sind, bitte anschauen.
                    </div>
                  ) : state.isApprovalGranted && state.hintsCount > 0 ? (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-slate-200">
                      Die Anmerkungen sind noch zu bewerten, aber ein erneutes
                      Review ist nicht notwendig mein{" "}
                      <span className="text-emerald-400 font-bold">
                        Approval
                      </span>{" "}
                      ist erteilt.
                    </div>
                  ) : state.isApprovalGranted ? (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-slate-200">
                      Ich habe mein{" "}
                      <span className="text-emerald-400 font-bold">
                        Approval
                      </span>{" "}
                      erteilt.
                    </div>
                  ) : (
                    <p className="text-slate-400">
                      Bitte die Anmerkungen prüfen.
                    </p>
                  )}
                </div>
              </div>
            )}

            {state.scenario === "to-qa" && (
              <div className="space-y-4 text-slate-300">
                {/* Intro & AK-Bestätigung */}
                <div className="space-y-2">
                  {state.qaSummary.trim() && <p>{state.qaSummary.trim()}</p>}
                  <p>
                    Das Ticket steht nun für die Qualitätssicherung bereit. Die
                    Akzeptanzkriterien wurden vorab geprüft und verifiziert.
                  </p>
                </div>

                {/* Horizontale Trennlinie */}
                <hr className="border-slate-800" />

                {/* Unit Tests */}
                <div className="space-y-1">
                  <span className="font-bold text-[11px] text-purple-400 uppercase tracking-wider block">
                    Automatisierte Tests / Unit-Tests
                  </span>
                  {state.qaUnitTests.length > 0 ? (
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 font-mono text-[11px]">
                      {state.qaUnitTests.map((t, idx) => (
                        <li key={idx}>
                          <code className="px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700 text-[10px]">
                            {t}
                          </code>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic text-[11px]">
                      Keine Unit-Tests ergänzt
                    </p>
                  )}
                </div>

                {/* Manueller Ablauf & Testdateien */}
                <div className="space-y-1.5">
                  <span className="font-bold text-[11px] text-emerald-400 uppercase tracking-wider block">
                    Manueller Testablauf
                  </span>
                  {state.qaManualSteps.length > 0 ? (
                    <ol className="list-decimal list-inside space-y-1 text-slate-300 text-xs">
                      {state.qaManualSteps.map((s, idx) => (
                        <li key={s.id}>
                          <span className="font-semibold">{s.action}</span>
                          {s.expected && (
                            <span className="block text-[11px] text-slate-400 pl-4">
                              ↳ Soll: {s.expected}
                            </span>
                          )}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-slate-400 text-xs">
                      Die Testschritte und Akzeptanzkriterien können direkt
                      anhand der Ticketbeschreibung verifiziert werden.
                    </p>
                  )}

                  {state.qaTestFiles.length > 0 && (
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">
                        Angehängte Testdateien:
                      </span>
                      <ul className="list-disc list-inside font-mono text-[10px] text-slate-300">
                        {state.qaTestFiles.map((f, idx) => (
                          <li key={idx}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Pipeline */}
                <div className="space-y-1">
                  <span className="font-bold text-[11px] text-blue-400 uppercase tracking-wider block">
                    CI/CD-Pipeline
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Status:</span>
                    {state.qaPipelinePassed ? (
                      <span className="font-bold text-emerald-400">
                        SUCCEED
                      </span>
                    ) : state.qaPipelineOverridden ? (
                      <span className="font-bold text-amber-400">
                        FAILED (Überschrieben)
                      </span>
                    ) : (
                      <span className="font-bold text-rose-400">FAILED</span>
                    )}
                  </div>
                  {!state.qaPipelinePassed && state.qaPipelineOverridden && (
                    <p className="text-[11px] text-amber-300 font-mono">
                      ↳ Grund:{" "}
                      {state.qaPipelineOverrideReason || "Keine Angabe"}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
