import {
  CheatSheetLevel,
  CheatSheetResponseDto,
} from "../models/cheatSheet.model.ts";

export const getLevelBadgeClass = (level?: CheatSheetLevel): string => {
  switch (level) {
    case "BASIC":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "INTERMEDIATE":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "ADVANCED":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    default:
      return "bg-slate-800 text-slate-400 border-slate-700";
  }
};

export const filterCheatsheetItems = (
  items: CheatSheetResponseDto[],
  selectedCategory: string | "ALL",
  selectedLevel: CheatSheetLevel | "ALL",
  search: string,
): CheatSheetResponseDto[] => {
  const query = search.trim().toLowerCase();

  return items.filter((item) => {
    // 1. Topic / Category Filter
    if (
      selectedCategory !== "ALL" &&
      item.category.toLowerCase() !== selectedCategory.toLowerCase()
    ) {
      return false;
    }

    // 2. Level Filter
    if (selectedLevel !== "ALL" && item.level !== selectedLevel) {
      return false;
    }

    // 3. Search Query Filter
    if (!query) {
      return true;
    }

    // Direkte Textfelder prüfen
    const matchTitle = item.title?.toLowerCase().includes(query) ?? false;
    const matchSyntax = item.syntax?.toLowerCase().includes(query) ?? false;
    const matchExplanation =
      item.explanation?.toLowerCase().includes(query) ?? false;
    const matchCategory = item.category?.toLowerCase().includes(query) ?? false;
    const matchSubcategory =
      item.subcategory?.toLowerCase().includes(query) ?? false;
    const matchLanguage = item.language?.toLowerCase().includes(query) ?? false;

    // Tags prüfen (z. B. "git" oder "#rebase")
    const normalizedQuery = query.startsWith("#") ? query.slice(1) : query;
    const matchTags =
      item.tags?.some(
        (t) =>
          t.toLowerCase().includes(query) ||
          t.toLowerCase().includes(normalizedQuery),
      ) ?? false;

    // Flags prüfen (-i, --volumes, etc.)
    const matchFlags =
      item.flags?.some(
        (f) =>
          f.flag.toLowerCase().includes(query) ||
          f.description.toLowerCase().includes(query),
      ) ?? false;

    // Examples prüfen
    const matchExamples =
      item.examples?.some(
        (ex) =>
          ex.title.toLowerCase().includes(query) ||
          ex.command.toLowerCase().includes(query),
      ) ?? false;

    return (
      matchTitle ||
      matchSyntax ||
      matchExplanation ||
      matchCategory ||
      matchSubcategory ||
      matchLanguage ||
      matchTags ||
      matchFlags ||
      matchExamples
    );
  });
};
