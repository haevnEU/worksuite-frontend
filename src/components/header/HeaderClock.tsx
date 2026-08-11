import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export const HeaderClock: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const formattedTime = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <div className="hidden md:flex items-center space-x-2 text-xs bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl text-slate-300">
      <Clock className="w-3.5 h-3.5 text-blue-400" />
      <span className="font-medium text-slate-400">{formattedDate}</span>
      <span className="text-slate-600">•</span>
      <span className="font-mono font-bold text-white">{formattedTime}</span>
    </div>
  );
};
