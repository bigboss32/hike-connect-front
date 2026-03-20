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
  package_id: string;
  date: string;
  weekday: number;
  is_day_available: boolean;
  is_available: boolean;
  booked_count: number;
  available_guests: number;
  max_people?: number;
}

const fetchPackageAvailability = async (
  packageId: string,
  date: string,
  token: string | null
): Promise<PackageDateAvailability> => {
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(
    `${API_BASE_URL}/hospedaje/packages/availability/?id=${packageId}&date=${date}`,
    { headers }
  );

  if (!response.ok) throw new Error("Error al consultar disponibilidad");
  return response.json();
};

export const usePackageAvailability = (packageId: string | undefined, date: string | undefined) => {
  const token = getStoredAccessToken();
  return useQuery({
    queryKey: ["packageAvailability", packageId, date],
    queryFn: () => fetchPackageAvailability(packageId!, date!, token),
    enabled: !!packageId && !!date,
    staleTime: 0,
    refetchOnMount: "always",
  });
};
