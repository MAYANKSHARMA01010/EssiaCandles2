// client/src/context/auth-context.tsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiRequest } from "../lib/queryClient";

// Create a proper AuthContext shape
const AuthContext = createContext<{
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetchUser: () => Promise<void>;
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Used by login/logout to force refetch user
  const refetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest("GET", "/api/users/me");
      setUser(response.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchUser(); // Initial fetch
  }, [refetchUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
