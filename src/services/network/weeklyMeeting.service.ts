import { NetworkService } from "./network.service.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { WeeklyMeetingDTO } from "../../models/weeklyMeeting.model.ts";

export class WeeklyMeetingService extends NetworkService {
  constructor() {
    super("/weekly-meetings");
  }

  public async fetchAll(): Promise<WeeklyMeetingDTO[]> {
    try {
      console.log("[WeeklyMeetingService] Fetching all weekly meetings...");
      return await this.get<WeeklyMeetingDTO[]>("");
    } catch (error) {
      ToastManager.toastBad("Could not fetch weekly meetings");
      console.error(
        "[WeeklyMeetingService] Error occurred while fetching all weekly meetings:",
        error,
      );
      return [];
    }
  }

  public async fetchById(id: string): Promise<WeeklyMeetingDTO | null> {
    try {
      console.log(
        "[WeeklyMeetingService] Fetching meeting details for id:",
        id,
      );
      return await this.get<WeeklyMeetingDTO>(`/${id}`);
    } catch (error) {
      ToastManager.toastBad("Could not fetch meeting details");
      console.error(
        "[WeeklyMeetingService] Error occurred while fetching meeting details:",
        error,
      );
      return null;
    }
  }

  public async generateNextWeek(): Promise<void> {
    try {
      console.log("[WeeklyMeetingService] Generating next week's meeting...");
      await this.post<void>("/generate", {});
      ToastManager.toastGood("Weekly meeting generated successfully.");
    } catch (error) {
      ToastManager.toastBad("Could not generate weekly meeting");
      console.error(
        "[WeeklyMeetingService] Error occurred while generating next week's meeting:",
        error,
      );
    }
  }

  public async addTaskToDay(
    meetingId: string,
    day: string,
    task: string,
  ): Promise<void> {
    try {
      const formattedDate: string = day.split("T")[0];
      console.log(
        `[WeeklyMeetingService] Adding task to day for meeting ${meetingId}:`,
      );
      await this.post<void>(`/${meetingId}/tasks?day=${formattedDate}`, {
        task,
      });
      ToastManager.toastGood("Task added successfully.");
    } catch (error) {
      ToastManager.toastBad("Could not add task to day");
      console.error(
        `[WeeklyMeetingService] Error occurred while adding task to day for meeting ${meetingId}:`,
        error,
      );
    }
  }

  public async updateDaySummary(
    meetingId: string,
    day: string,
    summary: string,
  ): Promise<void> {
    try {
      const formattedDate: string = day.split("T")[0];
      console.log(
        `[WeeklyMeetingService] Updating day summary for meeting ${meetingId}:`,
      );
      await this.put<void>(`/${meetingId}/day-summary?day=${formattedDate}`, {
        summary,
      });
      ToastManager.toastGood("Day summary updated.");
    } catch (error) {
      ToastManager.toastBad("Could not update day summary");
      console.error(
        `[WeeklyMeetingService] Error occurred while updating day summary for meeting ${meetingId}:`,
        error,
      );
    }
  }

  public async updateWeeklySummary(
    meetingId: string,
    summary: string,
  ): Promise<void> {
    try {
      console.log(
        `[WeeklyMeetingService] Updating weekly summary for meeting ${meetingId}:`,
      );
      await this.put<void>(`/${meetingId}/summary`, { summary });
      ToastManager.toastGood("Weekly summary updated.");
    } catch (error) {
      ToastManager.toastBad("Could not update weekly summary");
      console.error(
        `[WeeklyMeetingService] Error occurred while updating weekly summary for meeting ${meetingId}:`,
        error,
      );
    }
  }

  public async exportPdf(meetingId: string): Promise<void> {
    try {
      console.log(
        `[WeeklyMeetingService] Exporting PDF for meeting ${meetingId}...`,
      );
      await this.downloadFile(`/${meetingId}/export`);
      ToastManager.toastGood("PDF exported successfully.");
    } catch (error) {
      ToastManager.toastBad("Could not export meeting PDF");
      console.error(
        "[WeeklyMeetingService] Error occurred while exporting PDF",
        error,
      );
    }
  }
}

export const weeklyMeetingService = new WeeklyMeetingService();
