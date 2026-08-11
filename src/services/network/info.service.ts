import { RedmineInfoMap } from "../../models/info.model.ts";
import { NetworkService } from "./network.service.ts";

export class InfoService extends NetworkService {
  constructor() {
    super("/info");
  }

  public async fetchRedmineMeta(): Promise<RedmineInfoMap> {
    try {
      return await this.get<RedmineInfoMap>("/redmine");
    } catch {
      return {} as RedmineInfoMap;
    }
  }
}

export const infoService = new InfoService();
