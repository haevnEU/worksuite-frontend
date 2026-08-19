import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  DaySummaryDTO,
  WeeklyMeetingDTO,
} from "../models/weeklyMeeting.model.ts";
import { weeklyMeetingService } from "../services/network/weeklyMeeting.service.ts";
import { isWeekend } from "../utils/teamMeeting.util.ts";
import {
  DailyLogSection,
  MeetingArchiveModal,
  MeetingSelectionBar,
  TeamMeetingHeader,
  WeeklySummaryCard,
} from "../components/teamMeeting";
import { useSettings } from "../context/SettingsContext.tsx";

export const TeamMeetingPage: React.FC = () => {
  const [allMeetings, setAllMeetings] = useState<WeeklyMeetingDTO[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null,
  );
  const { isDraft } = useSettings();
  const [selectedDayDate, setSelectedDayDate] = useState<string>("");

  const [weeklySummaryInput, setWeeklySummaryInput] = useState("");
  const [daySummaryInput, setDaySummaryInput] = useState("");
  const [newTaskInput, setNewTaskInput] = useState("");

  const [isArchivModalOpen, setIsArchivModalOpen] = useState(false);
  const [archiveSearch, setArchiveSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const loadMeetings = useCallback(
    async (preferredMeetingId?: string) => {
      setIsLoading(true);
      try {
        const meetings = await weeklyMeetingService.fetchAll();
        if (meetings && meetings.length > 0) {
          meetings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
          setAllMeetings(meetings);

          const targetId =
            preferredMeetingId || selectedMeetingId || meetings[0].id;
          const current =
            meetings.find((m) => m.id === targetId) || meetings[0];

          setSelectedMeetingId(current.id);

          if (current.daySummaries) {
            current.daySummaries = current.daySummaries
              .filter((d) => !isWeekend(d.date))
              .sort((a, b) => a.date.localeCompare(b.date));
          }

          setWeeklySummaryInput(current.summary || "");

          if (current.daySummaries && current.daySummaries.length > 0) {
            const defaultDay =
              current.daySummaries.find((d) => d.date === selectedDayDate) ||
              current.daySummaries[0];
            setSelectedDayDate(defaultDay.date);
            setDaySummaryInput(defaultDay.summary || "");
          }
        } else {
          setAllMeetings([]);
          setSelectedMeetingId(null);
        }
      } catch (err) {
        console.error("Error loading weekly meetings:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedMeetingId, selectedDayDate],
  );

  useEffect(() => {
    loadMeetings();
  }, []);

  const activeMeeting = useMemo(() => {
    const meeting =
      allMeetings.find((m) => m.id === selectedMeetingId) ||
      allMeetings[0] ||
      null;
    if (meeting && meeting.daySummaries) {
      return {
        ...meeting,
        daySummaries: meeting.daySummaries
          .filter((d) => !isWeekend(d.date))
          .sort((a, b) => a.date.localeCompare(b.date)),
      };
    }
    return meeting;
  }, [allMeetings, selectedMeetingId]);

  const selectionMeetings = useMemo(() => {
    return allMeetings.slice(0, 4);
  }, [allMeetings]);

  const archivedMeetings = useMemo(() => {
    return allMeetings.filter((w) => {
      if (!archiveSearch.trim()) return true;
      const q = archiveSearch.toLowerCase();
      return (
        w.title.toLowerCase().includes(q) ||
        (w.summary && w.summary.toLowerCase().includes(q)) ||
        w.createdAt.includes(q)
      );
    });
  }, [allMeetings, archiveSearch]);

  const activeDaySummary: DaySummaryDTO | undefined = useMemo(() => {
    return activeMeeting?.daySummaries?.find((d) => d.date === selectedDayDate);
  }, [activeMeeting, selectedDayDate]);

  const activeDayIndex = useMemo(() => {
    return (
      activeMeeting?.daySummaries?.findIndex(
        (d) => d.date === selectedDayDate,
      ) ?? -1
    );
  }, [activeMeeting, selectedDayDate]);

  const handleSelectMeeting = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    const target = allMeetings.find((m) => m.id === meetingId);
    if (target) {
      const filteredDays = (target.daySummaries || [])
        .filter((d) => !isWeekend(d.date))
        .sort((a, b) => a.date.localeCompare(b.date));

      setWeeklySummaryInput(target.summary || "");
      if (filteredDays.length > 0) {
        setSelectedDayDate(filteredDays[0].date);
        setDaySummaryInput(filteredDays[0].summary || "");
      }
    }
  };

  const handleSelectDay = (date: string) => {
    setSelectedDayDate(date);
    const dayObj = activeMeeting?.daySummaries?.find((d) => d.date === date);
    setDaySummaryInput(dayObj?.summary || "");
  };

  const handleGenerateNextWeek = async () => {
    setIsGenerating(true);
    await weeklyMeetingService.generateNextWeek();
    setIsGenerating(false);
  };

  const handleSaveWeeklySummary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMeeting) return;
    await weeklyMeetingService.updateWeeklySummary(
      activeMeeting.id,
      weeklySummaryInput,
    );
    await loadMeetings(activeMeeting.id);
  };

  const handleSaveDaySummary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMeeting || !selectedDayDate) return;
    await weeklyMeetingService.updateDaySummary(
      activeMeeting.id,
      selectedDayDate,
      daySummaryInput,
    );
    await loadMeetings(activeMeeting.id);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMeeting || !selectedDayDate || !newTaskInput.trim()) return;
    await weeklyMeetingService.addTaskToDay(
      activeMeeting.id,
      selectedDayDate,
      newTaskInput.trim(),
    );
    setNewTaskInput("");
    await loadMeetings(activeMeeting.id);
  };

  const handleExportPdf = async () => {
    if (!activeMeeting) return;
    setIsExporting(true);
    await weeklyMeetingService.exportPdf(activeMeeting.id, isDraft);
    setIsExporting(false);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <TeamMeetingHeader
        activeMeeting={activeMeeting}
        isGenerating={isGenerating}
        isExporting={isExporting}
        isLoading={isLoading}
        onGenerateNextWeek={handleGenerateNextWeek}
        onExportPdf={handleExportPdf}
      />

      <MeetingSelectionBar
        allMeetings={allMeetings}
        selectionMeetings={selectionMeetings}
        activeMeetingId={activeMeeting?.id}
        onSelectMeeting={handleSelectMeeting}
        onOpenArchiveModal={() => setIsArchivModalOpen(true)}
      />

      {!activeMeeting && !isLoading ? (
        <div className="p-12 text-center bg-[#10192c]/80 border border-slate-800 rounded-xl space-y-3 shadow-lg backdrop-blur">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-white">
            No weekly meetings available
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Get started by generating your first weekly team sync meeting
            template.
          </p>
          <div className="pt-2">
            <button
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
              onClick={handleGenerateNextWeek}
            >
              Generate First Meeting
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <WeeklySummaryCard
            activeMeeting={activeMeeting}
            weeklySummaryInput={weeklySummaryInput}
            onWeeklySummaryInputChange={setWeeklySummaryInput}
            onSaveWeeklySummary={handleSaveWeeklySummary}
          />

          <DailyLogSection
            activeMeeting={activeMeeting}
            selectedDayDate={selectedDayDate}
            onSelectDay={handleSelectDay}
            daySummaryInput={daySummaryInput}
            onDaySummaryInputChange={setDaySummaryInput}
            onSaveDaySummary={handleSaveDaySummary}
            activeDayIndex={activeDayIndex}
            activeDaySummary={activeDaySummary}
            newTaskInput={newTaskInput}
            onNewTaskInputChange={setNewTaskInput}
            onAddTask={handleAddTask}
          />
        </div>
      )}

      <MeetingArchiveModal
        isOpen={isArchivModalOpen}
        onClose={() => setIsArchivModalOpen(false)}
        allMeetingsCount={allMeetings.length}
        archiveSearch={archiveSearch}
        onArchiveSearchChange={setArchiveSearch}
        archivedMeetings={archivedMeetings}
        activeMeetingId={activeMeeting?.id}
        onSelectMeeting={handleSelectMeeting}
      />
    </div>
  );
};
