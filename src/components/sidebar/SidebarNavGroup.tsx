import React from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavItem } from "../../models/sidebar.model.ts";

interface SidebarNavGroupProps {
  title: string;
  items: NavItem[];
  isOpen: boolean;
  onToggle: () => void;
  onNavClick: () => void;
}

export const SidebarNavGroup: React.FC<SidebarNavGroupProps> = ({
  title,
  items,
  isOpen,
  onToggle,
  onNavClick,
}) => {
  const isAltGroup = title.startsWith("Alt /");

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400/90 flex items-center justify-between border-b border-slate-800/60 hover:text-white transition-colors cursor-pointer group/title mb-1"
      >
        <span
          className={
            isAltGroup
              ? "text-amber-500/80 group-hover/title:text-amber-400"
              : ""
          }
        >
          {title}
        </span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover/title:text-slate-300" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover/title:text-slate-300" />
        )}
      </button>

      {isOpen && (
        <div className="space-y-1 animate-in fade-in duration-150">
          {items.length > 0 ? (
            items.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={`${title}-${item.path}`}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={onNavClick}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                    }`
                  }
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <IconComponent className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 group-hover:bg-white group-hover:text-blue-600">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })
          ) : (
            <div className="px-3 py-1.5 text-[11px] text-slate-600 italic">
              Keine Einträge
            </div>
          )}
        </div>
      )}
    </div>
  );
};
