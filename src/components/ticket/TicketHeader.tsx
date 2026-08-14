import React from "react";
import { Ticket } from "lucide-react";

interface TicketHeaderProps {
  openTicketsCount: number;
  totalTicketsCount: number;
}

const TicketHeader: React.FC<TicketHeaderProps> = ({
  openTicketsCount,
  totalTicketsCount,
}) => {
  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur shadow-lg shrink-0">
      {/* Linke Seite: Icon, Titel, Badge & Subtitle */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
          <Ticket className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-wide">
              Redmine Ticket Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Live Redmine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            All current tickets in an interactive, sortable overview
          </p>
        </div>
      </div>

      {/* Rechte Seite: Combined Open & Total Count Pill */}
      <div className="flex items-center gap-3 self-start md:self-center shrink-0">
        <div className="flex items-center gap-3 bg-[#0b111e] border border-slate-800 px-4 py-2 rounded-xl text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Open Tickets:</span>
            <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full text-[11px]">
              {openTicketsCount}
            </span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Total:</span>
            <span className="font-bold text-white text-[11px]">
              {totalTicketsCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
