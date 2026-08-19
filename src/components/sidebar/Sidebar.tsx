import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock,
  Code2,
  CodeXml,
  Database,
  FileCode,
  FileTerminal,
  GitBranch,
  Info,
  LayoutDashboard,
  RotateCcw,
  Settings,
  Share2,
  Sparkles,
  StickyNote,
  Ticket,
  Users,
} from "lucide-react";
import { useTickets } from "../../context/TicketContext.tsx";
import { SidebarHeader } from "./SidebarHeader.tsx";
import { SidebarNavGroup } from "./SidebarNavGroup.tsx";
import { SidebarUserProfile } from "./SidebarUserProfile.tsx";
import { NavItem } from "../../models/sidebar.model.ts";
import { useVCS } from "../../context/VcsContext.tsx";
import {
  getFavoritePaths,
  getPinnedFavoriteItems,
  MAX_FAVORITES,
  toggleFavoritePath,
  triggerHapticFeedback,
} from "../../utils/sidebar.util.ts";

const COLLAPSED_STORAGE_KEY = "worktool_sidebar_desktop_collapsed";

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen = false,
  onClose,
}) => {
  const { openTickets } = useTickets();
  const { pendingReviews } = useVCS();
  const pendingReviewsCount = pendingReviews?.length || 0;

  // Desktop Collapse State
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    return localStorage.getItem(COLLAPSED_STORAGE_KEY) === "true";
  });

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      return next;
    });
  };

  // -------------------------------------------------------------
  // Option 1: Konfliktfreier Shortcut (Alt + S oder Ctrl/Cmd + \)
  // -------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorieren, wenn der Fokus in einem Input, Textarea oder contentEditable liegt
      const activeTag = document.activeElement?.tagName.toLowerCase();
      const isInput =
        activeTag === "input" ||
        activeTag === "textarea" ||
        (document.activeElement as HTMLElement)?.isContentEditable;

      if (isInput) return;

      // 1. Alt + S (Option + S auf Mac)
      const isAltS = e.altKey && e.key.toLowerCase() === "s";
      // 2. Ctrl + \ oder Cmd + \ (bekannter Standard aus VS Code / Linear)
      const isCtrlBackslash = (e.ctrlKey || e.metaKey) && e.key === "\\";

      if (isAltS || isCtrlBackslash) {
        e.preventDefault();
        toggleCollapse();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // -------------------------------------------------------------
  // Option 2: Responsive Auto-Collapse bei mittleren Screens (< 1280px)
  // -------------------------------------------------------------
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Bei Split-Screen / halbem Monitor (Desktop zw. 1024px und 1280px) automatisch kollabieren
      if (width < 1280 && width >= 1024) {
        setCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -------------------------------------------------------------
  // Mobile Gesten: Touch Pull-Down & Snap-Up Drag State
  // -------------------------------------------------------------
  const [dragY, setDragY] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnimatingClose, setIsAnimatingClose] = useState<boolean>(false);

  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const lastTouchY = useRef<number | null>(null);
  const isEligibleToDrag = useRef<boolean>(false);
  const isSwipingUp = useRef<boolean>(false);
  const hasTriggeredThresholdHaptic = useRef<boolean>(false);
  const navRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!mobileOpen || isAnimatingClose) return;
    const isAtTop = !navRef.current || navRef.current.scrollTop <= 2;
    if (isAtTop) {
      isEligibleToDrag.current = true;
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      lastTouchY.current = e.touches[0].clientY;
      isSwipingUp.current = false;
      hasTriggeredThresholdHaptic.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (
      !isEligibleToDrag.current ||
      touchStartY.current === null ||
      touchStartX.current === null ||
      isAnimatingClose
    )
      return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;

    const diffY = currentY - touchStartY.current;
    const diffX = currentX - touchStartX.current;

    if (lastTouchY.current !== null) {
      isSwipingUp.current = currentY < lastTouchY.current - 2;
    }
    lastTouchY.current = currentY;

    if (diffY > 0 && diffY > Math.abs(diffX)) {
      setIsDragging(true);
      setDragY(diffY);

      // Haptik-Impuls bei Erreichen der 45% Schwelle
      const threshold = window.innerHeight * 0.45;
      if (diffY >= threshold && !hasTriggeredThresholdHaptic.current) {
        triggerHapticFeedback(12);
        hasTriggeredThresholdHaptic.current = true;
      } else if (diffY < threshold) {
        hasTriggeredThresholdHaptic.current = false;
      }
    } else if (diffY <= 0) {
      setDragY(0);
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    if (!isEligibleToDrag.current || isAnimatingClose) return;

    const threshold = window.innerHeight * 0.45;
    const shouldClose =
      !isSwipingUp.current && (dragY >= threshold || dragY > 160);

    if (shouldClose) {
      setIsDragging(false);
      setIsAnimatingClose(true);

      requestAnimationFrame(() => {
        setDragY(window.innerHeight);
      });

      setTimeout(() => {
        setIsAnimatingClose(false);
        setDragY(0);
        if (onClose) onClose();
      }, 230);
    } else {
      setIsDragging(false);
      setDragY(0);
    }

    touchStartY.current = null;
    touchStartX.current = null;
    lastTouchY.current = null;
    isEligibleToDrag.current = false;
    isSwipingUp.current = false;
    hasTriggeredThresholdHaptic.current = false;
  };

  // -------------------------------------------------------------
  // Favoriten & Navigation
  // -------------------------------------------------------------
  const [favoritePaths, setFavoritePaths] = useState<string[]>(() =>
    getFavoritePaths(),
  );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Overview: true,
    Favorites: true,
    Organization: true,
    "Development Tools": true,
    "Team & Meetings": true,
    Settings: true,
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Overview (fest oben)
  const overviewGroup: { title: string; items: NavItem[] } = useMemo(
    () => ({
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          path: "/",
          icon: LayoutDashboard,
          requiredPlan: "COMMUNITY",
        },
        {
          label: "VCS Repositories",
          path: "/vcs",
          icon: GitBranch,
          badge: pendingReviewsCount,
          statusDot:
            pendingReviewsCount > 0
              ? {
                  variant: "blue",
                  pulse: true,
                  tooltip: `${pendingReviewsCount} pending review(s)`,
                }
              : undefined,
          requiredPlan: "COMMUNITY",
        },
        {
          label: "Redmine Tickets",
          path: "/redmine",
          icon: Ticket,
          badge: openTickets,
          statusDot:
            openTickets > 0
              ? {
                  variant: "amber",
                  pulse: true,
                  tooltip: `${openTickets} open ticket(s)`,
                }
              : undefined,
          requiredPlan: "COMMUNITY",
        },
      ],
    }),
    [pendingReviewsCount, openTickets],
  );

  const otherNavGroups: { title: string; items: NavItem[] }[] = useMemo(
    () => [
      {
        title: "Organization",
        items: [
          {
            label: "Notes",
            path: "/notes",
            icon: StickyNote,
            requiredPlan: "PRO",
          },
          {
            label: "Code & Snippets",
            path: "/snippets",
            icon: Code2,
            requiredPlan: "PRO",
          },
          {
            label: "Templates",
            path: "/templates",
            icon: FileCode,
            requiredPlan: "PRO",
          },
          {
            label: "Time Tracking",
            path: "/time-log",
            icon: Clock,
            statusDot: {
              variant: "emerald",
              pulse: false,
              tooltip: "Tracking Active",
            },
            requiredPlan: "PRO",
          },
        ],
      },
      {
        title: "Development Tools",
        items: [
          {
            label: "Backend Table Query",
            path: "/database",
            icon: Database,
            requiredPlan: "ENTERPRISE",
          },
          {
            label: "CSV Viewer",
            path: "/csv-viewer",
            icon: FileCode,
            requiredPlan: "ENTERPRISE",
          },
          {
            label: "Mock Data",
            path: "/mock-data",
            icon: Database,
            requiredPlan: "ENTERPRISE",
          },
          {
            label: "Share & Export",
            path: "/share",
            icon: Share2,
            requiredPlan: "PRO",
          },
          {
            label: "Log Inspect",
            path: "/log",
            icon: FileTerminal,
            requiredPlan: "PRO",
          },
          {
            label: "Tools",
            path: "/tools",
            icon: FileTerminal,
            requiredPlan: "PRO",
          },
          {
            label: "Rule Generator",
            path: "/rule-generator",
            icon: CodeXml,
            requiredPlan: "ENTERPRISE",
          },
        ],
      },
      {
        title: "Team & Meetings",
        items: [
          {
            label: "Sprint Retro",
            path: "/retro",
            icon: RotateCcw,
            requiredPlan: "PRO",
          },
          {
            label: "Team Meeting",
            path: "/teammeeting",
            icon: Users,
            requiredPlan: "PRO",
          },
          {
            label: "Review",
            path: "/review",
            icon: Sparkles,
            requiredPlan: "PRO",
          },
        ],
      },
      {
        title: "Settings",
        items: [
          { label: "Settings", path: "/settings", icon: Settings },
          { label: "About", path: "/about", icon: Info },
        ],
      },
    ],
    [],
  );

  const allFavoritableItems = useMemo(
    () => otherNavGroups.flatMap((group) => group.items),
    [otherNavGroups],
  );

  const favoriteItems = useMemo(
    () => getPinnedFavoriteItems(allFavoritableItems),
    [allFavoritableItems, favoritePaths],
  );

  const handleToggleFavorite = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    const result = toggleFavoritePath(path);
    setFavoritePaths([...result.favorites]);
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const backdropOpacity = mobileOpen
    ? Math.max(
        0,
        1 -
          dragY /
            (typeof window !== "undefined" ? window.innerHeight * 0.75 : 800),
      )
    : 1;

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onClose}
          style={{ opacity: backdropOpacity }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-200"
          aria-label="Close menu"
        />
      )}

      <aside
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform:
            mobileOpen && (dragY > 0 || isAnimatingClose)
              ? `translate3d(0, ${dragY}px, 0)`
              : undefined,
          transition: isDragging
            ? "none"
            : isAnimatingClose
              ? "transform 220ms cubic-bezier(0.32, 0.72, 0, 1)"
              : "transform 240ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={`bg-slate-900 border-r border-slate-800 flex flex-col h-screen lg:h-screen max-lg:h-[100dvh] max-lg:max-h-[100dvh] shrink-0 text-slate-300 select-none z-50 ${
          mobileOpen
            ? "fixed inset-0 shadow-2xl w-full will-change-transform pb-[env(safe-area-inset-bottom,0px)]"
            : `hidden lg:flex transition-all duration-300 ${
                collapsed ? "w-16" : "w-64"
              }`
        }`}
      >
        {/* Mobile Pull-Down Handle */}
        {mobileOpen && (
          <div className="lg:hidden w-full flex justify-center pt-2.5 pb-1 shrink-0 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 rounded-full bg-slate-700/90 hover:bg-slate-600 transition-colors" />
          </div>
        )}

        <SidebarHeader
          collapsed={collapsed && !mobileOpen}
          onToggleCollapse={toggleCollapse}
          onClose={onClose}
        />

        <nav
          ref={navRef}
          className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-800 overscroll-contain"
        >
          {/* Overview */}
          <SidebarNavGroup
            title={overviewGroup.title}
            items={overviewGroup.items}
            isOpen={openGroups["Overview"] ?? true}
            collapsed={collapsed && !mobileOpen}
            isFavoritable={false}
            onToggle={() => toggleGroup("Overview")}
            onNavClick={handleNavClick}
          />

          {/* Favorites */}
          {favoriteItems.length > 0 && !(collapsed && !mobileOpen) && (
            <div className="py-2 my-2 border-y border-slate-800/80">
              <SidebarNavGroup
                title="Favorites"
                items={favoriteItems}
                isOpen={openGroups["Favorites"] ?? true}
                collapsed={false}
                isFavoritable={true}
                favoritePaths={favoritePaths}
                canAddFavorite={favoritePaths.length < MAX_FAVORITES}
                onToggle={() => toggleGroup("Favorites")}
                onToggleFavorite={handleToggleFavorite}
                onNavClick={handleNavClick}
              />
            </div>
          )}

          {/* Andere Gruppen */}
          {otherNavGroups.map((group, idx) => (
            <SidebarNavGroup
              key={idx}
              title={group.title}
              items={group.items}
              isOpen={openGroups[group.title] ?? true}
              collapsed={collapsed && !mobileOpen}
              isFavoritable={true}
              favoritePaths={favoritePaths}
              canAddFavorite={favoritePaths.length < MAX_FAVORITES}
              onToggle={() => toggleGroup(group.title)}
              onToggleFavorite={handleToggleFavorite}
              onNavClick={handleNavClick}
            />
          ))}
        </nav>

        {/* User Profile */}
        <SidebarUserProfile collapsed={collapsed && !mobileOpen} />
      </aside>
    </>
  );
};
