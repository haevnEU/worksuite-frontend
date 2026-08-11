import React, { useState } from "react";
import { Check, Copy } from "lucide-react";
import { FileTypeBadge } from "./FileTypeBadge.tsx";
import { FileMeta } from "../../services/network/share.service.ts";
import { formatFileSize } from "../../utils/file.util.ts";

interface ShareTableRowProps {
  file: FileMeta;
  onDownload: (file: FileMeta) => void;
  onDelete: (id: string, filename: string, e: React.MouseEvent) => void;
}

export const ShareTableRow: React.FC<ShareTableRowProps> = ({
  file,
  onDownload,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyChecksum = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!file.checksum) return;

    navigator.clipboard.writeText(file.checksum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <tr className="hover:bg-slate-800/30 transition-colors">
      <td className="py-3.5 px-4 font-semibold text-blue-400 hover:text-blue-300">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-slate-500 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="truncate max-w-[280px]" title={file.filename}>
            {file.filename}
          </span>
        </div>
      </td>

      <td className="py-3.5 px-4">
        <FileTypeBadge fileType={file.fileType} filename={file.filename} />
      </td>

      <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
        {formatFileSize(file.fileSize)}
      </td>

      <td className="py-3.5 px-4">
        {file.checksum ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-purple-950/40 text-purple-300 border border-purple-800/40">
            <span title={file.checksum}>
              {`${file.checksum.substring(0, 10)}...`}
            </span>
            <button
              type="button"
              onClick={handleCopyChecksum}
              title={copied ? "Copied!" : "Copy Checksum"}
              className="text-purple-400 hover:text-purple-200 transition cursor-pointer p-0.5 rounded focus:outline-none"
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        ) : (
          <span className="text-slate-500 font-mono text-xs">-</span>
        )}
      </td>

      <td className="py-3.5 px-4 text-xs text-slate-400">
        {file.createdAt ? new Date(file.createdAt).toLocaleString() : "-"}
      </td>

      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onDownload(file)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-500/30 transition shadow-sm cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download
          </button>

          <button
            onClick={(e) => onDelete(file.id, file.filename, e)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-500/30 transition shadow-sm cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};
