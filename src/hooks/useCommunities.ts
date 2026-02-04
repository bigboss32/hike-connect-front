import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

export interface ApiCommunity {
  id: string;
  name: string;
  description: string;
  image: string | null;
  company: string | null;
  location: string;
  is_public: boolean;
  created_at: string;
  member_count: number;
  user_is_member: boolean;
}

export interface CommunitiesResponse {
  count: number;
  page: number;
  page_size: number;
  results: ApiCommunity[];
}

export interface FetchCommunitiesParams {
  page?: number;
  is_public?: boolean;
}

export const useCommunities = (params: FetchCommunitiesParams = {}) => {
  const { authFetch } = useAuth();

  return useQuery({
    queryKey: ["communities", params],
    queryFn: async (): Promise<CommunitiesResponse> => {
      const queryParams = new URLSearchParams();
      
      if (params.page) {
        queryParams.append("page", params.page.toString());
      }
      if (params.is_public !== undefined) {
        queryParams.append("is_public", params.is_public.toString());
      }

      const queryString = queryParams.toString();
      const url = `${API_BASE_URL}/comunidad/${queryString ? `?${queryString}` : ""}`;

      const response = await authFetch(url);

      if (!response.ok) {
        throw new Error("Error al cargar comunidades");
      }

      return response.json();
    },
  });
};

export const useCommunityById = (id: string | undefined) => {
  const { authFetch } = useAuth();

  return useQuery({
    queryKey: ["community", id],
    queryFn: async (): Promise<ApiCommunity> => {
      const response = await authFetch(`${API_BASE_URL}/comunidad/?id=${id}`);

      if (!response.ok) {
        throw new Error("Error al cargar la comunidad");
      }

      return response.json();
    },
    enabled: !!id,
  });
};

export const useJoinCommunity = () => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comunidadId: string) => {
      const response = await authFetch(`${API_BASE_URL}/comunidad-member/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comunidad_id: comunidadId }),
      });

      if (!response.ok) {
        throw new Error("Error al unirse a la comunidad");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast({
        title: "¡Te has unido!",
        description: "Ahora eres miembro de esta comunidad",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo unir a la comunidad",
        variant: "destructive",
      });
    },
  });
};

export const useLeaveCommunity = () => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (comunidadId: string) => {
      const response = await authFetch(`${API_BASE_URL}/comunidad-member/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comunidad_id: comunidadId }),
      });

      if (!response.ok) {
        throw new Error("Error al salir de la comunidad");
      }

      // 204 No Content - successful deletion
      if (response.status === 204) {
        return { success: true };
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["communities"] });
      toast({
        title: "Has salido de la comunidad",
        description: "Ya no eres miembro de esta comunidad",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo salir de la comunidad",
        variant: "destructive",
      });
    },
  });
};
