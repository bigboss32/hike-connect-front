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

export interface PackageQueryFilters {
  location?: string;
  price_min?: string;
  price_max?: string;
  min_people?: string;
  package_type?: string;
  available_date?: string;
  component_type?: string;
  component_name?: string;
}

const fetchPackages = async (page: number, token: string | null, filters?: PackageQueryFilters): Promise<PackagesResponse> => {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const params = new URLSearchParams({ page: String(page) });
  if (filters) {
    if (filters.location) params.set("location", filters.location);
    if (filters.price_min) params.set("price_min", filters.price_min);
    if (filters.price_max) params.set("price_max", filters.price_max);
    if (filters.min_people) params.set("min_people", filters.min_people);
    if (filters.package_type && filters.package_type !== "todos") params.set("package_type", filters.package_type);
    if (filters.available_date) params.set("available_date", filters.available_date);
    if (filters.component_type) params.set("component_type", filters.component_type);
    if (filters.component_name) params.set("component_name", filters.component_name);
  }

  const response = await fetch(`${API_BASE_URL}/hospedaje/packages/?${params.toString()}`, { headers });
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

export const useAdventurePackages = (filters?: PackageQueryFilters) => {
  const token = getStoredAccessToken();
  return useInfiniteQuery({
    queryKey: ["adventurePackages", filters],
    queryFn: ({ pageParam = 1 }) => fetchPackages(pageParam, token, filters),
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
