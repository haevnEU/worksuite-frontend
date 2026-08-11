import { ShareableResource } from "../../models/shareableResource.model.ts";
import { NetworkService } from "./network.service.ts";

export class ShareService extends NetworkService {
  constructor() {
    super("/share/text");
  }
  //
  // public async fetch(id: string): Promise<ShareableResource> {
  //     return this.get<ShareableResource>(`/${id}`);
  // }

  public async fetchAll(): Promise<ShareableResource[]> {
    return this.get<ShareableResource[]>("");
  }
  //
  // public async deleteById(id: string): Promise<void> {
  //     return this.delete<void>(`/${id}`);
  // }
}

export const shareService = new ShareService();
