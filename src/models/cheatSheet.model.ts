export type CheatSheetLevel = "BASIC" | "INTERMEDIATE" | "ADVANCED";

export interface FlagDto {
  flag: string;
  description: string;
}

export interface ExampleDto {
  title: string;
  command: string;
}

/**
 * Response payload vom Backend (CheatSheetResponseDto)
 */
export interface CheatSheetResponseDto {
  id: string; // UUID
  category: string;
  subcategory?: string;
  title: string;
  language: string;
  level: CheatSheetLevel;
  syntax: string;
  explanation: string;
  flags: FlagDto[];
  examples: ExampleDto[];
  tags?: string[];
  destructive: boolean;
  warning?: string;
  docUrl?: string;
  createdAt?: string; // ISO-8601 LocalDateTime
  updatedAt?: string;
}

/**
 * Request payload zum Anlegen oder Aktualisieren (CheatSheetRequestDto)
 */
export interface CheatSheetRequestDto {
  category: string;
  subcategory?: string;
  title: string;
  language: string;
  level: CheatSheetLevel;
  syntax: string;
  explanation: string;
  flags?: FlagDto[];
  examples?: ExampleDto[];
  tags?: string[];
  destructive: boolean;
  warning?: string;
  docUrl?: string;
}
