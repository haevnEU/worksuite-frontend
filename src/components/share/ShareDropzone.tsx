import React, { ChangeEvent, DragEvent, useRef, useState } from "react";

interface ShareDropzoneProps {
  onUpload: (files: FileList | null) => void;
  disabled?: boolean;
}

export const ShareDropzone: React.FC<ShareDropzoneProps> = ({
  onUpload,
  disabled,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) {
      onUpload(e.dataTransfer.files);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    onUpload(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 mb-6 bg-[#0f172a]/50 hover:bg-[#131d35]/60 ${
        isDragging
          ? "border-blue-500 bg-blue-500/10 scale-[0.99]"
          : "border-slate-700/80"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={onChange}
        disabled={disabled}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
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
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-300">
          Drag & Drop files here, or{" "}
          <span className="text-blue-400 underline font-semibold">browse</span>
        </p>
        <span className="text-xs text-slate-500">
          Supports single or multi-file upload
        </span>
      </div>
    </div>
  );
};
