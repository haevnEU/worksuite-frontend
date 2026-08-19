import React from "react";
import { Link } from "react-router-dom";
import { Calendar, GitPullRequest, Server, Ticket } from "lucide-react";
import { useSettings } from "../../context/SettingsContext.tsx";
import { useTickets } from "../../context/TicketContext.tsx";
import { useVCS } from "../../context/VcsContext.tsx";

// TODO Move to utils
const formatDateFormatted = (date: Date): string => {
  const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${weekday} ${day} ${month} ${year}`;
};

interface DashboardHeaderProps {}

export const DashboardHeader: React.FC<DashboardHeaderProps> = () => {
  const { user } = useSettings();
  const { openTickets } = useTickets();
  const { pendingReviews, myMrs } = useVCS();

  const pendingReviewsCount = pendingReviews?.length || 0;
  const myMrsCount = myMrs?.length || 0;

  return (
    <div className="bg-slate-900 text-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none text-white">
        <Server style={{ width: "260px", height: "260px" }} />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDateFormatted(new Date())}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.firstName} {user.lastName}!
          </h1>

          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Overview of your development processes. Currently there are{" "}
            <Link
              to="/redmine"
              className="text-blue-400 font-extrabold hover:underline"
            >
              {openTickets} open tickets
            </Link>{" "}
            and{" "}
            <Link
              to="/vcs?tab=reviews"
              className="text-purple-400 font-extrabold hover:underline"
            >
              {pendingReviewsCount} pending{" "}
              {pendingReviewsCount === 1 ? "review" : "reviews"}
            </Link>{" "}
            waiting for your action.
          </p>
        </div>

        {/* Quick KPI Badges auf der rechten Seite (Klickbar mit Tab-Parametern) */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/redmine"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 text-xs transition-all duration-150 group cursor-pointer"
            title="Open Redmine Tickets"
          >
            <Ticket className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
              Tickets:
            </span>
            <span className="font-bold text-white group-hover:text-blue-300 transition-colors">
              {openTickets}
            </span>
          </Link>

          <Link
            to="/vcs?tab=reviews"
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 text-xs transition-all duration-150 group cursor-pointer"
            title="Open Pending Reviews"
          >
            <GitPullRequest className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
              Reviews:
            </span>
            <span className="font-bold text-white group-hover:text-purple-300 transition-colors">
              {pendingReviewsCount}
            </span>
          </Link>

          {myMrsCount > 0 && (
            <Link
              to="/vcs?tab=my-mrs"
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/50 text-xs transition-all duration-150 group cursor-pointer"
              title="Open My Merge Requests"
            >
              <GitPullRequest className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-slate-400 group-hover:text-slate-200 transition-colors">
                My MRs:
              </span>
              <span className="font-bold text-white group-hover:text-orange-300 transition-colors">
                {myMrsCount}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
