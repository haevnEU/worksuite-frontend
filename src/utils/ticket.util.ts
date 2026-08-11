export const getStatusBadgeClass = (status?: string | null): string => {
  if (status == null) {
    return "bg-slate-800 text-slate-300 border border-slate-700";
  }

  const key = String(status).toLowerCase().trim();

  switch (key) {
    case "new":
      return "bg-blue-950 text-blue-300 border border-blue-800";
    case "in progress":
      return "bg-amber-950 text-amber-300 border border-amber-800";
    case "resolved":
      return "bg-emerald-950 text-emerald-300 border border-emerald-800";
    case "feedback":
    case "in review":
    case "review":
      return "bg-purple-950 text-purple-300 border border-purple-800";
    case "closed":
      return "bg-slate-800 text-slate-400 border border-slate-700";
    case "rejected":
    case "obsolete":
    case "obsoleted":
      return "bg-rose-950 text-rose-300 border border-rose-800";
    case "session":
      return "bg-indigo-950 text-indigo-300 border border-indigo-800";
    case "presented to qs":
    case "qs":
    case "qa":
      return "bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-800";
    case "product backlog":
    case "sprint backlog":
    case "refinement":
    case "backlog":
      return "bg-cyan-950 text-cyan-300 border border-cyan-800";
    case "on hold":
    case "parking":
    case "warten auf feedback robotron":
    case "warten auf feedback theben":
    case "waiting for external supplier":
      return "bg-yellow-950 text-yellow-300 border border-yellow-800";
    case "test case":
      return "bg-teal-950 text-teal-300 border border-teal-800";
    case "approved":
      return "bg-green-950 text-green-300 border border-green-800";
    default:
      return "bg-slate-800 text-slate-300 border border-slate-700";
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
