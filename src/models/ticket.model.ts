import {
  TicketPriority,
  TicketStatus,
  TicketTracker,
} from "../types/ticket.type.ts";

export interface RedmineUser {
  id: number;
  name: string;
  email?: string;
  avatarUrl?: string;
  role?: string;
}

export interface RedmineProject {
  id: number;
  identifier?: string;
  name: string;
  description?: string;
  isPublic?: boolean;
  ticketCount?: number;
}

export interface RedmineAttachment {
  id: number | string;
  filename: string;
  filesize?: number;
  contentUrl: string;
  description?: string;
  createdOn: string;
  author?: {
    id: number;
    name: string;
  };
}

export interface RedmineJournal {
  id: number;
  user: {
    id: number;
    name: string;
  };
  notes: string;
  createdOn: string;
  details?: {
    property: string;
    name: string;
    oldValue?: string;
    newValue?: string;
  }[];
}

export interface TicketComment {
  id: number;
  user: RedmineUser;
  createdAt: string;
  notes: string;
  details?: {
    property: string;
    name: string;
    oldValue?: string;
    newValue?: string;
  }[];
}

export interface RedmineTicket {
  id: number;
  project: RedmineProject;
  tracker: TicketTracker;
  status: TicketStatus;
  priority: TicketPriority;
  subject: string;
  description: string;
  author: RedmineUser;
  assignedTo?: RedmineUser;
  category?: string;
  startDate?: string;
  dueDate?: string;
  estimatedHours?: number;
  spentHours: number;
  doneRatio: number; // 0 - 100
  createdAt?: string;
  updatedAt?: string;
  createdOn?: string;
  updatedOn?: string;
  comments?: TicketComment[];
  journals?: RedmineJournal[];
  attachments?: RedmineAttachment[];
  parentIssueId?: number;
  tags?: string[];
  mrLink?: string;
  checklist?: Array<{ id: string; text: string; done: boolean }>;
}

export interface QaProtocolData {
  pipelineSuccess: boolean;
  pipelineFailReason: string;
  rebaseExecuted: boolean;
  intro: string;
  hasAcceptanceCriteria: boolean;
  acceptanceCriteria: string;
  hasTestSetup: boolean;
  testSetup: string;
  hasUnitTests: boolean;
  unitTests: string;
  hasTestDatasets: boolean;
  testDatasets: string;
  hasSideEffects: boolean;
  sideEffects: string;
  hasChangedEndpoints: boolean;
  changedEndpoints: string;
}

export interface CustomField {
  id?: number;
  name: string;
  value?: string | string[] | null;
}
