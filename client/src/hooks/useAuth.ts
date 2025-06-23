import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export function useAuth() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  return {
    user: data?.user as User | undefined,
    isLoading,
    isAuthenticated: !!data?.user,
    error,
  };
}