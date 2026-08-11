import React from "react";
import { Clock } from "lucide-react";
import { useTickets } from "../../context/TicketContext.tsx";
import { useTime } from "../../context/TimeContext.tsx";

export const HeaderStats: React.FC = () => {
  const { openTickets } = useTickets();
  const { todayTotal } = useTime();

  return (
    <div className="hidden sm:flex items-center space-x-3 text-xs">
      <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
        <span className="text-slate-400 font-medium">Open:</span>
        <span className="font-extrabold text-white">{openTickets}</span>
      </div>

      <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center space-x-2">
        <Clock className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-slate-400 font-medium">Today:</span>
        <span className="font-extrabold text-blue-400">
          {todayTotal.hours}h {todayTotal.minutes}m
        </span>
      </div>
    </div>
  );
};
