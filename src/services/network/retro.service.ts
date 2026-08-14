import { ToastManager } from "../../toaster/ToastManager.ts";
import { RetroResource } from "../../models/retroResource.model.ts";
import { NetworkService } from "./network.service.ts";
import { fileDownloadService } from "./fileDownload.service.ts";

export class RetroService extends NetworkService {
  constructor() {
    super("/retros");
  }

  public async fetchAll(): Promise<RetroResource[]> {
    try {
      return await this.get<RetroResource[]>("");
    } catch {
      return [];
    }
  }

  public async createRetro(name: string): Promise<void> {
    if (!name?.trim())
      return ToastManager.toastBad("The retro name is missing!");

    const query = this.buildParams({ name: name.trim() });
    await this.post<void>(query, {});
    ToastManager.toastGood("Retro created successfully.");
  }

  public async addItem(item: string, id: string, list: string): Promise<void> {
    if (!id || !list)
      return ToastManager.toastBad("Missing ID or list parameter!");

    await this.put<void>(
      `/${encodeURIComponent(id)}/${encodeURIComponent(list)}`,
      item,
    );
    ToastManager.toastGood("Successfully added item to retro.");
  }

  public async removeItem(
    item: string,
    id: string,
    list: string,
  ): Promise<void> {
    if (!id || !list)
      return ToastManager.toastBad("Missing ID or list parameter!");

    const query = this.buildParams({ item });
    await this.delete<void>(
      `/${encodeURIComponent(id)}/${encodeURIComponent(list)}${query}`,
    );
    ToastManager.toastGood("Successfully removed item from retro.");
  }

  public async deleteById(id?: string): Promise<void> {
    if (!id) return ToastManager.toastBad("The ID is missing!");

    await this.delete<RetroResource>(`/${encodeURIComponent(id)}`);
    ToastManager.toastGood("Retro deleted successfully!");
  }

  public async exportPdf(id: string, isDraft: boolean): Promise<void> {
    if (!id) return ToastManager.toastBad("The ID is missing!");

    await fileDownloadService.downloadRetrospectiveProtocol(id, isDraft);
    ToastManager.toastGood("PDF exported successfully.");
  }
}

export const retroService = new RetroService();
