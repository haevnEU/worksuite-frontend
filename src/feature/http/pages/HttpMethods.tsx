import React, { useMemo, useState } from "react";
import { Globe, Search } from "lucide-react";
import { HTTP_METHODS_CATALOG } from "../constants/http.constant";
import type { HttpMethodDetail } from "../models/http.model";
import { HttpMethodCard, HttpMethodDrawer } from "../components";

export const HttpPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedMethod, setSelectedMethod] = useState<HttpMethodDetail | null>(
    null,
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    HTTP_METHODS_CATALOG.forEach((item) => set.add(item.category));
    return ["ALL", ...Array.from(set)];
  }, []);

  const filteredMethods = useMemo(() => {
    const query = search.trim().toLowerCase();
    return HTTP_METHODS_CATALOG.filter((item) => {
      const matchCat =
        selectedCategory === "ALL" || item.category === selectedCategory;
      if (!matchCat) return false;
      if (!query) return true;

      return (
        item.method.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.useCase.toLowerCase().includes(query) ||
        item.sampleEndpoint.toLowerCase().includes(query) ||
        item.rfc.toLowerCase().includes(query)
      );
    });
  }, [search, selectedCategory]);

  return (
    <div className="relative w-full">
      <div
        className={`space-y-6 transition-all duration-300 ${
          selectedMethod ? "xl:mr-[490px]" : "mr-0"
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
                HTTP Methods & RFC Specifications
              </h1>
              <p className="text-xs text-slate-400">
                Semantics, safety, idempotency flags, and ready-to-use cURL /
                Fetch / Spring Boot snippets.
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search methods, endpoints, RFCs..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {cat === "ALL" ? "All Categories" : cat}
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMethods.map((item) => (
            <HttpMethodCard
              key={item.method}
              item={item}
              isSelected={selectedMethod?.method === item.method}
              onSelect={(clicked) => {
                setSelectedMethod((prev) =>
                  prev?.method === clicked.method ? null : clicked,
                );
              }}
            />
          ))}
        </div>
      </div>

      <HttpMethodDrawer
        item={selectedMethod}
        onClose={() => setSelectedMethod(null)}
      />
    </div>
  );
};

export default HttpPage;
