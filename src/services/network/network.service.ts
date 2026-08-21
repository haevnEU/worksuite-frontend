import { RequestOptions } from "../../models/http.model.ts";
import { getHost, getProtocol } from "../../utils/network.util.ts";
import {
  Interceptor,
  RequestContext,
  ResponseContext,
} from "./internal/interceptor.interface.ts";
import { ErrorToastInterceptor } from "./internal/ErrorToast.interceptor.ts";
import { AuthInterceptor } from "./internal/AuthInterceptor.ts";
import { HttpError } from "../../exception/http.error.ts";
import { LicenseLockInterceptor } from "./internal/licenseLock.interceptor.ts";
import { httpEvents } from "../../events/http.event.ts";

export class NetworkService {
  protected baseUrl: string;
  private readonly interceptors: Interceptor[] = [];
  private readonly defaultTimeout: number = 15_000;

  constructor(endpoint: string) {
    this.baseUrl = `${getProtocol("http")}//${getHost()}/api/v1${endpoint}`;

    this.use(new LicenseLockInterceptor());
    this.use(new AuthInterceptor());
    this.use(new ErrorToastInterceptor());

    console.log(`[NetworkService] Initialized with base URL: ${this.baseUrl}`);
  }

  public use(interceptor: Interceptor): void {
    this.interceptors.push(interceptor);
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

  public async executeRequest<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = new Headers();
    headers.set("Accept", "application/json");

    if (options.headers) {
      new Headers(options.headers).forEach((value, key) => {
        headers.set(key, value);
      });
    }

    const body = this.prepareRequestBody(options.body, headers);

    const timeout = options.timeout ?? this.defaultTimeout;
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), timeout);

    let signal = timeoutController.signal;
    if (options.signal) {
      if ("any" in AbortSignal && typeof AbortSignal.any === "function") {
        signal = AbortSignal.any([options.signal, timeoutController.signal]);
      } else {
        options.signal.addEventListener("abort", () =>
          timeoutController.abort(),
        );
      }
    }

    const { timeout: _, headers: __, body: ___, ...fetchOptions } = options;

    let context: RequestContext = {
      url,
      options: {
        ...fetchOptions,
        headers,
        body,
        signal,
      },
    };

    try {
      for (const interceptor of this.interceptors) {
        if (interceptor.onRequest) {
          context = await interceptor.onRequest(context);
        }
      }

      console.log(
        `[NetworkService] Executing ${context.options.method || "GET"} request to: ${context.url}`,
      );

      const response = await fetch(context.url, context.options);

      if (options.returnRaw) {
        return response as unknown as T;
      }

      switch (response.status) {
        case 401:
          httpEvents.emit("http:401-unauthorized");
          break;
        case 403:
          httpEvents.emit("http:403-forbidden");
          break;
        case 418:
          httpEvents.emit("http:418-teapot");
          break;
        case 500:
          httpEvents.emit("http:500-server-error");
          break;
      }

      if (!response.ok) {
        const errorBody = await response.text().catch(() => "");
        throw new HttpError(
          response.status,
          response.statusText,
          errorBody,
          response.headers,
        );
      }

      let data: T = undefined as T;
      if (response.status !== 204) {
        const contentType = response.headers.get("content-type") || "";
        const text = await response.text();

        if (text) {
          if (contentType.includes("application/json")) {
            data = JSON.parse(text) as T;
          } else {
            data = text as unknown as T;
          }
        }
      }

      let responseContext: ResponseContext<T> = {
        response,
        data,
        request: context,
      };

      for (const interceptor of this.interceptors) {
        if (interceptor.onResponse) {
          responseContext = await interceptor.onResponse(responseContext);
        }
      }

      return responseContext.data as T;
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.warn(
          `[NetworkService] Request aborted or timed out (${timeout}ms) for: ${context.url}`,
        );
      }

      for (const interceptor of this.interceptors) {
        if (interceptor.onError) {
          await interceptor.onError(error, context);
        }
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  public async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.executeRequest<T>(endpoint, { ...options, method: "GET" });
  }

  public async post<T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: RequestOptions,
  ): Promise<T> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  }

  public async put<T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: RequestOptions,
  ): Promise<T> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  }

  public async patch<T, B = unknown>(
    endpoint: string,
    body?: B,
    options?: RequestOptions,
  ): Promise<T> {
    return this.executeRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    });
  }

  public async delete<T = void>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<T> {
    return this.executeRequest<T>(endpoint, { ...options, method: "DELETE" });
  }

  private prepareRequestBody(
    body: unknown,
    headers: Headers,
  ): BodyInit | null | undefined {
    if (body === undefined || body === null) {
      return undefined;
    }

    if (typeof body === "string") {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "text/plain");
      }
      return body;
    }

    if (
      body instanceof FormData ||
      body instanceof Blob ||
      body instanceof ArrayBuffer
    ) {
      headers.delete("Content-Type");
      headers.delete("content-type");
      return body as BodyInit;
    }

    if (body instanceof URLSearchParams) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/x-www-form-urlencoded");
      }
      return body.toString();
    }

    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return JSON.stringify(body);
  }

  public async ping(): Promise<boolean> {
    try {
      const response = await fetch("/api/v1/about/ping");
      return response.ok;
    } catch (error) {
      console.error("[NetworkService] Ping failed:", error);
      return false;
    }
  }
}
