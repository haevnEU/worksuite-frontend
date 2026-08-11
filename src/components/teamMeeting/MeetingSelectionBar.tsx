import React from "react";
import { Archive, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import { WeeklyMeetingDTO } from "../../models/weeklyMeeting.model.ts";

interface MeetingSelectionBarProps {
  allMeetings: WeeklyMeetingDTO[];
  selectionMeetings: WeeklyMeetingDTO[];
  activeMeetingId?: string | null;
  onSelectMeeting: (id: string) => void;
  onOpenArchiveModal: () => void;
}

export const MeetingSelectionBar: React.FC<MeetingSelectionBarProps> = ({
  allMeetings,
  selectionMeetings,
  activeMeetingId,
  onSelectMeeting,
  onOpenArchiveModal,
}) => {
  return (
    <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xs font-sans">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Select Meeting
          </span>
        </div>
        <button
          className="text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg flex items-center space-x-1.5 border border-slate-700 transition-colors cursor-pointer"
          onClick={onOpenArchiveModal}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Meeting Archive ({allMeetings.length})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {selectionMeetings.map((w, index) => {
          const isActive = activeMeetingId === w.id;
          let badgeLabel = "Last Meeting";
          if (index === 0) badgeLabel = "Current Weekly";
          else if (index === 1) badgeLabel = "Previous Week";
          else if (index === 2) badgeLabel = "2 Weeks Ago";
          else if (index === 3) badgeLabel = "3 Weeks Ago";

          return (
            <button
              key={w.id}
              onClick={() => onSelectMeeting(w.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between space-y-2 cursor-pointer relative overflow-hidden ${
                isActive
                  ? "bg-blue-950/40 border-blue-500/80 shadow-xs ring-1 ring-blue-500/30"
                  : "bg-slate-900 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${
                    index === 0
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {badgeLabel}
                </span>
                {isActive && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                )}
              </div>

              <div>
                <h4
                  className={`text-xs font-bold truncate ${
                    isActive ? "text-white" : "text-slate-200"
                  }`}
                >
                  {w.title}
                </h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {w.createdAt.split("T")[0]}
                </p>
              </div>
            </button>
          );
        })}

        <button
          className="p-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 hover:bg-slate-800/80 hover:border-blue-500/50 text-slate-300 text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer"
          onClick={onOpenArchiveModal}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wide bg-blue-900/40 text-blue-300 border border-blue-700/40">
              Archive
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
              <Archive className="w-3.5 h-3.5 text-blue-400" />
              <span>All Weeklies</span>
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Search {allMeetings.length} meetings
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
