import { ToastManager } from "../../toaster/ToastManager.ts";
import { UserModel } from "../../models/user.model.ts";
import { NetworkService } from "./network.service.ts";

export class SettingsService extends NetworkService {
  constructor() {
    super("/settings");
  }

  public async fetchAll(): Promise<UserModel[]> {
    try {
      return await this.get<UserModel[]>("/users");
    } catch {
      return [];
    }
  }

  public async setRedmineKey(user: UserModel, apiKey: string): Promise<void> {
    if (!user?.id) {
      ToastManager.toastBad("The User ID is missing!");
      return;
    }

    if (!apiKey?.trim()) {
      ToastManager.toastBad("The Redmine API key cannot be empty!");
      return;
    }
    const options = {
      headers: {
        "X-Redmine-API-Key": apiKey.trim(),
      },
    };

    await this.put<void>(
      `/users/${encodeURIComponent(user.id)}/redmine-key`,
      undefined,
      options,
    );
    ToastManager.toastGood("Redmine API Key set successfully.");
  }

  public async setVcsKey(user: UserModel, apiKey: string): Promise<void> {
    if (!user?.id) {
      ToastManager.toastBad("The User ID is missing!");
      return;
    }

    if (!apiKey?.trim()) {
      ToastManager.toastBad("The VCS API key cannot be empty!");
      return;
    }

    const options = {
      headers: {
        "X-VCS-API-Key": apiKey.trim(),
      },
    };

    await this.put<void>(
      `/users/${encodeURIComponent(user.id)}/vcs-key`,
      undefined,
      options,
    );
    ToastManager.toastGood("VCS API Key set successfully.");
  }

  public async setAvatar(user: UserModel, file: File): Promise<void> {
    if (!user?.id) {
      ToastManager.toastBad("The User ID is missing!");
      return;
    }

    if (!file) {
      ToastManager.toastBad("No image file provided!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    await this.put<void>(
      `/users/${encodeURIComponent(user.id)}/avatar`,
      formData,
    );
    ToastManager.toastGood("Avatar updated successfully.");
  }
}

export const settingsService = new SettingsService();
