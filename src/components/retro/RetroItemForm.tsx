import React from "react";
import { Plus } from "lucide-react";
import { CategoryType } from "../../types/retro.type.ts";

interface RetroItemFormProps {
  sprintName?: string;
  formType: CategoryType;
  onFormTypeChange: (type: CategoryType) => void;
  formText: string;
  onFormTextChange: (text: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RetroItemForm: React.FC<RetroItemFormProps> = ({
  sprintName,
  formType,
  onFormTypeChange,
  formText,
  onFormTextChange,
  onSubmit,
}) => {
  return (
    <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-3 font-sans">
      <h3 className="text-sm font-bold text-white flex items-center space-x-2">
        <Plus className="w-4 h-4 text-blue-500" />
        <span>Add feedback point to {sprintName || "Sprint"}</span>
      </h3>
      <form
        onSubmit={onSubmit}
        className="flex flex-col sm:flex-row gap-3 text-xs"
      >
        <select
          value={formType}
          onChange={(e) => onFormTypeChange(e.target.value as CategoryType)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="positive">🟢 What Went Well</option>
          <option value="negative">🔴 Needs Improvement</option>
          <option value="action">💡 Ideas & Action Items</option>
        </select>

        <input
          type="text"
          required
          value={formText}
          onChange={(e) => onFormTextChange(e.target.value)}
          placeholder="Enter feedback or action item..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};
