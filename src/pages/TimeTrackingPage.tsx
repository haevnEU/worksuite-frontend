import React, { useMemo, useState } from "react";
import { useTime } from "../context/TimeContext.tsx";
import { TimeHeader } from "../components/time/TimeHeader.tsx";
import { TimeFilterBar } from "../components/time/TimeFilterBar.tsx";
import { TimeTable } from "../components/time/TiemTable.tsx";

export const TimeTrackingPage: React.FC = () => {
  const { entries, isLoading, fetchTimeEntries } = useTime();

  const [ticketIdFilter, setTicketIdFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activityFilter, setActivityFilter] = useState<string>("all");

  const resetFilters = () => {
    setTicketIdFilter("");
    setDateFilter("");
    setSearchQuery("");
    setActivityFilter("all");
  };

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (ticketIdFilter.trim() !== "") {
        if (!entry.ticketId.toString().includes(ticketIdFilter.trim())) {
          return false;
        }
      }

      if (dateFilter) {
        if (!entry.date) return false;
        const entryDateFormatted = new Date(entry.date)
          .toISOString()
          .split("T")[0];
        if (entryDateFormatted !== dateFilter) {
          return false;
        }
      }

      if (activityFilter !== "all") {
        if (String(entry.activityId) !== activityFilter) {
          return false;
        }
      }

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesDesc = entry.description?.toLowerCase().includes(q);
        if (!matchesDesc) return false;
      }

      return true;
    });
  }, [entries, ticketIdFilter, dateFilter, activityFilter, searchQuery]);

  const totalFilteredMinutes = useMemo(() => {
    return filteredEntries.reduce(
      (acc, curr) => acc + curr.hours * 60 + curr.minutes,
      0,
    );
  }, [filteredEntries]);

  const totalDisplayHours = Math.floor(totalFilteredMinutes / 60);
  const totalDisplayMinutes = totalFilteredMinutes % 60;

  return (
    <div className="flex flex-col h-full min-h-0 w-full space-y-4 font-sans text-xs text-slate-200 overflow-hidden">
      <TimeHeader
        totalHours={totalDisplayHours}
        totalMinutes={totalDisplayMinutes}
        isLoading={isLoading}
        onRefresh={fetchTimeEntries}
      />

      <TimeFilterBar
        ticketIdFilter={ticketIdFilter}
        onTicketIdChange={setTicketIdFilter}
        dateFilter={dateFilter}
        onDateChange={setDateFilter}
        activityFilter={activityFilter}
        onActivityChange={setActivityFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onReset={resetFilters}
        filteredEntries={filteredEntries}
      />

      <TimeTable
        entries={filteredEntries}
        totalCount={entries.length}
        isLoading={isLoading}
      />
    </div>
  );
};
