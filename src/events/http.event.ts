export type HttpEventType =
  | "http:401-unauthorized"
  | "http:403-forbidden"
  | "http:418-teapot"
  | "http:500-server-error";

class HttpEventEmitter {
  emit(event: HttpEventType): void {
    window.dispatchEvent(new CustomEvent(event));
  }

  on(event: HttpEventType, callback: () => void): () => void {
    const listener = () => callback();
    window.addEventListener(event, listener);
    return () => window.removeEventListener(event, listener);
  }
}

export const httpEvents = new HttpEventEmitter();
