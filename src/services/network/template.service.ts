import { TemplateResource } from "../../models/templateResource.model.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { NetworkService } from "./network.service.ts";

export class TemplateService extends NetworkService {
  constructor() {
    super("/share/templates");
  }

  public async fetch(id: string): Promise<TemplateResource | null> {
    if (!id) {
      ToastManager.toastBad("The ID is missing!");
      return null;
    }

    try {
      return await this.get<TemplateResource>(`/${encodeURIComponent(id)}`);
    } catch {
      return null;
    }
  }

  public async fetchAll(): Promise<TemplateResource[]> {
    try {
      return await this.get<TemplateResource[]>("");
    } catch {
      return [];
    }
  }

  public async create(
    templateResource: TemplateResource,
  ): Promise<TemplateResource> {
    const data = await this.post<TemplateResource>("", templateResource);
    ToastManager.toastGood("Template created successfully!");
    return data;
  }

  public async deleteById(id?: string): Promise<void> {
    if (!id) {
      ToastManager.toastBad("The ID is missing!");
      return;
    }

    await this.delete<void>(`/${encodeURIComponent(id)}`);
    ToastManager.toastGood("Template deleted successfully!");
  }
}

export const templateService = new TemplateService();
