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

  public fetchMergeRequests = async (): Promise<void[]> => {};

  public fetchPendingReviews = async (): Promise<void[]> => {};

  public fetchPipelines = async (): Promise<void[]> => {};
}

export const gitlabService = new GitlabService();
