import React from "react";
import { getFileTypeBadge } from "../../utils/file.util.ts";

interface FileTypeBadgeProps {
  fileType?: string;
  filename?: string;
}

export const FileTypeBadge: React.FC<FileTypeBadgeProps> = ({
  fileType,
  filename,
}) => {
  const badge = getFileTypeBadge(fileType, filename);

  return (
    <span
      title={fileType || "unknown"}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${badge.className}`}
    >
      {badge.label}
    </span>
  );
};
