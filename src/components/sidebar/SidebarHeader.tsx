import React from "react";
import { X } from "lucide-react";
import { useLicense } from "../../context/LicenseContext.tsx";
import { getPlanBadge } from "../../utils/license.util.ts";

interface SidebarHeaderProps {
  onClose?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClose }) => {
  const { plan } = useLicense();

  return (
    <div className="p-4 pb-3 border-b border-slate-800/80 shrink-0">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-blue-600/20 shrink-0">
            W
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-white text-base tracking-tight truncate">
                WorkTool
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold border tracking-wider uppercase ${getPlanBadge(
                  plan,
                )}`}
              >
                {plan}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium truncate">
              Tools for Work Management
            </span>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Menü einklappen"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
