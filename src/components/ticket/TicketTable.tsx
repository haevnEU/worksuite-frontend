import React, { useMemo, useState, useEffect } from "react";
import {
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  ExternalLink,
  Eye,
  GitPullRequest,
  ShieldCheck,
} from "lucide-react";
import { Issue } from "../../models/ticketModel.model.ts";
import { CustomField, RedmineTicket } from "../../models/ticket.model";
import {
  getPriorityBadgeClass,
  getStatusBadgeClass,
  getTrackerColor,
  getTicketLink, getProjectLink,
} from "../../utils/ticket.util.ts";

export type SortField =
    | "id"
    | "project"
    | "tracker"
    | "subject"
    | "status"
    | "priority"
    | "estimatedHours";

export type SortDirection = "asc" | "desc";

interface TicketTableProps {
  tickets: (Issue & {
    customFields?: CustomField[];
    custom_fields?: CustomField[];
  })[];
  totalCount: number;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onOpenMRModal: (ticket: RedmineTicket) => void;
  onOpenQSModal: (ticket: RedmineTicket) => void;
  onOpenDetailModal: (
      ticket: Issue,
      initialTab?: "details" | "comments" | "files" | "time"
  ) => void;
}

const STATUS_WEIGHTS: Record<string, number> = {
  review: 2,
  "in review": 2,
  "in progress": 1,
};

const PRIORITY_WEIGHTS: Record<string, number> = {
  immediate: 5,
  urgent: 4,
  high: 3,
  normal: 2,
  low: 1,
};

