import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";
const POLL_MS = 20000;
const SEEN_KEY = "booking_chat_seen_v1";

interface BookingLite {
  payment_id: string;
  ruta_title?: string;
}

type SeenMap = Record<string, string>; // payment_id -> ISO string of last seen message

const readSeen = (): SeenMap => {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "{}");
  } catch {
    return {};
  }
};

const writeSeen = (m: SeenMap) => {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(m));
  } catch {
    // ignore
  }
};

/**
 * Polls each booking chat for unread messages (not sent by me) and surfaces:
 *  - per-booking unread counts (badge)
 *  - toast notifications when new messages arrive
 *
 * "Unread" is computed locally as: messages whose created_at > last-seen timestamp
 * stored in localStorage and whose sender_id !== current user id.
 */
export const useUnreadBookingChats = (bookings: BookingLite[]) => {
  const { authFetch, user } = useAuth();
  const [unreadMap, setUnreadMap] = useState<Record<string, number>>({});
  const lastNotifiedRef = useRef<Record<string, string>>({}); // payment_id -> latest msg id we toasted
  const firstRunRef = useRef(true);

  const fetchUnread = useCallback(async () => {
    if (!user || bookings.length === 0) return;
    const seen = readSeen();
    const next: Record<string, number> = {};

    await Promise.all(
      bookings.map(async (b) => {
        try {
          const res = await authFetch(
            `${API_BASE_URL}/payments/${b.payment_id}/chat/?page=1&page_size=20`
          );
          if (!res.ok) return;
          const data = await res.json();
          const items: Array<{
            id: string;
            sender_id: string | number;
            message: string;
            sender_username: string;
            created_at: string;
          }> = data.results || data.data || [];

          const seenAt = seen[b.payment_id]
            ? new Date(seen[b.payment_id]).getTime()
            : 0;

          const incoming = items.filter(
            (m) =>
              String(m.sender_id) !== String(user.id) &&
              new Date(m.created_at).getTime() > seenAt
          );
          next[b.payment_id] = incoming.length;

          // Toast for the most recent new message (skip on first mount to avoid spam)
          if (!firstRunRef.current && incoming.length > 0) {
            const latest = incoming.reduce((acc, cur) =>
              new Date(cur.created_at).getTime() >
              new Date(acc.created_at).getTime()
                ? cur
                : acc
            );
            if (lastNotifiedRef.current[b.payment_id] !== latest.id) {
              lastNotifiedRef.current[b.payment_id] = latest.id;
              toast(`💬 ${latest.sender_username}`, {
                description:
                  (b.ruta_title ? `${b.ruta_title} · ` : "") +
                  (latest.message.length > 60
                    ? latest.message.slice(0, 60) + "…"
                    : latest.message),
                action: {
                  label: "Abrir",
                  onClick: () => {
                    window.location.href = `/booking-chat/${b.payment_id}`;
                  },
                },
              });
            }
          }
        } catch {
          // silent
        }
      })
    );

    setUnreadMap(next);
    firstRunRef.current = false;
  }, [authFetch, bookings, user]);

  useEffect(() => {
    fetchUnread();
    const id = setInterval(fetchUnread, POLL_MS);
    return () => clearInterval(id);
  }, [fetchUnread]);

  const markAsSeen = useCallback((paymentId: string) => {
    const seen = readSeen();
    seen[paymentId] = new Date().toISOString();
    writeSeen(seen);
    setUnreadMap((prev) => ({ ...prev, [paymentId]: 0 }));
  }, []);

  return { unreadMap, markAsSeen, refresh: fetchUnread };
};
