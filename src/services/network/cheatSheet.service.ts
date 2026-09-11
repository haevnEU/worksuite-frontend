import { NetworkService } from "./network.service.ts";
import {
  CheatSheetRequestDto,
  CheatSheetResponseDto,
} from "../../models/cheatSheet.model.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";

export class CheatSheetService extends NetworkService {
  constructor() {
    super("/cheat-sheet");
  }

  /**
   * Lädt alle Cheat Sheets (optional nach Kategorie gefiltert).
   * Bei Fehlern wird ein leeres Array zurückgegeben, analog zu VcsService/SettingsService.
   */
  public async fetchAll(category?: string): Promise<CheatSheetResponseDto[]> {
    try {
      return await this.get<CheatSheetResponseDto[]>("");
    } catch {
      return [];
    }
  }

  /**
   * Lädt ein einzelnes Cheat Sheet per ID.
   */
  public async fetchById(id: string): Promise<CheatSheetResponseDto | null> {
    if (!id?.trim()) {
      ToastManager.toastBad("The Cheat Sheet ID is missing!");
      return null;
    }

    try {
      return await this.get<CheatSheetResponseDto>(
        `/${encodeURIComponent(id)}`,
      );
    } catch {
      return null;
    }
  }

  /**
   * Erstellt einen neuen Cheat Sheet Eintrag.
   */
  public async create(
    dto: CheatSheetRequestDto,
  ): Promise<CheatSheetResponseDto | null> {
    if (!dto?.title?.trim()) {
      ToastManager.toastBad("The Cheat Sheet title cannot be empty!");
      return null;
    }

    try {
      const created = await this.post<
        CheatSheetResponseDto,
        CheatSheetRequestDto
      >("", dto);
      ToastManager.toastGood("Cheat sheet created successfully.");
      return created;
    } catch {
      return null;
    }
  }

  /**
   * Aktualisiert einen bestehenden Eintrag per ID.
   */
  public async update(
    id: string,
    dto: CheatSheetRequestDto,
  ): Promise<CheatSheetResponseDto | null> {
    if (!id?.trim()) {
      ToastManager.toastBad("The Cheat Sheet ID is missing!");
      return null;
    }

    try {
      const updated = await this.put<
        CheatSheetResponseDto,
        CheatSheetRequestDto
      >(`/${encodeURIComponent(id)}`, dto);
      ToastManager.toastGood("Cheat sheet updated successfully.");
      return updated;
    } catch {
      return null;
    }
  }

  /**
   * Löscht ein Cheat Sheet per ID.
   */
  public async deleteCheatSheet(id: string): Promise<boolean> {
    if (!id?.trim()) {
      ToastManager.toastBad("The Cheat Sheet ID is missing!");
      return false;
    }

    try {
      await this.delete<void>(`/${encodeURIComponent(id)}`);
      ToastManager.toastGood("Cheat sheet deleted successfully.");
      return true;
    } catch {
      return false;
    }
  }

  public async seed(): Promise<void> {
    for (const cheatSheet of CHEAT_SHEET_SEEDS) {
      try {
        await this.create(cheatSheet);
      } catch (error) {
        console.error("Error seeding cheat sheet:", error);
      }
    }
  }
}

export const cheatSheetService = new CheatSheetService();

const CHEAT_SHEET_SEEDS: CheatSheetRequestDto[] = [];
