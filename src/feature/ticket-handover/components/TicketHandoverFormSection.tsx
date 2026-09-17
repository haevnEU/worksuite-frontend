import React, { useState } from "react";
import {
  AlertTriangle,
  ArrowRightLeft,
  Building2,
  CheckCircle2,
  Eye,
  FileCheck,
  FileCode2,
  GitBranch,
  Plus,
  Sparkles,
  Trash2,
  Undo2,
  User,
} from "lucide-react";
import type {
  HandoverScenario,
  ManualQaStep,
  TicketHandoverState,
} from "../models/ticketHandover.model";

interface TicketHandoverFormSectionProps {
  state: TicketHandoverState;
  recentNames: string[];
  recentCompanies: string[];
  updateField: <K extends keyof TicketHandoverState>(
    field: K,
    value: TicketHandoverState[K],
  ) => void;
  commitRecipientHistory: () => void;
  addQaUnitTest: (testClass: string) => void;
  removeQaUnitTest: (index: number) => void;
  addQaManualStep: (step: ManualQaStep) => void;
  removeQaManualStep: (id: string) => void;
  addQaTestFile: (file: string) => void;
  removeQaTestFile: (index: number) => void;
  setScenario: (scenario: HandoverScenario) => void;
}

export const TicketHandoverFormSection: React.FC<
  TicketHandoverFormSectionProps
