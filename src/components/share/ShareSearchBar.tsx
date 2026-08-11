import React from "react";

interface ShareSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const ShareSearchBar: React.FC<ShareSearchBarProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="flex items-center gap-3 mb-6 bg-[#10192c]/80 border border-slate-800 p-2.5 rounded-xl">
      <div className="flex items-center gap-2 px-3 flex-1">
        <svg
          className="w-4 h-4 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search files (Filename, Type, Checksum)..."
          className="bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 w-full"
        />
      </div>
      {searchTerm && (
        <button
          onClick={() => onSearchChange("")}
          className="text-xs text-slate-400 hover:text-white px-3 py-1 bg-slate-800 rounded-lg transition cursor-pointer"
        >
          Clear
        </button>
      )}
    </div>
  );
};
