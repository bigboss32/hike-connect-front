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

export interface HospedajeDayAvailability {
  date: string;
  weekday: number;
  is_day_available: boolean;
  booked_count: number;
  available_guests: number;
  is_available: boolean;
}

export interface HospedajeMonthAvailability {
  hospedaje_id: string;
  hospedaje_title: string;
  year: number;
  month: number;
  dates: HospedajeDayAvailability[];
}

const fetchMonthAvailability = async (
  hospedajeId: string,
  month: number,
  year: number,
  token: string | null
): Promise<HospedajeMonthAvailability> => {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}/hospedaje/${hospedajeId}/availability/month/?month=${month}&year=${year}`,
    { headers }
  );

  if (!response.ok) {
    throw new Error("Error al cargar la disponibilidad");
  }

  return response.json();
};

export const useHospedajeAvailability = (hospedajeId: string, month: number, year: number) => {
  const token = getStoredAccessToken();

  return useQuery({
    queryKey: ["hospedajeAvailability", hospedajeId, month, year],
    queryFn: () => fetchMonthAvailability(hospedajeId, month, year, token),
    enabled: !!hospedajeId && month >= 1 && month <= 12 && year > 0,
    staleTime: 0,
    refetchOnMount: "always",
  });
};
