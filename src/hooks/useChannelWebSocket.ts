import { useEffect, useRef, useCallback, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";

const WS_BASE_URL = "wss://hike-connect-back.onrender.com/ws/chat/canal";

export interface WsPost {
  id: string;
  content: string;
  created_at: string;
  author_name: string;
  author_image: string | null;
}

interface WsMessage {
  type: string;
  post?: WsPost;
  username?: string;
  can_write?: boolean;
  is_typing?: boolean;
  message?: string;
}

interface UseChannelWebSocketOptions {
  channelId: string | undefined;
  enabled?: boolean;
}

interface UseChannelWebSocketReturn {
  isConnected: boolean;
  canWrite: boolean;
  typingUsers: string[];
  sendTyping: (isTyping: boolean) => void;
  sendMessage: (content: string) => void;
}

export const useChannelWebSocket = ({
  channelId,
  enabled = true,
}: UseChannelWebSocketOptions): UseChannelWebSocketReturn => {
  const { getAccessToken, refreshAccessToken } = useAuth();
  const queryClient = useQueryClient();

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const reconnectAttemptsRef = useRef(0);

  const [isConnected, setIsConnected] = useState(false);
  const [canWrite, setCanWrite] = useState(true);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_BASE_DELAY = 1000;

  const clearTypingUser = useCallback((username: string) => {
    setTimeout(() => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    }, 3000);
  }, []);

  const connect = useCallback(async () => {
    if (!channelId || !enabled) return;

    // Close existing connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    let token = getAccessToken();
    if (!token) {
      token = await refreshAccessToken();
      if (!token) return;
    }

    const wsUrl = `${WS_BASE_URL}/${channelId}/?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket conectado al canal");
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data: WsMessage = JSON.parse(event.data);

        switch (data.type) {
          case "connection_established":
            setCanWrite(data.can_write ?? true);
            break;

          case "new_post":
            if (data.post) {
              // Invalidate posts query to refetch with new data
              queryClient.invalidateQueries({
                queryKey: ["posts", channelId],
              });
            }
            break;

          case "user_joined":
            // Optional: could show a subtle notification
            break;

          case "user_left":
            if (data.username) {
              setTypingUsers((prev) =>
                prev.filter((u) => u !== data.username)
              );
            }
            break;

          case "typing":
            if (data.username) {
              if (data.is_typing) {
                setTypingUsers((prev) =>
                  prev.includes(data.username!)
                    ? prev
                    : [...prev, data.username!]
                );
                clearTypingUser(data.username);
              } else {
                setTypingUsers((prev) =>
                  prev.filter((u) => u !== data.username)
                );
              }
            }
            break;

          case "error":
            console.error("WebSocket error:", data.message);
            toast({
              title: "Error en el chat",
              description: data.message,
              variant: "destructive",
            });
            break;
        }
      } catch (err) {
        console.error("Error parsing WS message:", err);
      }
    };

    ws.onerror = () => {
      console.error("❌ WebSocket error");
    };

    ws.onclose = async (event) => {
      setIsConnected(false);
      console.log("WebSocket cerrado. Code:", event.code);

      if (event.code === 4001) {
        // Token expired — refresh and reconnect
        const newToken = await refreshAccessToken();
        if (newToken) {
          reconnectAttemptsRef.current = 0;
          connect();
        }
        return;
      }

      if (event.code === 4003) {
        toast({
          title: "Sin acceso",
          description: "No tienes acceso a este canal",
          variant: "destructive",
        });
        return;
      }

      // Auto-reconnect with exponential backoff
      if (
        reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS &&
        event.code !== 1000
      ) {
        const delay =
          RECONNECT_BASE_DELAY * Math.pow(2, reconnectAttemptsRef.current);
        reconnectAttemptsRef.current++;
        console.log(
          `Reconectando en ${delay}ms (intento ${reconnectAttemptsRef.current})`
        );
        reconnectTimeoutRef.current = setTimeout(connect, delay);
      }
    };
  }, [
    channelId,
    enabled,
    getAccessToken,
    refreshAccessToken,
    queryClient,
    clearTypingUser,
  ]);

  // Connect/disconnect on mount/unmount
  useEffect(() => {
    connect();

    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      clearTimeout(typingTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounted");
        wsRef.current = null;
      }
    };
  }, [connect]);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ type: "typing", is_typing: isTyping })
      );

      if (isTyping) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({ type: "typing", is_typing: false })
            );
          }
        }, 1000);
      }
    }
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ type: "new_post", content })
        );
        // Also stop typing
        sendTyping(false);
      }
    },
    [sendTyping]
  );

  return { isConnected, canWrite, typingUsers, sendTyping, sendMessage };
};
