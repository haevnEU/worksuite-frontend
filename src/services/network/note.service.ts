import { NoteResource } from "../../models/noteResource.model.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { NetworkService } from "./network.service.ts";
import { fileDownloadService } from "./fileDownload.service.ts";

export class NoteService extends NetworkService {
  constructor() {
    super("/notes");
  }

  public async fetchAll(): Promise<NoteResource[]> {
    try {
      return await this.get<NoteResource[]>("");
    } catch {
      return [];
    }
  }

  public async create(noteResource: NoteResource): Promise<void> {
    await this.post<NoteResource>("", noteResource);
    ToastManager.toastGood("Note created successfully.");
  }

  public async update(noteResource: NoteResource): Promise<void> {
    const id = noteResource.id;
    if (!id) return ToastManager.toastBad("The ID is missing!");

    await this.put<NoteResource>(`/${encodeURIComponent(id)}`, noteResource);
    ToastManager.toastGood(`Note updated successfully.`);
  }

  public async deleteById(id?: string): Promise<void> {
    if (!id) return ToastManager.toastBad("The ID is missing!");

    await this.delete<void>(`/${encodeURIComponent(id)}`);
    ToastManager.toastGood(`Note deleted successfully.`);
  }

  public async exportPdf(noteId: string, isDraft: boolean): Promise<void> {
    if (!noteId) return ToastManager.toastBad("The ID is missing!");

    await fileDownloadService.downloadNotebookExport(noteId, isDraft);
    ToastManager.toastGood("PDF exported successfully.");
  }
}

export const noteService = new NoteService();
