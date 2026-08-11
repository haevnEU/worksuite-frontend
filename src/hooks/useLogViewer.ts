import { useCallback, useMemo, useState } from "react";
import {
  LogEntry,
  LogLevel,
  ParsedLogFile,
} from "../models/logViewer.model.ts";

const MAX_FILES = 5;

// Regex 1: Java/JBoss Logs (z. B. "2026-08-14 18:41:46 DEBUG info.hausheld... - Message")
const JAVA_LOG_REGEX =
  /^(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}(?:[.,]\d+)?(?:Z|[+-]\d{2}:?\d{2})?)\s+(TRACE|DEBUG|INFO|WARN|WARNING|ERROR|FATAL)\s+([a-zA-Z0-9_$.-]+)\s*(?:-\s*(.*)|:\s*(.*)|(.*))$/i;

// Regex 2: Access Logs (z. B. 127.0.0.1 - - [14/Aug/2026:18:35:32 +0200] "GET /path HTTP/1.1" 200 248)
const ACCESS_LOG_REGEX =
  /^(\S+)\s+\S+\s+\S+\s+\[([^\]]+)\]\s+"([A-Z]+)\s+([^\s"]+)\s+HTTP\/[0-9.]+"\s+(\d{3})\s+(\S+)/;

export const parseRawLogContent = (rawContent: string): LogEntry[] => {
  const rawLines = rawContent.split(/\r?\n/);
  const entries: LogEntry[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (!line && i === rawLines.length - 1) continue;

    // Multiline-Erkennung (Kafka Configs, Stacktraces 'at ...', 'Caused by', eingerückte Zeilen)
    const isIndented =
      /^\s+/.test(line) || /^\tat\s+/.test(line) || /^Caused by:/.test(line);

    if (isIndented && entries.length > 0) {
      const lastEntry = entries[entries.length - 1];
      lastEntry.rawText += `\n${line}`;
      lastEntry.message += `\n${line}`;
      continue;
    }

    // Java / JBoss Format (Format 1, 2, 3)
    const javaMatch = line.match(JAVA_LOG_REGEX);
    if (javaMatch) {
      const [, timestamp, rawLevel, logger, msg1, msg2, msg3] = javaMatch;
      let level: LogLevel =
        rawLevel.toUpperCase() === "WARNING"
          ? "WARN"
          : (rawLevel.toUpperCase() as LogLevel);
      const message = (msg1 || msg2 || msg3 || "").trim();

      entries.push({
        id: `entry-${entries.length + 1}`,
        lineNumber: i + 1,
        timestamp,
        level,
        logger,
        message,
        rawText: line,
      });
      continue;
    }

    // Nginx / Apache Access Log Format (Format 4)
    const accessMatch = line.match(ACCESS_LOG_REGEX);
    if (accessMatch) {
      const [, ip, timestamp, httpMethod, httpPath, statusStr] = accessMatch;
      const httpStatus = parseInt(statusStr, 10);

      let level: LogLevel = "INFO";
      if (httpStatus >= 500) level = "ERROR";
      else if (httpStatus >= 400) level = "WARN";
      else if (httpStatus >= 100 && httpStatus < 400) level = "INFO";

      entries.push({
        id: `entry-${entries.length + 1}`,
        lineNumber: i + 1,
        timestamp,
        level,
        logger: `${httpMethod} ${httpStatus}`,
        message: `${httpMethod} ${httpPath} (${httpStatus}) - IP: ${ip}`,
        rawText: line,
        ip,
        httpMethod,
        httpStatus,
        httpPath,
      });
      continue;
    }

    // Generic Fallback
    const genericLevelMatch = line.match(
      /\b(TRACE|DEBUG|INFO|WARN|WARNING|ERROR|FATAL)\b/i,
    );
    const level: LogLevel = genericLevelMatch
      ? genericLevelMatch[1].toUpperCase() === "WARNING"
        ? "WARN"
        : (genericLevelMatch[1].toUpperCase() as LogLevel)
      : "UNKNOWN";

    entries.push({
      id: `entry-${entries.length + 1}`,
      lineNumber: i + 1,
      level,
      message: line,
      rawText: line,
    });
  }

  // Neueste Logs standardmäßig ganz oben (letzte Zeilen zuerst)
  return entries.reverse();
};

