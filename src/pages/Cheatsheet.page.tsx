import React, { useMemo, useState } from "react";
import {
  Search,
  BookOpen,
  Filter,
  Terminal,
  GitBranch,
  Container,
  Database,
} from "lucide-react";
import { CheatLevel } from "../types/cheat.type.ts";
import { CheatItem } from "../models/cheat.model.ts";
import { filterCheatsheetItems } from "../utils/cheat.util.ts";
import { CHEATSHEET_TOPICS } from "../constants/cheat.constant.ts";
import { CheatCard, CheatDrawer } from "../components/cheat";

const LEVEL_TABS: { label: string; value: CheatLevel | "ALL" }[] = [
  { label: "All Levels", value: "ALL" },
  { label: "Basic", value: "basic" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
];

const renderTopicIcon = (iconName: string) => {
  switch (iconName) {
    case "GitBranch":
      return <GitBranch className="w-4 h-4 text-orange-400" />;
    case "Container":
      return <Container className="w-4 h-4 text-blue-400" />;
    case "Database":
      return <Database className="w-4 h-4 text-emerald-400" />;
    default:
      return <Terminal className="w-4 h-4 text-purple-400" />;
  }
};

export const CheatsheetPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState<string | "ALL">("ALL");
  const [selectedLevel, setSelectedLevel] = useState<CheatLevel | "ALL">("ALL");
  const [selectedItem, setSelectedItem] = useState<CheatItem | null>(null);

  const filteredTopics = useMemo(() => {
    return filterCheatsheetItems(
      CHEATSHEET_TOPICS,
      selectedTopicId,
      selectedLevel,
      search,
    );
  }, [selectedTopicId, selectedLevel, search]);

  return (
    <div className="relative w-full">
      {/* Haupt-Bereich: Weicht dem Drawer exakt per Margin aus, Karten verteilen sich gleichmäßig */}
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

          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search syntax, tags, commands..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Topic Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedTopicId("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedTopicId === "ALL"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
            }`}
          >
            All Topics
          </button>
          {CHEATSHEET_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setSelectedTopicId(topic.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTopicId === topic.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {renderTopicIcon(topic.iconName)}
              <span>{topic.title}</span>
            </button>
          ))}
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

        {/* Cards Grid */}
        {filteredTopics.length > 0 ? (
          <div className="space-y-8">
            {filteredTopics.map((topic) => {
              const allTopicItems = topic.sections.flatMap((s) =>
                s.items.map((item) => ({ ...item, sectionTitle: s.title })),
              );

              return (
                <section key={topic.id} className="space-y-3">
                  <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800/60">
                    {renderTopicIcon(topic.iconName)}
                    <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      {topic.title}
                    </h2>
                    <span className="text-[11px] text-slate-500">
                      ({topic.category})
                    </span>
                    <span className="ml-auto text-[10px] font-mono text-slate-500">
                      {allTopicItems.length} commands
                    </span>
                  </div>

                  {/* Responsives Grid: 2 Spalten wenn Drawer offen, 4 Spalten wenn zu */}
                  <div
                    className={`grid gap-3.5 transition-all duration-300 ${
                      selectedItem
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2"
                        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                    }`}
                  >
                    {allTopicItems.map((item) => (
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
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-500">
              No cheatsheet entries found for your filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Drawer */}
      <CheatDrawer item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default CheatsheetPage;
