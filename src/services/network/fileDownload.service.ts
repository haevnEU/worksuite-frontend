import { RequestOptions } from "../../models/http.model.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { downloadString, triggerBlobDownload } from "../../utils/file.util.ts";
import { NetworkService } from "./network.service.ts";

export class FileDownloadService extends NetworkService {
  constructor() {
    super("");
  }
  public async downloadFromEndpoint(
    endpoint: string,
    defaultFilename: string = `downloaded_${Date.now()}`,
    options?: RequestOptions,
  ): Promise<void> {
    if (!endpoint) {
      ToastManager.toastBad("Download URL is missing!");
      return;
    }

    try {
      const headers = new Headers();
      headers.set("Accept", "*/*");

      if (options?.headers) {
        new Headers(options.headers).forEach((value, key) => {
          headers.set(key, value);
        });
      }

      const token = localStorage.getItem("token");
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      let body: BodyInit | null | undefined = undefined;
      if (options?.body) {
        if (typeof options.body === "string") {
          body = options.body;
          if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "text/plain");
          }
        } else if (
          options.body instanceof FormData ||
          options.body instanceof Blob ||
          options.body instanceof ArrayBuffer
        ) {
          body = options.body as BodyInit;
        } else {
          body = JSON.stringify(options.body);
          if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
          }
        }
      }

      const fetchInit: RequestInit = {
        method: options?.method || "GET",
        headers,
        body,
        signal: options?.signal,
      };

      console.log(
        `[FileDownloadService] Executing download request to: ${endpoint}`,
      );
      const response = await fetch(endpoint, fetchInit);

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new Error(
          `HTTP Error ${response.status}: ${response.statusText}${
            errorBody ? ` - ${errorBody}` : ""
          }`,
        );
      }

      let filename = defaultFilename;
      const contentDisposition = response.headers.get("Content-Disposition");
      if (contentDisposition) {
        const filenameMatch =
          contentDisposition.match(/filename\*=UTF-8''([^;]+)/i) ||
          contentDisposition.match(/filename="?([^";]+)"?/i);

        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      const blob = await response.blob();
      triggerBlobDownload(blob, filename);
    } catch (error) {
      console.error("[FileDownloadService] Error downloading file:", error);
      ToastManager.toastBad("Failed to download file.");
      throw error;
    }
  }

  public downloadRawString(
    content: string,
    filename: string,
    contentType: string = "text/plain",
  ): void {
    if (!content) {
      ToastManager.toastBad("No content provided for download!");
      return;
    }

    try {
      downloadString(content, filename, contentType);
    } catch (error) {
      ToastManager.toastBad("Failed to generate file download.");
      throw error;
    }
  }
}

export const fileDownloadService = new FileDownloadService();
