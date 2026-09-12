export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS"
  | "TRACE"
  | "CONNECT";

export interface HttpMethodDetail {
  method: HttpMethod;
  category: "Standard" | "Modification" | "Diagnostic" | "Tunneling";
  description: string;
  useCase: string;
  rfc: string;
  isSafe: boolean;
  isIdempotent: boolean;
  isCacheable: boolean;
  sampleEndpoint: string;
  sampleHeaders?: Record<string, string>;
  samplePayload?: string;
}

export type HttpStatusCategory = "1xx" | "2xx" | "3xx" | "4xx" | "5xx";

export interface HttpStatusCode {
  code: number;
  phrase: string;
  category: HttpStatusCategory;
  description: string;
  rfc: string;
  practicalExample: string;
  clientBehavior: string;
}
