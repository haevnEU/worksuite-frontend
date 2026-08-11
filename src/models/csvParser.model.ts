export interface ParsedCsvData {
  id: string;
  fileName: string;
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
}
