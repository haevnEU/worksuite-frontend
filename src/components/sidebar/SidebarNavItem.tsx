import React from "react";
import { NavLink } from "react-router-dom";
import { Lock, Star } from "lucide-react";
import { NavItem, StatusDotVariant } from "../../models/sidebar.model.ts";
import { useLicense } from "../../context/LicenseContext.tsx";
import { getPlanBadge } from "../../utils/license.util.ts";

interface SidebarNavItemProps {
  item: NavItem;
  collapsed?: boolean;
  isFavorite?: boolean;
  canFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent, path: string) => void;
  onNavClick: () => void;
}

const getDotColorClass = (variant: StatusDotVariant = "emerald"): string => {
  switch (variant) {
    case "amber":
      return "bg-amber-400 border-amber-900";
    case "rose":
      return "bg-rose-400 border-rose-900";
    case "blue":
      return "bg-sky-400 border-sky-900";
    case "purple":
      return "bg-purple-400 border-purple-900";
    case "emerald":
    default:
      return "bg-emerald-400 border-emerald-900";
  }
};

export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  item,
  collapsed = false,
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
      <div className="relative group/disabled">
        <div
          className={`flex items-center rounded-xl text-xs font-semibold text-slate-500 bg-slate-950/40 border border-transparent cursor-not-allowed opacity-60 select-none transition-all ${
            collapsed ? "justify-center p-2.5" : "justify-between px-3 py-2.5"
          }`}
          title={`Requires ${item.requiredPlan || "a higher"} plan`}
        >
          <div
            className={`flex items-center min-w-0 ${
              collapsed ? "justify-center" : "space-x-3"
            }`}
          >
            <IconComponent className="w-4 h-4 shrink-0 text-slate-600" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </div>

          {!collapsed && (
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
          )}
        </div>

        {/* Floating Tooltip im minimierten Zustand */}
        {collapsed && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg shadow-xl whitespace-nowrap hidden group-hover/disabled:flex items-center gap-1.5 z-50 pointer-events-none">
            <span>{item.label}</span>
            <Lock className="w-3 h-3 text-amber-400" />
          </div>
        )}
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
          `flex-1 flex items-center rounded-xl text-xs font-semibold transition-all group ${
            collapsed ? "justify-center p-2.5" : "justify-between px-3 py-2.5"
          } ${
            isActive
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-slate-400 hover:text-white hover:bg-slate-800/70"
          }`
        }
      >
        <div
          className={`flex items-center min-w-0 relative ${
            collapsed ? "justify-center" : "space-x-3 pr-8"
          }`}
        >
          {/* Icon mit optionalem Activity Dot */}
          <div className="relative shrink-0">
            <IconComponent className="w-4 h-4 transition-transform group-hover:scale-110" />

            {/* Pulsierender Status Dot */}
            {item.statusDot && (
              <span
                title={item.statusDot.tooltip}
                className={`absolute -top-1 -right-1 w-2 h-2 rounded-full border border-slate-900 ${getDotColorClass(
                  item.statusDot.variant,
                )} ${item.statusDot.pulse !== false ? "animate-pulse" : ""}`}
              />
            )}
          </div>

          {!collapsed && <span className="truncate">{item.label}</span>}
        </div>

        {!collapsed && typeof item.badge === "number" && item.badge > 0 && (
          <span className="mr-8 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30 group-hover:bg-white group-hover:text-blue-600">
            {item.badge}
          </span>
        )}
      </NavLink>

      {/* Floating Tooltip im Collapsed Modus */}
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg shadow-xl whitespace-nowrap hidden group-hover/item:flex items-center gap-2 z-50 pointer-events-none">
          <span>{item.label}</span>
          {typeof item.badge === "number" && item.badge > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-blue-500/30 text-blue-300">
              {item.badge}
            </span>
          )}
        </div>
      )}

      {/* Favoriten Stern */}
      {!collapsed && onToggleFavorite && (
        <button
          type="button"
          onClick={(e) => onToggleFavorite(e, item.path)}
          disabled={!isFavorite && !canFavorite}
          className={`absolute right-1 p-2 rounded-lg transition-all cursor-pointer z-10 ${
            isFavorite
              ? "text-amber-400 hover:text-amber-300 opacity-100"
              : canFavorite
                ? "text-slate-600 hover:text-amber-400 max-lg:opacity-80 lg:opacity-0 lg:group-hover/item:opacity-100"
                : "text-slate-800 opacity-0 cursor-not-allowed"
          }`}
          title={
            isFavorite
              ? "Remove from favorites"
              : canFavorite
                ? "Add to favorites (max 3)"
                : "Maximum 3 favorites allowed"
          }
          aria-label={
            isFavorite
              ? "Remove from favorites"
              : canFavorite
                ? "Add to favorites"
                : "Maximum 3 favorites allowed"
          }
        >
          <Star
            className={`w-4 h-4 ${
              isFavorite
                ? "fill-amber-400 text-amber-400"
                : "text-slate-500 hover:text-amber-400"
            }`}
          />
        </button>
      )}
    </div>
  );
};
