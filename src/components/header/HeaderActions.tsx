import React, { useEffect, useState } from "react";
import { Bell, RefreshCw } from "lucide-react";
import { notificationHandler } from "../../services/push/NotificationHandler.ts";

interface HeaderActionsProps {
  onRefresh?: () => void;
  onOpenNotifications: () => void;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({
  onRefresh,
  onOpenNotifications,
}) => {
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    const unsubscribe = notificationHandler.subscribe((items) => {
      const unread = items.filter((n) => !n.read).length;
      setUnreadNotificationCount(unread);
    });
    return unsubscribe;
  }, []);

  const handleRefreshClick = () => {
    if (!onRefresh) {
      return;
    }
    onRefresh();
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        title="Synchronize data"
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        onClick={handleRefreshClick}
      >
        <RefreshCw className="w-4 h-4" />
      </button>

      <button
        title="Open Notification Center"
        onClick={onOpenNotifications}
        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {unreadNotificationCount > 0 && (
          <span className="absolute top-1 right-1 px-1.5 py-0.2 bg-blue-500 text-white rounded-full text-[9px] font-black border border-slate-900 animate-pulse">
            {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
          </span>
        )}
      </button>
    </div>
  );
};
