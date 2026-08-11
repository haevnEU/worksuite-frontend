import { ToastManager } from "../toaster/ToastManager.ts";
import { ExportType } from "../types/http.type.ts";

export const getFileExtension = (type: ExportType): string => {
  switch (type) {
    case "png":
      return ".png";
    case "jpg":
    case "jpeg":
      return ".jpg";
    case "gif":
      return ".gif";
    case "svg":
      return ".svg";
    case "webp":
      return ".webp";
    case "json":
      return ".json";
    case "csv":
      return ".csv";
    case "xml":
      return ".xml";
    case "pdf":
      return ".pdf";
    default:
      return ".txt";
  }
};

export const getMediaType = (type: ExportType): string => {
  switch (type) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "svg":
      return "image/svg+xml";
    case "webp":
      return "image/webp";
    case "json":
      return "application/json";
    case "csv":
      return "text/csv";
    case "xml":
      return "application/xml";
    case "pdf":
      return "application/pdf";
    default:
      return "text/plain";
  }
};

export const downloadString = (
  content: string,
  filename: string,
  contentType: string = "text/plain",
): void => {
  try {
    const blob = new Blob([content], { type: contentType });
    triggerBlobDownload(blob, filename);
    ToastManager.toastGood(`File successfully downloaded: ${filename}`);
  } catch (error) {
    console.error(`Error downloading file ${filename}:`, error);
    ToastManager.toastBad(`Error downloading file: ${filename}`);
  }
};

export const triggerBlobDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(a);
};
