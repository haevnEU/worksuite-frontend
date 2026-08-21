export interface RequestOptions extends Omit<RequestInit, "headers" | "body"> {
  headers?: Record<string, string>;
  timeout?: number;
  body?: unknown;
  returnRaw?: boolean;
}
