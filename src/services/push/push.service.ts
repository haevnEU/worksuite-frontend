import { notificationHandler } from "./NotificationHandler";
import { WsEvent } from "../../models/pushService.model.ts";
import { ConnectionStatus } from "../../types/PushService.type.ts";
import { getHost, getProtocol } from "../../utils/network.util.ts";

type StatusListener = (status: ConnectionStatus) => void;

class PushService {
  private socket: WebSocket | null = null;
  private status: ConnectionStatus = "disconnected";
  private statusListeners: Set<StatusListener> = new Set();

  private reconnectTimer: number | null = null;
  private reconnectAttempts = 0;
  private readonly minDelayMs = 1000;
  private readonly maxDelayMs = 30000;

  public getWsUrl(): string {
    const host = getHost();
    const protocol = getProtocol("ws");
    return `${protocol}//${host}/api/ws`;
  }

  public connect(): void {
    console.log("[PushService] Initialization triggered. State:", this.status);
    if (
        this.socket &&
        (this.socket.readyState === WebSocket.OPEN ||
            this.socket.readyState === WebSocket.CONNECTING)
    ) {
      console.log(
          "[PushService] Connection already active/connecting. Skipping.",
      );
      return;
    }

    const wsUrl = this.getWsUrl();
    console.log("[PushService] Attempting to connect to:", wsUrl);

    const isFirstConnect = this.reconnectAttempts === 0;
    this.updateStatus(isFirstConnect ? "connecting" : "reconnecting");

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log("[PushService] Connected to WebSocket Endpoint:", wsUrl);
        this.updateStatus("connected");
        this.reconnectAttempts = 0;
        this.clearReconnectTimer();
      };

      this.socket.onmessage = (event: MessageEvent) => {
        console.log("[PushService] Raw Message:", event.data);
        try {
          const wsEvent: WsEvent =
              typeof event.data === "string"
                  ? JSON.parse(event.data)
                  : event.data;

          console.log("[PushService] WS Event parsed successfully:", wsEvent);
          notificationHandler.addEvent(wsEvent);
        } catch (err) {
          console.error(
              "[PushService] Failed to parse WebSocket message:",
              err,
          );
        }
      };

      this.socket.onerror = (error) => {
        console.warn("[PushService] WS Transport Error:", error);
      };

      this.socket.onclose = (event) => {
        console.warn(
            `[PushService] WS Connection closed (Code: ${event.code}, Reason: ${event.reason}).`,
        );

        this.socket = null;

        // 403 Forbidden / Unauthorized Close Detection
        const isAuthFailure =
            event.code === 403 ||
            event.code === 4403 ||
            event.code === 4003 ||
            event.code === 1008 || // 1008 = WS Policy Violation
            event.reason?.includes("403") ||
            event.reason?.toLowerCase().includes("forbidden") ||
            event.reason?.toLowerCase().includes("unauthorized");

        if (isAuthFailure) {
          console.error(
              "[PushService] Access denied (403 Forbidden). Aborting reconnect and redirecting to /login.",
          );
          this.disconnect();

          if (typeof window !== "undefined" && window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          return;
        }

        // Regulärer Verbindungsverlust -> Reconnect versuchen
        this.updateStatus("reconnecting");
        this.scheduleReconnect();
      };
    } catch (err) {
      console.error(
          "[PushService] Critical error during WebSocket creation:",
          err,
      );
      this.updateStatus("reconnecting");
      this.scheduleReconnect();
    }
  }

  public disconnect(): void {
    this.clearReconnectTimer();
    this.reconnectAttempts = 0;
    if (this.socket) {
      // Event-Handler aushängen, um Nebeneffekte beim Schließen zu verhindern
      this.socket.onopen = null;
      this.socket.onmessage = null;
      this.socket.onerror = null;
      this.socket.onclose = null;
      this.socket.close();
      this.socket = null;
    }
    this.updateStatus("disconnected");
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return;

    this.reconnectAttempts++;
    const delay = Math.min(
        this.minDelayMs * Math.pow(2, this.reconnectAttempts - 1),
        this.maxDelayMs,
    );
    const jitter = delay * 0.2 * Math.random();
    const finalDelay = Math.floor(delay + jitter);

    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, finalDelay);
  }

  public updateStatus(newStatus: ConnectionStatus): void {
    this.status = newStatus;
    this.statusListeners.forEach((listener) => listener(newStatus));
  }

  public subscribeStatus(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    listener(this.status);
    return () => {
      this.statusListeners.delete(listener);
    };
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }
}

export const pushService = new PushService();