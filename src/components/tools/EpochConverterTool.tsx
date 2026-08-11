import React, { useState } from "react";
import { Clock, RefreshCw } from "lucide-react";

export const EpochConverterTool: React.FC = () => {
  const [epochInput, setEpochInput] = useState<string>(() =>
    Date.now().toString(),
  );
  const [dateInput, setDateInput] = useState<string>(() =>
    new Date().toISOString().slice(0, 16),
  );

  const parsedDate = (() => {
    if (!epochInput.trim()) return null;
    const num = Number(epochInput.trim());
    if (isNaN(num)) return null;
    const ms = num < 10000000000 ? num * 1000 : num;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  })();

  const setNow = () => {
    const now = Date.now();
    setEpochInput(now.toString());
    setDateInput(new Date(now).toISOString().slice(0, 16));
  };

  const handleDateChange = (val: string) => {
    setDateInput(val);
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      setEpochInput(d.getTime().toString());
    }
  };

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">
            Epoch / Unix Timestamp Converter
          </h2>
        </div>

        <button
          type="button"
          onClick={setNow}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b111e] hover:bg-slate-800 text-cyan-400 border border-slate-800 rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Current Timestamp</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Epoch Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400">
            Epoch Timestamp (Seconds or Milliseconds)
          </label>
          <input
            type="text"
            value={epochInput}
            onChange={(e) => setEpochInput(e.target.value)}
            placeholder="1770984000000"
            className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-400">
            Human Readable Date Input
          </label>
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full bg-[#0b111e] border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none focus:border-cyan-500 transition cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0b111e] space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block font-sans">
            ISO 8601
          </span>
          <span className="font-mono text-xs text-cyan-300 break-all select-all">
            {parsedDate ? parsedDate.toISOString() : "Invalid Date"}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0b111e] space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block font-sans">
            UTC Format
          </span>
          <span className="font-mono text-xs text-slate-200 break-all select-all">
            {parsedDate ? parsedDate.toUTCString() : "Invalid Date"}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0b111e] space-y-1">
          <span className="text-[11px] font-bold text-slate-400 block font-sans">
            Local Time
          </span>
          <span className="font-mono text-xs text-slate-200 break-all select-all">
            {parsedDate ? parsedDate.toString() : "Invalid Date"}
          </span>
        </div>
      </div>
    </div>
  );
};
