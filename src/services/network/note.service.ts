import { NetworkService } from "./network.service.ts";
import { NoteResource } from "../../models/noteResource.model.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";

export class NoteService extends NetworkService {
  constructor() {
    super("/notes");
  }

  public async fetch(id: string): Promise<NoteResource> {
    try {
      console.log(`[NoteService] Fetching note with id: ${id}`);
      return this.get<NoteResource>(`/${id}`);
    } catch (error) {
      ToastManager.toastBad(`Could not fetch note with id ${id}`);
      console.error("[NoteService] Error fetching note:", error);
      return Promise.reject(error);
    }
  }

  public async fetchAll(): Promise<NoteResource[]> {
    try {
      console.log("[NoteService] Fetching all notes...");
      return this.get<NoteResource[]>("");
    } catch (error) {
      ToastManager.toastBad("Could not fetch notes");
      console.error("[NoteService]  Error fetching notes:", error);
      return Promise.resolve([]);
    }
  }

  public async create(noteResource: NoteResource): Promise<void> {
    try {
      console.log("[NoteService] Creating note:", noteResource);
      await this.post<NoteResource>(``, noteResource);
      ToastManager.toastGood(`Note created successfully.`);
    } catch (error) {
      ToastManager.toastBad(`Could not create note.`);
      console.error("[NoteService] Error creating note:", error);
    }
  }

  public async update(noteResource: NoteResource): Promise<void> {
    try {
      console.log("[NoteService] Updating note:", noteResource);
      const id = noteResource.id;
      if (!id) {
        ToastManager.toastBad("The ID is missing!");
      }
      await this.put<NoteResource>(`/${id}`, noteResource);
      ToastManager.toastGood(`Note with id ${id} updated successfully.`);
    } catch (error) {
      ToastManager.toastBad(`Could not update note with id ${noteResource.id}`);
      console.error(
        `[NoteService] Error updating note with id ${noteResource.id}:`,
        error,
      );
    }
  }

  public async deleteById(id?: string): Promise<void> {
    try {
      console.log("[NoteService] Deleting note with id:", id);
      if (!id) {
        ToastManager.toastBad("The ID is missing!");
      }

      await this.delete<void>(`/${id}`);
      ToastManager.toastGood(`Note with id ${id} deleted successfully.`);
    } catch (error) {
      ToastManager.toastBad(`Could not delete note with id ${id}`);
      console.error("[NoteService] Error deleting note:", error);
    }
  }

  public async exportPdf(noteId?: string): Promise<void> {
    try {
      console.log("[NoteService] Exporting note PDF with id:", noteId);
      if (!noteId) {
        ToastManager.toastBad("The ID is missing!");
        return;
      }
      await this.downloadFile(`/${noteId}/export`);
      ToastManager.toastGood("PDF exported successfully.");
    } catch (error) {
      ToastManager.toastBad("Could not export meeting PDF");
      console.error("[NoteService] Error deleting note:", error);
    }
  }
}

export const noteService = new NoteService();
