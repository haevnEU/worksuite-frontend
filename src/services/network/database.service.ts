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
    const queryParams = this.buildQueryParams(params);
    return this.get<DatabaseMap>(`?${queryParams.toString()}`);
  }

  public async fetchByTable(
    tableName: string,
    params?: DatabaseSearchParams,
  ): Promise<DatabaseRecord[]> {
    console.log("[DatabaseService] Fetching records for table:", tableName);
    const queryParams = this.buildQueryParams(params);
    return this.get<DatabaseRecord[]>(
      `/tables/${tableName}?${queryParams.toString()}`,
    );
  }

  private buildQueryParams(params?: DatabaseSearchParams): URLSearchParams {
    const queryParams = new URLSearchParams();
    if (params?.searchParam) {
      queryParams.append("searchParam", params.searchParam);
    }
    if (params?.value) {
      queryParams.append("value", params.value);
    }
    return queryParams;
  }
}

export const databaseService = new DatabaseService();
