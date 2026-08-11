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

  async fetchWeeklyTotal() {
    try {
      return await this.get<{ hours: number; minutes: number }>(
        "/weekly-total",
      );
    } catch {
      return { hours: 0, minutes: 0 };
    }
  }
}

export const timeService = new TimeService();
