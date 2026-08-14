import { Issue } from "../../models/ticketModel.model.ts";
import { QaProtocolData } from "../../models/ticket.model.ts";
import { LogTimePayload } from "../../models/timeEntry.model.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { NetworkService } from "./network.service.ts";
import { fileDownloadService } from "./fileDownload.service.ts";

export class TicketService extends NetworkService {
  constructor() {
    super("/ticket");
  }

  public async fetch(): Promise<Issue[]> {
    try {
      return await this.get<Issue[]>("");
    } catch {
      return [];
    }
  }

  public async downloadAttachment(
    url: string,
    filename: string,
  ): Promise<void> {
    if (!url?.trim())
      return ToastManager.toastBad("Attachment URL is missing!");
    await fileDownloadService.downloadTicketAttachment(
      `http://localhost/api/v1/ticket/download/attachments`,
      filename,
      url,
    );
    ToastManager.toastGood("Attachment downloaded successfully.");
  }

  public async moveToQA(id: number, qaFormData: QaProtocolData): Promise<void> {
    if (!id || id <= 0) return ToastManager.toastBad("Invalid ticket ID!");

    await this.post<void>(`/${encodeURIComponent(id)}/move-to-qs`, qaFormData);
    ToastManager.toastGood(`Ticket #${id} moved to QA successfully.`);
  }

  public async addComment(id: number, comment: string): Promise<void> {
    if (!id || id <= 0) return ToastManager.toastBad("Invalid ticket ID!");
    if (!comment?.trim())
      return ToastManager.toastBad("Comment text cannot be empty!");

    await this.post<void>(`/${encodeURIComponent(id)}/comment`, comment);
    ToastManager.toastGood("Comment added successfully.");
  }

  public async createMergeRequest(
    id: number,
    mergeRequestData: QaProtocolData,
  ): Promise<void> {
    if (!id || id <= 0) return ToastManager.toastBad("Invalid ticket ID!");

    await this.post<void>(
      `/${encodeURIComponent(id)}/merge-request`,
      mergeRequestData,
    );
    ToastManager.toastGood(
      `Merge request for ticket #${id} created successfully.`,
    );
  }

  public async logTime(id: number, data: LogTimePayload): Promise<void> {
    if (!id || id <= 0) return ToastManager.toastBad("Invalid ticket ID!");

    await this.post<void>(`/${encodeURIComponent(id)}/time-entries`, data);
    ToastManager.toastGood(`Time logged successfully for ticket #${id}.`);
  }
}

export const ticketService = new TicketService();
