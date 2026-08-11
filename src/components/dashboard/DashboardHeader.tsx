import React from "react";
import { Calendar, Server } from "lucide-react";
import { useSettings } from "../../context/SettingsContext.tsx";
import { useTickets } from "../../context/TicketContext.tsx";

// TODO Move to utils
const formatDateFormatted = (date: Date): string => {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${weekday} ${day} ${month} ${year}`;
};

interface DashboardHeaderProps {}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({}) => {
  const { user } = useSettings();
  const { openTickets } = useTickets();

  return (
    <div className="bg-slate-900 text-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-white">
        <Server style={{ width: "260px", height: "260px" }} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDateFormatted(new Date())}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.firstName} {user.lastName}!
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Overview of your development processes. Currently there are{" "}
            <span className="text-blue-400 font-extrabold">
              {openTickets} open tickets
            </span>{" "}
            registered in the Redmine system.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0"></div>
      </div>
    </div>
  );
};
