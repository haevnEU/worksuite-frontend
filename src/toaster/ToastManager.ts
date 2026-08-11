export type ToastType = "info" | "success" | "warn" | "error";

export interface ToastOptions {
  title?: string;
  duration?: number;
}

export type ToastCallback = (
  message: string,
  type: ToastType,
  options?: ToastOptions,
) => void;

export class ToastManager {
  private static listener: ToastCallback | null = null;

  public static register(callback: ToastCallback) {
    this.listener = callback;
  }

  public static unregister() {
    this.listener = null;
  }

  public static toast(
    message: string,
    type: ToastType = "info",
    options?: ToastOptions,
  ) {
    if (this.listener) {
      this.listener(message, type, options);
    }
  }

  public static toastGood(message: string, options?: ToastOptions) {
    this.toast(message, "success", options);
  }

  public static toastBad(message: string, options?: ToastOptions) {
    this.toast(message, "error", options);
  }

  public static toastWarn(message: string, options?: ToastOptions) {
    this.toast(message, "warn", options);
  }

  public static toastInfo(message: string, options?: ToastOptions) {
    this.toast(message, "info", options);
  }
}
