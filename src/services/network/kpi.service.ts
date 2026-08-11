import { NetworkService } from "./network.service.ts";
import { KpiModel } from "../../models/kpi.model.ts";
import { DaysRange, KpiType } from "../../types/kpi.type.ts";

export class KpiService extends NetworkService {
  constructor() {
    super("/stats");
  }

  public async create(date: string): Promise<string> {
    console.log("[KpiService] Creating KPI for date:", date);
    return this.postRaw<string>(`?date=${date}`, undefined);
  }

  public async fetch(range: DaysRange): Promise<KpiModel[]> {
    console.log("[KpiService] Fetching KPIs for range:", range);
    return this.get<KpiModel[]>(`?duration=${range}`);
  }

  public async increment(id: string, kpi: KpiType): Promise<void> {
    console.log("[KpiService] Incrementing KPI for ID:", id);
    console.log("[KpiService] KPI Type:", kpi);
    return this.putRaw<void>(`/${id}?stat=${kpi}`, undefined);
  }
}

export const kpiService = new KpiService();
