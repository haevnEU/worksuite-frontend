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

export interface FileTypeBadgeConfig {
  label: string;
  className: string;
}
export interface FileTypeBadgeConfig {
  label: string;
  className: string;
}

export function getFileTypeBadge(
  mimeType?: string,
  filename?: string,
): FileTypeBadgeConfig {
  const type = (mimeType || "").toLowerCase();
  const ext = (filename || "").split(".").pop()?.toLowerCase() || "";

  if (type.includes("pdf") || ext === "pdf") {
    return {
      label: "PDF",
      className: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    };
  }

  if (
    type.startsWith("image/") ||
    ["png", "jpg", "jpeg", "webp", "gif", "svg", "bmp", "ico"].includes(ext)
  ) {
    return {
      label: ext ? ext.toUpperCase() : "IMAGE",
      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    };
  }

  if (type.includes("json") || ext === "json") {
    return {
      label: "JSON",
      className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    };
  }

  if (type.includes("csv") || ["csv", "xlsx", "xls"].includes(ext)) {
    return {
      label: ext ? ext.toUpperCase() : "CSV",
      className: "bg-teal-500/15 text-teal-400 border-teal-500/30",
    };
  }

  if (
    type.includes("xml") ||
    type.includes("html") ||
    ["xml", "html", "xhtml"].includes(ext)
  ) {
    return {
      label: ext ? ext.toUpperCase() : "XML",
      className: "bg-orange-500/15 text-orange-400 border-orange-500/30",
    };
  }

  if (
    type.includes("zip") ||
    type.includes("tar") ||
    type.includes("gzip") ||
    type.includes("compressed") ||
    ["zip", "tar", "gz", "7z", "rar"].includes(ext)
  ) {
    return {
      label: ext ? ext.toUpperCase() : "ZIP",
      className: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    };
  }

  if (type.startsWith("text/") || ["txt", "md", "log"].includes(ext)) {
    return {
      label: ext ? ext.toUpperCase() : "TEXT",
      className: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    };
  }

  return {
    label: ext
      ? ext.toUpperCase()
      : mimeType
        ? mimeType.split("/")[1]?.toUpperCase() || "FILE"
        : "BIN",
    className: "bg-slate-700/40 text-slate-300 border-slate-600/40",
  };
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
