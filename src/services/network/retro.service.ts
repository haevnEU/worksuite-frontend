import { NetworkService } from "./network.service.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { RetroResource } from "../../models/retroResource.model.ts";
import { RequestOptions } from "../../models/http.model.ts";

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
    try {
      console.log("[RetroService] Creating retro with name:", name);
      const query = this.buildParams({ name: name });
      await this.post<void>(`${query}`, {});
      ToastManager.toastGood("Retro created successfully.");
    } catch (error) {
      console.error("[RetroService] Error occurred during createRetro:", error);
      ToastManager.toastBad("Failed to create retro.");
    }
  }

  public async addItem(item: string, id: string, list: string): Promise<void> {
    try {
      console.log("[RetroService] Adding item to retro:", { item, id, list });
      const reqOpts: RequestOptions = {
        headers: {
          "Content-Type": "text/plain",
        },
      };
      await this.put<void>(`/${id}/${list}`, item, reqOpts);
      ToastManager.toastGood("Successfully added item to retro.");
    } catch (error) {
      console.error("[RetroService] Error occurred adding item:", error);
      ToastManager.toastBad("Failed to add item");
    }
  }

  public async removeItem(
    item: string,
    id: string,
    list: string,
  ): Promise<void> {
    try {
      console.log("[RetroService] Removing item from retro:", {
        item,
        id,
        list,
      });
      const requestOptions: RequestOptions = {
        body: item,
      };
      await this.delete<void>(`/${id}/${list}`, requestOptions);
      ToastManager.toastGood("Successfully removed item from retro.");
    } catch (error) {
      console.error(
        "[RetroService] Error occurred removing item from retro:",
        error,
      );
      ToastManager.toastBad("Failed to remove item from retro.");
    }
  }

  public async deleteById(id?: string): Promise<void> {
    try {
      console.log("[RetroService] Deleting retro with id:", id);
      if (!id) {
        ToastManager.toastBad("The ID is missing!");
        return;
      }
      await this.delete<RetroResource>(`/${id}`);
      ToastManager.toastGood("Retro deleted successfully!");
      return;
    } catch (error) {
      console.error("[RetroService] Error occurred during deleteById:", error);
      ToastManager.toastBad("Failed to delete retro.");
    }
  }

  public async exportPdf(id: string): Promise<void> {
    try {
      console.log("[RetroService] Exporting retro PDF with id:", id);
      await this.downloadFile(`/${id}/export`);
      ToastManager.toastGood("PDF exported successfully.");
    } catch (error) {
      ToastManager.toastBad("Could not export meeting PDF");
      console.error("[RetroService] Error exporting retro PDF:", error);
    }
  }
}

export const retroService = new RetroService();
