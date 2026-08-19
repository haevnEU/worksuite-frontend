import React from "react";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { useLicense } from "../../context/LicenseContext.tsx";
import { LicensePlan } from "../../types/license.type.ts";
import { getLogoStyles, getPlanBadge } from "../../utils/license.util.ts";

interface SidebarHeaderProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onClose?: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  collapsed = false,
  onToggleCollapse,
  onClose,
}) => {
  const { plan } = useLicense();
  const logoStyle = getLogoStyles(plan);

  return (
    <div className="p-3 border-b border-slate-800/80 shrink-0">
      {/* Collapsed view (Centered Logo as an interactive expand trigger) */}
      {collapsed ? (
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="group relative flex items-center justify-center cursor-pointer outline-none"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            {/* Logo */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shrink-0 transition-transform duration-200 group-hover:scale-105 ${logoStyle}`}
            >
              W
            </div>

            {/* Hover overlay with expand icon */}
            <div className="absolute inset-0 rounded-xl bg-slate-950/70 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-150">
              <PanelLeftOpen className="w-4 h-4 text-white" />
            </div>
          </button>
        </div>
      ) : (
        /* Expanded view (Logo + Info on the left, collapse toggle on the right) */
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center space-x-3 min-w-0">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shadow-lg shrink-0 transition-all duration-300 ${logoStyle}`}
            >
              W
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-white text-sm tracking-tight truncate">
                  WorkTool
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold border tracking-wider uppercase ${getPlanBadge(
                    plan,
                  )}`}
                >
                  {plan}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium truncate">
                Tools for Work Management
              </span>
            </div>
          </div>

          {/* Desktop collapse button */}
          {onToggleCollapse && (
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}

          {/* Mobile close button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close menu"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
