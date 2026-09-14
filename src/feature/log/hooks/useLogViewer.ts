import { useCallback, useMemo, useState } from "react";
import type { LogEntry, ParsedLogFile, SearchMode } from "../models/log.model";
import { parseRawLogText } from "../utils/parser.util";

const MAX_FILES = 5;

export function useLogViewer() {
  const [files, setFiles] = useState<ParsedLogFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchMode, setSearchMode] = useState<SearchMode>("all");
  const [selectedLevel, setSelectedLevel] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [highlightedRowIndex, setHighlightedRowIndex] = useState<number | null>(
    null,
  );
  const [drawerRowIndex, setDrawerRowIndex] = useState<number | null>(null);

  const handleFilesSelect = useCallback(async (newFiles: File[]) => {
    setIsLoading(true);
    try {
      const parsedList = await Promise.all(
        newFiles.slice(0, MAX_FILES).map(async (file) => {
          const text = await file.text();
          return parseRawLogText(file.name, text);
        }),
      );

      setFiles((prev) => {
        const combined = [...prev, ...parsedList].slice(0, MAX_FILES);
        return combined;
      });

      if (parsedList.length > 0) {
        setActiveFileId(parsedList[0].id);
        setCurrentPage(1);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCloseFile = useCallback(
    (fileId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setFiles((prev) => {
        const next = prev.filter((f) => f.id !== fileId);
        if (activeFileId === fileId) {
          setActiveFileId(next.length > 0 ? next[0].id : null);
        }
        return next;
      });
      setDrawerRowIndex(null);
    },
    [activeFileId],
  );

  const activeFile = useMemo(
    () => files.find((f) => f.id === activeFileId) || null,
    [files, activeFileId],
  );

  const filteredEntries = useMemo(() => {
    if (!activeFile) return [];
    const query = searchTerm.trim().toLowerCase();

    return activeFile.entries.filter((entry) => {
      const matchesLevel =
        selectedLevel === "ALL" || entry.level === selectedLevel;
      if (!matchesLevel) return false;
      if (!query) return true;

      switch (searchMode) {
        case "timestamp":
          return entry.timestamp?.toLowerCase().includes(query) ?? false;
        case "logger_endpoint":
          return entry.logger?.toLowerCase().includes(query) ?? false;
        default:
          return (
            entry.rawText.toLowerCase().includes(query) ||
            entry.level.toLowerCase().includes(query) ||
            (entry.logger?.toLowerCase().includes(query) ?? false)
          );
      }
    });
  }, [activeFile, searchTerm, searchMode, selectedLevel]);

  const totalPages = Math.max(Math.ceil(filteredEntries.length / pageSize), 1);

  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEntries.slice(start, start + pageSize);
  }, [filteredEntries, currentPage, pageSize]);

  const drawerEntry = useMemo<LogEntry | null>(() => {
    if (drawerRowIndex === null || !filteredEntries[drawerRowIndex])
      return null;
    return filteredEntries[drawerRowIndex];
  }, [drawerRowIndex, filteredEntries]);

  const handleRowClick = useCallback(
    (_e: React.MouseEvent, globalIndex: number) => {
      setHighlightedRowIndex(globalIndex);
      setDrawerRowIndex(globalIndex);
    },
    [],
  );

  return {
    MAX_FILES,
    files,
    activeFileId,
    isLoading,
    searchTerm,
    searchMode,
    selectedLevel,
    currentPage,
    totalPages,
    pageSize,
    highlightedRowIndex,
    drawerRowIndex,
    filteredEntries,
    paginatedEntries,
    drawerEntry,
    setActiveFileId,
    setSearchTerm,
    setSearchMode,
    setSelectedLevel,
    setCurrentPage,
    setPageSize,
    setDrawerRowIndex,
    handleFilesSelect,
    handleCloseFile,
    handleRowClick,
  };
}
