import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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
}

const fetchEvents = async ({ page = 1, search }: FetchEventsParams): Promise<EventsResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  
  if (search) {
    params.append("search", search);
  }

  const response = await fetch(`${API_BASE_URL}/evento/?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error("Error al cargar los eventos");
  }
  
  return response.json();
};

const fetchEventById = async (id: string): Promise<ApiEvent> => {
  const response = await fetch(`${API_BASE_URL}/evento/?id=${id}`);
  
  if (!response.ok) {
    throw new Error("Error al cargar el evento");
  }
  
  return response.json();
};

export const useEvents = (search: string = "") => {
  return useInfiniteQuery({
    queryKey: ["events", search],
    queryFn: ({ pageParam = 1 }) => fetchEvents({ page: pageParam, search }),
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

export const useEventById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(id!),
    enabled: !!id,
  });
};
