import React, { useState } from "react";
import {
  AlertTriangle,
  Boxes,
  CheckSquare,
  Cpu,
  Database,
  FileCheck,
  FileCode2,
  FileText,
  GitBranch,
  Plus,
  Rocket,
  Settings,
  Trash2,
} from "lucide-react";
import type {
  ManualTestStep,
  MrCreatorState,
  MrProject,
  MrType,
} from "../models/mrCreator.model";
import { MrCreatorListInput } from "./MrCreatorListInput";

interface MrCreatorFormSectionProps {
  state: MrCreatorState;
  updateField: <K extends keyof MrCreatorState>(
    field: K,
    value: MrCreatorState[K],
  ) => void;
  addAcceptanceCriterion: (text: string) => void;
  toggleAcceptanceCriterion: (id: string) => void;
  removeAcceptanceCriterion: (id: string) => void;
  addAffectedComponent: (component: string) => void;
  removeAffectedComponent: (index: number) => void;
  addBreakingChange: (change: string) => void;
  removeBreakingChange: (index: number) => void;
  addUnitTestClass: (testClass: string) => void;
  removeUnitTestClass: (index: number) => void;
  addManualTestStep: (step: ManualTestStep) => void;
  removeManualTestStep: (id: string) => void;
  addTestFile: (file: string) => void;
  removeTestFile: (index: number) => void;
}