> = ({
  state,
  recentNames,
  recentCompanies,
  updateField,
  commitRecipientHistory,
  addQaUnitTest,
  removeQaUnitTest,
  addQaManualStep,
  removeQaManualStep,
  addQaTestFile,
  removeQaTestFile,
  setScenario,
}) => {
  const [unitTestInput, setUnitTestInput] = useState("");
  const [stepAction, setStepAction] = useState("");
  const [stepExpected, setStepExpected] = useState("");
  const [fileInput, setFileInput] = useState("");

  const handleAddUnitTest = () => {
    if (!unitTestInput.trim()) return;
    addQaUnitTest(unitTestInput.trim());
    setUnitTestInput("");
  };

  const handleAddStep = () => {
    if (!stepAction.trim()) return;
    addQaManualStep({
      id: crypto.randomUUID(),
      action: stepAction.trim(),
      expected: stepExpected.trim() || undefined,
    });
    setStepAction("");
    setStepExpected("");
  };

  const handleAddFile = () => {
    if (!fileInput.trim()) return;
    addQaTestFile(fileInput.trim());
    setFileInput("");
  };

  return (
    <div className="space-y-5 text-xs font-sans">
      {/* 1. Scenario Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Handover Scenario
            </h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Stage Switch
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => setScenario("to-review")}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition cursor-pointer ${
              state.scenario === "to-review"
                ? "bg-blue-600/20 border-blue-500/50 text-blue-300 shadow-sm"
                : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <Eye className="w-4 h-4 text-blue-400" />
            <span className="font-bold">To Review</span>
            <span className="text-[10px] text-slate-500">
              Dev &rarr; Reviewer
            </span>
          </button>

          <button
            type="button"
            onClick={() => setScenario("back-to-dev")}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition cursor-pointer ${
              state.scenario === "back-to-dev"
                ? "bg-amber-600/20 border-amber-500/50 text-amber-300 shadow-sm"
                : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <Undo2 className="w-4 h-4 text-amber-400" />
            <span className="font-bold">Back to Dev</span>
            <span className="text-[10px] text-slate-500">
              Reviewer &rarr; Dev
            </span>
          </button>

          <button
            type="button"
            onClick={() => setScenario("to-qa")}
            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition cursor-pointer ${
              state.scenario === "to-qa"
                ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-300 shadow-sm"
                : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">To QA</span>
            <span className="text-[10px] text-slate-500">
              Dev / Reviewer &rarr; QA
            </span>
          </button>
        </div>

        {/* Recipient Inputs: Name & Company */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-bold">Recipient Name</label>
              <span className="text-[10px] text-slate-500 font-mono">
                {recentNames.length}/10 saved
              </span>
            </div>
            <div className="relative flex items-center">
              <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                list="handover-recent-names"
                value={state.recipientName}
                onChange={(e) => updateField("recipientName", e.target.value)}
                onBlur={commitRecipientHistory}
                placeholder="vorname.nachname"
                className="w-full bg-[#0b111e] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <datalist id="handover-recent-names">
                {recentNames.map((name, i) => (
                  <option key={i} value={name} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-bold">Company Domain</label>
              <span className="text-[10px] text-slate-500 font-mono">
                {recentCompanies.length}/10 saved
              </span>
            </div>
            <div className="relative flex items-center">
              <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                list="handover-recent-companies"
                value={state.recipientCompany}
                onChange={(e) =>
                  updateField("recipientCompany", e.target.value)
                }
                onBlur={commitRecipientHistory}
                placeholder="company.de"
                className="w-full bg-[#0b111e] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <datalist id="handover-recent-companies">
                {recentCompanies.map((comp, i) => (
                  <option key={i} value={comp} />
                ))}
              </datalist>
            </div>
          </div>
        </div>
      </div>

      {/* 2. To Review */}
      {state.scenario === "to-review" && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3 text-slate-400">
          <Eye className="w-4 h-4 text-blue-400 shrink-0" />
          <p className="text-[11px] leading-relaxed">
            Standard-Reviewer-Ping aktiv. Der MR-Link ist bereits im Ticket
            hinterlegt und wird in der GitLab-Referenz referenziert.
          </p>
        </div>
      )}

      {/* 3. Back to Dev */}
      {state.scenario === "back-to-dev" && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Undo2 className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Reviewer Feedback Stats
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-bold mb-1">
                General Hints Count
              </label>
              <input
                type="number"
                min={0}
                value={state.hintsCount}
                onChange={(e) =>
                  updateField(
                    "hintsCount",
                    Math.max(0, parseInt(e.target.value, 10) || 0),
                  )
                }
                className="w-full bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">
                Critical Hints Count (Blockers)
              </label>
              <input
                type="number"
                min={0}
                value={state.criticalHintsCount}
                onChange={(e) =>
                  updateField(
                    "criticalHintsCount",
                    Math.max(0, parseInt(e.target.value, 10) || 0),
                  )
                }
                className="w-full bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={state.pipelinePassed}
                onChange={(e) =>
                  updateField("pipelinePassed", e.target.checked)
                }
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
              />
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-blue-400" />
                CI/CD Pipeline SUCCEED (uncheck for FAILED)
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={state.isApprovalGranted}
                disabled={state.criticalHintsCount > 0 || !state.pipelinePassed}
                onChange={(e) =>
                  updateField("isApprovalGranted", e.target.checked)
                }
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-0 cursor-pointer disabled:opacity-40"
              />
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Approval Granted
              </span>
            </label>
          </div>
        </div>
      )}

      {/* 4. To QA */}
      {state.scenario === "to-qa" && (
        <div className="space-y-4">
          {/* Intro */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white uppercase text-xs">
                Intro & Beschreibung
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                AK geprüft & verifiziert
              </span>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">
                Kurzbeschreibung (optional)
              </label>
              <input
                type="text"
                value={state.qaSummary}
                onChange={(e) => updateField("qaSummary", e.target.value)}
                placeholder="Feature/Fix erfolgreich umgesetzt..."
                className="w-full bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Hinzugefügte Unit-Tests */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white uppercase text-xs">
                  Hinzugefügte Unit-Tests
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-purple-400">
                {state.qaUnitTests.length} Einträge
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={unitTestInput}
                onChange={(e) => setUnitTestInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddUnitTest())
                }
                placeholder="z. B. UserPreferencesTest"
                className="flex-1 bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono text-xs"
              />
              <button
                type="button"
                onClick={handleAddUnitTest}
                disabled={!unitTestInput.trim()}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-xl font-semibold flex items-center gap-1 cursor-pointer transition text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Hinzufügen</span>
              </button>
            </div>

            {state.qaUnitTests.length > 0 && (
              <ul className="space-y-1 pt-1">
                {state.qaUnitTests.map((t, idx) => (
                  <li
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 bg-[#0b111e] border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => removeQaUnitTest(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Manueller Testablauf & Testdateien */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <span className="font-bold text-white uppercase text-xs block pb-2 border-b border-slate-800">
              Manueller Testablauf & Testdateien
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={stepAction}
                onChange={(e) => setStepAction(e.target.value)}
                placeholder="Aktion (z. B. Upload sample.csv)"
                className="bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
              />
              <input
                type="text"
                value={stepExpected}
                onChange={(e) => setStepExpected(e.target.value)}
                placeholder="Erwartetes Ergebnis (optional)"
                className="bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>
            <button
              type="button"
              onClick={handleAddStep}
              disabled={!stepAction.trim()}
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-xl font-semibold flex items-center justify-center gap-1 cursor-pointer transition text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Testschritt hinzufügen</span>
            </button>

            {state.qaManualSteps.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {state.qaManualSteps.map((s, idx) => (
                  <div
                    key={s.id}
                    className="p-2.5 bg-[#0b111e] border border-slate-800 rounded-xl flex items-start justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-300">
                        {idx + 1}. {s.action}
                      </span>
                      {s.expected && (
                        <p className="text-[11px] text-slate-500">
                          Soll: {s.expected}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQaManualStep(s.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Testdateien Unterliste */}
            <div className="pt-3 border-t border-slate-800/60 space-y-2">
              <label className="text-slate-400 font-bold block">
                Angehängte Testdateien
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fileInput}
                  onChange={(e) => setFileInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddFile())
                  }
                  placeholder="z. B. invalid_payload.json"
                  className="flex-1 bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddFile}
                  disabled={!fileInput.trim()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-xl font-semibold flex items-center gap-1 cursor-pointer transition text-xs"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Datei anhängen</span>
                </button>
              </div>

              {state.qaTestFiles.length > 0 && (
                <ul className="space-y-1">
                  {state.qaTestFiles.map((f, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between p-2 bg-[#0b111e] border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300"
                    >
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => removeQaTestFile(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* CI/CD-Pipeline Status & Override */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-bold text-white uppercase text-xs">
                CI/CD-Pipeline Status
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                  state.qaPipelinePassed
                    ? "bg-emerald-950/60 border-emerald-800/60 text-emerald-400"
                    : state.qaPipelineOverridden
                      ? "bg-amber-950/60 border-amber-800/60 text-amber-400"
                      : "bg-rose-950/60 border-rose-800/60 text-rose-400"
                }`}
              >
                {state.qaPipelinePassed
                  ? "SUCCEED"
                  : state.qaPipelineOverridden
                    ? "FAILED (OVERRIDDEN)"
                    : "FAILED"}
              </span>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={state.qaPipelinePassed}
                onChange={(e) =>
                  updateField("qaPipelinePassed", e.target.checked)
                }
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-0 cursor-pointer"
              />
              <span className="font-bold text-slate-300">
                Pipeline lief erfolgreich durch (SUCCEED)
              </span>
            </label>

            {!state.qaPipelinePassed && (
              <div className="p-3 bg-[#0b111e] border border-amber-800/40 rounded-xl space-y-3 animate-in fade-in duration-150">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={state.qaPipelineOverridden}
                    onChange={(e) =>
                      updateField("qaPipelineOverridden", e.target.checked)
                    }
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Pipeline fehlgeschlagen, aber für QS überschrieben
                  </span>
                </label>

                {state.qaPipelineOverridden && (
                  <div className="space-y-1 pl-6">
                    <label className="text-[10px] text-amber-400 font-bold block">
                      Begründung für Pipeline-Override:
                    </label>
                    <input
                      type="text"
                      value={state.qaPipelineOverrideReason}
                      onChange={(e) =>
                        updateField("qaPipelineOverrideReason", e.target.value)
                      }
                      placeholder="z. B. Flaky Test im AuthService, Ticket #482 angelegt"
                      className="w-full bg-slate-950 border border-amber-800/60 rounded-xl px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 text-xs"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
