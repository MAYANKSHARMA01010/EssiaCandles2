import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "../lib/queryClient";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("GET", "/api/users/me");
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (err) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, isAuthenticated, isLoading, refetchUser: fetchUser };
};