export const MrCreatorFormSection: React.FC<MrCreatorFormSectionProps> = ({
  state,
  updateField,
  addAcceptanceCriterion,
  toggleAcceptanceCriterion,
  removeAcceptanceCriterion,
  addAffectedComponent,
  removeAffectedComponent,
  addBreakingChange,
  removeBreakingChange,
  addUnitTestClass,
  removeUnitTestClass,
  addManualTestStep,
  removeManualTestStep,
  addTestFile,
  removeTestFile,
}) => {
  const [akInput, setAkInput] = useState("");
  const [stepAction, setStepAction] = useState("");
  const [stepExpected, setStepExpected] = useState("");

  const handleAddAk = () => {
    if (!akInput.trim()) return;
    addAcceptanceCriterion(akInput.trim());
    setAkInput("");
  };

  const handleAddStep = () => {
    if (!stepAction.trim()) return;
    addManualTestStep({
      id: crypto.randomUUID(),
      step: `Step ${state.manualTestSteps.length + 1}`,
      action: stepAction.trim(),
      expected: stepExpected.trim(),
    });
    setStepAction("");
    setStepExpected("");
  };

  return (
    <div className="space-y-5 text-xs font-sans">
      {/* 1. Context & Motivation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <FileText className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Context & Motivation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-400 font-bold mb-1">
              MR Short Title
            </label>
            <input
              type="text"
              value={state.shortTitle}
              onChange={(e) => updateField("shortTitle", e.target.value)}
              placeholder="e.g. CSV Validation Engine Refactoring"
              className="w-full bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 font-bold mb-1">
                Type
              </label>
              <select
                value={state.type}
                onChange={(e) => updateField("type", e.target.value as MrType)}
                className="w-full bg-[#0b111e] border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="Feature">Feature</option>
                <option value="Bugfix">Bugfix</option>
                <option value="Refactoring">Refactoring</option>
                <option value="System/Infra">System/Infra</option>
                <option value="Support">Support</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">
                Project
              </label>
              <select
                value={state.project}
                onChange={(e) =>
                  updateField("project", e.target.value as MrProject)
                }
                className="w-full bg-[#0b111e] border border-slate-800 rounded-xl px-2.5 py-2 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="WMT">WMT</option>
                <option value="WMT-Backend">WMT-Backend</option>
                <option value="WMT-Mobile">WMT-Mobile</option>
                <option value="ERP-Tool">ERP-Tool</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-bold mb-1">
            Summary (Problem & Solution)
          </label>
          <textarea
            rows={3}
            value={state.summary}
            onChange={(e) => updateField("summary", e.target.value)}
            placeholder="Briefly describe the issue and the implemented solution..."
            className="w-full bg-[#0b111e] border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>
      </div>

      {/* 2. Technical Changes */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Technical Changes
          </h2>
        </div>

        <div>
          <label className="block text-slate-400 font-bold mb-1">
            Architecture & Design Decisions
          </label>
          <textarea
            rows={2}
            value={state.architectureRefactoring}
            onChange={(e) =>
              updateField("architectureRefactoring", e.target.value)
            }
            placeholder="Key architectural choices, design patterns, or encapsulation changes..."
            className="w-full bg-[#0b111e] border border-slate-800 rounded-xl p-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        <MrCreatorListInput
          title="Affected Components"
          icon={<Boxes className="w-4 h-4 text-cyan-400" />}
          items={state.affectedComponents}
          placeholder="e.g. `UserService`: Added validation rules for API keys"
          badgeColorClass="text-cyan-400"
          onAddItem={addAffectedComponent}
          onRemoveItem={removeAffectedComponent}
        />

        <MrCreatorListInput
          title="Breaking Changes / Side Effects"
          icon={<AlertTriangle className="w-4 h-4 text-rose-400" />}
          items={state.breakingChanges}
          placeholder="e.g. Required parameter added to DTO, altered DB schema"
          badgeColorClass="text-rose-400"
          onAddItem={addBreakingChange}
          onRemoveItem={removeBreakingChange}
        />
      </div>

      {/* 3. Verification & Testing */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Verification & Testing
          </h2>
        </div>

        {/* Acceptance Criteria */}
        <div className="space-y-2">
          <label className="block text-slate-400 font-bold">
            Acceptance Criteria
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={akInput}
              onChange={(e) => setAkInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddAk())
              }
              placeholder="Add acceptance criterion..."
              className="flex-1 bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddAk}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>AC</span>
            </button>
          </div>

          <div className="space-y-1.5 pt-1">
            {state.acceptanceCriteria.map((ak) => (
              <div
                key={ak.id}
                className="flex items-center justify-between p-2 bg-[#0b111e] border border-slate-800 rounded-xl"
              >
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={ak.completed}
                    onChange={() => toggleAcceptanceCriterion(ak.id)}
                    className="w-3.5 h-3.5 rounded bg-slate-800 border-slate-700 text-emerald-600 focus:ring-0 cursor-pointer"
                  />
                  <span
                    className={
                      ak.completed
                        ? "line-through text-slate-500"
                        : "text-slate-200"
                    }
                  >
                    {ak.text}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => removeAcceptanceCriterion(ak.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Test Steps */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          <label className="block text-slate-400 font-bold">
            Manual Test Instructions
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              value={stepAction}
              onChange={(e) => setStepAction(e.target.value)}
              placeholder="Action (e.g. POST to /api/v1/auth)"
              className="bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="text"
              value={stepExpected}
              onChange={(e) => setStepExpected(e.target.value)}
              placeholder="Expected outcome (optional)"
              className="bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="button"
            onClick={handleAddStep}
            disabled={!stepAction.trim()}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white rounded-xl font-semibold flex items-center justify-center gap-1 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Test Step</span>
          </button>

          {state.manualTestSteps.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {state.manualTestSteps.map((s, idx) => (
                <div
                  key={s.id}
                  className="p-2.5 bg-[#0b111e] border border-slate-800 rounded-xl flex items-start justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-300">
                      {idx + 1}. {s.action}
                    </span>
                    {s.expected && s.expected.trim() && (
                      <p className="text-[11px] text-slate-500">
                        Expected: {s.expected}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeManualTestStep(s.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Test Files */}
          <div className="pt-2">
            <MrCreatorListInput
              title="Test Files Attached to Ticket"
              icon={<FileCheck className="w-4 h-4 text-emerald-400" />}
              items={state.testFiles}
              placeholder="e.g. payload_invalid_schema.json"
              badgeColorClass="text-emerald-400"
              onAddItem={addTestFile}
              onRemoveItem={removeTestFile}
            />
          </div>
        </div>
      </div>

      {/* 4. Standalone Section: Unit Tests */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Unit Tests
            </h2>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {state.unitTestsChecked ? "Active" : "None"}
          </span>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={state.unitTestsChecked}
              onChange={(e) =>
                updateField("unitTestsChecked", e.target.checked)
              }
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-0 cursor-pointer"
            />
            <span className="font-bold text-slate-300">
              Unit tests were added or updated
            </span>
          </label>

          {state.unitTestsChecked ? (
            <div className="pt-1">
              <MrCreatorListInput
                title="Added / Updated Unit Test Classes"
                icon={<FileCode2 className="w-3.5 h-3.5 text-purple-400" />}
                items={state.unitTestClasses}
                placeholder="e.g. UserServiceTest, CsvValidationEngineTest"
                badgeColorClass="text-purple-400"
                onAddItem={addUnitTestClass}
                onRemoveItem={removeUnitTestClass}
              />
            </div>
          ) : (
            <div className="p-3 bg-[#0b111e] border border-slate-800 rounded-xl text-slate-400 text-[11px] italic">
              Notice: The Markdown template will output &quot;Es wurden keine
              Unit-Tests ergänzt&quot;.
            </div>
          )}
        </div>
      </div>

      {/* 5. Standalone Section: CI/CD Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              CI/CD Pipeline
            </h2>
          </div>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
              state.itestsChecked
                ? "bg-emerald-950/60 border-emerald-800/60 text-emerald-400 font-bold"
                : "bg-amber-950/60 border-amber-800/60 text-amber-400"
            }`}
          >
            {state.itestsChecked ? "PASSED" : "OVERRIDE / FAILED"}
          </span>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={state.itestsChecked}
              onChange={(e) => updateField("itestsChecked", e.target.checked)}
              className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
            />
            <span className="font-bold text-slate-300">
              CI/CD pipeline passed successfully
            </span>
          </label>

          {!state.itestsChecked && (
            <div className="p-3 bg-[#0b111e] border border-amber-800/50 rounded-xl space-y-1.5 animate-in fade-in duration-150">
              <label className="text-[10px] text-amber-400 font-bold block">
                Reason / Status (reflected across Tests & Deployment):
              </label>
              <input
                type="text"
                value={state.itestsDetails}
                onChange={(e) => updateField("itestsDetails", e.target.value)}
                placeholder="e.g. Skipped (known flakiness in AuthService, Issue #482 filed)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* 6. CI/CD & Deployment (Toggleable Sections) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <Rocket className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            CI/CD & Deployment
          </h2>
        </div>

        <div className="space-y-4">
          {/* Configuration */}
          <div className="p-3 bg-[#0b111e] border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={state.hasConfigChanges}
                  onChange={(e) =>
                    updateField("hasConfigChanges", e.target.checked)
                  }
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-600 focus:ring-0 cursor-pointer"
                />
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  Configuration updates required
                </span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {state.hasConfigChanges ? "Active" : "None"}
              </span>
            </div>

            {state.hasConfigChanges && (
              <input
                type="text"
                value={state.configChanges}
                onChange={(e) => updateField("configChanges", e.target.value)}
                placeholder="New application properties, env variables, or Helm values..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            )}
          </div>

          {/* Database Notes */}
          <div className="p-3 bg-[#0b111e] border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={state.hasDatabaseNotes}
                  onChange={(e) =>
                    updateField("hasDatabaseNotes", e.target.checked)
                  }
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-600 focus:ring-0 cursor-pointer"
                />
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                  Database changes / migrations included
                </span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {state.hasDatabaseNotes ? "Active" : "None"}
              </span>
            </div>

            {state.hasDatabaseNotes && (
              <input
                type="text"
                value={state.databaseNotes}
                onChange={(e) => updateField("databaseNotes", e.target.value)}
                placeholder="e.g. V1.4__add_user_preferences_table.sql"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            )}
          </div>

          {/* Rollout Notes */}
          <div className="p-3 bg-[#0b111e] border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={state.hasRolloutNotes}
                  onChange={(e) =>
                    updateField("hasRolloutNotes", e.target.checked)
                  }
                  className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-600 focus:ring-0 cursor-pointer"
                />
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Rocket className="w-3.5 h-3.5 text-amber-400" />
                  Specific rollout & deployment instructions
                </span>
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                {state.hasRolloutNotes ? "Active" : "Standard"}
              </span>
            </div>

            {state.hasRolloutNotes && (
              <input
                type="text"
                value={state.rolloutNotes}
                onChange={(e) => updateField("rolloutNotes", e.target.value)}
                placeholder="e.g. Deploy Service B prior to Service A, flush Redis cache"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
