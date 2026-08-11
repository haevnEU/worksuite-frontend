import React from "react";
import { Ticket } from "lucide-react";

interface TicketHeaderProps {
  openTicketsCount: number;
  totalTicketsCount: number;
}

export const TicketHeader: React.FC<TicketHeaderProps> = ({
  openTicketsCount,
  totalTicketsCount,
}) => {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
          <Ticket className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-black text-white tracking-tight">
              Redmine Ticket Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-950 text-blue-300 border border-blue-800">
              Live Redmine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            All current tickets in an interactive, sortable overview
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 text-xs bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
        <span className="text-slate-400 font-medium">Open Tickets:</span>
        <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-xs shadow-xs">
          {openTicketsCount}
        </span>
        <span className="text-slate-600">|</span>
        <span className="text-slate-400 font-medium">Total:</span>
        <span className="font-bold text-white">{totalTicketsCount}</span>
      </div>
    </div>
  );
};
