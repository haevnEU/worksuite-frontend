import React, { useEffect, useState } from "react";
import { Edit2, Timer } from "lucide-react";

export const HeaderTargetTimer: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());
  const [targetTime, setTargetTime] = useState<string>(() => {
    return localStorage.getItem("header_target_time") || "17:00";
  });
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleTargetTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTargetTime(val);
    localStorage.setItem("header_target_time", val);
  };

  const getRemainingTimeStr = (): string => {
    if (!targetTime) return "--:--";
    const [targetHours, targetMinutes] = targetTime.split(":").map(Number);
    const targetDate = new Date(now);
    targetDate.setHours(targetHours, targetMinutes, 0, 0);
    const diffMs = targetDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      return "Reached";
    }

    const totalMin = Math.floor(diffMs / (1000 * 60));
    const hrs = Math.floor(totalMin / 60);
    const mins = totalMin % 60;

    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="hidden xl:flex items-center space-x-2 text-xs bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl text-slate-300">
      <Timer className="w-3.5 h-3.5 text-emerald-400" />
      <span className="text-slate-400 font-medium">Target:</span>

      {isEditingTarget ? (
        <input
          type="time"
          value={targetTime}
          onChange={handleTargetTimeChange}
          onBlur={() => setIsEditingTarget(false)}
          autoFocus
          className="bg-slate-950 border border-slate-700 text-white font-mono text-xs rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      ) : (
        <button
          onClick={() => setIsEditingTarget(true)}
          className="font-mono font-bold text-white hover:text-blue-400 flex items-center space-x-1 cursor-pointer"
          title="Click to change target time"
        >
          <span>{targetTime}</span>
          <Edit2 className="w-2.5 h-2.5 text-slate-500" />
        </button>
      )}

      <span className="text-slate-600">•</span>
      <span className="text-slate-400 font-medium">Left:</span>
      <span className="font-mono font-bold text-emerald-400">
        {getRemainingTimeStr()}
      </span>
    </div>
  );
};
