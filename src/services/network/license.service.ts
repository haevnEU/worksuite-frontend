import { NetworkService } from "./network.service.ts";
import {
  LicenseStatusResponse,
  RenewLicenseRequest,
} from "../../models/license.model.ts";
import { LicensePlan } from "../../types/license.type.ts";

export interface AssignLicenseRequest {
  plan: LicensePlan;
}

export class LicenseService extends NetworkService {
  constructor() {
    super("/user-service/license");
  }

  public async getStatus(): Promise<LicenseStatusResponse> {
    return this.get<LicenseStatusResponse>("/status");
  }

  public async assignPlan(
      plan: LicensePlan,
  ): Promise<LicenseStatusResponse> {
    return this.post<LicenseStatusResponse, AssignLicenseRequest>(
        "/assign",
        { plan },
    );
  }

  public async renewLicense(
      licenseKey: string,
  ): Promise<LicenseStatusResponse> {
    const payload: RenewLicenseRequest = { licenseKey };
    return this.post<LicenseStatusResponse, RenewLicenseRequest>(
        "/renew",
        payload,
    );
  }
}

export const licenseService = new LicenseService();