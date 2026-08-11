import React, { useCallback, useEffect, useMemo, useState } from "react";
import { mockService } from "../services/network/mock.service.ts";

export interface ParsedCsvResult {
  fileName: string;
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
  rawCsv: string;
}

const parseCsvString = (csvText: string, fileName: string): ParsedCsvResult => {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) {
    return { fileName, headers: [], rows: [], totalRows: 0, rawCsv: csvText };
  }

  const delimiter = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0]
    .split(delimiter)
    .map((h) => h.replace(/^["']|["']$/g, "").trim());

  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i]
      .split(delimiter)
      .map((v) => v.replace(/^["']|["']$/g, "").trim());
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? "";
    });
    rows.push(row);
  }

  return {
    fileName,
    headers,
    rows,
    totalRows: rows.length,
    rawCsv: csvText,
  };
};

export const useMockGeneratorState = () => {
  const [types, setTypes] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [amount, setAmount] = useState<number>(50);
  const [isLoadingTypes, setIsLoadingTypes] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedData, setGeneratedData] = useState<ParsedCsvResult | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [highlightedRowIndex, setHighlightedRowIndex] = useState<number | null>(
    null,
  );
  const [drawerRowIndex, setDrawerRowIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        setIsLoadingTypes(true);
        const fetchedTypes = await mockService.fetchMockTypes();
        if (isMounted) {
          setTypes(fetchedTypes);
          if (fetchedTypes.length > 0) {
            setSelectedType(fetchedTypes[0]);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load mock types",
          );
        }
      } finally {
        if (isMounted) setIsLoadingTypes(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!selectedType || amount <= 0) return;

    setIsGenerating(true);
    setError(null);
    try {
      const csvText = await mockService.generateMockData(selectedType, amount);
      const currentTime = new Date()
        .toISOString()
        .replace(/[-:T.]/g, "")
        .slice(0, 14);
      const generatedFileName = `TEST_${selectedType}_${currentTime}.csv`;

      const parsed = parseCsvString(csvText, generatedFileName);
      setGeneratedData(parsed);
      setCurrentPage(1);
      setSearchTerm("");
      setDrawerRowIndex(null);
      setHighlightedRowIndex(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate mock data",
      );
    } finally {
      setIsGenerating(false);
    }
  }, [selectedType, amount]);

  const handleDownload = useCallback(() => {
    if (!generatedData) return;

    const blob = new Blob([generatedData.rawCsv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", generatedData.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [generatedData]);

  const filteredRows = useMemo(() => {
    if (!generatedData) return [];
    if (!searchTerm.trim()) return generatedData.rows;

    const term = searchTerm.toLowerCase();
    return generatedData.rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(term),
      ),
    );
  }, [generatedData, searchTerm]);

  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, currentPage, pageSize]);

  const drawerRow = useMemo(() => {
    if (drawerRowIndex === null || !filteredRows[drawerRowIndex]) return null;
    return filteredRows[drawerRowIndex];
  }, [drawerRowIndex, filteredRows]);

  const handleRowClick = useCallback((e: React.MouseEvent, index: number) => {
    setHighlightedRowIndex(index);
    setDrawerRowIndex(index);
  }, []);

  return {
    types,
    selectedType,
    amount,
    isLoadingTypes,
    isGenerating,
    error,
    generatedData,
    searchTerm,
    currentPage,
    pageSize,
    highlightedRowIndex,
    drawerRowIndex,
    drawerRow,
    filteredRows,
    paginatedRows,
    totalPages,
    setSelectedType,
    setAmount,
    setSearchTerm: (val: string) => {
      setSearchTerm(val);
      setCurrentPage(1);
    },
    setPageSize: (val: number) => {
      setPageSize(val);
      setCurrentPage(1);
    },
    setCurrentPage,
    setDrawerRowIndex,
    handleGenerate,
    handleDownload,
    handleRowClick,
  };
};
