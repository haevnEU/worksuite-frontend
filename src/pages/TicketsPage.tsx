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

export const TicketsPage: React.FC = () => {
  const { hasRedmineKey } = useSettings();
  const { status, projects, fetchTickets, tickets } = useTickets();
  const { toastGood } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [projectIdFilter, setProjectIdFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [sortField, setSortField] = useState<SortField>("id");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const [selectedTicket, setSelectedTicket] = useState<Issue | null>(null);
  const [selectedTicketTab, setSelectedTicketTab] = useState<
      "details" | "comments" | "files" | "time"
  >("details");

  const [mrModalTicket, setMrModalTicket] = useState<RedmineTicket | null>(
      null,
  );
  const [qsModalTicket, setQsModalTicket] = useState<RedmineTicket | null>(
      null,
  );

  const resetLocalFilter = () => {
    setSearchQuery("");
    setProjectIdFilter("all");
    setStatusFilter("all");
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
      initialTab: "details" | "comments" | "files" | "time" = "details",
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

  const handleSaveQaProtocol = async (
      ticketId: number,
      qaFormData: QaProtocolData,
  ) => {
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
    toastGood(
        `Logged ${data.hours}h ${data.minutes}m successfully for Ticket #${ticketId}!`,
    );
    await fetchTickets();
  };

  if (!hasRedmineKey) {
    return (
        <div className="space-y-6 pb-12 font-sans">
          <TicketHeader openTicketsCount={0} totalTicketsCount={0} />
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
              t.project?.name?.toLowerCase() ===
              String(projectIdFilter).toLowerCase();
          if (!matchesProjectId && !matchesProjectName) return false;
        }

        if (statusFilter !== "all") {
          const matchesStatusName =
              t.status?.name?.toLowerCase() === String(statusFilter).toLowerCase();
          const matchesStatusId = String(t.status?.id) === String(statusFilter);
          if (!matchesStatusName && !matchesStatusId) return false;
        }

        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matchesId = t.id.toString().includes(q);
          const matchesSubject = t.subject.toLowerCase().includes(q);
          const matchesAuthor =
              t.author?.name?.toLowerCase().includes(q) ?? false;
          const matchesAssigned =
              t.assignedTo?.name?.toLowerCase().includes(q) ?? false;
          const matchesTracker =
              t.tracker?.name?.toLowerCase().includes(q) ?? false;

          if (
              !matchesId &&
              !matchesSubject &&
              !matchesAuthor &&
              !matchesAssigned &&
              !matchesTracker
          ) {
            return false;
          }
        }

        return true;
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
      <div className="space-y-6 pb-12 font-sans">
        <TicketHeader
            openTicketsCount={calculateOpenTickets()}
            totalTicketsCount={tickets.length}
        />

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

        {selectedTicket && (
            <TicketDetailModal
                ticket={selectedTicket}
                initialTab={selectedTicketTab}
                onClose={() => setSelectedTicket(null)}
                onAddComment={handleAddComment}
                onLogTime={handleLogTime}
                onDownloadFile={(url, filename) =>
                    ticketService.downloadAttachment(url, filename)
                }
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