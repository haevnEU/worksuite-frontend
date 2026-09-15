import React, { useEffect, useState } from "react";
import { Clock, Loader2, Save, Sparkles } from "lucide-react";
import { useWeekly } from "../context/WeeklyContext";

export const WeeklySummaryCard: React.FC = () => {
  const { activeMeeting, updateWeeklySummary } = useWeekly();
  const [summaryDraft, setSummaryDraft] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSummaryDraft(activeMeeting?.summary || "");
  }, [activeMeeting?.summary]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMeeting || isSaving) return;

    try {
      setIsSaving(true);
      await updateWeeklySummary(summaryDraft);
    } finally {
      setIsSaving(false);
    }
  };

  return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xs space-y-4 font-sans">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              Weekly Overall Summary
            </h2>
          </div>
          {activeMeeting && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950/60 text-blue-400 border border-blue-800/60 flex items-center font-mono">
            <Clock className="w-3 h-3 mr-1" />
                {activeMeeting.createdAt.split("T")[0]}
          </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-3">
        <textarea
            rows={3}
            value={summaryDraft}
            disabled={!activeMeeting || isSaving}
            placeholder="Enter high-level summary, milestones, and key topics for this week..."
            className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl p-3 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 text-xs resize-none disabled:opacity-50 transition"
            onChange={(e) => setSummaryDraft(e.target.value)}
        />
          <div className="flex justify-end">
            <button
                type="submit"
                disabled={!activeMeeting || isSaving}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-xs flex items-center space-x-2 cursor-pointer shadow-md shadow-blue-600/20"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              <span>{isSaving ? "Saving..." : "Save Summary"}</span>
            </button>
          </div>
        </form>
      </div>
  );
};