import React, { useState } from "react";
import {
  Archive,
  Calendar,
  ChevronRight,
  FileText,
  HelpCircle,
  Info,
  Search,
  X,
} from "lucide-react";
import { WeeklyMeetingDTO } from "../../models/weeklyMeeting.model.ts";
import { isWeekend } from "../../utils/teamMeeting.util.ts";

interface MeetingArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  allMeetingsCount: number;
  archiveSearch: string;
  onArchiveSearchChange: (value: string) => void;
  archivedMeetings: WeeklyMeetingDTO[];
  activeMeetingId?: string | null;
  onSelectMeeting: (id: string) => void;
}

export const MeetingArchiveModal: React.FC<MeetingArchiveModalProps> = ({
  isOpen,
  onClose,
  allMeetingsCount,
  archiveSearch,
  onArchiveSearchChange,
  archivedMeetings,
  activeMeetingId,
  onSelectMeeting,
}) => {
  const [showGuide, setShowGuide] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs font-sans">
      <div className="bg-slate-900 w-full max-w-3xl max-h-[85vh] rounded-2xl p-6 border border-slate-800 shadow-2xl flex flex-col space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Archive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                All Weekly Meetings Archive ({allMeetingsCount})
              </h3>
              <p className="text-slate-400 text-xs">
                Overview and search for all past weeks and reports
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowGuide((prev) => !prev)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                showGuide
                  ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                  : "bg-slate-800 text-slate-400 hover:text-white border-slate-700"
              }`}
              title="Archive guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              <span>Guide</span>
            </button>

            <button
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {showGuide && (
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 text-indigo-400 font-bold">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Archive Navigation & History</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
              <div className="flex items-start gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Search by meeting title, creation date (YYYY-MM-DD), or
                  keyword.
                </span>
              </div>
              <div className="flex items-start gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Selecting a meeting loads historical notes and enables PDF
                  re-exporting.
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={archiveSearch}
            placeholder="Search by title, date, or topics..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            onChange={(e) => onArchiveSearchChange(e.target.value)}
          />
        </div>

        {/* Archive List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {archivedMeetings.map((w) => {
            const isActive = activeMeetingId === w.id;
            const filteredNotesCount = w.daySummaries
              ? w.daySummaries.filter((d) => !isWeekend(d.date)).length
              : 0; //[cite: 31]

            return (
              <div
                key={w.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isActive
                    ? "bg-blue-950/40 border-blue-500/80 shadow-xs"
                    : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/30 font-mono">
                      {w.createdAt.split("T")[0]}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Currently Active
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white">{w.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {w.summary || "No summary entered."}
                  </p>
                  <span className="text-[10px] text-slate-500 block">
                    📝 {filteredNotesCount} daily logs available
                  </span>
                </div>

                <div className="shrink-0">
                  <button
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                      isActive
                        ? "bg-emerald-600 text-white hover:bg-emerald-500"
                        : "bg-blue-600 text-white hover:bg-blue-500"
                    }`}
                    onClick={() => {
                      onSelectMeeting(w.id);
                      onClose();
                    }}
                  >
                    <span>Open</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {archivedMeetings.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No meetings found matching your search.
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
