import { NetworkService } from "./network.service.ts";
import { TimeDTO } from "../../models/timeEntry.model.ts";

export class TimeService extends NetworkService {
  constructor() {
    super("/time-entries");
  }

  public async fetch(): Promise<TimeDTO[]> {
    console.log("[TimeService] Fetching all time entries...");
    return this.get<TimeDTO[]>(``);
  }
}

export const timeService = new TimeService();
