import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { Issue, Project, RedmineStatus } from "../models/ticketModel.model.ts";
import { ticketService } from "../services/network/ticket.service.ts";

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
  const [tickets, setTickets] = useState<Issue[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [status, setStatus] = useState<RedmineStatus[]>([]);
  const [openTickets, setOpenTickets] = useState<number>(0);

  const fetchTickets = async () => {
    try {
      const fetchedTickets = await ticketService.fetch();

      setTickets(fetchedTickets || []);
      const projectsMap = new Map<number, Project>();
      const statusMap = new Map<number, RedmineStatus>();

      (fetchedTickets || []).forEach((issue) => {
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
        fetchedTickets.filter((t) => {
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
  };
  const getAmountStatus = (id: string) => {
    return tickets.filter((t) => t.status?.name === id).length;
  };
  const getAmountPriority = (id: string) => {
    return tickets.filter((t) => t.priority?.name === id).length;
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        fetchTickets,
        projects,
        status,
        openTickets,
        getAmountStatus,
        getAmountPriority,
      }}
    >
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
