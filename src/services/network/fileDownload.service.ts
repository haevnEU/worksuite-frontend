import { NetworkService } from "./network.service.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { triggerBlobDownload } from "../../utils/file.util.ts";

interface RequestDTO {
  apiKey?: string;
  filename?: string;
  id?: string;
  isDraft?: boolean;
  url?: string;
  webUrl?: string;
}

type DownloadModule =
  | "WEEKLY_MEETING_PROTOCOL"
  | "NOTEBOOK_EXPORT"
  | "RETROSPECTIVE_PROTOCOL"
  | "TICKET_ATTACHMENT";

export class FileDownloadService extends NetworkService {
  constructor() {
    super("/download");
  }

  public async downloadTicketAttachment(
    url: string,
    filename: string,
    webUrl: string,
  ): Promise<void> {
    if (!url?.trim())
      return ToastManager.toastBad("Attachment URL is missing!");

    await this.executeDownload(
      "TICKET_ATTACHMENT",
      { url, filename, isDraft: false, webUrl: webUrl },
      filename || `attachment_${Date.now()}`,
    );
  }

  /* ========================================================================= */
  /* DOMAIN DOWNLOAD METHODS                                                   */
  /* ========================================================================= */

  public async downloadWeeklyMeetingProtocol(
    meetingId: string,
    isDraft: boolean,
  ): Promise<void> {
    if (!meetingId) return ToastManager.toastBad("Meeting ID is missing!");

    await this.executeDownload(
      "WEEKLY_MEETING_PROTOCOL",
      { id: meetingId, isDraft: isDraft },
      `weekly_meeting_${meetingId}.pdf`,
    );
  }

  public async downloadRetrospectiveProtocol(
    id: string,
    isDraft: boolean,
  ): Promise<void> {
    if (!id) return ToastManager.toastBad("Retro ID is missing!");

    await this.executeDownload(
      "RETROSPECTIVE_PROTOCOL",
      { id, isDraft },
      `retrospective_${id}.pdf`,
    );
  }

  public async downloadNotebookExport(
    noteId: string,
    isDraft: boolean,
  ): Promise<void> {
    if (!noteId) return ToastManager.toastBad("Note ID is missing!");
    await this.executeDownload(
      "NOTEBOOK_EXPORT",
      { id: noteId, isDraft: isDraft },
      `notebook_export_${noteId}.pdf`,
    );
  }

  private async executeDownload(
    moduleType: DownloadModule,
    dto: RequestDTO,
    fallbackFilename: string,
  ): Promise<void> {
    try {
      const url = `${this.baseUrl}/${moduleType}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/pdf, application/octet-stream, */*",
          ...(localStorage.getItem("access_token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              }
            : {}),
        },
        body: JSON.stringify(dto),
      });

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
          `HTTP Error ${response.status}: ${response.statusText}${
            errorBody ? ` - ${errorBody}` : ""
          }`,
        );
      }

      // Filename aus dem Content-Disposition Header parsen (falls vom Backend mitgegeben)
      let filename = dto.filename || fallbackFilename;
      const contentDisposition = response.headers.get("Content-Disposition");
      if (contentDisposition) {
        const filenameMatch =
          contentDisposition.match(/filename\*=UTF-8''([^;]+)/i) ||
          contentDisposition.match(/filename="?([^";]+)"?/i);

        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      // Resource als Binary Blob einlesen und im Browser auslösen
      const blob = await response.blob();
      triggerBlobDownload(blob, filename);
    } catch (error) {
      console.error(
        `[FileDownloadService] Error downloading ${moduleType}:`,
        error,
      );
      ToastManager.toastBad("Failed to download file.");
      throw error;
    }
  }
}

export const fileDownloadService = new FileDownloadService();
