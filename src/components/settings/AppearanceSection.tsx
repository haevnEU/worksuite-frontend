import React from "react";
import { Lock, Palette } from "lucide-react";

export const AppearanceSection: React.FC = () => {
  return (
    <div className="bg-slate-900/60 rounded-2xl border border-slate-800/80 p-6 shadow-xs space-y-4 opacity-70">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Palette className="w-4 h-4 text-purple-400" />
          <h2 className="text-sm font-extrabold text-white">Appearance</h2>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800/80 text-slate-400 border border-slate-700/80 flex items-center">
          <Lock className="w-3 h-3 inline mr-1" />
          Disabled
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="block font-bold text-slate-400 mb-1.5">
            Theme Selection
          </label>
          <select
            value="dark"
            disabled
            className="w-full bg-slate-800/40 border border-slate-700/50 text-slate-400 rounded-xl p-3 focus:outline-none cursor-not-allowed font-medium"
          >
            <option value="dark">Dark Theme (Default)</option>
            <option value="light">Light Theme</option>
            <option value="system">System Preference</option>
          </select>
        </div>
        <div className="flex items-center text-slate-500 text-xs italic pt-4 md:pt-0">
          Theme switching is currently disabled and managed globally.
        </div>
      </div>
    </div>
  );
};
