import { NetworkService } from "./network.service.ts";
import { TimeDTO } from "../../models/timeEntry.model.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";

export class TimeService extends NetworkService {
  constructor() {
    super("/time-entries");
  }

  public async fetch(): Promise<TimeDTO[]> {
    try {
      console.log("[TimeService] Fetching all time entries...");
      return await this.get<TimeDTO[]>("");
    } catch (error) {
      console.error("[TimeService] Error fetching time entries:", error);
      ToastManager.toastBad("Failed to load time entries.");
      return [];
    }
  }
}

export const timeService = new TimeService();
