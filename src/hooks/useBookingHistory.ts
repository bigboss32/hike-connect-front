import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

export interface BookingHistoryItem {
  payment_id: string;
  ruta_id: string;
  ruta_title: string;
  ruta_image: string;
  booking_date: string;
  total_participants: number;
  amount: string;
  status: string;
  created_at: string;
}

interface BookingHistoryResponse {
  results: BookingHistoryItem[];
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const useBookingHistory = (page = 1, pageSize = 10) => {
  const { authFetch, user } = useAuth();

  return useQuery<BookingHistoryResponse>({
    queryKey: ["booking-history", page, pageSize],
    queryFn: async () => {
      const res = await authFetch(
        `${API_BASE_URL}/payments/my-bookings/history/?page=${page}&page_size=${pageSize}`
      );
      if (!res.ok) throw new Error("Error al obtener historial");
      return res.json();
    },
    enabled: !!user,
  });
};
