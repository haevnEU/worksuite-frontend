import React, { useState } from "react";
import {
  Archive,
  BookmarkPlus,
  FilePlus2,
  Hash,
  HelpCircle,
} from "lucide-react";
import { useMrCreator } from "../hooks/useMrCreator";
import { useMrCreatorArchive } from "../hooks/useMrCreatorArchive";
import {
  MrCreatorArchiveTab,
  MrCreatorFormSection,
  MrCreatorHeader,
  MrCreatorHelpTab,
  MrCreatorPreviewSection,
} from "../components";

export const MrCreatorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"main" | "help" | "archive">(
    "main",
  );

  const {
    state,
    generatedMarkdown,
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
    loadFromArchive,
  } = useMrCreator();

  const { archive, showSaveToast, saveCreator, deleteCreator } =
    useMrCreatorArchive();

  const handleSave = () => {
    saveCreator(state);
  };

  const handleLoad = (item: Parameters<typeof loadFromArchive>[0]) => {
    loadFromArchive(item);
    setActiveTab("main");
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-200">
      <MrCreatorHeader generatedMarkdown={generatedMarkdown} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center bg-[#0b111e] p-1 rounded-xl border border-slate-800 text-xs w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("main")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  activeTab === "main"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <FilePlus2 className="w-3.5 h-3.5" />
                <span>MR Form</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("help")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  activeTab === "help"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Guidelines</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("archive")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  activeTab === "archive"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive ({archive.length})</span>
              </button>
            </div>

            {/* Ticket ID Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <Hash className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={state.ticketId}
                  onChange={(e) => updateField("ticketId", e.target.value)}
                  placeholder="Ticket ID (e.g. 12345)"
                  className="bg-[#0b111e] border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono w-44"
                />
              </div>
              <button
                type="button"
                disabled={!state.ticketId.trim()}
                onClick={handleSave}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Save MR template to local archive"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-purple-400" />
                <span>{showSaveToast ? "Saved!" : "Save"}</span>
              </button>
            </div>
          </div>

          {activeTab === "help" && <MrCreatorHelpTab />}

          {activeTab === "archive" && (
            <MrCreatorArchiveTab
              archive={archive}
              onLoadCreator={handleLoad}
              onDeleteCreator={deleteCreator}
            />
          )}

          {activeTab === "main" && (
            <MrCreatorFormSection
              state={state}
              updateField={updateField}
              addAcceptanceCriterion={addAcceptanceCriterion}
              toggleAcceptanceCriterion={toggleAcceptanceCriterion}
              removeAcceptanceCriterion={removeAcceptanceCriterion}
              addAffectedComponent={addAffectedComponent}
              removeAffectedComponent={removeAffectedComponent}
              addBreakingChange={addBreakingChange}
              removeBreakingChange={removeBreakingChange}
              addUnitTestClass={addUnitTestClass}
              removeUnitTestClass={removeUnitTestClass}
              addManualTestStep={addManualTestStep}
              removeManualTestStep={removeManualTestStep}
              addTestFile={addTestFile}
              removeTestFile={removeTestFile}
            />
          )}
        </div>

        {/* Right Column: Live Preview */}
        <MrCreatorPreviewSection
          rawMarkdown={generatedMarkdown}
          state={state}
        />
      </div>
    </div>
  );
};

export default MrCreatorPage;
