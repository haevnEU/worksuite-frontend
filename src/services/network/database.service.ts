import { DatabaseRecord } from "../../models/databaseRecord.model.ts";
import { DatabaseMap } from "../../types/databaseRecord.type.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { NetworkService } from "./network.service.ts";

export interface DatabaseSearchParams {
  searchParam?: string;
  value?: string;
}

export class DatabaseService extends NetworkService {
  constructor() {
    super("/database");
  }

  public async fetchTables(): Promise<string[]> {
    try {
      return await this.get<string[]>("/tables");
    } catch {
      return [];
    }
  }

  public async fetchAll(params?: DatabaseSearchParams): Promise<DatabaseMap> {
    try {
      const queryString = this.buildParams(params as Record<string, any>);
      return await this.get<DatabaseMap>(queryString);
    } catch {
      return {} as DatabaseMap;
    }
  }

  public async fetchByTable(
    tableName: string,
    params?: DatabaseSearchParams,
  ): Promise<DatabaseRecord[]> {
    if (!tableName) {
      ToastManager.toastBad("Table name is missing!");
      return [];
    }

    try {
      const queryString = this.buildParams(params as Record<string, any>);
      return await this.get<DatabaseRecord[]>(
        `/tables/${encodeURIComponent(tableName)}${queryString}`,
      );
    } catch {
      return [];
    }
  }
}

export const databaseService = new DatabaseService();
