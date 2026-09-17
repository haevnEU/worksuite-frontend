import React, { useState } from "react";
import {
  Archive,
  ArrowRightLeft,
  BookmarkPlus,
  Hash,
  HelpCircle,
} from "lucide-react";
import { useTicketHandover } from "../hooks/useTicketHandover";
import { useTicketHandoverArchive } from "../hooks/useTicketHandoverArchive";
import {
  TicketHandoverArchiveTab,
  TicketHandoverFormSection,
  TicketHandoverHeader,
  TicketHandoverHelpTab,
  TicketHandoverPreviewSection,
} from "../components";

export const TicketHandoverPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"main" | "help" | "archive">(
    "main",
  );

  const {
    state,
    generatedTextile,
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
    loadFromArchive,
  } = useTicketHandover();

  const { archive, showSaveToast, saveHandover, deleteHandover } =
    useTicketHandoverArchive();

  const handleSave = () => {
    commitRecipientHistory();
    saveHandover(state);
  };

  const handleLoad = (item: Parameters<typeof loadFromArchive>[0]) => {
    loadFromArchive(item);
    setActiveTab("main");
  };

  return (
    <div className="w-full space-y-6 pb-12 font-sans text-slate-200">
      <TicketHandoverHeader generatedTextile={generatedTextile} />

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Linke Spalte */}
        <div className="space-y-4 w-full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center bg-[#0b111e] p-1 rounded-xl border border-slate-800 text-xs w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("main")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  activeTab === "main"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Handover Form</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("help")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  activeTab === "help"
                    ? "bg-emerald-600 text-white shadow-xs"
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
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive ({archive.length})</span>
              </button>
            </div>

            {/* Ticket-ID Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <Hash className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={state.ticketId}
                  onChange={(e) => updateField("ticketId", e.target.value)}
                  placeholder="Ticket ID (e.g. 12345)"
                  className="bg-[#0b111e] border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono w-44"
                />
              </div>
              <button
                type="button"
                disabled={!state.ticketId.trim()}
                onClick={handleSave}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Save handover to local archive"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-emerald-400" />
                <span>{showSaveToast ? "Saved!" : "Save"}</span>
              </button>
            </div>
          </div>

          {activeTab === "help" && <TicketHandoverHelpTab />}

          {activeTab === "archive" && (
            <TicketHandoverArchiveTab
              archive={archive}
              onLoadHandover={handleLoad}
              onDeleteHandover={deleteHandover}
            />
          )}

          {activeTab === "main" && (
            <TicketHandoverFormSection
              state={state}
              recentNames={recentNames}
              recentCompanies={recentCompanies}
              updateField={updateField}
              commitRecipientHistory={commitRecipientHistory}
              addQaUnitTest={addQaUnitTest}
              removeQaUnitTest={removeQaUnitTest}
              addQaManualStep={addQaManualStep}
              removeQaManualStep={removeQaManualStep}
              addQaTestFile={addQaTestFile}
              removeQaTestFile={removeQaTestFile}
              setScenario={setScenario}
            />
          )}
        </div>

        {/* Rechte Spalte: Live Preview */}
        <div className="w-full">
          <TicketHandoverPreviewSection
            rawTextile={generatedTextile}
            state={state}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketHandoverPage;
