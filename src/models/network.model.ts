import { HttpStatusCategory } from "../types/network.types.ts";

export interface HttpStatusCode {
  code: number;
  phrase: string;
  category: HttpStatusCategory;
  description: string;
  rfc: string;
  practicalExample: string;
  clientBehavior: string;
}

export interface HttpMethodDetail {
  method: string;
  category: "CORE" | "ADVANCED" | "WEBDAV";
  description: string;
  rfc: string;
  isSafe: boolean;
  isIdempotent: boolean;
  isCacheable: boolean;
  requestBodyAllowed: "YES" | "NO" | "OPTIONAL";
  responseBodyAllowed: "YES" | "NO" | "OPTIONAL";
  useCase: string;
  sampleEndpoint: string;
  samplePayload?: string;
  sampleHeaders?: Record<string, string>;
}
