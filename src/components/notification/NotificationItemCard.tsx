import React from "react";
import { NotificationItem } from "../../models/pushService.model.ts";

interface NotificationItemCardProps {
  item: NotificationItem;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
}

export const NotificationItemCard: React.FC<NotificationItemCardProps> = ({
  item,
  onMarkAsRead,
  onRemove,
}) => {
  return (
    <div
      onClick={() => onMarkAsRead(item.id)}
      className={`p-3.5 rounded-xl border transition-all space-y-2 relative cursor-pointer font-sans ${
        !item.read
          ? "bg-slate-900 border-blue-500/40 shadow-sm"
          : "bg-slate-950/70 border-slate-800 text-slate-400"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-white uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">
            {item.source || "SYSTEM"}
          </span>

          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/70 text-blue-300 border border-blue-800/60 font-mono">
            {item.priority || "INFO"}
          </span>
        </div>

        <span className="text-[10px] text-slate-400 font-mono">
          {item.timestamp
            ? new Date(item.timestamp).toLocaleTimeString("en-US")
            : ""}
        </span>
      </div>

      <p className="text-xs text-slate-100 font-medium leading-relaxed">
        {item.payload}
      </p>
    </div>
  );
};
