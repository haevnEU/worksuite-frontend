import { ShareableResource } from "../../models/shareableResource.model.ts";
import { NetworkService } from "./network.service.ts";
import { QaProtocolData } from "../../models/ticket.model.ts";

export class GitlabService extends NetworkService {
  constructor() {
    super("/gitlab");
    console.log(
      "[GitlabService] Initialized GitlabService with base URL:",
      this.baseUrl,
    );
  }

  public async createMergeRequest(
    id: number,
    mergeRequestData: QaProtocolData,
  ) {
    await this.post<void>(`/${id}/merge-request`, mergeRequestData);
  }

  public fetchMergeRequests = async (): Promise<void[]> => {
    return await this.get<void[]>(`/merge-requests/my`);
  };

  public fetchPendingReviews = async (): Promise<void[]> => {
    return await this.get<void[]>(`/merge-requests/reviews`);
  };

  public fetchPipelines = async (): Promise<void[]> => {
    return await this.get<void[]>(`/pipelines`);
  };
}

export const gitlabService = new GitlabService();
