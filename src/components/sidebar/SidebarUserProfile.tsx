import React from "react";
import { LogOut, UserCheck } from "lucide-react";
import { useSettings } from "../../context/SettingsContext.tsx";
import { useAuth } from "../../context/AuthContext.tsx";
import { AuthenticatedImage } from "../AuthenticatedImage.tsx";

export const SidebarUserProfile: React.FC = () => {
  const { user, getAvatarUrl } = useSettings();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const getUserFullName = (u: typeof user) => {
    if (!u.firstName && !u.lastName) return "Unknown User";
    return `${u.firstName || ""} ${u.lastName || ""}`.trim();
  };

  return (
    <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-2.5 shrink-0">
      <div className="flex items-center justify-between text-xs px-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
          <UserCheck className="w-3 h-3 text-blue-400" />
          <span>Logged-in User</span>
        </span>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2.5 space-y-2.5 relative">
        <div className="flex items-center space-x-2.5">
          {user.avatarUrl ? (
            /* Restrict wrapper to a fixed 32x32px (w-8 h-8) */
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-700/80">
              <AuthenticatedImage
                src={getAvatarUrl()}
                alt={getUserFullName(user)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
              {user.firstName?.[0] || "U"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">
              {getUserFullName(user)}
            </div>
            <div className="text-[10px] text-blue-400 font-medium truncate">
              {user.role || "No Role"}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-1.5 bg-slate-900/90 hover:bg-red-950/40 hover:text-red-400 border border-slate-700/80 hover:border-red-800/60 text-slate-300 text-xs font-semibold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
