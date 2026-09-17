import React, { useState } from "react";
import { Code, Eye } from "lucide-react";
import { CopyButton } from "../../../shared/components/CopyButton";
import type { MrCreatorState } from "../models/mrCreator.model";

interface MrCreatorPreviewSectionProps {
  rawMarkdown: string;
  state: MrCreatorState;
}

export const MrCreatorPreviewSection: React.FC<
  MrCreatorPreviewSectionProps
> = ({ rawMarkdown, state }) => {
  const [viewMode, setViewMode] = useState<"edit" | "preview">("preview");

  const pipelineStatusText = state.itestsChecked
    ? "PASSED"
    : state.itestsDetails || "Wurde übersprungen";

  return (
    <div className="sticky top-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-[#0b111e] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              viewMode === "preview"
                ? "bg-purple-600 text-white shadow-xs"
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
                ? "bg-purple-600 text-white shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Raw (RO)</span>
          </button>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          GitLab MR Template
        </span>
      </div>

      <div className="relative group bg-[#0b111e] border border-slate-800 rounded-2xl min-h-[550px] max-h-[850px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
        <div className="absolute top-3 right-3 z-10">
          <CopyButton
            textToCopy={rawMarkdown}
            title="Copy Markdown to clipboard"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer shadow-md inline-flex items-center justify-center"
          />
        </div>

        {viewMode === "edit" ? (
          <div className="p-5 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
            {rawMarkdown}
          </div>
        ) : (
          <div className="p-6 space-y-6 text-xs text-slate-200 leading-relaxed font-sans">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                [{state.ticketId ? `#${state.ticketId}` : "TICKET-ID"}]
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">
                {state.shortTitle || "Kurztitel des Merge Requests"}
              </h2>
            </div>

            {/* Context & Motivation */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-purple-400 uppercase tracking-wider text-[11px] border-b border-slate-800/60 pb-1">
                Kontext & Motivation
              </h4>
              <ul className="space-y-1 font-mono text-[11px] text-slate-300">
                <li>
                  <span className="text-slate-500 font-bold">Ticket:</span> #
                  {state.ticketId || "12345"}
                </li>
                <li>
                  <span className="text-slate-500 font-bold">Typ:</span>{" "}
                  {state.type}
                </li>
                <li>
                  <span className="text-slate-500 font-bold">Projekt:</span>{" "}
                  {state.project}
                </li>
              </ul>
              <p className="text-slate-300 pt-1">
                {state.summary ||
                  "Kurze Beschreibung des Problems und der gewählten Lösung."}
              </p>
            </div>

            {/* Technical Changes */}
            <div className="space-y-2">
              <h4 className="font-bold text-cyan-400 uppercase tracking-wider text-[11px] border-b border-slate-800/60 pb-1">
                Technische Änderungen
              </h4>
              <p className="text-slate-300">
                <strong>Architektur:</strong>{" "}
                {state.architectureRefactoring || "Keine spezifischen Details."}
              </p>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">
                  Betroffene Komponenten:
                </span>
                {state.affectedComponents.length > 0 ? (
                  <ul className="list-disc list-inside space-y-0.5 text-slate-300 font-mono text-[11px]">
                    {state.affectedComponents.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic">
                    Keine Komponenten gelistet.
                  </p>
                )}
              </div>

              <div>
                <span className="text-slate-400 font-semibold block mb-1">
                  Breaking Changes:
                </span>
                {state.breakingChanges.length > 0 ? (
                  <ul className="list-disc list-inside space-y-0.5 text-rose-300 font-mono text-[11px]">
                    {state.breakingChanges.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-slate-300">Keine</span>
                )}
              </div>
            </div>

            {/* Verification & Tests */}
            <div className="space-y-3">
              <h4 className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] border-b border-slate-800/60 pb-1">
                Verifikation & Tests
              </h4>

              {/* Acceptance Criteria */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  Akzeptanzkriterien:
                </span>
                {state.acceptanceCriteria.length > 0 ? (
                  <ul className="space-y-1.5 font-mono text-[11px]">
                    {state.acceptanceCriteria.map((ak) => (
                      <li key={ak.id} className="flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] font-bold shrink-0 ${
                            ak.completed
                              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                              : "bg-slate-800/40 border-slate-700 text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                        <span
                          className={
                            ak.completed
                              ? "line-through text-slate-500"
                              : "text-slate-200"
                          }
                        >
                          {ak.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic">
                    Keine Kriterien erfasst.
                  </p>
                )}
              </div>

              {/* Unit Tests als Bullet-Liste */}
              <div className="p-3 bg-[#0b111e] border border-slate-800 rounded-xl space-y-2">
                <span className="font-bold text-purple-400 uppercase text-[10px] tracking-wider block font-mono">
                  Automatisierte Tests / Unit-Tests
                </span>
                {state.unitTestsChecked ? (
                  state.unitTestClasses.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                      {state.unitTestClasses.map((tc, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <code className="px-1.5 py-0.5 rounded bg-slate-800/90 border border-slate-700/70 text-purple-300 font-mono text-[10px]">
                            {tc}
                          </code>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="list-disc list-inside text-slate-300 text-xs">
                      <li>
                        Unit-Tests ergänzt / angepasst (
                        <code className="px-1.5 py-0.5 rounded bg-slate-800/90 border border-slate-700/70 text-purple-300 font-mono text-[10px]">
                          MyServiceTest
                        </code>
                        )
                      </li>
                    </ul>
                  )
                ) : (
                  <p className="text-slate-400 text-xs italic pl-1">
                    Keine Unit-Tests ergänzt
                  </p>
                )}
              </div>

              {/* CI/CD Pipeline Checkbox */}
              <div className="p-3 bg-[#0b111e] border border-slate-800 rounded-xl space-y-2 font-mono text-[11px]">
                <span className="font-bold text-blue-400 uppercase text-[10px] tracking-wider block">
                  CI/CD-Pipeline
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] font-bold shrink-0 ${
                      state.itestsChecked
                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                        : "bg-amber-500/20 border-amber-500/40 text-amber-400"
                    }`}
                  >
                    {state.itestsChecked ? "✓" : "!"}
                  </span>
                  <span className="text-slate-200">
                    {state.itestsChecked
                      ? "Pipeline lief erfolgreich durch (`PASSED`)"
                      : `Pipeline: ${state.itestsDetails || "Wurde übersprungen"}`}
                  </span>
                </div>
              </div>

              {/* Manual Test Steps (Ausblenden von Expected falls leer) */}
              {state.manualTestSteps.length > 0 && (
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-400 block mb-1">
                    Manuelle Testanleitung:
                  </span>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                    {state.manualTestSteps.map((s, idx) => (
                      <li key={s.id}>
                        <span className="font-semibold">{s.action}</span>
                        {s.expected && s.expected.trim() && (
                          <span className="block text-[11px] text-slate-400 pl-4">
                            ↳ Soll: {s.expected.trim()}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Test Files */}
              <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-1 mt-1">
                <span className="font-bold text-[11px] text-slate-400 block">
                  Testdateien im Ticket:
                </span>
                {state.testFiles.length > 0 ? (
                  <ul className="list-disc list-inside text-slate-300 font-mono text-[10px]">
                    {state.testFiles.map((f, idx) => (
                      <li key={idx}>{f}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic text-[11px]">Keine</p>
                )}
              </div>
            </div>

            {/* CI/CD & Deployment */}
            <div className="space-y-1.5">
              <h4 className="font-bold text-amber-400 uppercase tracking-wider text-[11px] border-b border-slate-800/60 pb-1">
                CI/CD & Deployment
              </h4>
              <ul className="space-y-1 font-mono text-[11px] text-slate-300">
                <li>Pipeline: {pipelineStatusText}</li>
                <li>
                  Konfiguration:{" "}
                  {state.hasConfigChanges
                    ? state.configChanges || "Neue Properties / Env-Vars"
                    : "Keine"}
                </li>
                <li>
                  Datenbank:{" "}
                  {state.hasDatabaseNotes
                    ? state.databaseNotes || "Neue Migration"
                    : "Keine Migrationen"}
                </li>
                <li>
                  Rollout:{" "}
                  {state.hasRolloutNotes
                    ? state.rolloutNotes || "Reihenfolge beachten"
                    : "Standard"}
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
