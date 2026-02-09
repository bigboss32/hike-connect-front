import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

export interface ApiRoute {
  id: string;
  title: string;
  location: string;
  distance: string;
  duration: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  image: string;
  type: "pública" | "privada" | "agroturismo";
  category: "senderismo" | "agroturismo";
  description: string;
  company?: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  coordinates: { lat: number; lng: number };
  created_at: string;
  updated_at: string;
  rating_avg?: number | null;
  rating_count?: number;
}

interface RoutesResponse {
  count: number;
  page: number;
  page_size: number;
  results: ApiRoute[];
}

interface FetchRoutesParams {
  page?: number;
  category?: string;
  type?: string;
  search?: string;
  token?: string | null;
}

export interface RouteRating {
  score: number | null;
  rating_avg: number | null;
  rating_count: number;
}

export interface BannerRoute {
  id: string;
  title: string;
  image: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  category: string;
  location: string;
  distance: string;
  duration: string;
  rating_avg: number | null;
  rating_count: number;
}

const fetchBannerRoutes = async (token: string | null): Promise<BannerRoute[]> => {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/ruta-banner/`, { headers });
  
  if (!response.ok) {
    throw new Error("Error al cargar las rutas destacadas");
  }
  
  return response.json();
};

const fetchRoutes = async ({ page = 1, category, type, search, token }: FetchRoutesParams): Promise<RoutesResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  
  if (category && category !== "todas") {
    params.append("category", category);
  }
  
  if (type && type !== "todas") {
    if (type === "públicas") {
      params.append("type", "pública");
    } else if (type === "premium") {
      params.append("type", "privada");
    }
  }
  
  if (search) {
    params.append("search", search);
  }

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/rutas/?${params.toString()}`, { headers });
  
  if (!response.ok) {
    throw new Error("Error al cargar las rutas");
  }
  
  return response.json();
};

const fetchRouteById = async (id: string): Promise<ApiRoute> => {
  const response = await fetch(`${API_BASE_URL}/rutas/?id=${id}`);
  
  if (!response.ok) {
    throw new Error("Error al cargar la ruta");
  }
  
  return response.json();
};

export const useRoutes = (category: string, type: string, search: string) => {
  const token = getStoredAccessToken();
  return useInfiniteQuery({
    queryKey: ["routes", category, type, search],
    queryFn: ({ pageParam = 1 }) => fetchRoutes({ page: pageParam, category, type, search, token }),
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

export const useRouteById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["route", id],
    queryFn: () => fetchRouteById(id!),
    enabled: !!id,
  });
};

export const useBannerRoutes = () => {
  const token = getStoredAccessToken();
  return useQuery({
    queryKey: ["bannerRoutes"],
    queryFn: () => fetchBannerRoutes(token),
  });
};

export const useRouteRating = (routeId: string | undefined) => {
  const { getAccessToken } = useAuth();
  const token = getAccessToken();

  return useQuery({
    queryKey: ["routeRating", routeId, !!token],
    queryFn: async (): Promise<RouteRating> => {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/rate-routes/?ruta_id=${routeId}`, {
        headers,
      });
      
      if (!response.ok) {
        throw new Error("Error al cargar la calificación");
      }
      
      return response.json();
    },
    enabled: !!routeId,
  });
};

interface RateRouteResponse {
  detail: string;
  created: boolean;
  ruta_id: string;
  score: number;
}

export const useRateRoute = () => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ routeId, score }: { routeId: string; score: number }): Promise<RateRouteResponse> => {
      const response = await authFetch(`${API_BASE_URL}/rate-routes/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ruta_id: routeId, score }),
      });

      if (!response.ok) {
        throw new Error("Error al calificar la ruta");
      }

      return response.json();
    },
    onSuccess: (data) => {
      const message = data.created 
        ? "¡Gracias por tu calificación!" 
        : "Calificación actualizada";
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["routeRating", data.ruta_id] });
    },
    onError: () => {
      toast.error("Error al calificar la ruta");
    },
  });
};
