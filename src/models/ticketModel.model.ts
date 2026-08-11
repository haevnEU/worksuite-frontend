export interface Issue {
  id: number;
  project: RedmineProject;
  tracker: RedmineTracker;
  status: RedmineStatus;
  priority: RedminePriority;
  author: RedmineUser;
  assignedTo: RedmineUser;
  subject: string;
  description: string;
  startDate: string;
  dueDate: string;
  doneRation: number;
  isPrivate: boolean;
  estimatedHours: number | null;
  spentHours: number | null;
  totalSpentHours: number | null;
  cratedOn: string;
  updatedOn: string;
  closedOn: string;
  attachments: RedmineAttachment[];
  journals: RedmineJournal[];
}

export interface RedmineJournal {
  id: number;
  user: RedmineUser;
  notes: string;
  createdOn: string;
}

export interface RedmineAttachment {
  id: number;
  filename: string;
  contentType: string;
  description: string;
  contentUrl: string;
  thumbnailUrl: string;
  author: RedmineUser;
  createdOn: string;
}

export interface RedmineProject {
  id: number;
  name: string;
  description: string;
}

export interface RedmineTracker {
  id: number;
  name: string;
}

export interface RedmineStatus {
  id: number;
  name: string;
  isClosed: boolean;
}

export interface RedminePriority {
  id: number;
  name: string;
}

export interface RedmineUser {
  id: number;
  name: string;
}

export interface Project extends RedmineProject {
  issues: Issue[];
}
