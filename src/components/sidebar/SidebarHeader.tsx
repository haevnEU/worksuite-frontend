import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { licenseService } from "../../services/network/license.service.ts";

interface SidebarHeaderProps {
  onClose?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClose }) => {
  const [plan, setPlan] = useState<string>("COMMUNITY");

  useEffect(() => {
    licenseService
      .getStatus()
      .then((res) => {
        if (res?.plan) {
          setPlan(res.plan.toUpperCase());
        }
      })
      .catch(() => {
        setPlan("COMMUNITY");
      });
  }, []);

  const getBadgeStyle = (currentPlan: string) => {
    switch (currentPlan) {
      case "ENTERPRISE":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "PRO":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

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
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold border tracking-wider uppercase ${getBadgeStyle(
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
