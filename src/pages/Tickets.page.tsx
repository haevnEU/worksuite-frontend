import React, { useState } from "react";
import { RedmineTicket } from "../models/ticket.model.ts";
import { useTickets } from "../context/TicketContext.tsx";
import { useSettings } from "../context/SettingsContext.tsx";
import { Issue } from "../models/ticketModel.model.ts";
import { LogTimePayload } from "../models/timeEntry.model.ts";
import { ticketService } from "../services/network/ticket.service.ts";

import {
  MrLinkModal,
  QaProtocolData,
  QaProtocolModal,
  SortDirection,
  SortField,
  TicketDetailModal,
  TicketFilterBar,
  TicketHeader,
  TicketTable,
} from "../components/ticket";
import { useToast } from "../toaster/ToastContext.tsx";
import { MissingApiKeyCard } from "../components/MissingApiKeyCard.tsx";

interface ParsedQuery {
  exactFilters: Record<string, string>;
  textTokens: string[];
}

const parseGitLabQuery = (query: string): ParsedQuery => {
  const exactFilters: Record<string, string> = {};
  const textTokens: string[] = [];

  const normalized = query.replace(/\s*(&&|\bAND\b)\s*/gi, " ").trim();
  if (!normalized) {
    return { exactFilters, textTokens };
  }

  const regex = /(?:([\w.-]+)[:=](?:"([^"]*)"|(\S+)))|(?:"([^"]+)"|([^\s]+))/g;

  let match: RegExpExecArray | null;
  while ((match = regex.exec(normalized)) !== null) {
    const key = match[1]?.toLowerCase();
    const keyValue = match[2] ?? match[3];
    const freeText = match[4] ?? match[5];

    if (key && keyValue !== undefined) {
      exactFilters[key] = keyValue.trim().toLowerCase();
    } else if (freeText && freeText.trim().length > 0) {
      textTokens.push(freeText.trim().toLowerCase());
    }
  }

  return { exactFilters, textTokens };
};

const matchesTicketQuery = (ticket: any, searchQuery: string): boolean => {
  if (!searchQuery || searchQuery.trim() === "") {
    return true;
  }

  const { exactFilters, textTokens } = parseGitLabQuery(searchQuery);

  const getStr = (val: any): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === "string") return val.trim().toLowerCase();
    if (typeof val === "object" && val.name) return String(val.name).trim().toLowerCase();
    return String(val).trim().toLowerCase();
  };

  const idStr = String(ticket.id ?? "");
  const subjectStr = getStr(ticket.subject);
  const descriptionStr = getStr(ticket.description);
  const authorStr = getStr(ticket.author);
  const assignedStr = getStr(ticket.assignedTo);
  const createdStr = getStr(ticket.createdOn);
  const updatedStr = getStr(ticket.updatedOn);
  const statusStr = getStr(ticket.status);
  const priorityStr = getStr(ticket.priority);
  const projectStr = getStr(ticket.project);
  const trackerStr = getStr(ticket.tracker);

  for (const [key, expected] of Object.entries(exactFilters)) {
    switch (key) {
      case "id":
        if (!idStr.includes(expected)) return false;
        break;
      case "subject":
        if (!subjectStr.includes(expected)) return false;
        break;
      case "description":
        if (!descriptionStr.includes(expected)) return false;
        break;
      case "author":
        if (!authorStr.includes(expected)) return false;
        break;
      case "assignedto":
      case "assigned_to":
      case "assignee":
        if (!assignedStr.includes(expected)) return false;
        break;
      case "createdon":
      case "created_on":
        if (!createdStr.includes(expected)) return false;
        break;
      case "updatedon":
      case "updated_on":
        if (!updatedStr.includes(expected)) return false;
        break;
      case "status":
        if (!statusStr.includes(expected)) return false;
        break;
      case "priority":
        if (!priorityStr.includes(expected)) return false;
        break;
      case "project":
        if (!projectStr.includes(expected)) return false;
        break;
      case "tracker":
        if (!trackerStr.includes(expected)) return false;
        break;
      default:
        return false;
    }
  }

  for (const token of textTokens) {
    const matchesAnyField =
        idStr.includes(token) ||
        subjectStr.includes(token) ||
        descriptionStr.includes(token) ||
        authorStr.includes(token) ||
        assignedStr.includes(token) ||
        createdStr.includes(token) ||
        updatedStr.includes(token) ||
        statusStr.includes(token) ||
        priorityStr.includes(token) ||
        projectStr.includes(token) ||
        trackerStr.includes(token);

    if (!matchesAnyField) {
      return false;
    }
  }

  return true;
};

