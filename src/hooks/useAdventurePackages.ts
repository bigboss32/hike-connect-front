import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

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

export interface PackageActivity {
  code: string;
  name: string;
}

export interface PackageComponent {
  tipo: string;
  nombre: string;
  cantidad: number;
  imagen?: string;
}

export interface AdventurePackage {
  id: string;
  hospedaje_id: string | null;
  created_by: string;
  title: string;
  description: string;
  location: string;
  address: string;
  coordinates: { lat: number; lng: number };
  package_type: string;
  pricing_mode: string;
  base_price: string;
  currency: string;
  min_people: number;
  max_people: number;
  includes_stay: boolean;
  includes_breakfast: boolean;
  includes_lunch: boolean;
  includes_dinner: boolean;
  activities: PackageActivity[];
  components: PackageComponent[];
  pricing_rules: Record<string, number> | null;
  booking_rules: Record<string, number> | null;
  available_days: string;
  frequency: string;
  custom_interval: number | null;
  specific_dates: string[] | null;
  requires_date_selection: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface PackagesResponse {
  count: number;
  page: number;
  page_size: number;
  results: AdventurePackage[];
}

const fetchPackages = async (page: number, token: string | null): Promise<PackagesResponse> => {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/hospedaje/packages/?page=${page}`, { headers });
  if (!response.ok) throw new Error("Error al cargar los paquetes de aventura");
  const data = await response.json();
  return { ...data, page };
};

const fetchPackageById = async (id: string, token: string | null): Promise<AdventurePackage> => {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/hospedaje/packages/?id=${id}`, { headers });
  if (!response.ok) throw new Error("Error al cargar el paquete");
  return response.json();
};

export const useAdventurePackages = () => {
  const token = getStoredAccessToken();
  return useInfiniteQuery({
    queryKey: ["adventurePackages"],
    queryFn: ({ pageParam = 1 }) => fetchPackages(pageParam, token),
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.count / lastPage.page_size);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useAdventurePackageById = (id: string | undefined) => {
  const token = getStoredAccessToken();
  return useQuery({
    queryKey: ["adventurePackage", id],
    queryFn: () => fetchPackageById(id!, token),
    enabled: !!id,
  });
};
