import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface SearchableSelectProps {
  tables: string[];
  selectedTable: string;
  onSelect: (table: string) => void;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  tables,
  selectedTable,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterText, setFilterText] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTables = tables.filter((t) =>
    t.toLowerCase().includes(filterText.trim().toLowerCase()),
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    onSelect(value);
    setFilterText("");
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (selectedTable === "custom" || !selectedTable) {
      return "-- All Tables --";
    }
    return selectedTable;
  };

  return (
    <div className="relative font-mono" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={isOpen ? filterText : getDisplayText()}
          onChange={(e) => {
            setFilterText(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setFilterText("");
            setIsOpen(true);
          }}
          placeholder="Search / filter table..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
        />
        <ChevronDown
          className={`w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl max-h-60 overflow-y-auto text-xs divide-y divide-slate-800/50">
          <div
            onClick={() => handleSelect("custom")}
            className={`px-3.5 py-2.5 cursor-pointer hover:bg-slate-900 transition-colors ${
              selectedTable === "custom"
                ? "text-blue-400 bg-blue-500/10 font-bold"
                : "text-slate-400"
            }`}
          >
            -- All Tables --
          </div>

          {filteredTables.length > 0 ? (
            filteredTables.map((t) => (
              <div
                key={t}
                onClick={() => handleSelect(t)}
                className={`px-3.5 py-2.5 cursor-pointer hover:bg-slate-900 transition-colors ${
                  selectedTable === t
                    ? "text-blue-400 bg-blue-500/10 font-bold"
                    : "text-slate-200"
                }`}
              >
                {t}
              </div>
            ))
          ) : (
            <div className="px-3.5 py-3 text-slate-500 text-center">
              No tables found matching "{filterText}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};
