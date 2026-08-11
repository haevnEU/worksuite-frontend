import React from "react";
import { Bell, Check, Trash2, Wifi, WifiOff, X } from "lucide-react";
import { ConnectionStatus } from "../../types/PushService.type.ts";

interface NotificationHeaderProps {
  unreadCount: number;
  totalCount: number;
  wsStatus: ConnectionStatus;
  onClose: () => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  unreadCount,
  totalCount,
  wsStatus,
  onClose,
  onMarkAllRead,
  onClearAll,
}) => {
  return (
    <div className="flex flex-col border-b border-slate-800 bg-slate-900/90 shrink-0 font-sans">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-extrabold text-white text-sm">
                Notification Center
              </h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                  {unreadCount} New
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Live push events & system notifications
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border flex items-center space-x-1 ${
              wsStatus === "connected"
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                : wsStatus === "connecting" || wsStatus === "reconnecting"
                  ? "bg-amber-950/60 text-amber-400 border-amber-800 animate-pulse"
                  : "bg-slate-800 text-slate-400 border-slate-700"
            }`}
            title={`WebSocket Status: ${wsStatus}`}
          >
            {wsStatus === "connected" ? (
              <Wifi className="w-3 h-3" />
            ) : (
              <WifiOff className="w-3 h-3" />
            )}
            <span className="capitalize font-mono">WS: {wsStatus}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center space-x-2">
          <button
            onClick={onMarkAllRead}
            disabled={unreadCount === 0}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold rounded-lg border border-slate-700 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Mark all as read</span>
          </button>
          <button
            onClick={onClearAll}
            disabled={totalCount === 0}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 font-bold rounded-lg border border-slate-700 transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
            <span>Clear all</span>
          </button>
        </div>
      </div>
    </div>
  );
};
