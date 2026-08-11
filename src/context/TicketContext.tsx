import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Issue, Project, RedmineStatus } from "../models/ticketModel.model.ts";
import { ticketService } from "../services/network/ticket.service.ts";
import { useSettings } from "./SettingsContext.tsx";

interface TicketContextType {
  tickets: Issue[];
  fetchTickets: () => Promise<void>;
  projects: Project[];
  status: RedmineStatus[];
  openTickets: number;
  getAmountStatus: (name: string) => number;
  getAmountPriority: (name: string) => number;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{ children: ReactNode }> = ({
                                                                    children,
                                                                  }) => {
  const { hasRedmineKey } = useSettings();
  const [tickets, setTickets] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<RedmineStatus[]>([]);
  const [openTickets, setOpenTickets] = useState<number>(0);

  const fetchTickets = useCallback(async () => {
    // 🛑 Guard: Nicht fetchen, wenn kein Key existiert
    if (!hasRedmineKey) {
      setTickets([]);
      setProjects([]);
      setStatus([]);
      setOpenTickets(0);
      return;
    }

    try {
      const fetchedTickets = await ticketService.fetch();
      const rawTickets = Array.isArray(fetchedTickets) ? fetchedTickets : [];
      const safeTickets = Array.from(
          new Map(rawTickets.map((issue) => [issue.id, issue])).values(),
      );

      setTickets(safeTickets);

      const projectsMap = new Map<number, Project>();
      const statusMap = new Map<number, RedmineStatus>();

      safeTickets.forEach((issue) => {
        const redmineProject = issue.project;
        if (redmineProject) {
          if (!projectsMap.has(redmineProject.id)) {
            projectsMap.set(redmineProject.id, {
              ...redmineProject,
              issues: [],
            });
          }
          projectsMap.get(redmineProject.id)!.issues.push(issue);
        }

        const issueStatus = issue.status;
        if (issueStatus && !statusMap.has(issueStatus.id)) {
          statusMap.set(issueStatus.id, issueStatus);
        }
      });

      const sortedProjects = Array.from(projectsMap.values()).sort((a, b) =>
          a.name.localeCompare(b.name),
      );

      const sortedStatuses = Array.from(statusMap.values()).sort(
          (a, b) => a.id - b.id,
      );

      setProjects(sortedProjects);
      setStatus(sortedStatuses);

      setOpenTickets(
          safeTickets.filter((t) => {
            const statusName = t.status?.name?.toLowerCase() || "";
            return (
                !statusName.includes("closed") &&
                !statusName.includes("resolved") &&
                !statusName.includes("rejected") &&
                !statusName.includes("obsolete")
            );
          }).length,
      );
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }, [hasRedmineKey]);

  const getAmountStatus = useCallback(
      (name: string) => {
        return tickets.filter((t) => t.status?.name === name).length;
      },
      [tickets],
  );

  const getAmountPriority = useCallback(
      (name: string) => {
        return tickets.filter((t) => t.priority?.name === name).length;
      },
      [tickets],
  );

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const contextValue = useMemo<TicketContextType>(
      () => ({
        tickets,
        fetchTickets,
        projects,
        status,
        openTickets,
        getAmountStatus,
        getAmountPriority,
      }),
      [
        tickets,
        fetchTickets,
        projects,
        status,
        openTickets,
        getAmountStatus,
        getAmountPriority,
      ],
  );

  return (
      <TicketContext.Provider value={contextValue}>
        {children}
      </TicketContext.Provider>
  );
};

export const useTickets = (): TicketContextType => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketProvider");
  }
  return context;
};