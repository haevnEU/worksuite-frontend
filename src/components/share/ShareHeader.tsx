import React from "react";

interface ShareHeaderProps {
  totalFiles: number;
}

export const ShareHeader: React.FC<ShareHeaderProps> = ({ totalFiles }) => {
  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur shadow-lg">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white tracking-wide">
              File Share & Storage
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Shared Files
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Upload, inspect checksums and download shared project assets
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start md:self-center">
        <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-4 py-2 rounded-xl text-xs">
          <span className="text-slate-400 font-medium">Files:</span>
          <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full text-[11px]">
            {totalFiles}
          </span>
        </div>
      </div>
    </div>
  );
};
