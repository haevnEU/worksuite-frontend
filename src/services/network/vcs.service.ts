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

  public async fetchMergeRequests(
    vcsProvider: string = "GITLAB",
  ): Promise<MergeRequestModel[]> {
    try {
      return await this.get<MergeRequestModel[]>("/merge-requests/my");
    } catch {
      return [];
    }
  }

  public async fetchPendingReviews(
    vcsProvider: string = "GITLAB",
  ): Promise<MergeRequestModel[]> {
    try {
      return await this.get<MergeRequestModel[]>("/merge-requests/reviews");
    } catch {
      return [];
    }
  }

  public async fetchPipelines(
    vcsProvider: string = "GITLAB",
  ): Promise<ProtectedBranchPipeline[]> {
    try {
      return await this.get<ProtectedBranchPipeline[]>("/pipelines");
    } catch {
      return [];
    }
  }

  public async fetchRepos(
    vcsProvider: string = "GITLAB",
  ): Promise<GitLabRepository[]> {
    try {
      return await this.get<GitLabRepository[]>("/repositories");
    } catch {
      return [];
    }
  }
}

export const vcsService = new VcsService();
