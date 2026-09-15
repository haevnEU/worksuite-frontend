import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  DailyLogSection,
  MeetingArchiveModal,
  MeetingSelectionBar,
  TeamMeetingHeader,
  WeeklySummaryCard,
} from "../components";
import { TeamMeetingAiOverlay } from "../ai/overlay.ai.tsx";
import { WeeklyProvider, useWeekly } from "../context/WeeklyContext";

const WeeklyPageContent: React.FC = () => {
  const {
    allMeetings,
    selectionMeetings,
    activeMeeting,
    selectedMeetingId,
    isLoading,
    selectMeeting,
    generateNextWeek,
  } = useWeekly();

  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveSearch, setArchiveSearch] = useState("");

  const archivedMeetings = React.useMemo(() => {
    if (!archiveSearch.trim()) return allMeetings;
    const q = archiveSearch.toLowerCase();
    return allMeetings.filter(
        (w) =>
            w.title.toLowerCase().includes(q) ||
            (w.summary && w.summary.toLowerCase().includes(q)) ||
            w.createdAt.includes(q),
    );
  }, [allMeetings, archiveSearch]);

  return (
      <div className="space-y-6 pb-12 font-sans">
        <TeamMeetingHeader />

        <MeetingSelectionBar
            allMeetings={allMeetings}
            selectionMeetings={selectionMeetings}
            activeMeetingId={selectedMeetingId}
            onSelectMeeting={selectMeeting}
            onOpenArchiveModal={() => setIsArchiveModalOpen(true)}
        />

        {!activeMeeting && !isLoading ? (
            <div className="p-12 text-center bg-[#10192c]/80 border border-slate-800 rounded-xl space-y-3 shadow-lg backdrop-blur">
              <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-semibold text-white">
                No weekly meetings available
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Get started by generating your first weekly team sync cycle.
              </p>
              <div className="pt-2">
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                    onClick={generateNextWeek}
                >
                  Generate First Meeting
                </button>
              </div>
            </div>
        ) : (
            <div className="space-y-6">
              <WeeklySummaryCard />
              <DailyLogSection />
            </div>
        )}

        <MeetingArchiveModal
            isOpen={isArchiveModalOpen}
            onClose={() => setIsArchiveModalOpen(false)}
            allMeetingsCount={allMeetings.length}
            archiveSearch={archiveSearch}
            onArchiveSearchChange={setArchiveSearch}
            archivedMeetings={archivedMeetings}
            activeMeetingId={selectedMeetingId}
            onSelectMeeting={selectMeeting}
        />

        <TeamMeetingAiOverlay />
      </div>
  );
};

export const WeeklyPage: React.FC = () => {
  return (
      <WeeklyProvider>
        <WeeklyPageContent />
      </WeeklyProvider>
  );
};