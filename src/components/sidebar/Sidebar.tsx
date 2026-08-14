import React, { useState } from "react";
import {
  Clock,
  Code2,
  Database,
  FileCode,
  FileTerminal,
  GitBranch,
  LayoutDashboard,
  RotateCcw,
  ScrollText,
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

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen = false,
  onClose,
}) => {
  const { openTickets } = useTickets();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Overview: true,
    Organization: true,
    "Development Tools": true,
    "Team & Meetings": true,
    Settings: true,
    "Legacy / Dev Tools": false,
  });

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const navGroups: { title: string; items: NavItem[] }[] = [
    {
      title: "Overview",
      items: [
        { label: "Dashboard", path: "/", icon: LayoutDashboard },
        { label: "VCS Repositories", path: "/vcs", icon: GitBranch },
        {
          label: "Redmine Tickets",
          path: "/redmine",
          icon: Ticket,
          badge: openTickets,
        },
      ],
    },
    {
      title: "Organization",
      items: [
        { label: "Notes", path: "/notes", icon: StickyNote },
        { label: "Code & Snippets", path: "/snippets", icon: Code2 },
        { label: "Templates", path: "/templates", icon: FileCode },
        { label: "Time Tracking", path: "/time-log", icon: Clock },
      ],
    },
    {
      title: "Development Tools",
      items: [
        { label: "Backend Table Query", path: "/database", icon: Database },
        { label: "CSV Viewer", path: "/csv-viewer", icon: FileCode },
        { label: "Tools", path: "/tools", icon: FileTerminal },
        { label: "Share & Export", path: "/share", icon: Share2 },
        { label: "Log Inspect", path: "/log", icon: FileTerminal },
      ],
    },
    {
      title: "Team & Meetings",
      items: [
        { label: "Sprint Retro", path: "/retro", icon: RotateCcw },
        { label: "Team Meeting", path: "/teammeeting", icon: Users },
        { label: "Review", path: "/review", icon: Sparkles },
      ],
    },
    {
      title: "Settings",
      items: [{ label: "Settings", path: "/settings", icon: Settings }],
    },
  ];

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
        className={`w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen shrink-0 text-slate-300 select-none transition-all duration-300 z-50 ${
          mobileOpen
            ? "fixed inset-y-0 left-0 shadow-2xl animate-in slide-in-from-left duration-200"
            : "hidden lg:flex"
        }`}
      >
        <SidebarHeader onClose={onClose} />
        <nav className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
          {navGroups.map((group, idx) => (
            <SidebarNavGroup
              key={idx}
              title={group.title}
              items={group.items}
              isOpen={openGroups[group.title] ?? true}
              onToggle={() => toggleGroup(group.title)}
              onNavClick={handleNavClick}
            />
          ))}
        </nav>
        <SidebarUserProfile />
      </aside>
    </>
  );
};
