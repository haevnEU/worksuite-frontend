import { NetworkService } from "./network.service.ts";
import { Issue } from "../../models/ticketModel.model.ts";
import { QaProtocolData } from "../../models/ticket.model.ts";
import { LogTimePayload } from "../../models/timeEntry.model.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";

export class TicketService extends NetworkService {
  constructor() {
    super("/ticket");
  }

  public async fetch(): Promise<Issue[]> {
    try {
      console.log("[TicketService] Fetching all tickets...");
      return await this.get<Issue[]>("");
    } catch (error) {
      console.error("[TicketService] Error fetching tickets:", error);
      ToastManager.toastBad("Failed to load tickets.");
      return [];
    }
  }

  public async downloadAttachment(
    url: string,
    filename: string,
  ): Promise<void> {
    if (!url?.trim()) {
      ToastManager.toastBad("Attachment URL is missing!");
      return;
    }

    try {
      const downloadUrl = `/download/attachments`;
      const reqOpts = {
        body: url,
        method: "POST",
      };
      console.log(
        `[TicketService] Downloading attachment from URL: ${url} with filename: ${filename}`,
      );
      await this.downloadFile(downloadUrl, filename, reqOpts);
      ToastManager.toastGood("Attachment downloaded successfully.");
    } catch (error) {
      console.error("[TicketService] Error downloading attachment:", error);
      ToastManager.toastBad("Failed to download attachment.");
      throw error;
    }
  }

  public async moveToQA(id: number, qaFormData: QaProtocolData): Promise<void> {
    if (!id || id <= 0) {
      ToastManager.toastBad("Invalid ticket ID!");
      return;
    }

    try {
      console.log(`[TicketService] Moving ticket with id: ${id} to QA`);
      await this.post<void>(
        `/${encodeURIComponent(id)}/move-to-qs`,
        qaFormData,
      );
      ToastManager.toastGood(`Ticket #${id} moved to QA successfully.`);
    } catch (error) {
      console.error(`[TicketService] Error moving ticket #${id} to QA:`, error);
      ToastManager.toastBad(`Could not move ticket #${id} to QA.`);
      throw error;
    }
  }

  public async addComment(id: number, comment: string): Promise<void> {
    if (!id || id <= 0) {
      ToastManager.toastBad("Invalid ticket ID!");
      return;
    }

    if (!comment?.trim()) {
      ToastManager.toastBad("Comment text cannot be empty!");
      return;
    }

    try {
      console.log(`[TicketService] Adding comment to ticket with id: ${id}`);
      await this.postRaw<void>(`/${encodeURIComponent(id)}/comment`, comment);
      ToastManager.toastGood("Comment added successfully.");
    } catch (error) {
      console.error(
        `[TicketService] Error adding comment to ticket #${id}:`,
        error,
      );
      ToastManager.toastBad(`Could not add comment to ticket #${id}.`);
      throw error;
    }
  }

  public async createMergeRequest(
    id: number,
    mergeRequestData: QaProtocolData,
  ): Promise<void> {
    if (!id || id <= 0) {
      ToastManager.toastBad("Invalid ticket ID!");
      return;
    }

    try {
      console.log(
        `[TicketService] Creating merge request for ticket with id: ${id}`,
      );
      await this.post<void>(
        `/${encodeURIComponent(id)}/merge-request`,
        mergeRequestData,
      );
      ToastManager.toastGood(
        `Merge request for ticket #${id} created successfully.`,
      );
    } catch (error) {
      console.error(
        `[TicketService] Error creating merge request for ticket #${id}:`,
        error,
      );
      ToastManager.toastBad(
        `Could not create merge request for ticket #${id}.`,
      );
      throw error;
    }
  }

  public async logTime(id: number, data: LogTimePayload): Promise<void> {
    if (!id || id <= 0) {
      ToastManager.toastBad("Invalid ticket ID!");
      return;
    }

    try {
      console.log(`[TicketService] Logging time for ticket with id: ${id}`);
      await this.post<void>(`/${encodeURIComponent(id)}/time-entries`, data);
      ToastManager.toastGood(`Time logged successfully for ticket #${id}.`);
    } catch (error) {
      console.error(
        `[TicketService] Error logging time for ticket with id: ${id}`,
        error,
      );
      ToastManager.toastBad(`Error logging time for ticket #${id}.`);
      throw error;
    }
  }
}

export const ticketService = new TicketService();
