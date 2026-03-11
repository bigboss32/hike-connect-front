import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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

export interface Hospedaje {
  id: string;
  title: string;
  description: string;
  location: string;
  address: string;
  image: string;
  tipo: "hotel" | "cabaña" | "finca" | "ecolodge" | "camping" | "otro";
  company: string;
  phone: string;
  email: string;
  whatsapp: string;
  coordinates: { lat: number; lng: number };
  created_by: string;
  created_at: string;
  updated_at: string;
  base_price: string;
  requires_payment: boolean;
  max_guests: number;
  min_guests: number;
  max_guests_per_booking: number;
  check_in_time: string;
  check_out_time: string;
  requires_date_selection: boolean;
  is_active: boolean;
  available_days: string;
  frequency: string;
  custom_interval: number | null;
  specific_dates: string[] | null;
  amenities: string[];
  included_services: string;
  additional_services: Record<string, number> | null;
  policies: string;
  requirements: string;
  images: { id: string; image_url: string; caption: string; order: number }[];
}

interface HospedajesResponse {
  count: number;
  results: Hospedaje[];
}

interface FetchHospedajesParams {
  page?: number;
  tipo?: string;
  token?: string | null;
}

const fetchHospedajes = async ({ page = 1, tipo, token }: FetchHospedajesParams): Promise<HospedajesResponse & { page: number; page_size: number }> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  if (tipo && tipo !== "todos") {
    params.append("tipo", tipo);
  }

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/hospedaje/?${params.toString()}`, { headers });

  if (!response.ok) {
    throw new Error("Error al cargar los hospedajes");
  }

  const data = await response.json();
  return { ...data, page, page_size: 10 };
};

const fetchHospedajeById = async (id: string, token: string | null): Promise<Hospedaje> => {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/hospedaje/?id=${id}`, { headers });

  if (!response.ok) {
    throw new Error("Error al cargar el hospedaje");
  }

  return response.json();
};

export const useHospedajes = (tipo: string) => {
  const token = getStoredAccessToken();
  return useInfiniteQuery({
    queryKey: ["hospedajes", tipo],
    queryFn: ({ pageParam = 1 }) => fetchHospedajes({ page: pageParam, tipo, token }),
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.count / lastPage.page_size);
      if (lastPage.page < totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
};

export const useHospedajeById = (id: string | undefined) => {
  const token = getStoredAccessToken();
  return useQuery({
    queryKey: ["hospedaje", id],
    queryFn: () => fetchHospedajeById(id!, token),
    enabled: !!id,
  });
};
