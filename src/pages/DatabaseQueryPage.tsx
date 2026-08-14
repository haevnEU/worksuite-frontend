import React, { useEffect, useState } from "react";
import { useLocalStorageDraft } from "../hooks/useLocalStorageDraft.ts";
import { databaseService } from "../services/network/database.service.ts";
import { DatabaseRecord } from "../models/databaseRecord.model.ts";
import {
  DatabaseQueryHeader,
  QueryFilterSection,
  QueryResultsSection,
} from "../components/database";
import { DatabaseMap } from "../types/databaseRecord.type.ts";

export const DatabaseQueryPage: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useLocalStorageDraft<string>(
    "db_selected_table_draft",
    "custom",
  );
  const [searchParamMode, setSearchParamMode] = useLocalStorageDraft<string>(
    "db_search_param_draft",
    "id",
  );
  const [entityId, setEntityId] = useLocalStorageDraft<string>(
    "db_entity_id_draft",
    "",
  );
  const [viewMode, setViewMode] = useLocalStorageDraft<"cards" | "raw">(
    "db_view_mode_draft",
    "cards",
  );
  const [copyIdOnly, setCopyIdOnly] = useLocalStorageDraft<boolean>(
    "db_copy_id_only_draft",
    true,
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<
    DatabaseMap | DatabaseRecord[] | null
  >(null);
  const [rawJsonResult, setRawJsonResult] = useState<string | null>(null);
  const [httpStatus, setHttpStatus] = useState<{
    code: number;
    text: string;
    success: boolean;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const tableList = await databaseService.fetchTables();
      const sortedList = [...tableList].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" }),
      );
      setTables(sortedList);
    } catch (error) {
      console.error("Error loading table list:", error);
    }
  };

  const executeSearch = async () => {
    if (loading) return;

    setLoading(true);
    setHttpStatus(null);

    const trimmedValue = entityId.trim();
    const searchParams = trimmedValue
      ? { searchParam: searchParamMode, value: trimmedValue }
      : undefined;

    try {
      let result: DatabaseMap | DatabaseRecord[];

      if (selectedTable === "custom" || !selectedTable) {
        result = await databaseService.fetchAll(searchParams);
      } else {
        result = await databaseService.fetchByTable(
          selectedTable,
          searchParams,
        );
      }

      setSearchResult(result);
      setRawJsonResult(JSON.stringify(result, null, 2));
      setHttpStatus({ code: 200, text: "OK", success: true });
    } catch (error: any) {
      console.error("Error executing database query:", error);

      const statusCode = error?.status || 500;
      const statusText =
        error?.statusText || "Internal Server Error / Network Error";

      setSearchResult(null);
      setRawJsonResult(
        JSON.stringify({ error: statusText, details: error?.message }, null, 2),
      );
      setHttpStatus({ code: statusCode, text: statusText, success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!rawJsonResult) return;
    navigator.clipboard.writeText(rawJsonResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 font-sans">
      <DatabaseQueryHeader />

      <QueryFilterSection
        tables={tables}
        selectedTable={selectedTable}
        onSelectTable={setSelectedTable}
        searchParamMode={searchParamMode}
        onSearchParamModeChange={setSearchParamMode}
        entityId={entityId}
        onEntityIdChange={setEntityId}
        loading={loading}
        onExecuteQuery={executeSearch}
      />

      <QueryResultsSection
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        copyIdOnly={copyIdOnly}
        onCopyIdOnlyChange={setCopyIdOnly}
        httpStatus={httpStatus}
        rawJsonResult={rawJsonResult}
        searchResult={searchResult}
        loading={loading}
        copied={copied}
        onCopyJson={handleCopyJson}
      />
    </div>
  );
};
