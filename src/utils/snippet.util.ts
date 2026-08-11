import { SnippetLanguage } from "../types/snippet.type.ts";

export const mapLanguageForPrism = (lang?: string): string => {
  if (!lang) return "text";
  switch (lang.toLowerCase()) {
    case "docker":
      return "dockerfile";
    case "csharp":
      return "csharp";
    case "cpp":
      return "cpp";
    case "bash":
      return "bash";
    case "html":
    case "xml":
      return "markup";
    case "json":
      return "json";
    case "yaml":
      return "yaml";
    case "markdown":
      return "markdown";
    case "text":
      return "text";
    default:
      return lang.toLowerCase();
  }
};

export const getLanguageBadgeColor = (
  language?: SnippetLanguage | string,
): string => {
  switch (language) {
    case "bash":
      return "bg-emerald-950 text-emerald-300 border-emerald-800";
    case "python":
      return "bg-amber-950 text-amber-300 border-amber-800";
    case "ruby":
      return "bg-rose-950 text-rose-300 border-rose-800";
    case "html":
      return "bg-orange-950 text-orange-300 border-orange-800";
    case "css":
      return "bg-sky-950 text-sky-300 border-sky-800";
    case "javascript":
      return "bg-yellow-950 text-yellow-300 border-yellow-800";
    case "typescript":
      return "bg-blue-950 text-blue-300 border-blue-800";
    case "java":
    case "kotlin":
      return "bg-red-950 text-red-300 border-red-800";
    case "c":
    case "cpp":
      return "bg-indigo-950 text-indigo-300 border-indigo-800";
    case "csharp":
      return "bg-purple-950 text-purple-300 border-purple-800";
    case "go":
      return "bg-cyan-950 text-cyan-300 border-cyan-800";
    case "rust":
      return "bg-orange-950 text-amber-400 border-orange-800";
    case "swift":
      return "bg-orange-950 text-orange-400 border-orange-800";
    case "php":
      return "bg-violet-950 text-violet-300 border-violet-800";
    case "docker":
      return "bg-blue-950 text-sky-400 border-blue-800";
    case "sql":
      return "bg-teal-950 text-teal-300 border-teal-800";
    case "json":
    case "yaml":
    case "xml":
      return "bg-lime-950 text-lime-300 border-lime-800";
    case "markdown":
      return "bg-slate-800 text-slate-300 border-slate-700";
    case "text":
    default:
      return "bg-slate-800 text-slate-400 border-slate-700";
  }
};
