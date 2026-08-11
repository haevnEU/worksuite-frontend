import React, { useState } from "react";
import { Clock, X } from "lucide-react";
import { useTickets } from "../../context/TicketContext.tsx";
import { useToast } from "../../toaster/ToastContext.tsx";
import { ticketService } from "../../services/network/ticket.service.ts";
import { LogTimePayload } from "../../models/timeEntry.model.ts";
import { useInfo } from "../../context/InfoContext.tsx";

interface TimeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TimeLogModal: React.FC<TimeLogModalProps> = ({
  isOpen,
  onClose,
}) => {
  const logTime = async (ticketId: number, payload: LogTimePayload) => {
    await ticketService.logTime(ticketId, payload);
  };
  const { redmineActivity } = useInfo();
  const { tickets } = useTickets();
  const { toastWarn } = useToast();

  const [timeForm, setTimeForm] = useState({
    issueId: tickets[0]?.id,
    hours: 1,
    minutes: 0,
    activity: -1,
    comments: "",
  });

  if (!isOpen) return null;

  const handleTimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeForm.hours === 0 && timeForm.minutes === 0) {
      toastWarn("Please enter a valid time duration.");
      return;
    }

    if (timeForm.activity == -1) {
      toastWarn("Please select an activity.");
      return;
    }
    await logTime(timeForm.issueId, {
      hours: Number(timeForm.hours),
      minutes: Number(timeForm.minutes),
      activityId: timeForm.activity,
      comment: timeForm.comments,
      day: new Date().toISOString().split("T")[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <h3 className="text-base font-bold text-white">Log Working Time</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleTimeSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Select Ticket
            </label>
            <select
              value={timeForm.issueId}
              onChange={(e) =>
                setTimeForm({
                  ...timeForm,
                  issueId: Number(e.target.value),
                })
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {tickets.map((t) => (
                <option key={t.id} value={t.id}>
                  #{t.id} - {t.subject}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
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
                    hours: Math.max(0, parseInt(e.target.value) || 0),
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
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
                    minutes: Math.max(0, parseInt(e.target.value) || 0),
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Activity
              </label>
              <select
                value={timeForm.activity}
                onChange={(e) =>
                  setTimeForm({
                    ...timeForm,
                    activity: e.target.value as unknown as number,
                  })
                }
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value={-1}>Select Activity</option>
                {redmineActivity.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Comment
            </label>
            <input
              type="text"
              value={timeForm.comments}
              onChange={(e) =>
                setTimeForm({ ...timeForm, comments: e.target.value })
              }
              placeholder="e.g. Tested bugfix and performed code review"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
            >
              Log Time
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
