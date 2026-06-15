import { getToken } from "./api";
import type { WsEvent } from "./types";

export function openRoomSocket(
  code: string,
  onEvent: (event: WsEvent) => void,
): WebSocket {
  const token = getToken() ?? "";
  const proto = location.protocol === "https:" ? "wss" : "ws";
  const url = `${proto}://${location.host}/ws/${code}?token=${token}`;
  const ws = new WebSocket(url);
  ws.onmessage = (msg) => {
    try {
      onEvent(JSON.parse(msg.data) as WsEvent);
    } catch {
      /* ignore malformed */
    }
  };
  return ws;
}
