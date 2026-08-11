import {
  GitLabRepository,
  MergeRequestModel,
  ProtectedBranchPipeline,
} from "../../models/vcs.model.ts";
import { NetworkService } from "./network.service.ts";

export class VcsService extends NetworkService {
  constructor() {
    super("/vcs");
  }

  public async fetchMergeRequests(): Promise<MergeRequestModel[]> {
    try {
      return await this.get<MergeRequestModel[]>("/merge-requests/my");
    } catch {
      return [];
    }
  }

  public async fetchPendingReviews(): Promise<MergeRequestModel[]> {
    try {
      return await this.get<MergeRequestModel[]>("/merge-requests/reviews");
    } catch {
      return [];
    }
  }

  public async fetchPipelines(): Promise<ProtectedBranchPipeline[]> {
    try {
      return await this.get<ProtectedBranchPipeline[]>("/pipelines");
    } catch {
      return [];
    }
  }

  public async fetchRepos(): Promise<GitLabRepository[]> {
    try {
      return await this.get<GitLabRepository[]>("/repositories");
    } catch {
      return [];
    }
  }
}

export const vcsService = new VcsService();
