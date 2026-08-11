import React, { useEffect, useMemo, useState } from "react";
import Papa from "papaparse";
import { FileText } from "lucide-react";
import { CsvHeaderSection } from "../components/csv/CsvHeaderSection.tsx";
import { CsvTable, ParsedCsvData } from "../components/csv/CsvTable.tsx";
import { CsvDetailDrawer } from "../components/csv/CsvDetailDrawer.tsx";

const MAX_FILES = 5;

export const CsvViewerPage: React.FC = () => {
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

  const activeFile = useMemo(() => {
    return files.find((f) => f.id === activeFileId) || null;
  }, [files, activeFileId]);

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
  const activeIndex =
    drawerRowIndex !== null ? drawerRowIndex : highlightedRowIndex;

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
        if (highlightedRowIndex !== null) {
          setDrawerRowIndex(highlightedRowIndex);
        }
      } else if (e.key === "Escape") {
        setDrawerRowIndex(null);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex = Math.min(activeIndex + 1, filteredRows.length - 1);
        const targetPage = Math.floor(nextIndex / pageSize) + 1;
        if (targetPage !== currentPage) setCurrentPage(targetPage);

        if (drawerRowIndex !== null) setDrawerRowIndex(nextIndex);
        else setHighlightedRowIndex(nextIndex);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = Math.max(activeIndex - 1, 0);
        const targetPage = Math.floor(prevIndex / pageSize) + 1;
        if (targetPage !== currentPage) setCurrentPage(targetPage);

        if (drawerRowIndex !== null) setDrawerRowIndex(prevIndex);
        else setHighlightedRowIndex(prevIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    activeIndex,
    highlightedRowIndex,
    filteredRows.length,
    drawerRowIndex,
    currentPage,
    pageSize,
  ]);

  const handleFilesSelect = async (selectedFiles: File[]) => {
    const availableSlots = MAX_FILES - files.length;
    if (availableSlots <= 0) return;

    const filesToProcess = selectedFiles.slice(0, availableSlots);

    setIsLoading(true);

    const parsePromises = filesToProcess.map(
      (file, index) =>
        new Promise<ParsedCsvData>((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            delimiter: ";",
            dynamicTyping: false,
            complete: (results) => {
              const headers = results.meta.fields || [];
              const rows = results.data as Record<string, string>[];
              const newFileId = `${file.name}-${Date.now()}-${index}`;

              resolve({
                id: newFileId,
                fileName: file.name,
                headers,
                rows,
                totalRows: rows.length,
              });
            },
            error: (error) => reject(error),
          });
        }),
    );

    try {
      const parsedResults = await Promise.all(parsePromises);

      setFiles((prev) => [...prev, ...parsedResults]);

      if (parsedResults.length > 0) {
        setActiveFileId(parsedResults[parsedResults.length - 1].id);
      }

      setCurrentPage(1);
      setSearchTerm("");
      setHighlightedRowIndex(null);
      setDrawerRowIndex(null);
    } catch (error) {
      console.error("Error parsing one or more CSV files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseFile = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const remainingFiles = files.filter((f) => f.id !== fileId);
    setFiles(remainingFiles);

    if (activeFileId === fileId) {
      if (remainingFiles.length > 0) {
        setActiveFileId(remainingFiles[remainingFiles.length - 1].id);
      } else {
        setActiveFileId(null);
      }
    }

    setHighlightedRowIndex(null);
    setDrawerRowIndex(null);
  };

  const handleSelectFile = (fileId: string) => {
    if (fileId === activeFileId) return;
    setActiveFileId(fileId);
    setCurrentPage(1);
    setSearchTerm("");
    setHighlightedRowIndex(null);
    setDrawerRowIndex(null);
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

  const drawerRow = useMemo(() => {
    if (drawerRowIndex === null || !filteredRows[drawerRowIndex]) return null;
    return filteredRows[drawerRowIndex];
  }, [filteredRows, drawerRowIndex]);

  return (
    <div className="relative space-y-6 pb-16 font-sans w-full">
      <CsvHeaderSection
        filesCount={files.length}
        maxFiles={MAX_FILES}
        onFilesSelect={handleFilesSelect}
      />

      {isLoading && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs font-semibold">
          Processing CSV files...
        </div>
      )}

      {!isLoading && files.length === 0 && (
        <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-12 bg-slate-900/40 text-center space-y-4 transition-colors">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-200">No files loaded</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Select or drop up to 5 CSV files at once to inspect and compare
              datasets.
            </p>
          </div>
        </div>
      )}

      {!isLoading && files.length > 0 && activeFileId && (
        <CsvTable
          files={files}
          activeFileId={activeFileId}
          paginatedRows={paginatedRows}
          filteredRowsCount={filteredRows.length}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          searchTerm={searchTerm}
          highlightedRowIndex={highlightedRowIndex}
          drawerRowIndex={drawerRowIndex}
          onSelectFile={handleSelectFile}
          onCloseFile={handleCloseFile}
          onSearchChange={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
            setHighlightedRowIndex(null);
            setDrawerRowIndex(null);
          }}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
            setHighlightedRowIndex(null);
            setDrawerRowIndex(null);
          }}
          onPageChange={(page) => {
            setCurrentPage(page);
            setHighlightedRowIndex(null);
            setDrawerRowIndex(null);
          }}
          onRowClick={handleRowClick}
        />
      )}

      {drawerRow && drawerRowIndex !== null && activeFile && (
        <CsvDetailDrawer
          drawerRow={drawerRow}
          drawerRowIndex={drawerRowIndex}
          totalRows={filteredRows.length}
          headers={activeFile.headers}
          onClose={() => setDrawerRowIndex(null)}
          onNavigate={(dir) =>
            setDrawerRowIndex((prev) =>
              prev !== null
                ? dir === "up"
                  ? Math.max(prev - 1, 0)
                  : Math.min(prev + 1, filteredRows.length - 1)
                : null,
            )
          }
        />
      )}
    </div>
  );
};
