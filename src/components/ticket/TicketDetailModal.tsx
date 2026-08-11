import React, { useEffect, useRef, useState } from "react";
import { ArrowUp, Clock, Download, X } from "lucide-react";
import textile from "textile-js";
import DOMPurify from "dompurify";
import { Issue } from "../../models/ticketModel.model.ts";
import { LogTimePayload } from "../../models/timeEntry.model.ts";
import { useInfo } from "../../context/InfoContext.tsx";
import { getStatusBadgeClass } from "../../utils/ticket.util.ts";
import { useToast } from "../../toaster/ToastContext.tsx";

interface TicketDetailModalProps {
  ticket: Issue;
  initialTab?: "details" | "comments" | "files" | "time";
  onClose: () => void;
  onAddComment: (ticketId: number, comment: string) => Promise<void>;
  onLogTime: (ticketId: number, data: LogTimePayload) => Promise<void>;
  onDownloadFile: (contentUrl: string, filename: string) => void;
}

interface TempComment {
  id: string | number;
  userName: string;
  notes: string;
  createdOn: string;
  isMe: boolean;
}

const renderRedmineTextile = (text: string): string => {
  if (!text) return "";
  const rawHtml = textile(text);
  return DOMPurify.sanitize(rawHtml);
};

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticket,
  initialTab = "details",
  onClose,
  onAddComment,
  onLogTime,
  onDownloadFile,
}) => {
  const { redmineActivity } = useInfo();
  const [activeDetailTab, setActiveDetailTab] = useState<
    "details" | "comments" | "files" | "time"
  >(initialTab);

  const { toastWarn } = useToast();
  const [commentInput, setCommentInput] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [localComments, setLocalComments] = useState<TempComment[]>([]);
  const commentsTopRef = useRef<HTMLDivElement | null>(null);

  const [timeBooking, setTimeBooking] = useState({
    hours: 0,
    minutes: 0,
    activityId: 9,
    date: new Date().toISOString().split("T")[0],
    comment: "",
  });

  const existingJournals = [
    ...(
      ticket.journals?.filter((j) => j.notes && j.notes.trim() !== "") || []
    ).map((j) => ({
      id: j.id,
      userName: j.user.name,
      notes: j.notes,
      createdOn: j.createdOn,
      isMe: j.user.name?.toLowerCase().includes("you") || false,
    })),
  ].reverse();

  const allJournals = [...localComments, ...existingJournals];
  const scrollToTop = () => {
    commentsTopRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeDetailTab === "comments") {
      scrollToTop();
    }
  }, [activeDetailTab, localComments.length]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed) return;

    setIsSubmittingComment(true);

    try {
      await onAddComment(ticket.id, trimmed);
      setLocalComments((prev) => [
        {
          id: `temp-${Date.now()}`,
          userName: "You",
          notes: trimmed,
          createdOn: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isMe: true,
        },
        ...prev,
      ]);

      setCommentInput("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleTimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hrs = Number(timeBooking.hours);
    const mins = Number(timeBooking.minutes);

    if (hrs === 0 && mins === 0) {
      toastWarn("Please enter a valid time duration.");
      return;
    }

    if (timeBooking.activityId == -1 || timeBooking.activityId == null) {
      toastWarn("Please select an activity.");
      return;
    }

    const payload: LogTimePayload = {
      day: timeBooking.date,
      hours: hrs,
      minutes: mins,
      activityId: timeBooking.activityId,
      comment: timeBooking.comment,
    };

    await onLogTime(ticket.id, payload);

    setTimeBooking({
      hours: 0,
      minutes: 0,
      activityId: -1,
      date: new Date().toISOString().split("T")[0],
      comment: "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs font-sans text-xs">
      <div className="w-[80vw] h-[80vh] bg-slate-900 rounded-2xl flex flex-col shadow-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-sm font-bold text-blue-400">
                #{ticket.id}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold text-slate-300">
                {ticket.tracker.name}
              </span>
              <span
                className={`inline-flex items-center justify-center whitespace-nowrap leading-none px-2 py-0.5 rounded text-[10px] font-bold ${getStatusBadgeClass(ticket.status.name)}`}
              >
                {ticket.status.name}
              </span>
            </div>
            <h3 className="text-base font-bold text-white line-clamp-1">
              {ticket.subject}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center space-x-1 px-5 border-b border-slate-800 bg-slate-950/50 shrink-0">
          <button
            type="button"
            onClick={() => setActiveDetailTab("details")}
            className={`py-2.5 px-3 border-b-2 font-bold text-xs cursor-pointer ${activeDetailTab === "details" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}
          >
            Details & Description
          </button>
          <button
            type="button"
            onClick={() => setActiveDetailTab("comments")}
            className={`py-2.5 px-3 border-b-2 font-bold text-xs cursor-pointer ${activeDetailTab === "comments" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}
          >
            Comments ({allJournals.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveDetailTab("files")}
            className={`py-2.5 px-3 border-b-2 font-bold text-xs cursor-pointer ${activeDetailTab === "files" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}
          >
            Files ({ticket.attachments?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveDetailTab("time")}
            className={`py-2.5 px-3 border-b-2 font-bold text-xs cursor-pointer ${activeDetailTab === "time" ? "border-blue-500 text-blue-400" : "border-transparent text-slate-400"}`}
          >
            Time Tracking
          </button>
        </div>

        {activeDetailTab === "comments" ? (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-950/60 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans">
              <div ref={commentsTopRef} />

              {allJournals.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800/80">
                  No comments yet. Start the conversation below.
                </div>
              ) : (
                allJournals.map((journal) => {
                  const isMe = journal.isMe || journal.userName === "You";

                  return (
                    <div
                      key={journal.id}
                      className={`flex flex-col ${
                        isMe ? "items-end" : "items-start"
                      } space-y-1 group`}
                    >
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 px-1">
                        <span className="font-semibold text-slate-400">
                          {journal.userName}
                        </span>
                        <span>•</span>
                        <span className="font-mono">{journal.createdOn}</span>
                      </div>

                      <div
                        className={`max-w-[75%] px-4 py-2.5 shadow-sm text-xs leading-relaxed overflow-x-auto
                          [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0
                          [&_table]:w-full [&_table]:border-collapse [&_table]:my-2
                          [&_th]:bg-slate-950 [&_th]:border [&_th]:border-slate-800 [&_th]:p-2 [&_th]:font-bold [&_th]:text-slate-200
                          [&_td]:border [&_td]:border-slate-800/80 [&_td]:p-2
                          [&_pre]:bg-slate-950 [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-slate-800 [&_pre]:font-mono [&_pre]:text-blue-300 [&_pre]:my-2 [&_pre]:overflow-x-auto
                          [&_code]:bg-slate-950 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-blue-300 [&_code]:border [&_code]:border-slate-800
                          [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-white [&_h1]:my-2
                          [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-slate-100 [&_h2]:my-1.5
                          [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-slate-200 [&_h3]:my-1
                          [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4
                          ${
                            isMe
                              ? "bg-blue-600 text-white rounded-2xl rounded-br-xs font-normal"
                              : "bg-slate-800 text-slate-100 rounded-2xl rounded-bl-xs border border-slate-700/50"
                          }`}
                        dangerouslySetInnerHTML={{
                          __html: renderRedmineTextile(journal.notes),
                        }}
                      />
                    </div>
                  );
                })
              )}
            </div>
            <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 shrink-0 backdrop-blur-md">
              <form
                onSubmit={handleCommentSubmit}
                className="flex items-end gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-1.5 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all"
              >
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleCommentSubmit(e);
                    }
                  }}
                  placeholder="Write a comment (supports Redmine Textile)..."
                  rows={1}
                  required
                  className="flex-1 bg-transparent px-3 py-1.5 text-white placeholder-slate-500 focus:outline-none font-sans text-xs resize-none min-h-[32px] max-h-[120px]"
                />
                <button
                  type="submit"
                  disabled={isSubmittingComment || !commentInput.trim()}
                  className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all shrink-0 ${
                    commentInput.trim()
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md"
                      : "bg-slate-800 text-slate-600 cursor-not-allowed opacity-50"
                  }`}
                  title="Send message"
                >
                  <ArrowUp className="w-4 h-4 stroke-[3]" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 min-h-0">
            {activeDetailTab === "details" && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-slate-800/60 rounded-xl border border-slate-700/60">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Project
                    </span>
                    <p className="font-bold text-slate-200 truncate">
                      {ticket.project.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Priority
                    </span>
                    <p className="font-bold text-slate-200">
                      {ticket.priority.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Updated
                    </span>
                    <p className="font-mono text-[11px] font-semibold text-slate-200 truncate">
                      {ticket.updatedOn || "---"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Author
                    </span>
                    <p className="font-bold text-slate-200 truncate">
                      {ticket.author?.name || "---"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">
                      Assignee
                    </span>
                    <p className="font-bold text-slate-200 truncate">
                      {ticket.assignedTo?.name || "Unassigned"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-200 text-sm">
                    Description
                  </h4>
                  <div
                    className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-slate-300 font-sans text-xs leading-relaxed overflow-x-auto
                      [&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0
                      [&_table]:w-full [&_table]:border-collapse [&_table]:my-3
                      [&_th]:bg-slate-900 [&_th]:border [&_th]:border-slate-800 [&_th]:p-2 [&_th]:font-bold [&_th]:text-slate-200
                      [&_td]:border [&_td]:border-slate-800/80 [&_td]:p-2
                      [&_pre]:bg-slate-900 [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-slate-800 [&_pre]:font-mono [&_pre]:text-blue-300 [&_pre]:my-2 [&_pre]:overflow-x-auto
                      [&_code]:bg-slate-900 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-blue-300 [&_code]:border [&_code]:border-slate-800
                      [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-white [&_h1]:my-2
                      [&_h2]:text-sm [&_h2]:font-bold [&_h2]:text-slate-100 [&_h2]:my-1.5
                      [&_h3]:text-xs [&_h3]:font-bold [&_h3]:text-slate-200 [&_h3]:my-1
                      [&_ul]:list-disc [&_ul]:ml-4 [&_ol]:list-decimal [&_ol]:ml-4"
                    dangerouslySetInnerHTML={{
                      __html: renderRedmineTextile(
                        ticket.description || "No description available.",
                      ),
                    }}
                  />
                </div>
              </div>
            )}

            {activeDetailTab === "files" && (
              <div className="space-y-3">
                {!ticket.attachments || ticket.attachments.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-950/40 rounded-xl border border-slate-800">
                    No attachments available.
                  </div>
                ) : (
                  ticket.attachments.map((file) => (
                    <div
                      key={file.id || file.contentUrl}
                      className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-white text-sm break-all">
                            {file.filename}
                          </span>
                          {file.author?.name && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-700/60 text-slate-300 border border-slate-600/50 shrink-0">
                              {file.author.name}
                            </span>
                          )}
                        </div>
                        {file.description && (
                          <p className="text-slate-300 text-xs">
                            {file.description}
                          </p>
                        )}
                        <div className="text-[10px] font-mono text-slate-400">
                          Added on: {file.createdOn}
                        </div>
                      </div>
                      <div className="shrink-0 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            onDownloadFile(file.contentUrl, file.filename);
                          }}
                          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors text-xs flex items-center space-x-1.5 cursor-pointer shadow-md"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeDetailTab === "time" && (
              <div className="space-y-6">
                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      Time Spent So Far
                    </span>
                    <span className="px-3 py-1 rounded-full bg-blue-950 text-blue-300 font-bold border border-blue-800 text-xs">
                      {ticket.spentHours || 0} hrs
                    </span>
                  </div>
                  <p className="text-slate-400">
                    Estimated hours on ticket:{" "}
                    <strong className="text-slate-200">
                      {ticket.estimatedHours || 0} hrs
                    </strong>
                  </p>
                </div>

                <div className="p-5 bg-slate-800/40 rounded-xl border border-slate-700/60 space-y-4">
                  <span className="font-bold text-blue-300 flex items-center space-x-1.5 text-xs">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>Log New Working Time</span>
                  </span>

                  <form onSubmit={handleTimeSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">
                          Hours
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="24"
                          value={timeBooking.hours}
                          onChange={(e) =>
                            setTimeBooking({
                              ...timeBooking,
                              hours: Math.max(0, parseInt(e.target.value) || 0),
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">
                          Minutes
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="59"
                          step="5"
                          value={timeBooking.minutes}
                          onChange={(e) =>
                            setTimeBooking({
                              ...timeBooking,
                              minutes: Math.max(
                                0,
                                parseInt(e.target.value) || 0,
                              ),
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">
                          Activity
                        </label>
                        <select
                          value={timeBooking.activityId}
                          onChange={(e) =>
                            setTimeBooking({
                              ...timeBooking,
                              activityId: e.target.value as unknown as number,
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                        >
                          <option value={-1}>Select Activity</option>
                          {redmineActivity.map((activity) => (
                            <option key={activity.id} value={activity.id}>
                              {activity.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">
                          Date (Day)
                        </label>
                        <input
                          type="date"
                          required
                          value={timeBooking.date}
                          onChange={(e) =>
                            setTimeBooking({
                              ...timeBooking,
                              date: e.target.value,
                            })
                          }
                          className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">
                        Comment / Description
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Refactored REST API endpoints & wrote unit tests"
                        value={timeBooking.comment}
                        onChange={(e) =>
                          setTimeBooking({
                            ...timeBooking,
                            comment: e.target.value,
                          })
                        }
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center space-x-1.5 cursor-pointer shadow-md transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Log Time Now</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
