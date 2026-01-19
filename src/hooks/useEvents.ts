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

interface FetchEventsParams {
  page?: number;
  search?: string;
  token?: string | null;
}

const fetchEvents = async ({ page = 1, search, token }: FetchEventsParams): Promise<EventsResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  
  if (search) {
    params.append("search", search);
  }

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/evento/?${params.toString()}`, {
    headers,
  });
  
  if (!response.ok) {
    throw new Error("Error al cargar los eventos");
  }
  
  return response.json();
};

const fetchEventById = async (id: string, token?: string | null): Promise<ApiEvent> => {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/evento/?id=${id}`, {
    headers,
  });
  
  if (!response.ok) {
    throw new Error("Error al cargar el evento");
  }
  
  return response.json();
};

export const useEvents = (search: string = "") => {
  const { getAccessToken } = useAuth();
  const token = getAccessToken();

  return useInfiniteQuery({
    queryKey: ["events", search, token],
    queryFn: ({ pageParam = 1 }) => fetchEvents({ page: pageParam, search, token }),
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
  const { getAccessToken } = useAuth();
  const token = getAccessToken();

  return useQuery({
    queryKey: ["event", id, token],
    queryFn: () => fetchEventById(id!, token),
    enabled: !!id && !!token,
  });
};
