// src/services/network/internal/LicenseLock.interceptor.ts
import { Interceptor, RequestContext } from "./interceptor.interface.ts";
import { HttpError } from "../../../exception/http.error.ts";
import { LicenseStateManagerInstance } from "../../../state/license.state.ts";

export class LicenseLockInterceptor implements Interceptor {
  public async onError(error: any, _context: RequestContext): Promise<void> {
    if (error instanceof HttpError && error.status === 402) {
      console.error(
        "[LicenseLockInterceptor] License expired (HTTP 402). Locking UI.",
      );
      LicenseStateManagerInstance.setExpired(true);
    }
  }
}
