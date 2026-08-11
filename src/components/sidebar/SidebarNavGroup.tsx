import React from "react";
import { ChevronDown, ChevronRight, Star } from "lucide-react";
import { NavItem } from "../../models/sidebar.model.ts";
import { SidebarNavItem } from "./SidebarNavItem.tsx";

interface SidebarNavGroupProps {
  title: string;
  items: NavItem[];
  isOpen: boolean;
  collapsed?: boolean;
  isFavoritable?: boolean;
  favoritePaths?: string[];
  canAddFavorite?: boolean;
  onToggle: () => void;
  onToggleFavorite?: (e: React.MouseEvent, path: string) => void;
  onNavClick: () => void;
}

export const SidebarNavGroup: React.FC<SidebarNavGroupProps> = ({
  title,
  items,
  isOpen,
  collapsed = false,
  isFavoritable = true,
  favoritePaths = [],
  canAddFavorite = true,
  onToggle,
  onToggleFavorite,
  onNavClick,
}) => {
  const isFavorites = title === "Favorites";
  const isAltGroup = title.startsWith("Alt /");

  if (collapsed) {
    return (
      <div className="space-y-1 border-b border-slate-800/50 pb-2 mb-2 last:border-b-0">
        {items.map((item) => (
          <SidebarNavItem
            key={`${title}-${item.path}`}
            item={item}
            collapsed={true}
            onNavClick={onNavClick}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400/90 flex items-center justify-between border-b border-slate-800/60 hover:text-white transition-colors cursor-pointer group/title mb-1"
      >
        <span
          className={`flex items-center gap-1.5 ${
            isFavorites
              ? "text-amber-400 font-black tracking-wider"
              : isAltGroup
                ? "text-amber-500/80 group-hover/title:text-amber-400"
                : ""
          }`}
        >
          {isFavorites && (
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
          )}
          <span>{title}</span>
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
                collapsed={false}
                isFavorite={favoritePaths.includes(item.path)}
                canFavorite={isFavoritable && canAddFavorite}
                onToggleFavorite={isFavoritable ? onToggleFavorite : undefined}
                onNavClick={onNavClick}
              />
            ))
          ) : (
            <div className="px-3 py-1.5 text-[11px] text-slate-600 italic">
              No entries found
            </div>
          )}
        </div>
      )}
    </div>
  );
};
