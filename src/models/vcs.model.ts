import { PipelineStatus } from "../types/vcs.type.ts";

export interface MergeRequestModel {
  id: string | number;
  iid: string | number;
  title: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  description: string;
  sourceBranch: string;
  targetBranch: string;
  webUrl: string;
  pipelineStatus: PipelineStatus;
  userNotesCount: number;
  hasConflicts: boolean;
  isDraft: boolean;
  approved: boolean;
  updatedAt: string;
  projectName: string;
}

export interface ProtectedBranchPipeline {
  id: string | number;
  projectName: string;
  branchName: string;
  status: PipelineStatus;
  commitMessage: string;
  webUrl: string;
  updatedAt: string;
}

export interface GitLabRepository {
  id: number;
  webUrl: string;
  name: string;
  lastPipelineStatus: string;
  path: string;
  openMRCount: number;
  mergeRequests: MergeRequestModel[];
}

export interface MrProtocolData {
  title: string;
  description: string;
  ticketId: string;
  hasImportantChanges: boolean;
  importantChanges: string;
  hasTestSetup: boolean;
  hasUnitTests: boolean;
  unitTests: string;
  hasManualTests: boolean;
  manualTests: string;
  hasBreakingChanges: boolean;
  hasDatabaseSchemaChanges: boolean;
  hasDatabaseViewsChanges: boolean;
}
