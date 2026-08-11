import { PipelineStatus } from "../types/gitlab.type.ts";

export interface MergeRequestModel {
  id: string | number;
  iid: number;
  title: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
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