export const TicketsPage: React.FC = () => {
  const { hasRedmineKey } = useSettings();
  const { status, projects, fetchTickets, tickets } = useTickets();
  const { toastGood } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [projectIdFilter, setProjectIdFilter] = useState<number | "all">(375);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [sortField, setSortField] = useState<SortField>("tracker");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const [selectedTicket, setSelectedTicket] = useState<Issue | null>(null);
  const [selectedTicketTab, setSelectedTicketTab] = useState<
      "details" | "comments" | "files" | "time"
  >("details");

  const [mrModalTicket, setMrModalTicket] = useState<RedmineTicket | null>(null);
  const [qsModalTicket, setQsModalTicket] = useState<RedmineTicket | null>(null);

  const resetLocalFilter = () => {
    setSearchQuery("");
    setProjectIdFilter(375);
    setStatusFilter("all");
    setSortField("tracker");
    setSortDirection("asc");
  };

  const calculateOpenTickets = () => {
    return tickets.filter((t) => {
      const statusName = t.status?.name?.toLowerCase() || "";
      return (
          !statusName.includes("closed") &&
          !statusName.includes("resolved") &&
          !statusName.includes("rejected") &&
          !statusName.includes("obsolete")
      );
    }).length;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleOpenDetailModal = (
      ticket: Issue,
      initialTab: "details" | "comments" | "files" | "time" = "details"
  ) => {
    setSelectedTicketTab(initialTab);
    setSelectedTicket(ticket);
  };

  const handleSaveMR = async (ticketId: number, protocol: any) => {
    await ticketService.createMergeRequest(ticketId, protocol);
    toastGood(`Merge Request Link for Ticket #${ticketId} successfully saved!`);
    setMrModalTicket(null);
    await fetchTickets();
  };

  const handleSaveQaProtocol = async (ticketId: number, qaFormData: QaProtocolData) => {
    await ticketService.moveToQA(ticketId, qaFormData);
    toastGood(`Ticket #${ticketId} successfully submitted to QA!`);
    setQsModalTicket(null);
    await fetchTickets();
  };

  const handleAddComment = async (ticketId: number, comment: string) => {
    await ticketService.addComment(ticketId, comment);
    toastGood("Comment successfully added!");
    await fetchTickets();
  };

  const handleLogTime = async (ticketId: number, data: LogTimePayload) => {
    await ticketService.logTime(ticketId, data);
    toastGood(`Logged ${data.hours}h ${data.minutes}m successfully for Ticket #${ticketId}!`);
    await fetchTickets();
  };

  if (!hasRedmineKey) {
    return (
        <div className="h-full flex flex-col space-y-4 pb-4 font-sans overflow-hidden">
          <TicketHeader openTicketsCount={0} totalTicketsCount={0} onRefresh={fetchTickets} />
          <MissingApiKeyCard
              title="Redmine API Key Not Found"
              serviceName="Redmine"
              description="Your ticket workspace cannot synchronize issues, comments, or log time because no API key is configured."
              accentColor="blue"
          />
        </div>
    );
  }

  const filteredAndSortedTickets = tickets
      .filter((t) => {
        if (projectIdFilter !== "all") {
          const matchesProjectId = t.project?.id === projectIdFilter;
          const matchesProjectName =
              t.project?.name?.toLowerCase() === String(projectIdFilter).toLowerCase();
          if (!matchesProjectId && !matchesProjectName) return false;
        }

        if (statusFilter !== "all") {
          const matchesStatusName =
              t.status?.name?.toLowerCase() === String(statusFilter).toLowerCase();
          const matchesStatusId = String(t.status?.id) === String(statusFilter);
          if (!matchesStatusName && !matchesStatusId) return false;
        }

        return matchesTicketQuery(t, searchQuery);
      })
      .sort((a, b) => {
        let aValue: any = "";
        let bValue: any = "";

        switch (sortField) {
          case "id":
            aValue = a.id;
            bValue = b.id;
            break;
          case "project":
            aValue = a.project?.name || "";
            bValue = b.project?.name || "";
            break;
          case "tracker":
            aValue = a.tracker?.name || "";
            bValue = b.tracker?.name || "";
            break;
          case "subject":
            aValue = a.subject || "";
            bValue = b.subject || "";
            break;
          case "status":
            aValue = a.status?.name || "";
            bValue = b.status?.name || "";
            break;
          case "priority":
            aValue = a.priority?.id || 0;
            bValue = b.priority?.id || 0;
            break;
        }

        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });

  return (
      <div className="h-full flex flex-col min-h-0 space-y-3 font-sans overflow-hidden">
        <div className="shrink-0">
          <TicketHeader
              openTicketsCount={calculateOpenTickets()}
              totalTicketsCount={tickets.length}
              onRefresh={fetchTickets}
          />
        </div>

        <div className="shrink-0">
          <TicketFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              projectIdFilter={projectIdFilter}
              onProjectChange={setProjectIdFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              projects={projects}
              statusList={status}
              onReset={resetLocalFilter}
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <TicketTable
              tickets={filteredAndSortedTickets}
              totalCount={tickets.length}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onOpenMRModal={(ticket) => setMrModalTicket(ticket)}
              onOpenQSModal={(ticket) => setQsModalTicket(ticket)}
              onOpenDetailModal={handleOpenDetailModal}
          />
        </div>

        {selectedTicket && (
            <TicketDetailModal
                ticket={selectedTicket}
                initialTab={selectedTicketTab}
                onClose={() => setSelectedTicket(null)}
                onAddComment={handleAddComment}
                onLogTime={handleLogTime}
                onDownloadFile={(url, filename) => ticketService.downloadAttachment(url, filename)}
            />
        )}

        {mrModalTicket && (
            <MrLinkModal
                ticket={mrModalTicket}
                onClose={() => setMrModalTicket(null)}
                onSave={handleSaveMR}
            />
        )}

        {qsModalTicket && (
            <QaProtocolModal
                ticket={qsModalTicket}
                onClose={() => setQsModalTicket(null)}
                onSave={handleSaveQaProtocol}
            />
        )}
      </div>
  );
};