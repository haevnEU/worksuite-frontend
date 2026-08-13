import { NetworkService } from "./network.service.ts";
import { RedmineInfoMap } from "../../models/info.model.ts";

export class InfoService extends NetworkService {
  constructor() {
    super("/info");
  }

  public async fetchRedmineMeta(): Promise<RedmineInfoMap> {
    return this.get<RedmineInfoMap>("/redmine");
  }
}

export const infoService = new InfoService();
