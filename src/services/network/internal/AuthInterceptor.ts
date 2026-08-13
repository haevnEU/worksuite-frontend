import { Interceptor, RequestContext } from "./interceptor.interface.ts";
import { STORAGE_KEY_IS_DRAFT } from "../../../constants/settings.constant.ts";

export class AuthInterceptor implements Interceptor {
  onRequest(context: RequestContext): RequestContext {
    const token = localStorage.getItem("access_token");
    const isDraftSaved = localStorage.getItem(STORAGE_KEY_IS_DRAFT);
    const isDraft =
      isDraftSaved !== null ? String(JSON.parse(isDraftSaved)) : "true";
    const headers = new Headers(context.options.headers);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("X-Is-Draft", isDraft);

    return {
      ...context,
      options: {
        ...context.options,
        headers,
      },
    };
  }
}
