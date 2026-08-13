import { NetworkService } from "./network.service.ts";
import { KpiModel } from "../../models/kpi.model.ts";
import { DaysRange, KpiType } from "../../types/kpi.type.ts";

export class KpiService extends NetworkService {
  constructor() {
    super("/stats");
  }

  public async create(date: string): Promise<string> {
    console.log("[KpiService] Creating KPI for date:", date);
    const params = new URLSearchParams({ date });
    return this.postRaw<string>(`?${params.toString()}`, undefined);
  }

  public async fetch(range: DaysRange): Promise<KpiModel[]> {
    console.log("[KpiService] Fetching KPIs for range:", range);
    const params = new URLSearchParams({ duration: range.toString() });
    return this.get<KpiModel[]>(`?${params.toString()}`);
  }

  public async increment(id: string, kpi: KpiType): Promise<void> {
    console.log("[KpiService] Incrementing KPI for ID:", id, "KPI Type:", kpi);
    const params = new URLSearchParams({ stat: kpi });
    return this.putRaw<void>(
      `/${encodeURIComponent(id)}?${params.toString()}`,
      undefined,
    );
  }
}

export const kpiService = new KpiService();
