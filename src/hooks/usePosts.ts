import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

export interface ApiPost {
  id: string;
  content: string;
  created_at: string;
  author_name: string;
  author_image: string | null;
}

export interface PostsResponse {
  count: number;
  page: number;
  page_size: number;
  results: ApiPost[];
}

export interface FetchPostsParams {
  canalId: string | undefined;
  page?: number;
  pageSize?: number;
}

export const usePosts = (params: FetchPostsParams) => {
  const { authFetch } = useAuth();

  return useQuery({
    queryKey: ["posts", params.canalId, params.page],
    queryFn: async (): Promise<PostsResponse> => {
      const queryParams = new URLSearchParams();
      queryParams.append("canal_id", params.canalId!);
      
      if (params.page) {
        queryParams.append("page", params.page.toString());
      }
      if (params.pageSize) {
        queryParams.append("page_size", params.pageSize.toString());
      }

      const response = await authFetch(
        `${API_BASE_URL}/comunidad-post/?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Error al cargar posts");
      }

      return response.json();
    },
    enabled: !!params.canalId,
  });
};

export interface CreatePostData {
  comunidad_id: string;
  canal_id: string;
  content: string;
}

export const useCreatePost = () => {
  const { authFetch } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData): Promise<ApiPost> => {
      const response = await authFetch(`${API_BASE_URL}/comunidad-post/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al crear el post");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["posts", variables.canal_id] });
      toast({
        title: "¡Publicado!",
        description: "Tu mensaje se ha publicado correctamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo publicar el mensaje",
        variant: "destructive",
      });
    },
  });
};
