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

export interface PackageDateAvailability {
  date: string;
  weekday: number;
  is_day_available: boolean;
  booked_count: number;
  available_guests: number;
  is_available: boolean;
}

export interface PackageMonthAvailability {
  package_id: string;
  package_title: string;
  year: number;
  month: number;
  dates: PackageDateAvailability[];
}

const fetchPackageMonthAvailability = async (
  packageId: string,
  month: number,
  year: number,
  token: string | null
): Promise<PackageMonthAvailability> => {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(
    `${API_BASE_URL}/hospedaje/packages/availability/month/?id=${packageId}&month=${month}&year=${year}`,
    { headers }
  );

  if (!response.ok) throw new Error("Error al consultar disponibilidad mensual");
  return response.json();
};

export const usePackageMonthAvailability = (
  packageId: string | undefined,
  month: number,
  year: number
) => {
  const token = getStoredAccessToken();
  return useQuery({
    queryKey: ["packageMonthAvailability", packageId, month, year],
    queryFn: () => fetchPackageMonthAvailability(packageId!, month, year, token),
    enabled: !!packageId,
    staleTime: 60_000,
  });
};
