import { NetworkService } from "./network.service.ts";
import { QaProtocolData } from "../../models/ticket.model.ts";

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

export const vcsService = new VcsService();
