import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

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
}

export interface RouteRating {
  score: number | null;
  rating_avg: number | null;
  rating_count: number;
}

const fetchRoutes = async ({ page = 1, category, type, search }: FetchRoutesParams): Promise<RoutesResponse> => {
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

  const response = await fetch(`${API_BASE_URL}/rutas/?${params.toString()}`);
  
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
  return useInfiniteQuery({
    queryKey: ["routes", category, type, search],
    queryFn: ({ pageParam = 1 }) => fetchRoutes({ page: pageParam, category, type, search }),
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
