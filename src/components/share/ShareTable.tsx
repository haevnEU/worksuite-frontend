import React from "react";
import { ShareTableRow } from "./ShareTableRow.tsx";
import { FileMeta } from "../../services/network/share.service.ts";

interface ShareTableProps {
  files: FileMeta[];
  totalFilesCount: number;
  isLoading: boolean;
  onDownload: (file: FileMeta) => void;
  onDelete: (id: string, filename: string, e: React.MouseEvent) => void;
}

export const ShareTable: React.FC<ShareTableProps> = ({
  files,
  totalFilesCount,
  isLoading,
  onDownload,
  onDelete,
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Files List
          </h2>
          <span className="text-xs text-slate-500">
            ({files.length} of {totalFilesCount} results)
          </span>
        </div>
        <span className="text-xs text-slate-500 italic">
          Click actions to download or remove
        </span>
      </div>

      <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-[#0c1322] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Filename</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Size</th>
                <th className="py-3.5 px-4">Checksum</th>
                <th className="py-3.5 px-4">Created At</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-sm">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-400 text-xs"
                  >
                    Loading files...
                  </td>
                </tr>
              ) : files.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-slate-500 text-xs"
                  >
                    No files found.
                  </td>
                </tr>
              ) : (
                files.map((file) => (
                  <ShareTableRow
                    key={file.id}
                    file={file}
                    onDownload={onDownload}
                    onDelete={onDelete}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
