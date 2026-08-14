export interface RenewLicenseRequest {
  licenseKey: string;
}

export interface LicenseStatusResponse {
  userId: string;
  valid: boolean;
  licenseKey?: string;
  plan: "COMMUNITY" | "PRO" | "ENTERPRISE" | string;
  expiresAt: string;
  createdAt: string;
  updatedAt?: string;
  message?: string;
}
