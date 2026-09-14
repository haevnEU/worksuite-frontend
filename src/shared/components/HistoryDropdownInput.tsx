import React, { useState } from "react";
import { Check, Clock, History, X } from "lucide-react";

interface HistoryDropdownInputProps {
  value: string;
  onChange: (val: string) => void;
  onSelectHistory: (val: string) => void;
  onClearHistory: () => void;
  history: string[];
  placeholder?: string;
  historyTitle?: string;
  icon?: React.ReactNode;
  activeColorClass?: string;
}

export const HistoryDropdownInput: React.FC<HistoryDropdownInputProps> = ({
  value,
  onChange,
  onSelectHistory,
  onClearHistory,
  history,
  placeholder = "Search...",
  historyTitle = "Recent Items",
  icon,
  activeColorClass = "text-rose-400 focus:border-rose-500",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative flex-1">
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (history.length > 0) setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) {
              onSelectHistory(value.trim());
              setIsOpen(false);
            }
          }}
          placeholder={placeholder}
          className={`w-full bg-[#0b111e] border border-slate-800 rounded-xl ${
            icon ? "pl-9" : "pl-3"
          } pr-14 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono transition ${activeColorClass}`}
        />

        <div className="absolute right-2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}

          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className={`p-1 rounded text-slate-400 hover:text-slate-200 transition cursor-pointer ${
                isOpen ? "bg-slate-800 text-slate-200" : ""
              }`}
              title={historyTitle}
            >
              <History className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {isOpen && history.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#0b111e] border border-slate-800 rounded-xl shadow-2xl z-30 overflow-hidden text-xs animate-in fade-in duration-100">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#10192c] border-b border-slate-800 text-[11px] font-semibold text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {historyTitle}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearHistory();
                  setIsOpen(false);
                }}
                className="text-slate-500 hover:text-rose-400 transition cursor-pointer"
              >
                Clear
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/40 font-mono">
              {history.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    onSelectHistory(item);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-2 flex items-center justify-between cursor-pointer transition hover:bg-slate-800/60 ${
                    value === item
                      ? "bg-slate-800/60 text-white font-semibold"
                      : "text-slate-300"
                  }`}
                >
                  <span className="truncate">{item}</span>
                  {value === item && (
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
