import { KpiModel } from "../../models/kpi.model.ts";
import { DaysRange, KpiType } from "../../types/kpi.type.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { NetworkService } from "./network.service.ts";

export class KpiService extends NetworkService {
  constructor() {
    super("/stats");
  }

  public async create(date: string): Promise<string> {
    if (!date) {
      ToastManager.toastBad("Date is missing!");
      throw new Error("Date is missing");
    }

    const query = this.buildParams({ date });
    return await this.post<string>(query);
  }

  public async fetch(range: DaysRange): Promise<KpiModel[]> {
    try {
      const query = this.buildParams({ duration: range });
      return await this.get<KpiModel[]>(query);
    } catch {
      return [];
    }
  }

  public async increment(id: string, kpi: KpiType): Promise<void> {
    if (!id) return ToastManager.toastBad("KPI ID is missing!");
    if (!kpi) return ToastManager.toastBad("KPI Type is missing!");

    const query = this.buildParams({ stat: kpi });
    await this.put<void>(`/${encodeURIComponent(id)}${query}`);
  }
}

export const kpiService = new KpiService();
