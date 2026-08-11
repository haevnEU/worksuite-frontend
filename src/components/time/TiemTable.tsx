import React from "react";
import { TimeDTO } from "../../models/timeEntry.model.ts";
import { useInfo } from "../../context/InfoContext.tsx";

interface TimeTableProps {
  entries: TimeDTO[];
  totalCount: number;
  isLoading: boolean;
}

export const TimeTable: React.FC<TimeTableProps> = ({
  entries,
  totalCount,
  isLoading,
}) => {
  const { redmineActivity } = useInfo();

  return (
    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col min-h-0">
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider z-10">
            <tr>
              <th className="py-3 px-4">Ticket</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Activity</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-right">Logged At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  Loading time entries...
                </td>
              </tr>
            ) : entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  No time entries found matching your filters.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-blue-400 bg-blue-950/60 border border-blue-800/60 px-2 py-0.5 rounded">
                      #{entry.ticketId}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-300">
                    {new Date(entry.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-slate-100 bg-slate-800 px-2 py-0.5 rounded border border-slate-700/50">
                      {entry.hours}h {entry.minutes}m
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {redmineActivity.find((a) => a.id === entry.activityId)
                        ?.name || `Activity #${entry.activityId}`}
                    </span>
                  </td>

                  <td
                    className="py-3 px-4 text-slate-300 max-w-xs truncate"
                    title={entry.description}
                  >
                    {entry.description || (
                      <span className="italic text-slate-600">No comment</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right font-mono text-[10px] text-slate-500">
                    {new Date(entry.createdAt).toLocaleDateString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-slate-500 text-[11px] shrink-0">
        <span>
          Showing {entries.length} of {totalCount} entries
        </span>
      </div>
    </div>
  );
};
