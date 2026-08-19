import React, { useMemo, useState } from "react";
import { Search, Radio, Filter, ShieldCheck, Zap } from "lucide-react";
import { HttpMethodDetail } from "../models/network.model.ts";
import { HTTP_METHODS } from "../constants/network.constant.ts";
import { HttpMethodCard, HttpMethodDrawer } from "../components/http/method";

const FILTER_TABS = [
  { label: "All Methods", value: "ALL" },
  { label: "Core REST", value: "CORE" },
  { label: "Advanced", value: "ADVANCED" },
  { label: "WebDAV", value: "WEBDAV" },
  { label: "Safe Only", value: "SAFE" },
  { label: "Idempotent Only", value: "IDEMPOTENT" },
];

export const HttpMethodsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedMethod, setSelectedMethod] = useState<HttpMethodDetail | null>(
    null,
  );

  const filteredMethods = useMemo(() => {
    return HTTP_METHODS.filter((item) => {
      // Filter Tab Matching
      let matchesTab = true;
      if (activeFilter === "CORE") matchesTab = item.category === "CORE";
      else if (activeFilter === "ADVANCED")
        matchesTab = item.category === "ADVANCED";
      else if (activeFilter === "WEBDAV")
        matchesTab = item.category === "WEBDAV";
      else if (activeFilter === "SAFE") matchesTab = item.isSafe;
      else if (activeFilter === "IDEMPOTENT") matchesTab = item.isIdempotent;

      // Text Search
      const query = search.trim().toLowerCase();
      const matchesSearch =
        query === "" ||
        item.method.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.useCase.toLowerCase().includes(query) ||
        item.sampleEndpoint.toLowerCase().includes(query);

      return matchesTab && matchesSearch;
    });
  }, [search, activeFilter]);

  return (
    <div className="relative min-h-full">
      <div
        className={`space-y-6 transition-all duration-300 ease-in-out ${
          selectedMethod ? "xl:mr-[500px]" : "mr-0"
        }`}
      >
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white">
                HTTP Request Methods
              </h1>
              <p className="text-xs text-slate-400">
                Idempotency, safety semantics, specification guidelines, and
                executable code snippets.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search method, endpoint, usecase..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 mr-1" />
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveFilter(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === tab.value
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid of Methods */}
        {filteredMethods.length > 0 ? (
          <div
            className={`grid gap-3.5 transition-all duration-300 ${
              selectedMethod
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 2xl:grid-cols-3"
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            }`}
          >
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
        ) : (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-2xl">
            <p className="text-xs text-slate-500">
              No HTTP methods match your search filter.
            </p>
          </div>
        )}
      </div>

      {/* Drawer */}
      <HttpMethodDrawer
        item={selectedMethod}
        onClose={() => setSelectedMethod(null)}
      />
    </div>
  );
};

export default HttpMethodsPage;
