import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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

interface JoinEventResponse {
  detail: string;
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

export const useJoinEvent = () => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string): Promise<JoinEventResponse> => {
      const response = await authFetch(`${API_BASE_URL}/evento-inscripcion/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event_id: eventId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Error al inscribirse al evento");
      }

      return response.json();
    },
    onSuccess: (data, eventId) => {
      toast.success(data.detail || "¡Inscripción exitosa!");
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
