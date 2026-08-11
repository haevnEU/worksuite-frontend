import { LicensePlan } from "../types/license.type.ts";

export interface RenewLicenseRequest {
  licenseKey: string;
}

export interface LicenseStatusResponse {
  userId: string;
  valid: boolean;
  licenseKey?: string;
  plan: LicensePlan;
  expiresAt: string;
  createdAt: string;
  updatedAt?: string;
  message?: string;
}
