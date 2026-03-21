import { useQuery } from "@tanstack/react-query";

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

export interface FilterOption {
  value: string;
  count: number;
  label?: string;
}

export interface PackageFiltersData {
  locations: FilterOption[];
  package_types: FilterOption[];
  component_types: FilterOption[];
  price_range: { min: string; max: string; currency: string };
  people_range: { min: number; max: number };
}

const fetchPackageFilters = async (token: string | null): Promise<PackageFiltersData> => {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}/hospedaje/packages/filters/`, { headers });
  if (!response.ok) throw new Error("Error al cargar filtros");
  return response.json();
};

export const usePackageFilters = () => {
  const token = getStoredAccessToken();
  return useQuery({
    queryKey: ["packageFilters"],
    queryFn: () => fetchPackageFilters(token),
    staleTime: 5 * 60 * 1000,
  });
};
