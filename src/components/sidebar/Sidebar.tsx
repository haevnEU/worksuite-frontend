import React, { useMemo, useState } from "react";
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
} from "../../utils/sidebar.util.ts";

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

  // 1. Feste Overview-Gruppe (ganz oben, nicht favorisierbar)
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
          requiredPlan: "COMMUNITY",
        },
        {
          label: "Redmine Tickets",
          path: "/redmine",
          icon: Ticket,
          badge: openTickets,
          requiredPlan: "COMMUNITY",
        },
      ],
    }),
    [pendingReviewsCount, openTickets],
  );

  // 2. Restliche Funktionsgruppen (favorisierbar)
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

  // Alle favorisierbaren Items für die Suche
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

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
          aria-label="Close menu"
        />
      )}

      <aside
        className={`w-full lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0 text-slate-300 select-none transition-all duration-300 z-50 ${
          mobileOpen
            ? "fixed inset-0 lg:inset-y-0 lg:left-0 shadow-2xl animate-in slide-in-from-left duration-200"
            : "hidden lg:flex"
        }`}
      >
        <SidebarHeader onClose={onClose} />

        <nav className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {/* 1. Overview steht IMMER ganz oben (ohne Favoriten-Sterne) */}
          <SidebarNavGroup
            title={overviewGroup.title}
            items={overviewGroup.items}
            isOpen={openGroups["Overview"] ?? true}
            isFavoritable={false}
            onToggle={() => toggleGroup("Overview")}
            onNavClick={handleNavClick}
          />

          {/* 2. Favorites-Gruppe direkt darunter (nur wenn Items markiert sind) */}
          {favoriteItems.length > 0 && (
            <div className="py-2 my-2 border-y border-slate-800/80">
              <SidebarNavGroup
                title="Favorites"
                items={favoriteItems}
                isOpen={openGroups["Favorites"] ?? true}
                isFavoritable={true}
                favoritePaths={favoritePaths}
                canAddFavorite={favoritePaths.length < MAX_FAVORITES}
                onToggle={() => toggleGroup("Favorites")}
                onToggleFavorite={handleToggleFavorite}
                onNavClick={handleNavClick}
              />
            </div>
          )}

          {/* 3. Restliche Gruppen */}
          {otherNavGroups.map((group, idx) => (
            <SidebarNavGroup
              key={idx}
              title={group.title}
              items={group.items}
              isOpen={openGroups[group.title] ?? true}
              isFavoritable={true}
              favoritePaths={favoritePaths}
              canAddFavorite={favoritePaths.length < MAX_FAVORITES}
              onToggle={() => toggleGroup(group.title)}
              onToggleFavorite={handleToggleFavorite}
              onNavClick={handleNavClick}
            />
          ))}
        </nav>

        <SidebarUserProfile />
      </aside>
    </>
  );
};
