import React, { useMemo, useRef, useState } from "react";
import {
  Search,
  Globe,
  Filter,
  Info,
  CheckCircle2,
  CornerUpRight,
  AlertTriangle,
  ServerCrash,
} from "lucide-react";
import { HttpStatusCategory } from "../types/network.types.ts";
import { HTTP_STATUS_CODES } from "../constants/network.constant.ts";
import { HttpStatusCode } from "../models/network.model.ts";
import { HttpStatusCard, HttpStatusDrawer } from "../components/http/status";

interface CategoryMeta {
  value: HttpStatusCategory;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const CATEGORY_DEFINITIONS: CategoryMeta[] = [
  {
    value: "1xx",
    title: "1xx Informational",
    subtitle: "Request received, continuing process",
    icon: <Info className="w-4 h-4 text-sky-400" />,
  },
  {
    value: "2xx",
    title: "2xx Success",
    subtitle: "The action was successfully received, understood, and accepted",
    icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
  },
  {
    value: "3xx",
    title: "3xx Redirection",
    subtitle: "Further action must be taken in order to complete the request",
    icon: <CornerUpRight className="w-4 h-4 text-blue-400" />,
  },
  {
    value: "4xx",
    title: "4xx Client Error",
    subtitle: "The request contains bad syntax or cannot be fulfilled",
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  },
  {
    value: "5xx",
    title: "5xx Server Error",
    subtitle: "The server failed to fulfill an apparently valid request",
    icon: <ServerCrash className="w-4 h-4 text-rose-400" />,
  },
];

const FILTER_TABS: { label: string; value: HttpStatusCategory | "ALL" }[] = [
  { label: "All Classes", value: "ALL" },
  { label: "1xx Informational", value: "1xx" },
  { label: "2xx Success", value: "2xx" },
  { label: "3xx Redirection", value: "3xx" },
  { label: "4xx Client Error", value: "4xx" },
  { label: "5xx Server Error", value: "5xx" },
];

export const HttpStatusPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    HttpStatusCategory | "ALL"
  >("ALL");
  const [selectedItem, setSelectedItem] = useState<HttpStatusCode | null>(null);

  // Zähler & Timer für 3x Klicks auf Status 418
  const teapotClickCountRef = useRef(0);
  const teapotResetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();

    return CATEGORY_DEFINITIONS.filter(
      (cat) => selectedCategory === "ALL" || cat.value === selectedCategory,
    )
      .map((cat) => {
        const items = HTTP_STATUS_CODES.filter((item) => {
          const matchesCategory = item.category === cat.value;
          const matchesSearch =
            query === "" ||
            item.code.toString().includes(query) ||
            item.phrase.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query);

          return matchesCategory && matchesSearch;
        });

        return { ...cat, items };
      })
      .filter((group) => group.items.length > 0);
  }, [search, selectedCategory]);

  const handleSelectStatus = (clicked: HttpStatusCode) => {
    // 418 Easter Egg: Nach genau 3 Klicks Event auslösen
    if (clicked.code === 418) {
      teapotClickCountRef.current += 1;

      if (teapotResetTimerRef.current) {
        clearTimeout(teapotResetTimerRef.current);
      }

      if (teapotClickCountRef.current >= 3) {
        teapotClickCountRef.current = 0;
        setSelectedItem(null);
        window.dispatchEvent(new CustomEvent("http:418-teapot"));
        return;
      }

      teapotResetTimerRef.current = setTimeout(() => {
        teapotClickCountRef.current = 0;
      }, 1500);
    } else {
      teapotClickCountRef.current = 0;
    }

    // Toggle-Verhalten für Drawer
    setSelectedItem((prev) => (prev?.code === clicked.code ? null : clicked));
  };

  return (
    <div className="relative min-h-full w-full">
      {/* Hauptbereich */}
      <div
        className={`space-y-6 transition-all duration-300 ease-in-out ${
          selectedItem ? "xl:mr-[460px]" : "mr-0"
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white">
                HTTP Status Codes Reference
              </h1>
              <p className="text-xs text-slate-400">
                Interactive standard status definitions, RFC specifications, and
                client handling guides.
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
              placeholder="Search code, phrase, description..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
          {FILTER_TABS.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.value
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grouped Status Sections */}
        {filteredGroups.length > 0 ? (
          <div className="space-y-8">
            {filteredGroups.map((group) => (
              <section key={group.value} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800/60">
                  {group.icon}
                  <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    {group.title}
                  </h2>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">
                    — {group.subtitle}
                  </span>
                  <span className="ml-auto text-[10px] font-mono text-slate-500">
                    {group.items.length} codes
                  </span>
                </div>

                {/* Card Grid */}
                <div
                  className={`grid gap-3.5 transition-all duration-300 ${
                    selectedItem
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-2"
                      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                  }`}
                >
                  {group.items.map((item) => (
                    <HttpStatusCard
                      key={item.code}
                      item={item}
                      isSelected={selectedItem?.code === item.code}
                      onSelect={handleSelectStatus}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-500">
              No HTTP status codes match your filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Detail Inspection Drawer */}
      <HttpStatusDrawer
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};

export default HttpStatusPage;
