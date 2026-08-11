import React, { useState } from "react";
import {
  Share2,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  UploadCloud,
  Hash,
  Download,
  FolderArchive,
} from "lucide-react";

interface ShareHeaderProps {
  totalFiles: number;
}

export const ShareHeader: React.FC<ShareHeaderProps> = ({ totalFiles }) => {
  const [showGuide, setShowGuide] = useState<boolean>(false);

  return (
    <div className="bg-[#10192c]/80 border border-slate-800 rounded-xl p-6 mb-6 space-y-4 backdrop-blur shadow-lg">
      {/* Top Row: Icon, Title, Badge & Guide Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner shrink-0">
            <Share2 className="w-6 h-6" />
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
              Upload, inspect checksums, verify file integrity, and download
              shared project assets.
            </p>
          </div>
        </div>

        {/* Right Side: Total Files Pill & Guide Toggle */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
          <div className="flex items-center gap-2 bg-[#0b111e] border border-slate-800 px-3.5 py-2 rounded-xl text-xs">
            <FolderArchive className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400 font-medium">Files:</span>
            <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full text-[11px]">
              {totalFiles}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowGuide((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              showGuide
                ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                : "bg-[#0b111e] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
            title="Toggle file share guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Guide</span>
            {showGuide ? (
              <ChevronUp className="w-3 h-3 ml-0.5" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-0.5" />
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Action & Storage Guide */}
      {showGuide && (
        <div className="p-4 rounded-xl bg-[#0b111e]/90 border border-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 text-xs text-slate-300 space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold border-b border-slate-800 pb-2">
            <Info className="w-4 h-4 shrink-0" />
            <span>File Share & Storage Guide</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Upload & Dropzone */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
                  <UploadCloud className="w-3.5 h-3.5 shrink-0" />
                  <span>Upload & Batch Drop</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Drag and drop single or multiple files directly onto the
                  dropzone or click browse to upload project assets.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-blue-300 border-t border-slate-800/40">
                <span>Supports: Multi-file Dropzone</span>
              </div>
            </div>

            {/* 2. Checksum & Integrity */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-purple-900/40 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-purple-400 font-semibold mb-1">
                  <Hash className="w-3.5 h-3.5 shrink-0" />
                  <span>Checksums & Verification</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Each asset features an automatically generated cryptographic
                  hash. Click the copy icon to verify payload integrity.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-purple-300 border-t border-slate-800/40">
                <span>1-Click Copy Checksum Hash</span>
              </div>
            </div>

            {/* 3. Search & File Actions */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 space-y-1.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <Download className="w-3.5 h-3.5 shrink-0" />
                  <span>Search & Quick Actions</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Filter by filename, extension, or checksum prefix. Download
                  assets directly or remove outdated files permanently.
                </p>
              </div>
              <div className="pt-2 text-[10px] font-mono text-emerald-300 border-t border-slate-800/40">
                <span>Instant Filter · Direct Downloads</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
