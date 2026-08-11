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

export interface TimeEntry {
  id: number;
  issueId: number;
  issueSubject: string;
  projectName: string;
  user: string;
  hours: number;
  activity:
    | "Entwicklung"
    | "Design"
    | "Testen"
    | "Besprechung"
    | "Dokumentation"
    | "DevOps"
    | string;
  comments: string;
  spentOn: string;
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

export interface RedmineConfig {
  serverUrl: string;
  apiKey: string;
  defaultProjectId: number;
  autoSync: boolean;
  syncIntervalMinutes: number;
  isLiveConnection: boolean;
}

export interface TicketFilter {
  searchQuery: string;
  projectId: number | "all";
  status: TicketStatus | "all";
  tracker: TicketTracker | "all";
  priority: TicketPriority | "all";
  assigneeId: number | "all";
}

// ==========================================
// REQUEST / DTO TYPES
// ==========================================

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

export interface LogTimeRequest {
  hours: number;
  activityId: string;
  date: string;
  comment: string;
}

// ==========================================
// WORK SUITE / UTILITY TYPES
// ==========================================

export interface WorkNote {
  id: number;
  title: string;
  content: string;
  category: "QS" | "Entwicklung" | "Meeting" | "Release";
  tags: string[];
  updatedAt: string;
}

export interface CodeSnippet {
  id: number;
  title: string;
  language: "bash" | "sql" | "json" | "typescript" | "docker";
  code: string;
  description: string;
  tags: string[];
}

export interface SharedFile {
  id: string;
  shareCode?: string;
  shareType?: "file" | "text";
  filename: string;
  fileSize: string;
  fileType: string;
  description: string;
  content: string;
  password?: string;
  expiresIn: string;
  createdAt: string;
  downloadCount: number;
  locked?: boolean;
}

export interface WorkTemplate {
  id: number;
  title: string;
  platform: "redmine" | "gitlab" | "allgemein";
  category:
    | "Bug Report"
    | "Merge Request"
    | "Issue"
    | "CI/CD"
    | "QA Protocol"
    | "Allgemein";
  description: string;
  content: string;
  tags: string[];
}

// ==========================================
// GITLAB INTEGRATION TYPES
// ==========================================

export interface GitLabMergeRequestItem {
  id: number;
  iid: number;
  title: string;
  sourceBranch: string;
  targetBranch: string;
  author: string;
  webUrl: string;
  status: "opened" | "merged" | "closed";
  updatedAt: string;
}

export interface GitLabPipelineItem {
  id: number;
  ref: string;
  status: "success" | "running" | "failed" | "canceled";
  webUrl: string;
  commitSha: string;
  commitMessage: string;
  createdAt: string;
}

export interface GitLabRepo {
  id: number;
  name: string;
  path: string;
  webUrl: string;
  branch: string;
  lastPipelineStatus: "success" | "running" | "failed";
  openMRCount: number;
  starsCount: number;
  updatedAt: string;
  mergeRequests?: GitLabMergeRequestItem[];
  pipelines?: GitLabPipelineItem[];
}

export interface GitLabConfig {
  gitlabUrl: string;
  personalAccessToken: string;
  isLiveConnection: boolean;
}

// ==========================================
// MEETINGS & RETRO TYPES
// ==========================================

export type WeekdayName =
  | "Dienstag"
  | "Mittwoch"
  | "Donnerstag"
  | "Freitag"
  | "Montag"
  | "Dienstag (Folgewoche)";

export interface MeetingActionItem {
  id: number;
  text: string;
  assignee: string;
  completed: boolean;
}

export interface TeamMeetingNote {
  id: number;
  weekday: WeekdayName;
  date: string;
  title: string;
  participants: string[];
  summary: string;
  actionItems: MeetingActionItem[];
}

export interface WeeklyMeeting {
  id: string;
  weekLabel: string;
  weekNumber: number;
  year: number;
  title: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  tuesdayMeetingAgenda?: string;
  tuesdayParticipants?: string[];
  notes: TeamMeetingNote[];
}

export interface FeatureReview {
  id: number;
  title: string;
  ticketId?: number;
  ticketSubject?: string;
  presenter: string;
  summary: string;
  demoSteps: string[];
  qaStatus: "Freigegeben" | "In QA" | "Nacharbeit nötig";
  updatedAt: string;
}

export interface RetroItem {
  id: number;
  sprint: string;
  type: "positive" | "negative" | "idea";
  author: string;
  text: string;
  votes: number;
  createdAt: string;
}

export interface CustomField {
  id?: number;
  name: string;
  value?: string | string[] | null;
}
