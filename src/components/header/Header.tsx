import React, { useState } from "react";
import { Menu } from "lucide-react";
import { HeaderClock } from "./HeaderClock.tsx";
import { HeaderTargetTimer } from "./HeaderTargetTimer.tsx";
import { HeaderStats } from "./HeaderStats.tsx";
import { HeaderActions } from "./HeaderActions.tsx";
import { HeaderUserAvatar } from "./HeaderUserAvatar.tsx";
import { NotificationOverlay } from "../notification/NotificationOverlay.tsx";

interface HeaderProps {
  onToggleMobileMenu?: () => void;
  onTriggerRefresh?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  onTriggerRefresh,
}) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  return (
    <>
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 font-sans">
        <div className="flex items-center space-x-3">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Open menu"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <HeaderClock />
          <HeaderTargetTimer />
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <HeaderStats />
          <HeaderActions
            onRefresh={onTriggerRefresh}
            onOpenNotifications={() => setIsNotificationOpen(true)}
          />
          <HeaderUserAvatar />
        </div>
      </header>

      <NotificationOverlay
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </>
  );
};
