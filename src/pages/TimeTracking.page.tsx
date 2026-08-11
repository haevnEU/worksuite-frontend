import React, { useMemo, useState } from "react";
import { useTime } from "../context/TimeContext.tsx";
import { useSettings } from "../context/SettingsContext.tsx";
import { TimeFilterBar, TimeHeader, TimeTable } from "../components/time";
import { MissingApiKeyCard } from "../components/MissingApiKeyCard.tsx";

export const TimeTrackingPage: React.FC = () => {
  const { hasRedmineKey } = useSettings();
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

  if (!hasRedmineKey) {
    return (
        <div className="space-y-6 pb-12 font-sans">
          <TimeHeader
              totalHours={0}
              totalMinutes={0}
              isLoading={false}
              onRefresh={() => {}}
          />
          <MissingApiKeyCard
              title="Redmine API Key Required"
              serviceName="Redmine"
              description="Your time tracking history and logged entries cannot be retrieved because no Redmine API key is configured."
              accentColor="blue"
          />
        </div>
    );
  }

  return (
      <div className="space-y-6 pb-12 font-sans">
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