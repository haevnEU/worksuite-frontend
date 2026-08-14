import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NavItem } from "../../models/sidebar.model.ts";
import { SidebarNavItem } from "./SidebarNavItem.tsx";

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
            items.map((item) => (
              <SidebarNavItem
                key={`${title}-${item.path}`}
                item={item}
                onNavClick={onNavClick}
              />
            ))
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
