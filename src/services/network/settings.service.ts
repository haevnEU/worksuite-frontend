import { NetworkService } from "./network.service.ts";
import { ToastManager } from "../../toaster/ToastManager.ts";
import { UserModel } from "../../models/userModel.model.ts";

export class SettingsService extends NetworkService {
  constructor() {
    super("/settings");
  }

  public async fetchAll(): Promise<UserModel[]> {
    try {
      console.log("[SettingsService] Fetching all users...");
      return this.get<UserModel[]>("/users");
    } catch (error) {
      ToastManager.toastBad("Could not fetch users");
      console.error("[SettingsService] Error fetching users:", error);
      return Promise.resolve([]);
    }
  }

  public async setRedmineKey(user: UserModel, apiKey: string): Promise<void> {
    try {
      console.log("[SettingsService] Setting Redmine API Key for user:", user);
      const reqOpts = {
        headers: {
          "X-Redmine-API-Key": apiKey,
        },
      };
      await this.put<void>(`/users/${user.id}/redmine-key`, {}, reqOpts);
      ToastManager.toastGood("Redmine API Key set.");
    } catch (error) {
      ToastManager.toastBad("Could not set Redmine key:");
      console.error("[SettingsService] Error setting Redmine key:", error);
    }
  }

  public async setGitlabKey(user: UserModel, apiKey: string): Promise<void> {
    try {
      console.log("[SettingsService] Setting GitLab API Key for user:", user);
      const reqOpts = {
        headers: {
          "X-Gitlab-API-Key": apiKey,
        },
      };
      await this.put<void>(`/users/${user.id}/gitlab-key`, {}, reqOpts);
      ToastManager.toastGood("GitLab API Key set.");
    } catch (error) {
      ToastManager.toastBad("Could not set GitLab key:");
      console.error("[SettingsService] Error setting GitLab key:", error);
    }
  }

  public async setAvatar(user: UserModel, file: File): Promise<void> {
    try {
      console.log("[SettingsService] Setting avatar for user:", user);
      const formData = new FormData();
      formData.append("file", file);

      await this.formUpload<void>("PUT", `/users/${user.id}/avatar`, formData);
      ToastManager.toastGood("Avatar set.");
    } catch (error) {
      ToastManager.toastBad("Could not set avatar record");
      console.error("[SettingsService] Error setting avatar record:", error);
    }
  }
}

export const settingsService = new SettingsService();
