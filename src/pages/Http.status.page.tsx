import React, { useMemo, useState } from "react";
import { Search, Globe, Filter } from "lucide-react";
import { HttpStatusCategory } from "../types/network.types.ts";
import { HTTP_STATUS_CODES } from "../constants/network.constant.ts";
import { HttpStatusCode } from "../models/network.model.ts";
import { HttpStatusCard, HttpStatusDrawer } from "../components/http/status";

const CATEGORIES: { label: string; value: HttpStatusCategory | "ALL" }[] = [
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

  const filteredCodes = useMemo(() => {
    return HTTP_STATUS_CODES.filter((item) => {
      const matchesCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        item.code.toString().includes(query) ||
        item.phrase.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <div className="relative min-h-full">
      {/* Haupt-Container: Schrumpft dynamisch zusammen, wenn selectedItem aktiv ist */}
      <div
        className={`space-y-6 transition-all duration-300 ease-in-out ${
          selectedItem ? "xl:mr-[440px]" : "mr-0"
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white">
                HTTP Status Codes Reference
              </h1>
              <p className="text-xs text-slate-400">
                Interactive standard status definitions, RFC specifications, and
                client handling guides.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code, phrase, description..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
          {CATEGORIES.map((cat) => (
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

        {/* Dynamic Grid: Spalten passen sich automatisch der verbleibenden Breite an */}
        {filteredCodes.length > 0 ? (
          <div
            className={`grid gap-3.5 transition-all duration-300 ${
              selectedItem
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 2xl:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
            }`}
          >
            {filteredCodes.map((item) => (
              <HttpStatusCard
                key={item.code}
                item={item}
                isSelected={selectedItem?.code === item.code}
                onSelect={(clicked) => {
                  // Toggle Verhalten: erneuter Klick schließt den Drawer wieder
                  setSelectedItem((prev) =>
                    prev?.code === clicked.code ? null : clicked,
                  );
                }}
              />
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
