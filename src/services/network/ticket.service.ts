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
    console.log("[TicketService] Fetching all tickets...");
    return this.get<Issue[]>(``);
  }

  public async downloadAttachment(
    url: string,
    filename: string,
  ): Promise<void> {
    const downloadUrl = `/download/attachments`;
    const reqOpts = {
      body: url,
      method: "POST",
    };
    console.log(
      `[TicketService] Downloading attachment from URL: ${url} with filename: ${filename}`,
    );
    this.downloadFile(downloadUrl, filename, reqOpts);
  }

  async moveToQA(id: number, qaFormData: QaProtocolData) {
    console.log(`[TicketService] Moving ticket with id: ${id} to QA`);
    await this.post<void>(`/${id}/move-to-qs`, qaFormData);
  }

  async addComment(id: number, comment: string) {
    console.log(`[TicketService] Adding comment to ticket with id: ${id}`);
    await this.postRaw<void>(`/${id}/comment`, comment);
  }

  async createMergeRequest(id: number, mergeRequestData: QaProtocolData) {
    console.log(
      `[TicketService] Creating merge request for ticket with id: ${id}`,
    );
    await this.post<void>(`/${id}/merge-request`, mergeRequestData);
  }

  async logTime(id: number, data: LogTimePayload) {
    console.log(`[TicketService] Logging time for ticket with id: ${id}`);
    try {
      await this.post<void>(`/${id}/time-entries`, data);
    } catch (error) {
      console.log(
        `[TicketService] Error logging time for ticket with id: ${id}`,
        error,
      );
      ToastManager.toastBad(`Error logging time for ticket #${id}`);
    }
  }
}

export const ticketService = new TicketService();
