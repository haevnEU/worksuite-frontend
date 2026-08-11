// TODO Split into multiple components

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Archive,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  ListTodo,
  Plus,
  RefreshCw,
  Save,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  DaySummaryDTO,
  WeeklyMeetingDTO,
} from "../models/weeklyMeeting.model.ts";
import { weeklyMeetingService } from "../services/network/weeklyMeeting.service.ts";

export const WeeklyMeetingPage: React.FC = () => {
  const [allMeetings, setAllMeetings] = useState<WeeklyMeetingDTO[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(
    null,
  );
  const [selectedDayDate, setSelectedDayDate] = useState<string>("");

  const [weeklySummaryInput, setWeeklySummaryInput] = useState("");
  const [daySummaryInput, setDaySummaryInput] = useState("");
  const [newTaskInput, setNewTaskInput] = useState("");
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveSearch, setArchiveSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const isWeekend = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const dayOfWeek = date.getUTCDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const formatDayLabel = (
    dateStr: string,
    index: number,
    totalDays: number,
  ): string => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const dayName = date.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });

    if (index === totalDays - 1 && dayName === "Tuesday" && totalDays > 1) {
      return "Tuesday (Next Week)";
    }

    return dayName;
  };

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
    try {
      const created = await weeklyMeetingService.generateNextWeek();
      await loadMeetings(created.id);
    } catch (err) {
      console.error("Error generating week:", err);
    } finally {
      setIsGenerating(false);
    }
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
    await weeklyMeetingService.exportPdf(activeMeeting.id);
    setIsExporting(false);
  };

  return (
    <div className="space-y-6 pb-16 font-sans w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
            <Calendar className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              {activeMeeting
                ? activeMeeting.title
                : "Team Meeting & Tuesday Preparation"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeMeeting
                ? `Created on ${activeMeeting.createdAt.split("T")[0]}`
                : "No active meeting loaded"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            disabled={isGenerating || isLoading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl transition-colors text-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            onClick={handleGenerateNextWeek}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-blue-400 ${isGenerating ? "animate-spin" : ""}`}
            />
            <span>{isGenerating ? "Generating..." : "Generate Week"}</span>
          </button>

          <button
            type="button"
            disabled={!activeMeeting || isExporting || isLoading}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl transition-colors text-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            onClick={handleExportPdf}
          >
            <Download
              className={`w-3.5 h-3.5 text-slate-400 ${isExporting ? "animate-bounce" : ""}`}
            />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="space-y-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xs">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Meeting
            </span>
          </div>
          <button
            type="button"
            className="text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-blue-400 rounded-lg flex items-center space-x-1.5 border border-slate-700 transition-colors cursor-pointer"
            onClick={() => setIsArchiveModalOpen(true)}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Meeting Archive ({allMeetings.length})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {selectionMeetings.map((w, index) => {
            const isActive = activeMeeting?.id === w.id;
            let badgeLabel = "Last Meeting";
            if (index === 0) badgeLabel = "Current Weekly";
            else if (index === 1) badgeLabel = "Previous Week";
            else if (index === 2) badgeLabel = "2 Weeks Ago";
            else if (index === 3) badgeLabel = "3 Weeks Ago";

            return (
              <button
                key={w.id}
                type="button"
                onClick={() => handleSelectMeeting(w.id)}
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
                    className={`text-xs font-bold truncate ${isActive ? "text-white" : "text-slate-200"}`}
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
            type="button"
            className="p-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 hover:bg-slate-800/80 hover:border-blue-500/50 text-slate-300 text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer"
            onClick={() => setIsArchiveModalOpen(true)}
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

      {!activeMeeting && !isLoading ? (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <p className="text-sm text-slate-400">
            No weekly meetings available.
          </p>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl transition-colors cursor-pointer"
            onClick={handleGenerateNextWeek}
          >
            Generate First Meeting
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Weekly Overall Summary
                </h2>
              </div>
              {activeMeeting && (
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950/60 text-blue-400 border border-blue-800/60 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {activeMeeting.createdAt.split("T")[0]}
                </span>
              )}
            </div>

            <form onSubmit={handleSaveWeeklySummary} className="space-y-3">
              <textarea
                rows={3}
                value={weeklySummaryInput}
                placeholder="Enter high-level summary and key topics for this week..."
                className="w-full bg-slate-800/50 border border-slate-700/60 text-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-xs resize-none"
                onChange={(e) => setWeeklySummaryInput(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!activeMeeting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors text-xs flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                  Daily Log
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                Tuesday – Tuesday (Working Days)
              </span>
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
              {activeMeeting?.daySummaries?.map((dayObj, idx) => {
                const isActive = selectedDayDate === dayObj.date;
                const dayLabel = formatDayLabel(
                  dayObj.date,
                  idx,
                  activeMeeting.daySummaries.length,
                );

                return (
                  <button
                    key={dayObj.date}
                    type="button"
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer border flex flex-col items-center min-w-[110px] ${
                      isActive
                        ? "bg-emerald-600/10 border-emerald-500/50 text-emerald-300"
                        : "bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                    }`}
                    onClick={() => handleSelectDay(dayObj.date)}
                  >
                    <span>{dayLabel}</span>
                    <span className="text-[10px] opacity-60 font-normal mt-0.5">
                      {dayObj.date.split("T")[0]}
                    </span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSaveDaySummary} className="space-y-3 pt-1">
              <div className="text-xs space-y-1.5">
                <label className="block font-medium text-slate-300">
                  Note for{" "}
                  {selectedDayDate
                    ? formatDayLabel(
                        selectedDayDate,
                        activeDayIndex,
                        activeMeeting?.daySummaries?.length || 0,
                      )
                    : "Selected Day"}{" "}
                  ({selectedDayDate ? selectedDayDate.split("T")[0] : ""})
                </label>
                <textarea
                  rows={3}
                  value={daySummaryInput}
                  placeholder="Enter progress, daily outcomes, and notes..."
                  className="w-full bg-slate-800/50 border border-slate-700/60 text-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 text-xs resize-none"
                  onChange={(e) => setDaySummaryInput(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!selectedDayDate}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-colors text-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Daily Note</span>
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <div className="flex items-center space-x-2">
                <ListTodo className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Tasks ({activeDaySummary?.tasks?.length || 0})
                </h3>
              </div>
              <form
                onSubmit={handleAddTask}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={newTaskInput}
                  className="flex-1 bg-slate-800/50 border border-slate-700/60 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30 placeholder:text-slate-500"
                  placeholder="Add a new task for this day..."
                  onChange={(e) => setNewTaskInput(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!selectedDayDate || !newTaskInput.trim()}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-colors text-xs flex items-center space-x-1.5 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>

              <div className="space-y-1.5 pt-1">
                {activeDaySummary?.tasks &&
                activeDaySummary.tasks.length > 0 ? (
                  activeDaySummary.tasks.map((taskText, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-800/30 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300"
                    >
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>{taskText}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No tasks created for this day.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-slate-900 w-full max-w-3xl max-h-[85vh] rounded-2xl p-6 border border-slate-800 shadow-2xl flex flex-col space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
                  <Archive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    All Weekly Meetings Archive ({allMeetings.length})
                  </h3>
                  <p className="text-slate-400 text-xs">
                    Overview and search for all past weeks and reports
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
                onClick={() => setIsArchiveModalOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={archiveSearch}
                placeholder="Search archive..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setArchiveSearch(e.target.value)}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {archivedMeetings.map((w) => {
                const isActive = activeMeeting?.id === w.id;
                const filteredNotesCount = w.daySummaries
                  ? w.daySummaries.filter((d) => !isWeekend(d.date)).length
                  : 0;

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
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/30">
                          {w.createdAt.split("T")[0]}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            Currently Active
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {w.title}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {w.summary || "No summary entered."}
                      </p>
                      <span className="text-[10px] text-slate-500 block">
                        📝 {filteredNotesCount} daily logs available
                      </span>
                    </div>

                    <div className="shrink-0">
                      <button
                        type="button"
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                          isActive
                            ? "bg-emerald-600 text-white hover:bg-emerald-500"
                            : "bg-blue-600 text-white hover:bg-blue-500"
                        }`}
                        onClick={() => {
                          handleSelectMeeting(w.id);
                          setIsArchiveModalOpen(false);
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
                  No meetings found in archive.
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsArchiveModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
