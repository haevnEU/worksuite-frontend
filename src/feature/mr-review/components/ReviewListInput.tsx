import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface ReviewListInputProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  placeholder: string;
  badgeColorClass?: string;
  onAddItem: (item: string) => void;
  onRemoveItem: (index: number) => void;
}

export const ReviewListInput: React.FC<ReviewListInputProps> = ({
  title,
  icon,
  items,
  placeholder,
  badgeColorClass = "text-blue-400",
  onAddItem,
  onRemoveItem,
}) => {
  const [currentInput, setCurrentInput] = useState("");

  const handleAdd = () => {
    if (!currentInput.trim()) return;
    onAddItem(currentInput.trim());
    setCurrentInput("");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-bold text-white">{title}</h2>
        </div>
        <span className={`text-[11px] font-mono font-bold ${badgeColorClass}`}>
          {items.length} Einträge
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-[#0b111e] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!currentInput.trim()}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Hinzufügen</span>
        </button>
      </div>

      {items.length > 0 && (
        <ul className="space-y-1.5 pt-1">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex items-center justify-between gap-2 p-2 bg-[#0b111e] border border-slate-800 rounded-xl text-xs text-slate-300"
            >
              <span className="break-all">{item}</span>
              <button
                type="button"
                onClick={() => onRemoveItem(index)}
                className="text-slate-500 hover:text-rose-400 p-1 transition cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
