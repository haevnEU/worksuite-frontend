import { ShareableResource } from "../../models/shareableResource.model.ts";
import { NetworkService } from "./network.service.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";

export class SnippetService extends NetworkService {
  constructor() {
    super("/snippets");
  }

  public async fetchAll(): Promise<ShareableResource[]> {
    try {
      console.log("[SnippetService] Fetching all snippets...");
      return await this.get<ShareableResource[]>("");
    } catch (error) {
      console.error(
        "[SnippetService] Error occurred during fetchAll snippets:",
        error,
      );
      ToastManager.toastBad("Failed to load snippets.");
      return [];
    }
  }

  public async fetch(id: string): Promise<ShareableResource> {
    try {
      console.log("[SnippetService] Fetching id for id:", id);
      return await this.get<ShareableResource>(`/${id}`);
    } catch (error) {
      console.error(
        "[SnippetService] Error occurred during fetch snippet:",
        error,
      );
      ToastManager.toastBad("Failed to load snippet.");
      return {} as ShareableResource;
    }
  }

  public async create(snippet: ShareableResource): Promise<void> {
    try {
      console.log("[SnippetService] Creating new snippet...");
      await this.post<string, ShareableResource>("", snippet);
      ToastManager.toastGood("Snippet created successfully!");
    } catch (error) {
      console.error(
        "[SnippetService] Error occurred during create snippet:",
        error,
      );
      ToastManager.toastBad("Failed to create snippet.");
    }
  }

  public async update(snippet: ShareableResource): Promise<void> {
    const id = snippet.id;
    try {
      console.log("[SnippetService] Update snippet...");
      if (!id) {
        ToastManager.toastBad("Snippet not found.");
        return;
      }
      await this.put<ShareableResource, ShareableResource>(`/${id}`, snippet);
      ToastManager.toastGood("Snippet updated successfully!");
    } catch (error) {
      console.error(
        `[SnippetService] Error occurred during update snippet with id ${id}:`,
        error,
      );
      ToastManager.toastBad("Failed to update snippet.");
    }
  }

  public async deleteById(id?: string): Promise<void> {
    try {
      console.log("[SnippetService] Delete snippet...");
      if (!id) {
        ToastManager.toastBad("The ID is missing!");
        return;
      }
      await this.delete<ShareableResource>(`/${id}`);
      ToastManager.toastGood("Snippet deleted successfully!");
      return;
    } catch (error) {
      console.error(
        `[SnippetService] Error occurred during deleteById snippet with id ${id}:`,
        error,
      );
      ToastManager.toastBad("Failed to delete snippet.");
    }
  }
}

export const snippetService = new SnippetService();
