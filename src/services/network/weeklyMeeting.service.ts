import { ToastManager } from "../../toaster/ToastManager.ts";
import { WeeklyMeetingDTO } from "../../models/weeklyMeeting.model.ts";
import { NetworkService } from "./network.service.ts";
import { fileDownloadService } from "./fileDownload.service.ts";

export class WeeklyMeetingService extends NetworkService {
  constructor() {
    super("/weekly-meetings");
  }

  public async fetchAll(): Promise<WeeklyMeetingDTO[]> {
    try {
      return await this.get<WeeklyMeetingDTO[]>("");
    } catch {
      return [];
    }
  }

  public async generateNextWeek(): Promise<void> {
    await this.post<void>("/generate");
    ToastManager.toastGood("Weekly meeting generated successfully.");
  }

  public async addTaskToDay(
    meetingId: string,
    day: string,
    task: string,
  ): Promise<void> {
    if (!meetingId) return ToastManager.toastBad("The Meeting ID is missing!");
    if (!day) return ToastManager.toastBad("The Day parameter is missing!");

    const formattedDate = day.split("T")[0];
    const params = this.buildParams({ day: formattedDate });

    await this.post<void>(`/${encodeURIComponent(meetingId)}/tasks${params}`, {
      task,
    });
    ToastManager.toastGood("Task added successfully.");
  }

  public async updateDaySummary(
    meetingId: string,
    day: string,
    summary: string,
  ): Promise<void> {
    if (!meetingId) return ToastManager.toastBad("The Meeting ID is missing!");
    if (!day) return ToastManager.toastBad("The Day parameter is missing!");

    const formattedDate = day.split("T")[0];
    const params = this.buildParams({ day: formattedDate });

    await this.put<void>(
      `/${encodeURIComponent(meetingId)}/day-summary${params}`,
      { summary },
    );
    ToastManager.toastGood("Day summary updated.");
  }

  public async updateWeeklySummary(
    meetingId: string,
    summary: string,
  ): Promise<void> {
    if (!meetingId) return ToastManager.toastBad("The Meeting ID is missing!");

    await this.put<void>(`/${encodeURIComponent(meetingId)}/summary`, {
      summary,
    });
    ToastManager.toastGood("Weekly summary updated.");
  }

  public async exportPdf(meetingId: string): Promise<void> {
    if (!meetingId) return ToastManager.toastBad("The Meeting ID is missing!");

    await fileDownloadService.downloadFromEndpoint(
      `/weekly-meetings/${encodeURIComponent(meetingId)}/export`,
    );
    ToastManager.toastGood("PDF exported successfully.");
  }
}

export const weeklyMeetingService = new WeeklyMeetingService();
