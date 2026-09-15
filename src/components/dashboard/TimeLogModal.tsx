import React, { useState, useEffect, useMemo } from "react";
import { Clock, FolderGit2, Ticket, X } from "lucide-react";
import { useTickets } from "../../context/TicketContext.tsx";
import { useToast } from "../../toaster/ToastContext.tsx";
import { ticketService } from "../../services/network/ticket.service.ts";
import { LogTimePayload } from "../../models/timeEntry.model.ts";
import { useInfo } from "../../context/InfoContext.tsx";

type LogTab = "ticket" | "project";

interface TimeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTicketId?: number;
  defaultProjectId?: number;
}

export const TimeLogModal: React.FC<TimeLogModalProps> = ({
                                                            isOpen,
                                                            onClose,
                                                            defaultTicketId,
                                                            defaultProjectId,
                                                          }) => {
  const { redmineActivity } = useInfo();
  const { tickets } = useTickets();
  const { toastWarn } = useToast();

  const [activeTab, setActiveTab] = useState<LogTab>("ticket");

  // Deduplizierte Projektliste aus den Tickets extrahieren
  const availableProjects = useMemo(() => {
    const projectMap = new Map<number, { id: number; name: string }>();
    tickets.forEach((t: any) => {
      if (t.project && t.project.id) {
        projectMap.set(t.project.id, {
          id: t.project.id,
          name: t.project.name || `Project #${t.project.id}`,
        });
      }
    });
    return Array.from(projectMap.values()).sort((a, b) =>
        a.name.localeCompare(b.name)
    );
  }, [tickets]);

  const [timeForm, setTimeForm] = useState({
    issueId: defaultTicketId || tickets[0]?.id || 0,
    projectId: defaultProjectId || 0,
    hours: 1,
    minutes: 0,
    activity: -1,
    comments: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync Form when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialTicketId = defaultTicketId || tickets[0]?.id || 0;
      const initialProjectId =
          defaultProjectId ||
          availableProjects[0]?.id ||
          (tickets[0] as any)?.project?.id ||
          0;

      setTimeForm((prev) => ({
        ...prev,
        issueId: initialTicketId,
        projectId: initialProjectId,
      }));
      setActiveTab("ticket");
    }
  }, [isOpen, defaultTicketId, defaultProjectId, tickets, availableProjects]);

  if (!isOpen) return null;

  const handleTimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === "ticket" && !timeForm.issueId) {
      toastWarn("Please select a valid ticket.");
      return;
    }

    if (activeTab === "project" && !timeForm.projectId) {
      toastWarn("Please select a valid project.");
      return;
    }

    if (timeForm.hours === 0 && timeForm.minutes === 0) {
      toastWarn("Please enter a valid time duration.");
      return;
    }

    if (timeForm.activity === -1) {
      toastWarn("Please select an activity.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload: LogTimePayload = {
        hours: Number(timeForm.hours),
        minutes: Number(timeForm.minutes),
        activityId: Number(timeForm.activity),
        comment: timeForm.comments.trim(),
        day: new Date().toISOString().split("T")[0],
        ...(activeTab === "project" ? { projectId: timeForm.projectId } : {}),
      };

      if (activeTab === "ticket") {
        await ticketService.logTime(timeForm.issueId, payload);
      } else {
        await ticketService.logProjectTime(timeForm.projectId, payload);
      }

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-sans">
        <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-800 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-blue-950/80 border border-blue-800 text-blue-400">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Log Working Time</h3>
                <p className="text-[11px] text-slate-400">
                  Book hours to a ticket or directly to a project
                </p>
              </div>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold">
            <button
                type="button"
                onClick={() => setActiveTab("ticket")}
                className={`flex items-center justify-center gap-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "ticket"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Ticket Booking</span>
            </button>

            <button
                type="button"
                onClick={() => setActiveTab("project")}
                className={`flex items-center justify-center gap-2 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === "project"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Project Booking</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleTimeSubmit} className="space-y-4 text-xs">
            {/* Dynamic Target Selection (Ticket vs Project) */}
            {activeTab === "ticket" ? (
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">
                    Select Ticket <span className="text-blue-400">*</span>
                  </label>
                  <select
                      value={timeForm.issueId}
                      onChange={(e) =>
                          setTimeForm({
                            ...timeForm,
                            issueId: Number(e.target.value),
                          })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    {tickets.length === 0 ? (
                        <option value={0}>No tickets available</option>
                    ) : (
                        tickets.map((t) => (
                            <option key={t.id} value={t.id}>
                              #{t.id} - {t.subject}
                            </option>
                        ))
                    )}
                  </select>
                </div>
            ) : (
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">
                    Select Project <span className="text-blue-400">*</span>
                  </label>
                  <select
                      value={timeForm.projectId}
                      onChange={(e) =>
                          setTimeForm({
                            ...timeForm,
                            projectId: Number(e.target.value),
                          })
                      }
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                  >
                    {availableProjects.length === 0 ? (
                        <option value={0}>No projects available</option>
                    ) : (
                        availableProjects.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                        ))
                    )}
                  </select>
                </div>
            )}

            {/* Time & Activity Row */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  Hours (h)
                </label>
                <input
                    type="number"
                    min="0"
                    max="24"
                    value={timeForm.hours}
                    onChange={(e) =>
                        setTimeForm({
                          ...timeForm,
                          hours: Math.max(0, parseInt(e.target.value, 10) || 0),
                        })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono font-bold text-center"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  Minutes (m)
                </label>
                <input
                    type="number"
                    min="0"
                    max="59"
                    step="5"
                    value={timeForm.minutes}
                    onChange={(e) =>
                        setTimeForm({
                          ...timeForm,
                          minutes: Math.max(0, parseInt(e.target.value, 10) || 0),
                        })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono font-bold text-center"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1.5">
                  Activity <span className="text-blue-400">*</span>
                </label>
                <select
                    value={timeForm.activity}
                    onChange={(e) =>
                        setTimeForm({
                          ...timeForm,
                          activity: Number(e.target.value),
                        })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  <option value={-1}>Select...</option>
                  {redmineActivity.map((activity) => (
                      <option key={activity.id} value={activity.id}>
                        {activity.name}
                      </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Comment
              </label>
              <input
                  type="text"
                  value={timeForm.comments}
                  onChange={(e) =>
                      setTimeForm({ ...timeForm, comments: e.target.value })
                  }
                  placeholder={
                    activeTab === "ticket"
                        ? "e.g. Implemented feature logic and added unit tests"
                        : "e.g. Sprint planning, architecture sync, general refinement"
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>
                {isSubmitting
                    ? "Logging..."
                    : activeTab === "ticket"
                        ? "Log to Ticket"
                        : "Log to Project"}
              </span>
              </button>
            </div>
          </form>
        </div>
      </div>
  );
};