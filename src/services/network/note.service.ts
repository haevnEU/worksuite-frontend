import { NetworkService } from "./network.service.ts";
import { NoteResource } from "../../models/noteResource.model.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";

export class NoteService extends NetworkService {
  constructor() {
    super("/notes");
  }

  public async fetchAll(): Promise<NoteResource[]> {
    try {
      console.log("[NoteService] Fetching all notes...");
      return await this.get<NoteResource[]>("");
    } catch (error) {
      ToastManager.toastBad("Could not fetch notes");
      console.error("[NoteService] Error fetching notes:", error);
      return [];
    }
  }

  public async create(noteResource: NoteResource): Promise<void> {
    try {
      console.log("[NoteService] Creating note:", noteResource);
      await this.post<NoteResource>("", noteResource);
      ToastManager.toastGood("Note created successfully.");
    } catch (error) {
      ToastManager.toastBad("Could not create note.");
      console.error("[NoteService] Error creating note:", error);
      throw error;
    }
  }

  public async update(noteResource: NoteResource): Promise<void> {
    const id = noteResource.id;
    if (!id) {
      ToastManager.toastBad("The ID is missing!");
      return;
    }

    try {
      console.log("[NoteService] Updating note:", noteResource);
      await this.put<NoteResource>(`/${encodeURIComponent(id)}`, noteResource);
      ToastManager.toastGood(`Note with id ${id} updated successfully.`);
    } catch (error) {
      ToastManager.toastBad(`Could not update note with id ${id}`);
      console.error(`[NoteService] Error updating note with id ${id}:`, error);
      throw error;
    }
  }

  public async deleteById(id?: string): Promise<void> {
    if (!id) {
      ToastManager.toastBad("The ID is missing!");
      return;
    }

    try {
      console.log("[NoteService] Deleting note with id:", id);
      await this.delete<void>(`/${encodeURIComponent(id)}`);
      ToastManager.toastGood(`Note with id ${id} deleted successfully.`);
    } catch (error) {
      ToastManager.toastBad(`Could not delete note with id ${id}`);
      console.error("[NoteService] Error deleting note:", error);
      throw error;
    }
  }

  public async exportPdf(noteId?: string): Promise<void> {
    if (!noteId) {
      ToastManager.toastBad("The ID is missing!");
      return;
    }

    try {
      console.log("[NoteService] Exporting note PDF with id:", noteId);
      await this.downloadFile(`/${encodeURIComponent(noteId)}/export`);
      ToastManager.toastGood("PDF exported successfully.");
    } catch (error) {
      ToastManager.toastBad("Could not export meeting PDF");
      console.error("[NoteService] Error exporting PDF:", error);
    }
  }
}

export const noteService = new NoteService();
