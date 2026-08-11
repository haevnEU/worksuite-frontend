import { downloadString, triggerBlobDownload } from "../../utils/file.util.ts";
import { STORAGE_KEY_IS_DRAFT } from "../../constants/settings.constant.ts";
import { RequestOptions } from "../../models/http.model.ts";
import { getHost, getProtocol } from "../../utils/network.util.ts";

export class NetworkService {
  protected baseUrl: string;
  protected defaultHeaders: Record<string, string>;

  constructor(endpoint: string) {
    this.baseUrl = `${getProtocol("http")}//${getHost()}/api/v1${endpoint}`;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    console.log(`[NetworkService] Initialized with base URL: ${this.baseUrl}`);
  }

  private getIsDraftHeader(): string {
    const saved = localStorage.getItem(STORAGE_KEY_IS_DRAFT);
    return saved !== null ? String(JSON.parse(saved)) : "true";
  }

  /**
   * Holt das Token direkt aus dem localStorage.
   */
  private getAuthToken(): string | null {
    return localStorage.getItem("access_token");
  }

  public setAuthToken(token: string | null): void {
    if (token) {
      this.defaultHeaders["Authorization"] = `Bearer ${token}`;
      localStorage.setItem("access_token", token);
    } else {
      delete this.defaultHeaders["Authorization"];
      localStorage.removeItem("access_token");
    }
  }

  public buildParams(params?: Record<string, any>): string {
    if (!params) return "";
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, String(item)));
        } else {
          searchParams.set(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }

  public async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  public async post<T, B = unknown>(
    endpoint: string,
    body: B,
    options?: RequestOptions,
  ): Promise<T> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  public async postRaw<T>(
    endpoint: string,
    rawBody: string | undefined,
    options?: RequestOptions,
  ): Promise<T> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        ...(options?.headers as Record<string, string>),
      },
      body: rawBody,
    });
  }

  public async put<T, B = unknown>(
    endpoint: string,
    body: B,
    options?: RequestOptions,
  ): Promise<T> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  public async putRaw<T>(
    endpoint: string,
    rawBody: string | undefined,
    options?: RequestOptions,
  ): Promise<T> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      headers: {
        "Content-Type": "text/plain",
        ...(options?.headers as Record<string, string>),
      },
      body: rawBody,
    });
  }

  public async delete<T = void>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<T> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }

  public async formUpload<T>(
    method: "POST" | "PUT",
    endpoint: string,
    formData: FormData,
    options?: RequestOptions,
  ): Promise<T> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method,
      body: formData,
    });
  }

  public async executeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    console.log(
      `[NetworkService] Executing ${options.method || "GET"} request to: ${this.baseUrl}${endpoint}`,
    );
    const url = `${this.baseUrl}${endpoint}`;

    // Token dynamisch vor jedem Request anhängen, falls vorhanden
    const token = this.getAuthToken();
    const authHeaders: Record<string, string> = {};
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...authHeaders,
      ...(options.headers as Record<string, string>),
    };

    if (options.body instanceof FormData) {
      delete headers["Content-Type"];
      delete headers["content-type"];
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(
        `HTTP Error ${response.status}: ${response.statusText}${
          errorBody ? ` - ${errorBody}` : ""
        }`,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    if (!text) {
      return undefined as T;
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  /**
   * Re-export als Instanz-Methode für Kompatibilität
   */
  public downloadString(
    content: string,
    filename: string,
    contentType: string = "text/plain",
  ): void {
    downloadString(content, filename, contentType);
  }

  public async downloadFile(
    endpoint: string,
    defaultFilename: string = `downloaded_${Date.now()}`,
    options?: RequestOptions,
  ): Promise<void> {
    const url = `${this.baseUrl}${endpoint}`;
    const isDraft = this.getIsDraftHeader();
    const token = this.getAuthToken();

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      isDraft,
      ...options?.headers,
      Accept: "*/*",
    };
    delete headers["Content-Type"];
    delete headers["content-type"];

    const response = await fetch(url, {
      ...options,
      method: options?.method || "GET",
      headers,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(
        `HTTP Error ${response.status}: ${response.statusText}${
          errorBody ? ` - ${errorBody}` : ""
        }`,
      );
    }

    let filename = (isDraft ? "DRAFT_" : "") + defaultFilename;
    const contentDisposition = response.headers.get("Content-Disposition");
    if (contentDisposition) {
      const filenameMatch =
        contentDisposition.match(/filename\*=UTF-8''([^;]+)/i) ||
        contentDisposition.match(/filename="?([^";]+)"?/i);

      if (filenameMatch && filenameMatch[1]) {
        filename = decodeURIComponent(filenameMatch[1]);
      }
    }

    const blob = await response.blob();
    triggerBlobDownload(blob, filename);
  }
}
