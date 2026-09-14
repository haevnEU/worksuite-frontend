import React, { useState } from "react";
import {
  Archive,
  BookmarkPlus,
  CheckSquare,
  Hash,
  HelpCircle,
  ShieldAlert,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useMrReview } from "../hooks/useMrReview";
import { useReviewArchive } from "../hooks/useReviewArchive";
import {
  MrReviewHeader,
  ReviewArchiveTab,
  ReviewChecklistSection,
  ReviewHelpTab,
  ReviewListInput,
  ReviewPreviewSection,
} from "../components";

export const MrReviewPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"main" | "help" | "archive">(
    "main",
  );

  const {
    state,
    generatedMarkdown,
    setTicketId,
    updateChecklist,
    addPositiveFeedback,
    removePositiveFeedback,
    addNegativeFeedback,
    removeNegativeFeedback,
    addBlocker,
    removeBlocker,
    setTentativeApproval,
    loadFromArchive,
  } = useMrReview();

  const { archive, showSaveToast, saveReview, deleteReview } =
    useReviewArchive();

  const handleSave = () => {
    saveReview(state);
  };

  const handleLoad = (item: Parameters<typeof loadFromArchive>[0]) => {
    loadFromArchive(item);
    setActiveTab("main");
  };

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-200">
      <MrReviewHeader generatedMarkdown={generatedMarkdown} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Linke Spalte mit Tab-Navigation */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center bg-[#0b111e] p-1 rounded-xl border border-slate-800 text-xs w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("main")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  activeTab === "main"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Review Formular</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("help")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  activeTab === "help"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Kriterien-Hilfe</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("archive")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                  activeTab === "archive"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archiv ({archive.length})</span>
              </button>
            </div>

            {/* Ticket-ID Bar mit Sofort-Speichern */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <Hash className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
                <input
                  type="text"
                  value={state.ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="Ticket ID (z.B. PROJ-1024)"
                  className="bg-[#0b111e] border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono w-44"
                />
              </div>

              <button
                type="button"
                disabled={!state.ticketId.trim()}
                onClick={handleSave}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Review im lokalen Archiv speichern"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-blue-400" />
                <span>{showSaveToast ? "Gespeichert!" : "Speichern"}</span>
              </button>
            </div>
          </div>

          {activeTab === "help" && <ReviewHelpTab />}

          {activeTab === "archive" && (
            <ReviewArchiveTab
              archive={archive}
              onLoadReview={handleLoad}
              onDeleteReview={deleteReview}
            />
          )}

          {activeTab === "main" && (
            <div className="space-y-5">
              <ReviewChecklistSection
                checklist={state.checklist}
                onChange={updateChecklist}
              />

              <ReviewListInput
                title="Besonders gut gefiel mir..."
                icon={<ThumbsUp className="w-4 h-4 text-emerald-400" />}
                items={state.positiveFeedback}
                placeholder="z.B. Saubere DTO-Kapselung, durchgängige ExceptionMapper..."
                badgeColorClass="text-emerald-400"
                onAddItem={addPositiveFeedback}
                onRemoveItem={removePositiveFeedback}
              />

              <ReviewListInput
                title="Anmerkungen & Verbesserungspotenzial"
                icon={<ThumbsDown className="w-4 h-4 text-amber-400" />}
                items={state.negativeFeedback}
                placeholder="z.B. Streams nicht im try-with-resources geschlossen..."
                badgeColorClass="text-amber-400"
                onAddItem={addNegativeFeedback}
                onRemoveItem={removeNegativeFeedback}
              />

              <ReviewListInput
                title="Kritische Blocker (verhindern Approval)"
                icon={<ShieldAlert className="w-4 h-4 text-rose-400" />}
                items={state.blockers}
                placeholder="z.B. Akzeptanzkriterium 2 fehlt, API-Key im Testcode..."
                badgeColorClass="text-rose-400"
                onAddItem={addBlocker}
                onRemoveItem={removeBlocker}
              />

              {state.blockers.length === 0 && (
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-200 block">
                      Approval mit Vorbehalt (Tentative Approval)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Approval gilt sofort; kein erneutes Review bei einfachen
                      Fixes nötig.
                    </p>
                  </div>

                  <input
                    type="checkbox"
                    checked={state.isTentativeApproval}
                    onChange={(e) => setTentativeApproval(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Rechte Spalte: Live Markdown-Preview */}
        <ReviewPreviewSection rawMarkdown={generatedMarkdown} state={state} />
      </div>
    </div>
  );
};

export default MrReviewPage;
