import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  BookOpen,
  Filter,
  Terminal,
  GitBranch,
  Container,
  Database,
  RefreshCw,
  Plus,
  Hammer,
  Globe,
  TerminalSquare,
} from "lucide-react";
import {
  CheatSheetLevel,
  CheatSheetResponseDto,
} from "../models/cheatSheet.model.ts";
import { filterCheatsheetItems } from "../utils/cheat.util.ts";
import {
  CheatCard,
  CheatDrawer,
  CreateCheatSheetModal,
} from "../components/cheat";
import { cheatSheetService } from "../services/network/cheatSheet.service.ts";

const LEVEL_TABS: { label: string; value: CheatSheetLevel | "ALL" }[] = [
  { label: "All Levels", value: "ALL" },
  { label: "Basic", value: "BASIC" },
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
];

const renderCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "git":
      return <GitBranch className="w-4 h-4 text-orange-400" />;
    case "docker":
    case "k8s":
    case "container":
      return <Container className="w-4 h-4 text-blue-400" />;
    case "database":
    case "postgres":
    case "psql":
    case "mongo":
    case "sql":
      return <Database className="w-4 h-4 text-emerald-400" />;
    case "gradle":
      return <Hammer className="w-4 h-4 text-teal-400" />;
    case "curl":
      return <Globe className="w-4 h-4 text-cyan-400" />;
    case "unix":
    case "linux":
    case "bash":
      return <TerminalSquare className="w-4 h-4 text-yellow-400" />;
    default:
      return <Terminal className="w-4 h-4 text-purple-400" />;
  }
};

export const CheatsheetPage: React.FC = () => {
  const [items, setItems] = useState<CheatSheetResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "ALL">(
    "ALL",
  );
  const [selectedLevel, setSelectedLevel] = useState<CheatSheetLevel | "ALL">(
    "ALL",
  );
  const [selectedItem, setSelectedItem] =
    useState<CheatSheetResponseDto | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadCheatSheets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await cheatSheetService.fetchAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load cheatsheets from backend");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCheatSheets();
  }, []);

  // Dynamische Kategorien dedupliziert und case-insensitive ermittelt
  const availableCategories = useMemo(() => {
    const cats = new Map<string, string>();
    items.forEach((item) => {
      if (item.category) {
        const key = item.category.trim().toLowerCase();
        if (!cats.has(key)) {
          cats.set(key, item.category.trim());
        }
      }
    });
    return Array.from(cats.values());
  }, [items]);

  // Live gefilterte Einträge
  const filteredItems = useMemo(() => {
    return filterCheatsheetItems(
      items,
      selectedCategory,
      selectedLevel,
      search,
    );
  }, [items, selectedCategory, selectedLevel, search]);

  // Nach Kategorie gruppiert für die Sektionen
  const groupedByCategory = useMemo(() => {
    const groups: Record<string, CheatSheetResponseDto[]> = {};
    filteredItems.forEach((item) => {
      const catKey = (item.category || "General").toUpperCase();
      if (!groups[catKey]) groups[catKey] = [];
      groups[catKey].push(item);
    });
    return groups;
  }, [filteredItems]);

  return (
    <div className="relative w-full">
      <div
        className={`space-y-6 transition-all duration-300 ease-in-out ${
          selectedItem ? "xl:mr-[460px]" : "mr-0"
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white">
                Developer Cheatsheets
              </h1>
              <p className="text-xs text-slate-400">
                Quick commands, CLI syntax flags, queries, and shortcuts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Suchfeld mit Clear-Button */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search syntax, tags, commands, flags..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs cursor-pointer p-0.5"
                  title="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={loadCheatSheets}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh Cheatsheets"
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Entry</span>
            </button>
            {/*<button*/}
            {/*  type="button"*/}
            {/*  onClick={() => cheatSheetService.seed()}*/}
            {/*  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"*/}
            {/*>*/}
            {/*  Seed Cheatsheets*/}
            {/*</button>*/}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === "ALL"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            All Topics ({items.length})
          </button>
          {availableCategories.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() =>
                  setSelectedCategory((prev) =>
                    prev.toLowerCase() === cat.toLowerCase()
                      ? "ALL"
                      : cat.toLowerCase(),
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 uppercase ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {renderCategoryIcon(cat)}
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1 shrink-0" />
          {LEVEL_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedLevel(tab.value)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                selectedLevel === tab.value
                  ? "bg-slate-800 text-slate-200 border border-slate-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content View */}
        {error ? (
          <div className="p-8 text-center border border-rose-800/50 bg-rose-950/20 rounded-2xl text-rose-300 text-xs">
            <p className="font-semibold mb-2">Error loading cheat sheets</p>
            <p className="text-slate-400 mb-4">{error}</p>
            <button
              onClick={loadCheatSheets}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : isLoading && items.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-500 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
            <span>Loading cheatsheets from database...</span>
          </div>
        ) : Object.keys(groupedByCategory).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedByCategory).map(([category, catItems]) => (
              <section key={category} className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800/60">
                  {renderCategoryIcon(category)}
                  <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {category}
                  </h2>
                  <span className="ml-auto text-[10px] font-mono text-slate-500">
                    {catItems.length} commands
                  </span>
                </div>

                <div
                  className={`grid gap-3.5 transition-all duration-300 ${
                    selectedItem
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2"
                      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                  }`}
                >
                  {catItems.map((item) => (
                    <CheatCard
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      onSelect={(clicked) => {
                        setSelectedItem((prev) =>
                          prev?.id === clicked.id ? null : clicked,
                        );
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-500">
              No cheatsheet entries found for your filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Detail Drawer */}
      <CheatDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />

      {/* Create Modal Dialog */}
      <CreateCheatSheetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={loadCheatSheets}
      />
    </div>
  );
};

export default CheatsheetPage;
