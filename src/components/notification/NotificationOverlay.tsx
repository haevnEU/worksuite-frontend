import React, { useEffect, useMemo, useState } from "react";
import { Info } from "lucide-react";
import { NotificationHeader } from "./NotificationHeader.tsx";
import { NotificationPriorityTabs } from "./NotificationPriorityTabs.tsx";
import { NotificationItemCard } from "./NotificationItemCard.tsx";
import { notificationHandler } from "../../services/push/NotificationHandler.ts";
import { pushService } from "../../services/push/push.service.ts";
import { NotificationItem } from "../../models/pushService.model.ts";
import {
  ConnectionStatus,
  PriorityFilter,
} from "../../types/PushService.type.ts";

interface NotificationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationOverlay: React.FC<NotificationOverlayProps> = ({
  isOpen,
  onClose,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeTab, setActiveTab] = useState<PriorityFilter>("all");
  const [wsStatus, setWsStatus] = useState<ConnectionStatus>(
    pushService.getStatus(),
  );

  useEffect(() => {
    const unsubscribeNotifications = notificationHandler.subscribe((items) => {
      setNotifications(items);
    });

    const unsubscribeWs = pushService.subscribeStatus((status) => {
      setWsStatus(status);
    });

    return () => {
      unsubscribeNotifications();
      unsubscribeWs();
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const counts = useMemo(
    () => ({
      all: notifications.length,
      INFO: notifications.filter((n) => n.priority === "INFO" || !n.priority)
        .length,
      WARN: notifications.filter((n) => n.priority === "WARN").length,
      ERROR: notifications.filter((n) => n.priority === "ERROR").length,
      CRITICAL: notifications.filter((n) => n.priority === "CRITICAL").length,
      SUCCESS: notifications.filter((n) => n.priority === "SUCCESS").length,
    }),
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    if (activeTab === "all") return notifications;
    return notifications.filter((n) => n.priority === activeTab);
  }, [notifications, activeTab]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-xs text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <NotificationHeader
          unreadCount={unreadCount}
          totalCount={notifications.length}
          wsStatus={wsStatus}
          onClose={onClose}
          onMarkAllRead={() => notificationHandler.markAllAsRead()}
          onClearAll={() => notificationHandler.clearAll()}
        />

        <NotificationPriorityTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
        />

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-64">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Info className="w-8 h-8 mx-auto text-slate-600" />
              <p className="font-semibold text-xs">
                No notifications in this category.
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <NotificationItemCard
                key={item.id}
                item={item}
                onMarkAsRead={(id) => notificationHandler.markAsRead(id)}
                onRemove={(id) => notificationHandler.removeById(id)}
              />
            ))
          )}
        </div>

        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>
            Events in memory: <strong>{notifications.length}</strong>
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            WS Endpoint: /api/ws
          </span>
        </div>
      </div>
    </div>
  );
};
