import { NetworkService } from "./network.service.ts";
import { DatabaseRecord } from "../../models/databaseRecord.model.ts";
import { DatabaseMap } from "../../types/databaseRecord.type.ts";

export interface DatabaseSearchParams {
  searchParam?: string;
  value?: string;
}

export class DatabaseService extends NetworkService {
  constructor() {
    super("/database");
  }

  public async fetchTables(): Promise<string[]> {
    console.log("[DatabaseService] Fetching tables...");
    return this.get<string[]>("/tables");
  }

  public async fetchAll(params?: DatabaseSearchParams): Promise<DatabaseMap> {
    console.log("[DatabaseService] Fetching all records...");
    const queryString = this.buildQueryString(params);
    return this.get<DatabaseMap>(queryString);
  }

  public async fetchByTable(
    tableName: string,
    params?: DatabaseSearchParams,
  ): Promise<DatabaseRecord[]> {
    console.log("[DatabaseService] Fetching records for table:", tableName);
    const queryString = this.buildQueryString(params);
    return this.get<DatabaseRecord[]>(
      `/tables/${encodeURIComponent(tableName)}${queryString}`,
    );
  }

  private buildQueryString(params?: DatabaseSearchParams): string {
    if (!params) return "";

    const queryParams = new URLSearchParams();
    if (params.searchParam) {
      queryParams.append("searchParam", params.searchParam);
    }
    if (params.value) {
      queryParams.append("value", params.value);
    }

    const queryStr = queryParams.toString();
    return queryStr ? `?${queryStr}` : "";
  }
}

export const databaseService = new DatabaseService();
