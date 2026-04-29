import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";
const WS_BASE_URL = "wss://hike-connect-back.onrender.com/ws/chat/payment";

export interface PaymentChatMessage {
  id: string;
  message: string;
  sender_id: string | number;
  sender_username: string;
  sender_avatar?: string | null;
  created_at: string;
}

interface UsePaymentChatOptions {
  paymentId: string | undefined;
  pageSize?: number;
}

export const usePaymentChat = ({ paymentId, pageSize = 30 }: UsePaymentChatOptions) => {
  const { authFetch, getAccessToken, refreshAccessToken, user } = useAuth();
  const [messages, setMessages] = useState<PaymentChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const pingIntervalRef = useRef<ReturnType<typeof setInterval>>();
  const reconnectAttemptsRef = useRef(0);

  // Fetch initial history
  useEffect(() => {
    if (!paymentId) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await authFetch(
          `${API_BASE_URL}/payments/${paymentId}/chat/?page=1&page_size=${pageSize}`
        );
        if (!res.ok) throw new Error("Error al cargar mensajes");
        const data = await res.json();
        const items: PaymentChatMessage[] = data.results || data.data || [];
        // API returns most-recent-first; reverse for chat display (oldest at top)
        if (!cancelled) setMessages([...items].reverse());
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paymentId, pageSize, authFetch]);

  // WebSocket connection
  const connect = useCallback(async () => {
    if (!paymentId) return;

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    let token = getAccessToken();
    if (!token) {
      token = await refreshAccessToken();
      if (!token) return;
    }

    const ws = new WebSocket(`${WS_BASE_URL}/${paymentId}/?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      // Keep-alive ping every 30s
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("[PaymentChat WS] msg:", data);

        // Ignore pongs / connection acks
        if (data.type === "pong" || data.type === "connection_established") return;

        // Accept any payload that looks like a chat message:
        // backend may send { type: "new_message" | "message" | "chat_message", ... }
        // or even bare message objects.
        const looksLikeMessage =
          data && (data.message || data.content) && (data.id || data.created_at);

        const isMessageType =
          data?.type === "new_message" ||
          data?.type === "message" ||
          data?.type === "chat_message" ||
          data?.type === "chat.message";

        if (!isMessageType && !looksLikeMessage) return;

        const msg: PaymentChatMessage = {
          id: String(data.id ?? `${data.sender_id ?? "x"}-${data.created_at ?? Date.now()}`),
          message: data.message ?? data.content ?? "",
          sender_id: data.sender_id ?? data.user_id ?? data.sender ?? "",
          sender_username: data.sender_username ?? data.username ?? "Usuario",
          sender_avatar: data.sender_avatar ?? data.avatar ?? null,
          created_at: data.created_at ?? new Date().toISOString(),
        };

        setMessages((prev) => {
          // Skip if exact same id already exists
          if (prev.some((m) => String(m.id) === String(msg.id))) return prev;

          // Replace optimistic local message: same sender + same text within last 30s
          const msgTime = new Date(msg.created_at).getTime();
          const optimisticIdx = prev.findIndex(
            (m) =>
              String(m.id).startsWith("local-") &&
              String(m.sender_id) === String(msg.sender_id) &&
              m.message.trim() === msg.message.trim() &&
              Math.abs(new Date(m.created_at).getTime() - msgTime) < 30000
          );
          if (optimisticIdx !== -1) {
            const next = [...prev];
            next[optimisticIdx] = msg;
            return next;
          }

          return [...prev, msg].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        });
      } catch (err) {
        console.error("WS parse error:", err);
      }
    };

    ws.onerror = () => {
      // handled in onclose
    };

    ws.onclose = async (event) => {
      setIsConnected(false);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);

      if (event.code === 4001) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          reconnectAttemptsRef.current = 0;
          connect();
        }
        return;
      }

      if (event.code !== 1000 && reconnectAttemptsRef.current < 5) {
        const delay = 1000 * Math.pow(2, reconnectAttemptsRef.current);
        reconnectAttemptsRef.current++;
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      }
    };
  }, [paymentId, getAccessToken, refreshAccessToken]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (wsRef.current) {
        wsRef.current.close(1000, "unmount");
        wsRef.current = null;
      }
    };
  }, [connect]);

  const sendMessage = useCallback(
    (message: string) => {
      const text = message.trim();
      if (!text) return false;
      if (wsRef.current?.readyState !== WebSocket.OPEN) return false;
      wsRef.current.send(JSON.stringify({ type: "message", message: text }));

      // Optimistic local append so the sender sees the message immediately
      // even if the backend does not echo it back via WS.
      const tempId = `local-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          message: text,
          sender_id: user?.id ?? "",
          sender_username: user?.name || user?.first_name || "Tú",
          sender_avatar: user?.avatar ?? null,
          created_at: new Date().toISOString(),
        },
      ]);
      return true;
    },
    [user]
  );

  return {
    messages,
    loading,
    isConnected,
    sendMessage,
    currentUserId: user?.id,
  };
};
