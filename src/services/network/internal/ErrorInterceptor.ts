import { STORAGE_KEY_IS_DRAFT } from "../../../constants/settings.constant.ts";
import { Interceptor, RequestContext } from "./interceptor.interface.ts";
import { ToastManager } from "../../../toaster/ToastManager.ts";

export class ErrorToastInterceptor implements Interceptor {
  onError(error: unknown, context: RequestContext): never {
    if (error instanceof Error) {
      ToastManager.toastBad(
        `Cannot complete request to ${context.url}: ${error.message}`,
      );
    } else {
      ToastManager.toastBad(
        `Cannot complete request to ${context.url}: Unknown error`,
      );
    }
    throw error;
  }
}
