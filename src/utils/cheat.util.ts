import { CheatCategory, CheatLevel } from "../types/cheat.type.ts";
import { CheatItem, CheatsheetTopic } from "../models/cheat.model.ts";

export const extractUniqueCategories = (
  topics: CheatsheetTopic[],
): string[] => {
  return Array.from(new Set(topics.map((t) => t.category)));
};

export const filterCheatsheetItems = (
  topics: CheatsheetTopic[],
  selectedTopicId: string | "ALL",
  selectedLevel: CheatLevel | "ALL",
  searchQuery: string,
): CheatsheetTopic[] => {
  const query = searchQuery.trim().toLowerCase();

  return topics
    .filter(
      (topic) => selectedTopicId === "ALL" || topic.id === selectedTopicId,
    )
    .map((topic) => {
      const filteredSections = topic.sections
        .map((section) => {
          const matchingItems = section.items.filter((item) => {
            const matchesLevel =
              selectedLevel === "ALL" || item.level === selectedLevel;
            const matchesSearch =
              query === "" ||
              item.title.toLowerCase().includes(query) ||
              item.syntax.toLowerCase().includes(query) ||
              item.description.toLowerCase().includes(query) ||
              item.tags.some((tag) => tag.toLowerCase().includes(query));

            return matchesLevel && matchesSearch;
          });

          return { ...section, items: matchingItems };
        })
        .filter((section) => section.items.length > 0);

      return { ...topic, sections: filteredSections };
    })
    .filter((topic) => topic.sections.length > 0);
};

export const getLevelBadgeClass = (level?: CheatLevel): string => {
  switch (level) {
    case "basic":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "intermediate":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "advanced":
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
};
