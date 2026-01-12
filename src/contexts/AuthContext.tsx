import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

interface User {
  id: number;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, passwordConfirm: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("auth_user");
    const storedTokens = localStorage.getItem("auth_tokens");
    
    if (storedUser && storedTokens) {
      setUser(JSON.parse(storedUser));
      setTokens(JSON.parse(storedTokens));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.detail || errorData.message || "Correo o contraseña incorrectos" 
        };
      }

      const data = await response.json();
      
      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.full_name || data.user.first_name || data.user.email.split("@")[0],
        first_name: data.user.first_name,
        last_name: data.user.last_name,
      };

      const authTokens: AuthTokens = {
        access: data.access,
        refresh: data.refresh,
      };

      setUser(userData);
      setTokens(authTokens);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      localStorage.setItem("auth_tokens", JSON.stringify(authTokens));
      
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Error de conexión. Intenta de nuevo." };
    }
  };

  const register = async (
    email: string, 
    password: string, 
    passwordConfirm: string,
    firstName: string, 
    lastName: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password,
          password_confirm: passwordConfirm,
          first_name: firstName,
          last_name: lastName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { 
          success: false, 
          error: errorData.detail || errorData.message || "Error al registrar. Intenta de nuevo." 
        };
      }

      // If registration returns tokens, use them; otherwise prompt login
      const data = await response.json();
      
      if (data.access && data.user) {
        const userData: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.full_name || name,
          first_name: data.user.first_name,
          last_name: data.user.last_name,
        };

        const authTokens: AuthTokens = {
          access: data.access,
          refresh: data.refresh,
        };

        setUser(userData);
        setTokens(authTokens);
        localStorage.setItem("auth_user", JSON.stringify(userData));
        localStorage.setItem("auth_tokens", JSON.stringify(authTokens));
      }
      
      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: "Error de conexión. Intenta de nuevo." };
    }
  };

  const logout = async () => {
    try {
      if (tokens?.refresh) {
        await fetch(`${API_BASE_URL}/logout/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokens.access}`,
          },
          body: JSON.stringify({ refresh: tokens.refresh }),
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setTokens(null);
      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_tokens");
    }
  };

  const getAccessToken = () => {
    return tokens?.access || null;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, getAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
