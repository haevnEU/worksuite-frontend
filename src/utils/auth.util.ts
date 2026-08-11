type AuthEventListener = () => void;

class AuthEventHub {
  private sessionExpiredListeners: AuthEventListener[] = [];

  onSessionExpired(callback: AuthEventListener) {
    this.sessionExpiredListeners.push(callback);
    return () => {
      this.sessionExpiredListeners = this.sessionExpiredListeners.filter(
        (cb) => cb !== callback,
      );
    };
  }

  notifySessionExpired() {
    this.sessionExpiredListeners.forEach((callback) => callback());
  }
}

export const authEvents = new AuthEventHub();
export const fetchClient = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const token = localStorage.getItem("access_token");

  const headers = new Headers(init?.headers);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...init,
    headers,
  });

  // Wenn das Backend 401 Unauthorized meldet:
  if (response.status === 401) {
    const url = typeof input === "string" ? input : input.toString();

    // Nicht beim eigentlichen Login oder Reauth feuern
    if (!url.includes("/login") && !url.includes("/reauth")) {
      authEvents.notifySessionExpired();
    }
  }

  return response;
};
