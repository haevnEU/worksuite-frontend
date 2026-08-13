import { ShareableResource } from "../../models/shareableResource.model.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { NetworkService } from "./network.service.ts";

export class SnippetService extends NetworkService {
  constructor() {
    super("/snippets");
  }

  public async fetchAll(): Promise<ShareableResource[]> {
    try {
      return await this.get<ShareableResource[]>("");
    } catch {
      return [];
    }
  }

  public async fetch(id: string): Promise<ShareableResource | null> {
    if (!id) {
      ToastManager.toastBad("The ID is missing!");
      return null;
    }

    try {
      return await this.get<ShareableResource>(`/${encodeURIComponent(id)}`);
    } catch {
      return null;
    }
  }

  public async create(snippet: ShareableResource): Promise<void> {
    await this.post<string, ShareableResource>("", snippet);
    ToastManager.toastGood("Snippet created successfully!");
  }

  public async update(snippet: ShareableResource): Promise<void> {
    const id = snippet.id;
    if (!id) return ToastManager.toastBad("Snippet ID not found.");

    await this.put<ShareableResource, ShareableResource>(
      `/${encodeURIComponent(id)}`,
      snippet,
    );
    ToastManager.toastGood("Snippet updated successfully!");
  }

  public async deleteById(id?: string): Promise<void> {
    if (!id) return ToastManager.toastBad("The ID is missing!");

    await this.delete<void>(`/${encodeURIComponent(id)}`);
    ToastManager.toastGood("Snippet deleted successfully!");
  }
}

export const snippetService = new SnippetService();
