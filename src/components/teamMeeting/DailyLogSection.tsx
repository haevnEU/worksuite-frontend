import React from "react";
import { CheckCircle2, FileText, ListTodo, Plus, Save } from "lucide-react";
import {
  DaySummaryDTO,
  WeeklyMeetingDTO,
} from "../../models/weeklyMeeting.model.ts";
import { formatDayLabel } from "../../utils/teamMeeting.util.ts";

interface DailyLogSectionProps {
  activeMeeting: WeeklyMeetingDTO | null;
  selectedDayDate: string;
  onSelectDay: (date: string) => void;
  daySummaryInput: string;
  onDaySummaryInputChange: (value: string) => void;
  onSaveDaySummary: (e: React.FormEvent) => void;
  activeDayIndex: number;
  activeDaySummary?: DaySummaryDTO;
  newTaskInput: string;
  onNewTaskInputChange: (value: string) => void;
  onAddTask: (e: React.FormEvent) => void;
}

export const DailyLogSection: React.FC<DailyLogSectionProps> = ({
  activeMeeting,
  selectedDayDate,
  onSelectDay,
  daySummaryInput,
  onDaySummaryInputChange,
  onSaveDaySummary,
  activeDayIndex,
  activeDaySummary,
  newTaskInput,
  onNewTaskInputChange,
  onAddTask,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xs space-y-5 font-sans">
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
              onClick={() => onSelectDay(dayObj.date)}
            >
              <span>{dayLabel}</span>
              <span className="text-[10px] opacity-60 font-normal mt-0.5">
                {dayObj.date.split("T")[0]}
              </span>
            </button>
          );
        })}
      </div>

      <form onSubmit={onSaveDaySummary} className="space-y-3 pt-1">
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
            onChange={(e) => onDaySummaryInputChange(e.target.value)}
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
        <form onSubmit={onAddTask} className="flex items-center space-x-2">
          <input
            type="text"
            value={newTaskInput}
            className="flex-1 bg-slate-800/50 border border-slate-700/60 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/30 placeholder:text-slate-500"
            placeholder="Add a new task for this day..."
            onChange={(e) => onNewTaskInputChange(e.target.value)}
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
          {activeDaySummary?.tasks && activeDaySummary.tasks.length > 0 ? (
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
  );
};