export const useLogViewerState = () => {
  const [files, setFiles] = useState<ParsedLogFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  // Selection / Drawer
  const [highlightedRowIndex, setHighlightedRowIndex] = useState<number | null>(
    null,
  );
  const [drawerRowIndex, setDrawerRowIndex] = useState<number | null>(null);

  const activeFile = useMemo(
    () => files.find((f) => f.id === activeFileId) || files[0] || null,
    [files, activeFileId],
  );

  const handleFilesSelect = useCallback(
    async (selectedFiles: File[]) => {
      setIsLoading(true);
      try {
        const slotsAvailable = MAX_FILES - files.length;
        const toProcess = selectedFiles.slice(0, slotsAvailable);

        const newParsed: ParsedLogFile[] = await Promise.all(
          toProcess.map(async (file) => {
            const text = await file.text();
            const entries = parseRawLogContent(text);

            const levelCounts: Record<LogLevel, number> = {
              TRACE: 0,
              DEBUG: 0,
              INFO: 0,
              WARN: 0,
              ERROR: 0,
              FATAL: 0,
              UNKNOWN: 0,
            };

            entries.forEach((e) => {
              levelCounts[e.level] = (levelCounts[e.level] || 0) + 1;
            });

            return {
              id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
              fileName: file.name,
              fileSize: file.size,
              entries,
              totalLines: entries.length,
              levelCounts,
            };
          }),
        );

        setFiles((prev) => [...prev, ...newParsed]);
        if (!activeFileId && newParsed.length > 0) {
          setActiveFileId(newParsed[0].id);
        }
      } catch (err) {
        console.error("Error reading log files:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [files.length, activeFileId],
  );

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
      setHighlightedRowIndex(null);
    },
    [activeFileId],
  );

  const filteredEntries = useMemo(() => {
    if (!activeFile) return [];

    const query = searchTerm.trim().toLowerCase();

    return activeFile.entries.filter((entry) => {
      if (selectedLevel !== "ALL" && entry.level !== selectedLevel) {
        return false;
      }
      if (query) {
        const matchesRaw = entry.rawText.toLowerCase().includes(query);
        const matchesLogger =
          entry.logger?.toLowerCase().includes(query) ?? false;
        const matchesPath =
          entry.httpPath?.toLowerCase().includes(query) ?? false;
        if (!matchesRaw && !matchesLogger && !matchesPath) return false;
      }
      return true;
    });
  }, [activeFile, searchTerm, selectedLevel]);

  const totalPages = Math.ceil(filteredEntries.length / pageSize) || 1;

  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEntries.slice(start, start + pageSize);
  }, [filteredEntries, currentPage, pageSize]);

  const drawerEntry = useMemo(() => {
    if (drawerRowIndex === null || !filteredEntries[drawerRowIndex])
      return null;
    return filteredEntries[drawerRowIndex];
  }, [drawerRowIndex, filteredEntries]);

  const handleRowClick = useCallback((e: React.MouseEvent, index: number) => {
    setHighlightedRowIndex(index);
    setDrawerRowIndex(index);
  }, []);

  return {
    MAX_FILES,
    files,
    activeFile,
    activeFileId,
    isLoading,
    searchTerm,
    selectedLevel,
    currentPage,
    pageSize,
    highlightedRowIndex,
    drawerRowIndex,
    drawerEntry,
    filteredEntries,
    paginatedEntries,
    totalPages,
    setSearchTerm: (val: string) => {
      setSearchTerm(val);
      setCurrentPage(1);
    },
    setSelectedLevel: (level: string) => {
      setSelectedLevel(level);
      setCurrentPage(1);
    },
    setPageSize: (size: number) => {
      setPageSize(size);
      setCurrentPage(1);
    },
    setCurrentPage,
    setActiveFileId,
    setDrawerRowIndex,
    handleFilesSelect,
    handleCloseFile,
    handleRowClick,
  };
};
