import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

export interface CommunityMember {
  id: string;
  comunidad_id: string;
  user_id: number;
  user_name: string;
  user_image: string | null;
  role: "owner" | "admin" | "moderator" | "member";
  joined_at: string;
}

export interface CommunityMembersResponse {
  count: number;
  results: CommunityMember[];
}

export interface UserCommunityStats {
  total_communities: number;
}

export const useCommunityMembers = (comunidadId: string | undefined) => {
  const { authFetch } = useAuth();

  return useQuery({
    queryKey: ["community-members", comunidadId],
    queryFn: async (): Promise<CommunityMembersResponse> => {
      const response = await authFetch(
        `${API_BASE_URL}/comunidad-member/?comunidad_id=${comunidadId}`
      );

      if (!response.ok) {
        throw new Error("Error al cargar los miembros");
      }

      return response.json();
    },
    enabled: !!comunidadId,
  });
};

export const useUserCommunityStats = () => {
  const { authFetch } = useAuth();

  return useQuery({
    queryKey: ["user-community-stats"],
    queryFn: async (): Promise<UserCommunityStats> => {
      const response = await authFetch(
        `${API_BASE_URL}/comunidad-member/?stats=true`
      );

      if (!response.ok) {
        throw new Error("Error al cargar estadísticas");
      }

      return response.json();
    },
  });
};
