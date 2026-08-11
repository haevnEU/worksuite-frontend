import React, { useEffect, useState } from "react";
import { FileMeta, shareService } from "../services/network/share.service.ts";
import { ToastManager } from "../toaster/ToastManager.ts";
import {
  ShareDropzone,
  ShareHeader,
  ShareSearchBar,
  ShareTable,
} from "../components/share";

export const SharePage: React.FC = () => {
  const [files, setFiles] = useState<FileMeta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const data = await shareService.getFiles();
      setFiles((data || []).filter((f) => !f.deleted));
    } catch {
      ToastManager.toastBad("Failed to load file list.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const filesToUpload = Array.from(fileList);

    try {
      setIsLoading(true);
      await shareService.uploadFiles(filesToUpload);
      ToastManager.toastGood(
        `${filesToUpload.length} file(s) uploaded successfully.`,
      );
      await loadFiles();
    } catch {
      ToastManager.toastBad("Failed to upload files.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (
    id: string,
    filename: string,
    e?: React.MouseEvent,
  ) => {
    const isModifierPressed = e ? e.ctrlKey || e.metaKey : false;

    if (
      !isModifierPressed &&
      !confirm(`Are you sure you want to delete "${filename}"?`)
    ) {
      return;
    }

    try {
      await shareService.deleteFile(id);
      ToastManager.toastGood(`File "${filename}" deleted.`);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch {
      ToastManager.toastBad("Failed to delete file.");
    }
  };

  const handleDownload = async (file: FileMeta) => {
    try {
      await shareService.downloadFile(file);
    } catch {
      ToastManager.toastBad("Failed to download file.");
    }
  };

  const filteredFiles = files.filter(
    (f) =>
      f.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.fileType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.checksum?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 pb-12 font-sans">
      <ShareHeader totalFiles={files.length} />
      <ShareDropzone onUpload={handleUpload} disabled={isLoading} />
      <ShareSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <ShareTable
        files={filteredFiles}
        totalFilesCount={files.length}
        isLoading={isLoading}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
    </div>
  );
};
