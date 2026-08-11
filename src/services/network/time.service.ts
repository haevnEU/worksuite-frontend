import { TimeDTO } from "../../models/timeEntry.model.ts";
import { NetworkService } from "./network.service.ts";

export class TimeService extends NetworkService {
  constructor() {
    super("/time-entries");
  }

  public async fetch(): Promise<TimeDTO[]> {
    try {
      return await this.get<TimeDTO[]>("");
    } catch {
      return [];
    }
  }
}

export const timeService = new TimeService();
