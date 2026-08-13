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
    if (!id) {
      ToastManager.toastBad("The Meeting ID is missing!");
      return null;
    }

    try {
      console.log(
        "[WeeklyMeetingService] Fetching meeting details for id:",
        id,
      );
      return await this.get<WeeklyMeetingDTO>(`/${encodeURIComponent(id)}`);
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
      throw error;
    }
  }

  public async addTaskToDay(
    meetingId: string,
    day: string,
    task: string,
  ): Promise<void> {
    if (!meetingId) {
      ToastManager.toastBad("The Meeting ID is missing!");
      return;
    }

    if (!day) {
      ToastManager.toastBad("The Day parameter is missing!");
      return;
    }

    try {
      const formattedDate: string = day.split("T")[0];
      console.log(
        `[WeeklyMeetingService] Adding task to day for meeting ${meetingId}:`,
      );
      const params = this.buildParams({ day: formattedDate });
      await this.post<void>(
        `/${encodeURIComponent(meetingId)}/tasks${params}`,
        { task },
      );
      ToastManager.toastGood("Task added successfully.");
    } catch (error) {
      ToastManager.toastBad("Could not add task to day");
      console.error(
        `[WeeklyMeetingService] Error occurred while adding task to day for meeting ${meetingId}:`,
        error,
      );
      throw error;
    }
  }

  public async updateDaySummary(
    meetingId: string,
    day: string,
    summary: string,
  ): Promise<void> {
    if (!meetingId) {
      ToastManager.toastBad("The Meeting ID is missing!");
      return;
    }

    if (!day) {
      ToastManager.toastBad("The Day parameter is missing!");
      return;
    }

    try {
      const formattedDate: string = day.split("T")[0];
      console.log(
        `[WeeklyMeetingService] Updating day summary for meeting ${meetingId}:`,
      );
      const params = this.buildParams({ day: formattedDate });
      await this.put<void>(
        `/${encodeURIComponent(meetingId)}/day-summary${params}`,
        { summary },
      );
      ToastManager.toastGood("Day summary updated.");
    } catch (error) {
      ToastManager.toastBad("Could not update day summary");
      console.error(
        `[WeeklyMeetingService] Error occurred while updating day summary for meeting ${meetingId}:`,
        error,
      );
      throw error;
    }
  }

  public async updateWeeklySummary(
    meetingId: string,
    summary: string,
  ): Promise<void> {
    if (!meetingId) {
      ToastManager.toastBad("The Meeting ID is missing!");
      return;
    }

    try {
      console.log(
        `[WeeklyMeetingService] Updating weekly summary for meeting ${meetingId}:`,
      );
      await this.put<void>(`/${encodeURIComponent(meetingId)}/summary`, {
        summary,
      });
      ToastManager.toastGood("Weekly summary updated.");
    } catch (error) {
      ToastManager.toastBad("Could not update weekly summary");
      console.error(
        `[WeeklyMeetingService] Error occurred while updating weekly summary for meeting ${meetingId}:`,
        error,
      );
      throw error;
    }
  }

  public async exportPdf(meetingId: string): Promise<void> {
    if (!meetingId) {
      ToastManager.toastBad("The Meeting ID is missing!");
      return;
    }

    try {
      console.log(
        `[WeeklyMeetingService] Exporting PDF for meeting ${meetingId}...`,
      );
      await this.downloadFile(`/${encodeURIComponent(meetingId)}/export`);
      ToastManager.toastGood("PDF exported successfully.");
    } catch (error) {
      ToastManager.toastBad("Could not export meeting PDF");
      console.error(
        "[WeeklyMeetingService] Error occurred while exporting PDF:",
        error,
      );
      throw error;
    }
  }
}

export const weeklyMeetingService = new WeeklyMeetingService();
