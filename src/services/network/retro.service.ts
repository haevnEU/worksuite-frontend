import { NetworkService } from "./network.service.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { RetroResource } from "../../models/retroResource.model.ts";

export class RetroService extends NetworkService {
  constructor() {
    super("/retros");
  }

  public async fetchAll(): Promise<RetroResource[]> {
    try {
      console.log("[RetroService] Fetching all retros...");
      return await this.get<RetroResource[]>("");
    } catch (error) {
      console.error(
        "[RetroService] Error occurred during fetchAll retros:",
        error,
      );
      ToastManager.toastBad("Failed to load retros.");
      return [];
    }
  }

  public async createRetro(name: string): Promise<void> {
    if (!name?.trim()) {
      ToastManager.toastBad("The retro name is missing!");
      return;
    }

    try {
      console.log("[RetroService] Creating retro with name:", name);
      const query = this.buildParams({ name });
      await this.post<void>(query, {});
      ToastManager.toastGood("Retro created successfully.");
    } catch (error) {
      console.error("[RetroService] Error occurred during createRetro:", error);
      ToastManager.toastBad("Failed to create retro.");
      throw error;
    }
  }

  public async addItem(item: string, id: string, list: string): Promise<void> {
    if (!id || !list) {
      ToastManager.toastBad("Missing ID or list parameter!");
      return;
    }

    try {
      console.log("[RetroService] Adding item to retro:", { item, id, list });
      await this.putRaw<void>(
        `/${encodeURIComponent(id)}/${encodeURIComponent(list)}`,
        item,
      );
      ToastManager.toastGood("Successfully added item to retro.");
    } catch (error) {
      console.error("[RetroService] Error occurred adding item:", error);
      ToastManager.toastBad("Failed to add item");
      throw error;
    }
  }

  public async removeItem(
    item: string,
    id: string,
    list: string,
  ): Promise<void> {
    if (!id || !list) {
      ToastManager.toastBad("Missing ID or list parameter!");
      return;
    }

    try {
      console.log("[RetroService] Removing item from retro:", {
        item,
        id,
        list,
      });
      const query = this.buildParams({ item });
      await this.delete<void>(
        `/${encodeURIComponent(id)}/${encodeURIComponent(list)}${query}`,
      );
      ToastManager.toastGood("Successfully removed item from retro.");
    } catch (error) {
      console.error(
        "[RetroService] Error occurred removing item from retro:",
        error,
      );
      ToastManager.toastBad("Failed to remove item from retro.");
      throw error;
    }
  }

  public async deleteById(id?: string): Promise<void> {
    if (!id) {
      ToastManager.toastBad("The ID is missing!");
      return;
    }

    try {
      console.log("[RetroService] Deleting retro with id:", id);
      await this.delete<RetroResource>(`/${encodeURIComponent(id)}`);
      ToastManager.toastGood("Retro deleted successfully!");
    } catch (error) {
      console.error("[RetroService] Error occurred during deleteById:", error);
      ToastManager.toastBad("Failed to delete retro.");
      throw error;
    }
  }

  public async exportPdf(id: string): Promise<void> {
    if (!id) {
      ToastManager.toastBad("The ID is missing!");
      return;
    }

    try {
      console.log("[RetroService] Exporting retro PDF with id:", id);
      await this.downloadFile(`/${encodeURIComponent(id)}/export`);
      ToastManager.toastGood("PDF exported successfully.");
    } catch (error) {
      ToastManager.toastBad("Could not export retro PDF");
      console.error("[RetroService] Error exporting retro PDF:", error);
    }
  }
}

export const retroService = new RetroService();
