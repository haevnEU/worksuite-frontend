import { NetworkService } from "./network.service.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { UserModel } from "../../models/user.model.ts";

export class SettingsService extends NetworkService {
  constructor() {
    super("/settings");
  }

  public async fetchAll(): Promise<UserModel[]> {
    try {
      console.log("[SettingsService] Fetching all users...");
      return await this.get<UserModel[]>("/users");
    } catch (error) {
      ToastManager.toastBad("Could not fetch users");
      console.error("[SettingsService] Error fetching users:", error);
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

    try {
      console.log(
        "[SettingsService] Setting Redmine API Key for user:",
        user.id,
      );
      const reqOpts = {
        headers: {
          "X-Redmine-API-Key": apiKey.trim(),
        },
      };
      await this.put<void>(
        `/users/${encodeURIComponent(user.id)}/redmine-key`,
        {},
        reqOpts,
      );
      ToastManager.toastGood("Redmine API Key set successfully.");
    } catch (error) {
      ToastManager.toastBad("Could not set Redmine API key");
      console.error("[SettingsService] Error setting Redmine key:", error);
      throw error;
    }
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

    try {
      console.log("[SettingsService] Setting VCS API Key for user:", user.id);
      const reqOpts = {
        headers: {
          "X-VCS-API-Key": apiKey.trim(),
        },
      };
      await this.put<void>(
        `/users/${encodeURIComponent(user.id)}/vcs-key`,
        {},
        reqOpts,
      );
      ToastManager.toastGood("VCS API Key set successfully.");
    } catch (error) {
      ToastManager.toastBad("Could not set VCS key");
      console.error("[SettingsService] Error setting VCS key:", error);
      throw error;
    }
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

    try {
      console.log("[SettingsService] Setting avatar for user:", user.id);
      const formData = new FormData();
      formData.append("file", file);

      await this.formUpload<void>(
        "PUT",
        `/users/${encodeURIComponent(user.id)}/avatar`,
        formData,
      );
      ToastManager.toastGood("Avatar updated successfully.");
    } catch (error) {
      ToastManager.toastBad("Could not set avatar image");
      console.error("[SettingsService] Error setting avatar record:", error);
      throw error;
    }
  }
}

export const settingsService = new SettingsService();
