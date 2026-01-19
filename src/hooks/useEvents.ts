import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

export interface ApiEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  max_participants: number;
  participants_count: number;
  organized_by: string;
  meeting_point: {
    lat: number;
    lng: number;
  };
  description?: string;
}

interface EventsResponse {
  count: number;
  page: number;
  page_size: number;
  results: ApiEvent[];
}

export const useEvents = (search: string = "") => {
  const { authFetch, getAccessToken } = useAuth();
  const token = getAccessToken();

  return useInfiniteQuery({
    queryKey: ["events", search, token],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.append("page", pageParam.toString());
      
      if (search) {
        params.append("search", search);
      }

      const response = await authFetch(`${API_BASE_URL}/evento/?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error("Error al cargar los eventos");
      }
      
      return response.json() as Promise<EventsResponse>;
    },
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.count / lastPage.page_size);
      if (lastPage.page < totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!token,
  });
};

export const useEventById = (id: string | undefined) => {
  const { authFetch, getAccessToken } = useAuth();
  const token = getAccessToken();

  return useQuery({
    queryKey: ["event", id, token],
    queryFn: async () => {
      const response = await authFetch(`${API_BASE_URL}/evento/?id=${id}`);
      
      if (!response.ok) {
        throw new Error("Error al cargar el evento");
      }
      
      return response.json() as Promise<ApiEvent>;
    },
    enabled: !!id && !!token,
  });
};
