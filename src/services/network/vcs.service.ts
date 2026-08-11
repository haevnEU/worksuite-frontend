import { NetworkService } from "./network.service.ts";
import { QaProtocolData } from "../../models/ticket.model.ts";
import {
  MergeRequestModel,
  ProtectedBranchPipeline,
} from "../../models/vcs.model.ts";

export class VcsService extends NetworkService {
  constructor() {
    super("/vcs");
    console.log(
      "[VcsService] Initialized VcsService with base URL:",
      this.baseUrl,
    );
  }

  public async createMergeRequest(
    id: number,
    mergeRequestData: QaProtocolData,
  ) {
    await this.post<void>(`/${id}/merge-request`, mergeRequestData);
  }

  public fetchMergeRequests = async (): Promise<MergeRequestModel[]> => {
    return await this.get<MergeRequestModel[]>(`/merge-requests/my`);
  };

  public fetchPendingReviews = async (): Promise<MergeRequestModel[]> => {
    return await this.get<MergeRequestModel[]>(`/merge-requests/reviews`);
  };

  public fetchPipelines = async (): Promise<ProtectedBranchPipeline[]> => {
    return await this.get<ProtectedBranchPipeline[]>(`/pipelines`);
  };
}

export const vcsService = new VcsService();
