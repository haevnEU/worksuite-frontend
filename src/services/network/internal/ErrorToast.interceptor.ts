import { Interceptor, RequestContext } from "./interceptor.interface.ts";
import { HttpError } from "../../../exception/http.error.ts";
import { GlobalErrorManager } from "../../../state/error.state.ts";
import { ToastManager } from "../../../toaster/ToastManager.ts";

export class ErrorToastInterceptor implements Interceptor {
  public async onError(error: any, _context: RequestContext): Promise<void> {
    if (error instanceof HttpError) {
      if (error.isHtml || error.status >= 500) {
        console.error(
          `[Nginx Error] Showing full-page error with CID: ${error.correlationId}`,
        );
        GlobalErrorManager.showError(error);
        return;
      }
      ToastManager.toastBad(error.message);
      return;
    }
    ToastManager.toastBad(error?.message || "An unexpected error occurred.");
  }
}
