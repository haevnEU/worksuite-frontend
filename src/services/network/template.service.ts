import { NetworkService } from "./network.service.ts";
import { TemplateResource } from "../../models/templateResource.model.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";

export class TemplateService extends NetworkService {
  constructor() {
    super("/share/templates");
  }

  public async fetch(id: string): Promise<TemplateResource> {
    try {
      console.log(`[TemplateService] Fetching template with id: ${id}`);
      const data = await this.get<TemplateResource>(`/${id}`);
      return data;
    } catch (error) {
      console.error(
        `[TemplateService] Error occurred during fetch template with id ${id}:`,
        error,
      );
      ToastManager.toastBad("Failed to load template.");
      throw error;
    }
  }

  public async fetchAll(): Promise<TemplateResource[]> {
    try {
      console.log("[TemplateService] Fetching all templates...");
      const data = await this.get<TemplateResource[]>("");
      return data;
    } catch (error) {
      console.error(
        "[TemplateService] Error occurred during fetchAll templates:",
        error,
      );
      ToastManager.toastBad("Failed to load templates.");
      throw error;
    }
  }

  public async create(
    templateResource: TemplateResource,
  ): Promise<TemplateResource> {
    try {
      console.log("[TemplateService] Creating new template...");
      const data = await this.post<TemplateResource>(``, templateResource);
      ToastManager.toastGood("Template created successfully!");
      return data;
    } catch (error) {
      console.error(
        "[TemplateService] Error occurred during create template:",
        error,
      );
      ToastManager.toastBad("Failed to create template.");
      throw error;
    }
  }

  public async update(
    id: string,
    templateResource: TemplateResource,
  ): Promise<TemplateResource> {
    try {
      console.log("[TemplateService] Updating template with id:", id);
      const data = await this.put<TemplateResource>(`/${id}`, templateResource);
      ToastManager.toastGood("Template updated successfully!");
      return data;
    } catch (error) {
      console.error(
        `[TemplateService] Error occurred during update template with id ${id}:`,
        error,
      );
      ToastManager.toastBad("Failed to update template.");
      throw error;
    }
  }

  public async deleteById(id?: string): Promise<void> {
    try {
      console.log("[TemplateService] Deleting template with id:", id);
      if (!id) {
        ToastManager.toastBad("Id is missing!");
        return;
      }
      await this.delete<void>(`/${id}`);
      ToastManager.toastGood("Template deleted successfully!");
    } catch (error) {
      console.error(
        `[TemplateService] Error occurred during deleteById template with id ${id}:`,
        error,
      );
      ToastManager.toastBad("Failed to delete template.");
      throw error;
    }
  }
}

export const templateService = new TemplateService();
