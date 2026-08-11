import { NotificationItem, WsEvent } from "../../models/pushService.model.ts";

type NotificationListener = (items: NotificationItem[]) => void;

class NotificationHandler {
  private notifications: NotificationItem[] = [];
  private listeners: Set<NotificationListener> = new Set();
  private readonly maxStored = 50;

  public addEvent(event: WsEvent): void {
    console.log("[NotificationHandler] New Event received:", event);

    const newItem: NotificationItem = {
      source: event.source || "System",
      priority: event.priority || "INFO",
      payload: event.payload || "",
      timestamp: event.timestamp || new Date().toISOString(),
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      read: false,
    };

    this.notifications = [newItem, ...this.notifications].slice(
      0,
      this.maxStored,
    );
    this.notify();
  }

  public subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    listener([...this.notifications]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    const copy = [...this.notifications];
    this.listeners.forEach((listener) => listener(copy));
  }

  public markAsRead(id: string): void {
    this.notifications = this.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    this.notify();
  }

  public markAllAsRead(): void {
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }));
    this.notify();
  }

  public removeById(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.notify();
  }

  public clearAll(): void {
    this.notifications = [];
    this.notify();
  }
}

export const notificationHandler = new NotificationHandler();
