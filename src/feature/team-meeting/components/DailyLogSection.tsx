import React, { useEffect, useState } from "react";
import {
    CheckCircle2,
    FileText,
    ListTodo,
    Loader2,
    Plus,
    Save,
} from "lucide-react";
import { useLocalStorageDraft } from "../../../hooks/useLocalStorageDraft.ts";
import { formatDayLabel } from "../utils/weekly.util.ts";
import { useWeekly } from "../context/WeeklyContext";

export const DailyLogSection: React.FC = () => {
    const {
        activeMeeting,
        selectedDayDate,
        activeDaySummary,
        activeDayIndex,
        selectDay,
        saveDaySummary,
        addTaskToDay,
    } = useWeekly();

    const [isSavingNote, setIsSavingNote] = useState(false);
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [taskDraft, setTaskDraft] = useState("");

    const draftKeyNote = `draft_note_${activeMeeting?.id ?? "none"}_${selectedDayDate || "none"}`;
    const [noteDraft, setNoteDraft, clearNoteDraft] = useLocalStorageDraft<string>(
        draftKeyNote,
        activeDaySummary?.summary || "",
    );

    useEffect(() => {
        setNoteDraft(activeDaySummary?.summary || "");
        setTaskDraft("");
    }, [selectedDayDate, activeDaySummary?.summary, setNoteDraft]);

    const handleSaveDaySummary = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedDayDate || isSavingNote) return;

        try {
            setIsSavingNote(true);
            await saveDaySummary(selectedDayDate, noteDraft.trim());
            clearNoteDraft();
        } finally {
            setIsSavingNote(false);
        }
    };

    const handleAddTask = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const task = taskDraft.trim();
        if (!selectedDayDate || !task || isAddingTask) return;

        try {
            setIsAddingTask(true);
            await addTaskToDay(selectedDayDate, task);
            setTaskDraft("");
        } finally {
            setIsAddingTask(false);
        }
    };

    const formattedDateString = selectedDayDate ? selectedDayDate.split("T")[0] : "";
    const totalDays = activeMeeting?.daySummaries?.length || 0;

    return (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xs space-y-5 font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <h2 className="text-xs font-bold text-white uppercase tracking-wider">
                        Daily Log
                    </h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-mono">
          Tuesday – Tuesday (Working Days)
        </span>
            </div>

            {/* Day Selector Buttons */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                {activeMeeting?.daySummaries?.map((dayObj, idx) => {
                    const isActive = selectedDayDate === dayObj.date;
                    const dayLabel = formatDayLabel(dayObj.date, idx, totalDays);
                    const dayString = dayObj.date.split("T")[0];

                    return (
                        <button
                            key={dayObj.date}
                            type="button"
                            onClick={() => selectDay(dayObj.date)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer border flex flex-col items-center min-w-[110px] ${
                                isActive
                                    ? "bg-emerald-600/15 border-emerald-500/60 text-emerald-300 shadow-sm"
                                    : "bg-slate-800/40 border-slate-700/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            }`}
                        >
                            <span>{dayLabel}</span>
                            <span className="text-[10px] opacity-60 font-mono mt-0.5">
                {dayString}
              </span>
                        </button>
                    );
                })}
            </div>

            {/* Daily Notes Input */}
            <form onSubmit={handleSaveDaySummary} className="space-y-3 pt-1">
                <div className="text-xs space-y-1.5">
                    <label className="block font-medium text-slate-300">
                        Note for{" "}
                        <span className="text-emerald-400 font-semibold">
              {selectedDayDate
                  ? formatDayLabel(selectedDayDate, activeDayIndex, totalDays)
                  : "Selected Day"}
            </span>{" "}
                        {formattedDateString && (
                            <span className="text-slate-500 font-mono">
                ({formattedDateString})
              </span>
                        )}
                    </label>
                    <textarea
                        rows={3}
                        value={noteDraft}
                        onChange={(e) => setNoteDraft(e.target.value)}
                        disabled={!selectedDayDate || isSavingNote}
                        placeholder={
                            selectedDayDate
                                ? "Enter progress, daily outcomes, blockers, and notes..."
                                : "Select a day first to enter daily notes."
                        }
                        className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 text-xs resize-none disabled:opacity-50 transition"
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={!selectedDayDate || isSavingNote}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-xs flex items-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                    >
                        {isSavingNote ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        <span>{isSavingNote ? "Saving..." : "Save Daily Note"}</span>
                    </button>
                </div>
            </form>

            {/* Daily Tasks Checklist */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center space-x-2">
                    <ListTodo className="w-4 h-4 text-purple-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Tasks ({activeDaySummary?.tasks?.length || 0})
                    </h3>
                </div>

                <form onSubmit={handleAddTask} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={taskDraft}
                        onChange={(e) => setTaskDraft(e.target.value)}
                        disabled={!selectedDayDate || isAddingTask}
                        className="flex-1 bg-[#0b111e] border border-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 placeholder:text-slate-600 disabled:opacity-50 transition"
                        placeholder={
                            selectedDayDate
                                ? "Add a new task or checklist item for this day..."
                                : "Select a day first..."
                        }
                    />
                    <button
                        type="submit"
                        disabled={!selectedDayDate || !taskDraft.trim() || isAddingTask}
                        className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-xs flex items-center space-x-1.5 cursor-pointer shrink-0 shadow-md shadow-purple-600/20"
                    >
                        {isAddingTask ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <Plus className="w-3.5 h-3.5" />
                        )}
                        <span>Add</span>
                    </button>
                </form>

                <div className="space-y-1.5 pt-1">
                    {activeDaySummary?.tasks && activeDaySummary.tasks.length > 0 ? (
                        activeDaySummary.tasks.map((taskText, idx) => (
                            <div
                                key={`${selectedDayDate}-task-${idx}`}
                                className="p-2.5 bg-[#0b111e] border border-slate-800/80 rounded-xl flex items-center justify-between text-xs text-slate-300"
                            >
                                <div className="flex items-center space-x-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                                    <span>{taskText}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                            No tasks logged for this day yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};