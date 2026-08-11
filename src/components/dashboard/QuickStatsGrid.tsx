import React from "react";
import { Link } from "react-router-dom";
import { AlertOctagon, AlertTriangle, Clock, Ticket } from "lucide-react";
import { useTickets } from "../../context/TicketContext.tsx";
import { useTime } from "../../context/TimeContext.tsx";

interface QuickStatsGridProps {
  onOpenTimeLogModal: () => void;
}

export const QuickStatsGrid: React.FC<QuickStatsGridProps> = ({
  onOpenTimeLogModal,
}) => {
  const { todayTotal } = useTime();
  const { tickets, getAmountStatus, getAmountPriority } = useTickets();

  const totalOpenTickets =
    getAmountStatus("Open") +
    getAmountStatus("In Progress") +
    getAmountStatus("Sprint Backlog") +
    getAmountStatus("Refinement") +
    getAmountStatus("In Review");

  const immediatePriorityCount =
    getAmountPriority("Immediate") + getAmountPriority("Urgent");
  const urgentPriorityCount = getAmountPriority("High");
  const normalPriorityCount = getAmountPriority("Normal");
  const lowPriorityCount = getAmountPriority("Low");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-900 text-white p-6 rounded-xl border border-blue-800/60 shadow-md relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white">
              Number of Open Tickets
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/30 text-blue-300 flex items-center justify-center">
            <Ticket className="w-7 h-7" />
          </div>
        </div>

        <div className="my-6 flex items-baseline space-x-4">
          <span className="text-5xl md:text-6xl font-black text-white tracking-tight">
            {totalOpenTickets}
          </span>
          <div className="text-sm text-slate-300">
            <span className="font-bold text-white">open tickets</span>
            <span className="block text-xs text-slate-400">
              out of {tickets.length} total registered issues
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {immediatePriorityCount > 0 && (
              <span className="flex items-center space-x-1 text-red-400 font-bold bg-red-950/60 border border-red-800/60 px-2 py-0.5 rounded">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>{immediatePriorityCount} Immediate / Urgent</span>
              </span>
            )}

            <span className="flex items-center space-x-1 text-amber-300 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{urgentPriorityCount} High</span>
            </span>

            <span className="flex items-center space-x-1 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>{normalPriorityCount} Normal</span>
            </span>

            <span className="flex items-center space-x-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              <span>{lowPriorityCount} Low</span>
            </span>
          </div>

          <Link
            to="/redmine"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg text-sm flex items-center space-x-2 shadow-xs transition-colors cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>Open Tickets Page</span>
          </Link>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenTimeLogModal}
        className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm hover:border-blue-500/50 transition-all flex flex-col justify-between text-left group cursor-pointer w-full"
      >
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Hours Logged Today
          </span>
          <div className="w-10 h-10 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="my-4">
          <span className="text-3xl font-extrabold text-blue-400">
            {todayTotal.hours}h {todayTotal.minutes}m
          </span>
          <span className="text-xs text-slate-400 block mt-1">
            Logged working time for today
          </span>
        </div>

        <div className="text-xs text-blue-400 font-semibold flex items-center space-x-1 pt-3 border-t border-slate-800 w-full">
          <span>Log Working Time</span>
          <Clock className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
