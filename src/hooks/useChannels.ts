import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

export interface ApiChannel {
  id: string;
  name: string;
  description: string;
  is_info: boolean;
  is_read_only: boolean;
  created_at: string;
  post_count: number;
}

export const useChannels = (comunidadId: string | undefined) => {
  const { authFetch } = useAuth();

  return useQuery({
    queryKey: ["channels", comunidadId],
    queryFn: async (): Promise<ApiChannel[]> => {
      const response = await authFetch(
        `${API_BASE_URL}/comunidad-canal/?comunidad_id=${comunidadId}`
      );

      if (!response.ok) {
        throw new Error("Error al cargar canales");
      }

      return response.json();
    },
    enabled: !!comunidadId,
  });
};
