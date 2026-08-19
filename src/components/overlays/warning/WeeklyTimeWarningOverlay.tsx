import React, { useEffect, useState } from "react";
import { AlertTriangle, BellOff, Check, Clock, Timer, X } from "lucide-react";
import { useTime } from "../../../context/TimeContext.tsx";
interface WeeklyTimeWarningOverlayProps {
  onOpenTimeLogModal?: () => void;
}

const STORAGE_KEYS = {
  DISMISSED_DATE: "weekly_time_warning_dismissed_date",
  SNOOZE_UNTIL: "weekly_time_warning_snooze_until",
};

export const WeeklyTimeWarningOverlay: React.FC<
  WeeklyTimeWarningOverlayProps
> = ({ onOpenTimeLogModal }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { weeklyTotal } = useTime();

  const totalHoursLogged = weeklyTotal?.hours || 0;
  const totalMinutesLogged = weeklyTotal?.minutes || 0;

  const decimalHours = totalHoursLogged + totalMinutesLogged / 60;
  const targetHours = 40;
  const missingHours = Math.max(0, targetHours - decimalHours);

  useEffect(() => {
    const checkAndShowOverlay = () => {
      const now = new Date();
      const isFriday = now.getDay() === 5;
      const isAfterNoon = now.getHours() >= 12;

      if (!isFriday || !isAfterNoon || decimalHours >= targetHours) {
        setIsVisible(false);
        return;
      }

      const todayDateString = now.toDateString();
      const dismissedDate = localStorage.getItem(STORAGE_KEYS.DISMISSED_DATE);
      if (dismissedDate === todayDateString) {
        setIsVisible(false);
        return;
      }

      // Prüfen, ob ein aktiver Snooze vorliegt
      const snoozeUntil = localStorage.getItem(STORAGE_KEYS.SNOOZE_UNTIL);
      if (snoozeUntil && Date.now() < Number(snoozeUntil)) {
        setIsVisible(false);
        return;
      }

      setIsVisible(true);
    };

    checkAndShowOverlay();

    // Alle 60 Sekunden prüfen (z. B. für Snooze-Ablauf)
    const interval = setInterval(checkAndShowOverlay, 60 * 1000);
    return () => clearInterval(interval);
  }, [decimalHours, targetHours]);

  // Snooze für X Minuten (30 oder 60 Min)
  const handleSnooze = (minutes: number) => {
    const snoozeTimestamp = Date.now() + minutes * 60 * 1000;
    localStorage.setItem(STORAGE_KEYS.SNOOZE_UNTIL, snoozeTimestamp.toString());
    setIsVisible(false);
  };

  // Bestätigung: "Ich weiß Bescheid" (für heute nicht mehr anzeigen)
  const handleAcknowledgeForToday = () => {
    localStorage.setItem(
      STORAGE_KEYS.DISMISSED_DATE,
      new Date().toDateString(),
    );
    localStorage.removeItem(STORAGE_KEYS.SNOOZE_UNTIL);
    setIsVisible(false);
  };

  // Direkt Zeit buchen
  const handleLogTimeClick = () => {
    handleAcknowledgeForToday();
    if (onOpenTimeLogModal) {
      onOpenTimeLogModal();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm font-sans animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-500/30 space-y-5 relative animate-in zoom-in-95 duration-200">
        {/* Close Button oben rechts = Snooze 30m als Default */}
        <button
          onClick={() => handleSnooze(30)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Snooze 30 minutes"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex flex-col items-center text-center space-y-2.5 pt-1">
          <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/5">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-extrabold text-white">
            Missing Weekly Working Hours
          </h2>
          <p className="text-xs text-slate-300 max-w-sm leading-relaxed">
            It is Friday afternoon and you have not reached your weekly target
            of <span className="font-bold text-white">{targetHours} hours</span>{" "}
            yet.
          </p>
        </div>

        {/* Stats Box */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Currently Logged
            </span>
            <div className="text-base font-extrabold text-white flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              <span>
                {totalHoursLogged}h {totalMinutesLogged}m
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Time Remaining
            </span>
            <div className="text-base font-extrabold text-amber-400">
              ~ {Math.ceil(missingHours)}h missing
            </div>
          </div>
        </div>

        {/* Snooze & Bestätigungs-Aktionen */}
        <div className="space-y-3 pt-1">
          {/* Snooze Leiste */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center space-x-1 shrink-0">
              <Timer className="w-3.5 h-3.5 text-slate-400" />
              <span>Remind me in:</span>
            </span>
            <button
              type="button"
              onClick={() => handleSnooze(30)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-semibold hover:text-white transition-all cursor-pointer"
            >
              30 Min
            </button>
            <button
              type="button"
              onClick={() => handleSnooze(60)}
              className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 text-xs font-semibold hover:text-white transition-all cursor-pointer"
            >
              1 Hour
            </button>
          </div>

          {/* Primäre Aktionen */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleAcknowledgeForToday}
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/60 transition-colors cursor-pointer text-xs flex items-center justify-center space-x-1.5"
              title="Acknowledge for the rest of today"
            >
              <Check className="w-3.5 h-3.5 text-slate-400" />
              <span>I know (Dismiss for Today)</span>
            </button>
            <button
              type="button"
              onClick={handleLogTimeClick}
              className="flex-1 py-2.5 px-4 rounded-xl font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all cursor-pointer text-xs flex items-center justify-center space-x-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Log Time Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