export const TicketTable: React.FC<TicketTableProps> = ({
                                                          tickets,
                                                          totalCount,
                                                          sortField,
                                                          sortDirection,
                                                          onSort,
                                                          onOpenMRModal,
                                                          onOpenQSModal,
                                                          onOpenDetailModal,
                                                        }) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  useEffect(() => {
    setCurrentPage(1);
  }, [tickets.length, sortField, sortDirection]);

  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "id":
          comparison = Number(a.id) - Number(b.id);
          break;

        case "project":
          comparison = (a.project?.name || "").localeCompare(b.project?.name || "");
          break;

        case "tracker":
          comparison = (a.tracker?.name || "").localeCompare(b.tracker?.name || "");
          break;

        case "subject":
          comparison = (a.subject || "").localeCompare(b.subject || "");
          break;

        case "status": {
          const statusAKey = String(a.status?.name || a.status?.id || "").toLowerCase().trim();
          const statusBKey = String(b.status?.name || b.status?.id || "").toLowerCase().trim();

          const weightA = STATUS_WEIGHTS[statusAKey] || 0;
          const weightB = STATUS_WEIGHTS[statusBKey] || 0;

          if (weightA !== weightB) {
            comparison = weightA - weightB;
          } else {
            comparison = (a.status?.name || "").localeCompare(b.status?.name || "");
          }
          break;
        }

        case "priority": {
          const prioAKey = String(a.priority?.name || a.priority?.id || "").toLowerCase().trim();
          const prioBKey = String(b.priority?.name || b.priority?.id || "").toLowerCase().trim();

          const weightA = PRIORITY_WEIGHTS[prioAKey] || 0;
          const weightB = PRIORITY_WEIGHTS[prioBKey] || 0;

          if (weightA !== weightB) {
            comparison = weightA - weightB;
          } else {
            comparison = (a.priority?.name || "").localeCompare(b.priority?.name || "");
          }
          break;
        }

        case "estimatedHours":
          comparison = (a.estimatedHours || 0) - (b.estimatedHours || 0);
          break;

        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [tickets, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedTickets.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedTickets.length);
  const paginatedTickets = sortedTickets.slice(startIndex, endIndex);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
          <ArrowUpDown className="w-3 h-3 text-slate-500 opacity-50 group-hover:opacity-100 transition-opacity" />
      );
    }
    return sortDirection === "asc" ? (
        <ChevronUp className="w-3.5 h-3.5 text-blue-400" />
    ) : (
        <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
    );
  };

  const getCustomFieldValue = (ticket: any, fieldName: string): string | null => {
    const fields: CustomField[] = ticket.customFields || ticket.custom_fields || [];
    const found = fields.find((cf) => cf.name === fieldName);
    if (!found || !found.value) return null;
    if (Array.isArray(found.value)) {
      return found.value.length > 0 ? found.value[0] : null;
    }
    return String(found.value).trim() || null;
  };

  return (
      <div className="flex-1 min-h-0 bg-slate-900 rounded-2xl border border-slate-800 shadow-sm flex flex-col overflow-hidden font-sans">
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm text-white">Tickets List</span>
            <span className="text-xs text-slate-400">
            ({tickets.length} of {totalCount} results)
          </span>
          </div>
          <span className="text-[11px] text-slate-400 italic">Click on column headers to sort</span>
        </div>

        {/* Intern scrollbare Tabelle mit fixer Kopfzeile */}
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-900 text-slate-200 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800 select-none shadow-sm">
              <tr>
                <th
                    onClick={() => onSort("id")}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>ID</span>
                    {renderSortIcon("id")}
                  </div>
                </th>
                <th
                    onClick={() => onSort("project")}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Project</span>
                    {renderSortIcon("project")}
                  </div>
                </th>
                <th
                    onClick={() => onSort("tracker")}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Tracker</span>
                    {renderSortIcon("tracker")}
                  </div>
                </th>
                <th
                    onClick={() => onSort("subject")}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Subject</span>
                    {renderSortIcon("subject")}
                  </div>
                </th>
                <th
                    onClick={() => onSort("status")}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Status</span>
                    {renderSortIcon("status")}
                  </div>
                </th>
                <th
                    onClick={() => onSort("priority")}
                    className="py-3 px-4 cursor-pointer hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center space-x-1.5">
                    <span>Priority</span>
                    {renderSortIcon("priority")}
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {paginatedTickets.map((t) => {
                const mrCodeUrl = getCustomFieldValue(t, "Merge-Request (Code)");
                const mrITestsUrl = getCustomFieldValue(t, "Merge-Request (itest)");

                return (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">
                        <a
                            href={getTicketLink(t.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 hover:underline flex items-center space-x-1"
                            title={`Open Ticket #${t.id} in Redmine`}
                        >
                          <span>#{t.id}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                        </a>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-200">
                        <a
                            href={getProjectLink(t.project.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 hover:underline flex items-center space-x-1"
                            title={`Open Project #${t.project.id} in Redmine`}
                        >
                          <span>{t.project.name}</span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                        </a>
                      </td>
                      <td className="py-3 px-4">
                    <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold border whitespace-nowrap ${getTrackerColor(
                            t.tracker.name
                        )}`}
                    >
                      {t.tracker.name}
                    </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white max-w-xs truncate">
                        <a
                            href={getTicketLink(t.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-300 hover:underline"
                            title={t.subject}
                        >
                          {t.subject}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                    <span
                        className={`inline-flex items-center justify-center whitespace-nowrap leading-none px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadgeClass(
                            t.status.name
                        )}`}
                    >
                      {t.status.name}
                    </span>
                      </td>
                      <td className="py-3 px-4">
                    <span
                        className={`inline-flex items-center justify-center whitespace-nowrap leading-none px-2 py-1 rounded text-[10px] font-bold border ${getPriorityBadgeClass(
                            t.priority.name
                        )}`}
                    >
                      {t.priority.name}
                    </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end space-x-1.5">
                          {mrCodeUrl ? (
                              <a
                                  href={mrCodeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1.5 rounded-lg bg-orange-950/80 hover:bg-orange-900 text-orange-200 border border-orange-800/80 font-bold text-[11px] cursor-pointer transition-colors flex items-center space-x-1"
                              >
                                <GitPullRequest className="w-3.5 h-3.5 text-orange-400" />
                                <span className="hidden xl:inline">MR Code</span>
                                <ExternalLink className="w-3 h-3 text-orange-400 opacity-70" />
                              </a>
                          ) : (
                              <button
                                  type="button"
                                  onClick={() => onOpenMRModal(t as any)}
                                  className="px-2.5 py-1.5 rounded-lg bg-orange-950/80 hover:bg-orange-900 text-orange-200 border border-orange-800/80 font-bold text-[11px] cursor-pointer transition-colors flex items-center space-x-1"
                              >
                                <GitPullRequest className="w-3.5 h-3.5 text-orange-400" />
                                <span className="hidden xl:inline">MR Link</span>
                              </button>
                          )}

                          {mrITestsUrl && (
                              <a
                                  href={mrITestsUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-800/80 font-bold text-[11px] cursor-pointer transition-colors flex items-center space-x-1"
                              >
                                <GitPullRequest className="w-3.5 h-3.5 text-amber-400" />
                                <span className="hidden xl:inline">MR iTests</span>
                                <ExternalLink className="w-3 h-3 text-amber-400 opacity-70" />
                              </a>
                          )}

                          <button
                              type="button"
                              onClick={() => onOpenQSModal(t as any)}
                              className="px-2.5 py-1.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 text-purple-200 border border-purple-800/80 font-bold text-[11px] cursor-pointer transition-colors flex items-center space-x-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                            <span className="hidden xl:inline">Move to QA</span>
                          </button>

                          <button
                              type="button"
                              onClick={() => onOpenDetailModal(t, "time")}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-blue-200 border border-blue-800/80 font-bold text-[11px] cursor-pointer transition-colors flex items-center space-x-1"
                          >
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                            <span className="hidden xl:inline">Log Time</span>
                          </button>

                          <button
                              type="button"
                              onClick={() => onOpenDetailModal(t, "details")}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold text-[11px] cursor-pointer transition-colors flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span className="hidden md:inline">Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                );
              })}

              {sortedTickets.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 space-y-2">
                      <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="font-semibold text-sm">No tickets found</p>
                      <p className="text-xs text-slate-500">Adjust your search criteria or filters</p>
                    </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Fixer Pagination-Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center space-x-3 text-slate-400">
            <div className="flex items-center space-x-1.5">
              <span>Show:</span>
              <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <span className="hidden sm:inline text-slate-600">|</span>

            <span>
            Showing <strong className="text-slate-200">{sortedTickets.length === 0 ? 0 : startIndex + 1}</strong> to{" "}
              <strong className="text-slate-200">{endIndex}</strong> of{" "}
              <strong className="text-slate-200">{sortedTickets.length}</strong> filtered tickets
          </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 text-slate-300 font-medium">
            Page <strong className="text-white">{currentPage}</strong> of{" "}
              <strong className="text-white">{totalPages}</strong>
          </span>

            <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
  );
};