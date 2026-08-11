import React from "react";
import { Link } from "react-router-dom";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Ticket,
} from "lucide-react";
import { useTickets } from "../../context/TicketContext.tsx";
import { useTime } from "../../context/TimeContext.tsx";

interface QuickStatsGridProps {
  onOpenTimeLogModal: () => void;
}

// Berechnet die Farbe basierend auf Wochentag und erreichter Wochenarbeitszeit
const getProgressColor = (loggedHours: number): string => {
  const day = new Date().getDay(); // 0 = So, 1 = Mo, ..., 5 = Fr, 6 = Sa

  // Zielstunden pro Tag (Mo: 8h, Di: 16h, Mi: 24h, Do: 32h, Fr-So: 40h)
  let targetHours = 40;
  if (day === 1) targetHours = 8;
  else if (day === 2) targetHours = 16;
  else if (day === 3) targetHours = 24;
  else if (day === 4) targetHours = 32;

  // Schwellenwerte relativ zum Tagesziel
  if (loggedHours < targetHours - 2) {
    return "bg-rose-500 shadow-rose-500/50";
  }
  if (loggedHours < targetHours) {
    return "bg-amber-400 shadow-amber-400/50";
  }
  if (loggedHours <= targetHours + 1) {
    return "bg-emerald-500 shadow-emerald-500/50";
  }
  return "bg-purple-500 shadow-purple-500/50";
};

export const QuickStatsGrid: React.FC<QuickStatsGridProps> = ({
  onOpenTimeLogModal,
}) => {
  const { todayTotal, weeklyTotal } = useTime();
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

  // Wochenarbeitszeit & verbleibende Zeit berechnen
  const weekHours = weeklyTotal?.hours || 0;
  const weekMinutes = weeklyTotal?.minutes || 0;
  const totalLoggedMinutes = weekHours * 60 + weekMinutes;
  const targetMinutes = 40 * 60; // 2400 Minuten (40h)

  const remainingMinutesTotal = targetMinutes - totalLoggedMinutes;
  const hasReachedTarget = remainingMinutesTotal <= 0;

  const remainingHours = Math.max(0, Math.floor(remainingMinutesTotal / 60));
  const remainingMinutes = Math.max(0, remainingMinutesTotal % 60);

  // Überstunden berechnen falls Ziel überschritten
  const overtimeMinutesTotal = Math.abs(remainingMinutesTotal);
  const overtimeHours = Math.floor(overtimeMinutesTotal / 60);
  const overtimeMinutes = overtimeMinutesTotal % 60;

  const weeklyDecimal = weekHours + weekMinutes / 60;
  const weeklyProgress = Math.min(100, Math.round((weeklyDecimal / 40) * 100));
  const progressBarColor = getProgressColor(weeklyDecimal);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Gesamte Karte fungiert als interaktiver Link zur Ticket-Seite */}
      <Link
        to="/redmine"
        className="md:col-span-2 bg-gradient-to-br from-blue-900 via-slate-900 to-slate-900 text-white p-6 rounded-xl border border-blue-800/60 shadow-md relative overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-blue-500 hover:shadow-lg hover:from-blue-900/90 group cursor-pointer"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
              Number of Open Tickets
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/30 text-blue-300 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-600/40 transition-all">
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
        </div>
      </Link>

      {/* Zeiterfassungs-Karte mit Tages-, Wochen- & verbleibender Arbeitszeit */}
      <button
        type="button"
        onClick={onOpenTimeLogModal}
        className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm hover:border-blue-500/50 hover:bg-slate-800/60 transition-all flex flex-col justify-between text-left group cursor-pointer w-full"
      >
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
            Working Time Overview
          </span>
          <div className="w-10 h-10 rounded-lg bg-blue-950/60 text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="my-4 space-y-3">
          {/* Heute geloggt */}
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl md:text-3xl font-extrabold text-blue-400">
                {todayTotal.hours}h {todayTotal.minutes}m
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Today
              </span>
            </div>
          </div>

          {/* Woche / Gesamt geloggt mit Fortschrittsbalken und verbleibender Zeit */}
          <div className="pt-2 border-t border-slate-800/70 space-y-2">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-slate-400">This Week:</span>
              <span className="font-extrabold text-white">
                {weekHours}h {weekMinutes}m{" "}
                <span className="text-slate-400 font-normal">/ 40h</span>
              </span>
            </div>

            {/* Fortschrittsbalken */}
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-500 rounded-full shadow-xs ${progressBarColor}`}
                style={{ width: `${weeklyProgress}%` }}
              />
            </div>

            {/* Verbleibende Arbeitszeit unter dem Balken */}
            <div className="flex items-center justify-between text-[11px] pt-0.5">
              <span className="text-slate-400">Remaining:</span>
              {hasReachedTarget ? (
                <span className="font-bold text-emerald-400 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>
                    Goal reached{" "}
                    {overtimeMinutesTotal > 0 &&
                      `(+${overtimeHours}h ${overtimeMinutes}m)`}
                  </span>
                </span>
              ) : (
                <span className="font-semibold text-amber-300">
                  {remainingHours}h {remainingMinutes}m left
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="text-xs text-blue-400 font-semibold flex items-center space-x-1 pt-3 border-t border-slate-800 w-full">
          <span>Log Working Time</span>
          <Clock className="w-3.5 h-3.5" />
        </div>
      </button>
    </div>
  );
};
