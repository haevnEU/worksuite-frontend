import { Priority } from "../types/PushService.type.ts";

export interface WsEvent {
  source: string;
  priority: Priority;
  payload: string;
  timestamp: string;
}

export interface NotificationItem extends WsEvent {
  id: string;
  read: boolean;
}
