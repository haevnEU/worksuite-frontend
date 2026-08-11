import { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { ParsedCsvData } from "../models/csvParser.model.ts";

const MAX_FILES = 5;

const parseCsvFile = (file: File, index: number): Promise<ParsedCsvData> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: ";",
      dynamicTyping: false,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data as Record<string, string>[];
        resolve({
          id: `${file.name}-${Date.now()}-${index}`,
          fileName: file.name,
          headers,
          rows,
          totalRows: rows.length,
        });
      },
      error: (err) => reject(err),
    });
  });
};

export function useCsvViewerState() {
  const [files, setFiles] = useState<ParsedCsvData[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [highlightedRowIndex, setHighlightedRowIndex] = useState<number | null>(
    null,
  );
  const [drawerRowIndex, setDrawerRowIndex] = useState<number | null>(null);

  const activeFile = useMemo(
    () => files.find((f) => f.id === activeFileId) || null,
    [files, activeFileId],
  );

  const filteredRows = useMemo(() => {
    if (!activeFile) return [];
    if (!searchTerm.trim()) return activeFile.rows;

    const term = searchTerm.toLowerCase();
    return activeFile.rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(term),
      ),
    );
  }, [activeFile, searchTerm]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const activeIndex = drawerRowIndex ?? highlightedRowIndex;

  const resetSelection = () => {
    setHighlightedRowIndex(null);
    setDrawerRowIndex(null);
  };

  // Keyboard Navigation Effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!filteredRows.length) return;

      if (activeIndex === null) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightedRowIndex(0);
        }
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedRowIndex !== null)
          setDrawerRowIndex(highlightedRowIndex);
      } else if (e.key === "Escape") {
        setDrawerRowIndex(null);
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const delta = e.key === "ArrowDown" ? 1 : -1;
        const nextIndex = Math.max(
          0,
          Math.min(activeIndex + delta, filteredRows.length - 1),
        );
        const targetPage = Math.floor(nextIndex / pageSize) + 1;

        if (targetPage !== currentPage) setCurrentPage(targetPage);
        if (drawerRowIndex !== null) setDrawerRowIndex(nextIndex);
        else setHighlightedRowIndex(nextIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeIndex,
    highlightedRowIndex,
    drawerRowIndex,
    filteredRows.length,
    currentPage,
    pageSize,
  ]);

  // Handlers
  const handleFilesSelect = async (selectedFiles: File[]) => {
    const availableSlots = MAX_FILES - files.length;
    if (availableSlots <= 0) return;

    setIsLoading(true);
    try {
      const parsed = await Promise.all(
        selectedFiles.slice(0, availableSlots).map(parseCsvFile),
      );

      setFiles((prev) => [...prev, ...parsed]);
      if (parsed.length > 0) setActiveFileId(parsed[parsed.length - 1].id);

      setCurrentPage(1);
      setSearchTerm("");
      resetSelection();
    } catch (err) {
      console.error("Error parsing CSV files:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseFile = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = files.filter((f) => f.id !== fileId);
    setFiles(remaining);

    if (activeFileId === fileId) {
      setActiveFileId(
        remaining.length > 0 ? remaining[remaining.length - 1].id : null,
      );
    }
    resetSelection();
  };

  const handleSelectFile = (fileId: string) => {
    if (fileId === activeFileId) return;
    setActiveFileId(fileId);
    setCurrentPage(1);
    setSearchTerm("");
    resetSelection();
  };

  const handleRowClick = (e: React.MouseEvent, globalIndex: number) => {
    if (e.ctrlKey || e.metaKey) {
      setDrawerRowIndex(globalIndex);
      return;
    }
    setHighlightedRowIndex((prev) =>
      prev === globalIndex ? null : globalIndex,
    );
  };

  const drawerRow =
    drawerRowIndex !== null ? filteredRows[drawerRowIndex] || null : null;

  return {
    files,
    activeFile,
    activeFileId,
    searchTerm,
    isLoading,
    currentPage,
    pageSize,
    totalPages,
    highlightedRowIndex,
    drawerRowIndex,
    drawerRow,
    filteredRows,
    paginatedRows,
    MAX_FILES,
    handleFilesSelect,
    handleCloseFile,
    handleSelectFile,
    handleRowClick,
    setSearchTerm: (term: string) => {
      setSearchTerm(term);
      setCurrentPage(1);
      resetSelection();
    },
    setPageSize: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
      resetSelection();
    },
    setCurrentPage: (page: number) => {
      setCurrentPage(page);
      resetSelection();
    },
    setDrawerRowIndex,
  };
}
