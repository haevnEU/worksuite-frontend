import React from "react";
import { User } from "lucide-react";
import { useSettings } from "../../context/SettingsContext.tsx";

export const GeneralProfileSection: React.FC = () => {
  const { user } = useSettings();

  const getFullName = () => {
    if (!user.firstName && !user.lastName) return "";
    return `${user.firstName || ""} ${user.lastName || ""}`.trim();
  };

  const getEmail = () => {
    if (!user.firstName || !user.lastName) return "";
    return `${user.firstName.toLowerCase()}.${user.lastName.toLowerCase()}@hausheld.de`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-extrabold text-white">General</h2>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            Read-Only Profile
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={getFullName()}
              placeholder="No name loaded"
              readOnly
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-300 rounded-xl p-3 focus:outline-none cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              User Role
            </label>
            <input
              type="text"
              value={user.role || ""}
              placeholder="No role assigned"
              readOnly
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-300 rounded-xl p-3 focus:outline-none cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={getEmail()}
              placeholder="email@hausheld.de"
              readOnly
              className="w-full bg-slate-800/60 border border-slate-700/60 text-slate-300 rounded-xl p-3 focus:outline-none cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
