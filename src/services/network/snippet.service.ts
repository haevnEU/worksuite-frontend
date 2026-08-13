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

  public async fetch(id: string): Promise<ShareableResource | null> {
    if (!id) {
      ToastManager.toastBad("The ID is missing!");
      return null;
    }

    try {
      console.log("[SnippetService] Fetching snippet for id:", id);
      return await this.get<ShareableResource>(`/${encodeURIComponent(id)}`);
    } catch (error) {
      console.error(
        `[SnippetService] Error occurred during fetch snippet with id ${id}:`,
        error,
      );
      ToastManager.toastBad("Failed to load snippet.");
      return null;
    }
  }

  public async create(snippet: ShareableResource): Promise<void> {
    try {
      console.log("[SnippetService] Creating new snippet...", snippet);
      await this.post<string, ShareableResource>("", snippet);
      ToastManager.toastGood("Snippet created successfully!");
    } catch (error) {
      console.error(
        "[SnippetService] Error occurred during create snippet:",
        error,
      );
      ToastManager.toastBad("Failed to create snippet.");
      throw error;
    }
  }

  public async update(snippet: ShareableResource): Promise<void> {
    const id = snippet.id;
    if (!id) {
      ToastManager.toastBad("Snippet ID not found.");
      return;
    }

    try {
      console.log(
        `[SnippetService] Updating snippet with id ${id}...`,
        snippet,
      );
      await this.put<ShareableResource, ShareableResource>(
        `/${encodeURIComponent(id)}`,
        snippet,
      );
      ToastManager.toastGood("Snippet updated successfully!");
    } catch (error) {
      console.error(
        `[SnippetService] Error occurred during update snippet with id ${id}:`,
        error,
      );
      ToastManager.toastBad("Failed to update snippet.");
      throw error;
    }
  }

  public async deleteById(id?: string): Promise<void> {
    if (!id) {
      ToastManager.toastBad("The ID is missing!");
      return;
    }

    try {
      console.log(`[SnippetService] Deleting snippet with id ${id}...`);
      await this.delete<void>(`/${encodeURIComponent(id)}`);
      ToastManager.toastGood("Snippet deleted successfully!");
    } catch (error) {
      console.error(
        `[SnippetService] Error occurred during deleteById snippet with id ${id}:`,
        error,
      );
      ToastManager.toastBad("Failed to delete snippet.");
      throw error;
    }
  }
}

export const snippetService = new SnippetService();
