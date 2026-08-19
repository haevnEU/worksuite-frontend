import React from "react";
import { NavLink } from "react-router-dom";
import { Lock, Star } from "lucide-react";
import { NavItem } from "../../models/sidebar.model.ts";
import { useLicense } from "../../context/LicenseContext.tsx";
import { getPlanBadge } from "../../utils/license.util.ts";

interface SidebarNavItemProps {
  item: NavItem;
  isFavorite?: boolean;
  canFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent, path: string) => void;
  onNavClick: () => void;
}

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  isFavorite = false,
  canFavorite = true,
  onToggleFavorite,
  onNavClick,
}) => {
  const IconComponent = item.icon;
  const { hasAccess } = useLicense();

  const disabled = item.requiredPlan ? !hasAccess(item.requiredPlan) : false;

  if (disabled) {
    return (
      <div
        className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 bg-slate-950/40 border border-transparent cursor-not-allowed opacity-60 select-none group transition-all"
        title={`Erfordert ${item.requiredPlan || "einen höheren"} Plan`}
      >
        <div className="flex items-center space-x-3 min-w-0">
          <IconComponent className="w-4 h-4 shrink-0 text-slate-600" />
          <span className="truncate">{item.label}</span>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          {item.requiredPlan && (
            <span
              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${getPlanBadge(
                item.requiredPlan,
              )}`}
            >
              {item.requiredPlan}
            </span>
          )}
          <Lock className="w-3.5 h-3.5 text-slate-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="group/item relative flex items-center">
      <NavLink
        to={item.path}
        end={item.path === "/"}
        onClick={onNavClick}
        className={({ isActive }) =>
          `flex-1 flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
            isActive
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-slate-400 hover:text-white hover:bg-slate-800/70"
          }`
        }
      >
        <div className="flex items-center space-x-3 min-w-0 pr-6">
          <IconComponent className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
          <span className="truncate">{item.label}</span>
        </div>

        {typeof item.badge === "number" && item.badge > 0 && (
          <span className="mr-6 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 group-hover:bg-white group-hover:text-blue-600">
            {item.badge}
          </span>
        )}
      </NavLink>

      {/* Stern zum Markieren/Entfernen des Favoriten */}
      {onToggleFavorite && (
        <button
          type="button"
          onClick={(e) => onToggleFavorite(e, item.path)}
          disabled={!isFavorite && !canFavorite}
          className={`absolute right-2 p-1 rounded-md transition-all cursor-pointer ${
            isFavorite
              ? "text-amber-400 hover:text-amber-300 opacity-100"
              : canFavorite
                ? "text-slate-500 hover:text-amber-400 opacity-0 group-hover/item:opacity-100"
                : "text-slate-700 opacity-0 cursor-not-allowed"
          }`}
          title={
            isFavorite
              ? "Aus Favoriten entfernen"
              : canFavorite
                ? "Zu Favoriten hinzufügen (max. 3)"
                : "Maximal 3 Favoriten erlaubt"
          }
        >
          <Star
            className={`w-3.5 h-3.5 ${
              isFavorite ? "fill-amber-400 text-amber-400" : ""
            }`}
          />
        </button>
      )}
    </div>
  );
};
