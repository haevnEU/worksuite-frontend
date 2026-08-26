
export const getTrackerColor = (tracker: string): string => {
  const key = tracker ? tracker.trim().toLowerCase() : "";

  switch (key) {
      // 1. New (ID: 1)
    case "new":
      return "bg-blue-950/80 text-blue-300 border-blue-800/80";

      // 2. Backlogs & Refinement (IDs: 9, 16, 17, 18)
    case "product backlog":
    case "sprint backlog":
    case "refinement":
    case "backlog":
      return "bg-cyan-950/80 text-cyan-300 border-cyan-800/80";

      // 3. In Progress & Session (IDs: 2, 7)
    case "in progress":
      return "bg-amber-950/80 text-amber-300 border-amber-800/80";
    case "session":
      return "bg-indigo-950/80 text-indigo-300 border-indigo-800/80";

      // 4. Feedback & Reviews (IDs: 4, 19)
    case "feedback":
    case "in review":
      return "bg-purple-950/80 text-purple-300 border-purple-800/80";

      // 5. Quality Assurance & Testing (IDs: 8, 14)
    case "presented to qs":
    case "test case":
      return "bg-fuchsia-950/80 text-fuchsia-300 border-fuchsia-800/80";

      // 6. Blockers & External Feedback (IDs: 20, 21, 22)
    case "warten auf feedback robotron":
    case "warten auf feedback theben":
    case "waiting for external supplier":
      return "bg-orange-950/80 text-orange-300 border-orange-800/80";

      // 7. Paused / On Hold (IDs: 10, 13)
    case "on hold":
    case "parking":
      return "bg-zinc-900/80 text-zinc-300 border-zinc-700/80";

      // 8. Completed / Resolved / Approved (IDs: 3, 15)
    case "resolved":
      return "bg-emerald-950/80 text-emerald-300 border-emerald-800/80";
    case "approved":
      return "bg-green-950/80 text-green-300 border-green-800/80";

      // 9. Closed (ID: 5)
    case "closed":
      return "bg-slate-900/80 text-slate-400 border-slate-700/80";

      // 10. Rejected & Obsolete (IDs: 6, 11, 12)
    case "rejected":
    case "obsolete":
    case "obsoleted":
      return "bg-rose-950/80 text-rose-300 border-rose-800/80";

    default:
      return "bg-slate-800 text-slate-300 border-slate-700";
  }
};

export const getStatusBadgeClass = (status?: string | null): string => {
    const key = status?.trim().toLowerCase();

    switch (key) {
      case "bug":
      case "fehler":
      case "incident":
        return "bg-rose-500/15 text-rose-400 border border-rose-500/30";

      case "task":
      case "aufgabe":
        return "bg-sky-500/15 text-sky-400 border border-sky-500/30";

      case "support":
      case "service":
      case "anfrage":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";

      case "feature":
      case "enhancement":
      case "verbesserung":
        return "bg-violet-500/15 text-violet-400 border border-violet-500/30";

      case "epic":
      case "milestone":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";

      case "doc":
      case "documentation":
      case "meeting":
        return "bg-slate-500/15 text-slate-300 border border-slate-500/30";

      default:
        return "bg-slate-800/60 text-slate-300 border border-slate-700/50";
    }
  };

export const getPriorityBadgeClass = (priority: string | null): string => {
  if (priority == null) {
    return "bg-slate-800 text-slate-300 border border-slate-700";
  }

  const key = String(priority).toLowerCase().trim();
  switch (key) {
    case "immediate":
      return "bg-rose-900 text-rose-300 border border-rose-700 font-bold";
    case "urgent":
      return "bg-rose-950 text-rose-300 border border-rose-800";
    case "high":
      return "bg-amber-950 text-amber-300 border border-amber-800";
    case "normal":
      return "bg-blue-950 text-blue-300 border border-blue-800";
    case "low":
      return "bg-slate-800/80 text-slate-400 border border-slate-700/60";
    default:
      return "bg-slate-800 text-slate-300 border border-slate-700";
  }
};
