import { useQuery } from "@tanstack/react-query";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

const getStoredAccessToken = (): string | null => {
  try {
    const tokens = localStorage.getItem("auth_tokens");
    if (tokens) {
      const parsed = JSON.parse(tokens);
      return parsed.access || null;
    }
  } catch {}
  return null;
};

export interface DayAvailability {
  date: string;
  weekday: number;
  is_day_available: boolean;
  max_capacity: number;
  booked_count: number;
  available_slots: number;
  is_available: boolean;
}

export interface MonthAvailability {
  ruta_id: string;
  ruta_title: string;
  year: number;
  month: number;
  days: DayAvailability[];
}

const fetchMonthAvailability = async (
  routeId: string,
  month: number,
  year: number,
  token: string | null
): Promise<MonthAvailability> => {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/rutas/${routeId}/availability/month/?month=${month}&year=${year}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Error al cargar la disponibilidad");
  }

  return response.json();
};

export const useRouteAvailability = (routeId: string, month: number, year: number) => {
  const token = getStoredAccessToken();

  return useQuery({
    queryKey: ["routeAvailability", routeId, month, year],
    queryFn: () => fetchMonthAvailability(routeId, month, year, token),
    enabled: !!routeId && month >= 1 && month <= 12 && year > 0,
    staleTime: 5 * 60 * 1000,
  });
};
