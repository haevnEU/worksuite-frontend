import { NetworkService } from "./network.service.ts";
import { AboutSystemInfo } from "../../models/about.model.ts";

export class AboutService extends NetworkService {
  constructor() {
    super("/about");
  }

  public async fetchSystemInfo(): Promise<AboutSystemInfo> {
    try {
      const data = await this.get<AboutSystemInfo>("", { timeout: 30_000 });
      return data;
    } catch (error) {
      console.error("[AboutService] Failed to fetch system telemetry:", error);
      throw error;
    }
  }
}

export const aboutService = new AboutService();
