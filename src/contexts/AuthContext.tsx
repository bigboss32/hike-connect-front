import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_BASE_URL = "https://hike-connect-back.onrender.com/api/v1";

interface User {
  id: number;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  bio?: string;
  avatar?: string | null;
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  register: (email: string, password: string, passwordConfirm: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => void;
  getAccessToken: () => string | null;
  refreshAccessToken: () => Promise<string | null>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
  fetchProfile: () => Promise<{ success: boolean; error?: string }>;
  updateProfile: (data: { first_name?: string; last_name?: string; bio?: string }) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: (email: string, code: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  resendVerification: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  verifyPasswordReset: (email: string, code: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  confirmPasswordReset: (email: string, code: string, password: string, passwordConfirm: string) => Promise<{ success: boolean; error?: string; message?: string }>;
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
      
      const authTokens: AuthTokens = {
        access: data.access,
        refresh: data.refresh,
      };

      setTokens(authTokens);
      localStorage.setItem("auth_tokens", JSON.stringify(authTokens));

      // Fetch user profile with the new token
      const profileRes = await fetch(`${API_BASE_URL}/profile/`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${data.access}` },
      });

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        const userData: User = {
          id: profileData.id,
          email: profileData.email,
          name: profileData.full_name || `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim() || email.split("@")[0],
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          bio: profileData.bio,
          avatar: profileData.avatar,
        };
        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));
      } else {
        // Fallback: use email as name if profile fetch fails
        const userData: User = { id: 0, email, name: email.split("@")[0] };
        setUser(userData);
        localStorage.setItem("auth_user", JSON.stringify(userData));
      }
      
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

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      if (!tokens?.refresh) {
        logout();
        return null;
      }

      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: tokens.refresh }),
      });

      if (!response.ok) {
        logout();
        return null;
      }

      const data = await response.json();
      const newTokens: AuthTokens = {
        access: data.access,
        refresh: tokens.refresh,
      };

      setTokens(newTokens);
      localStorage.setItem("auth_tokens", JSON.stringify(newTokens));
      
      return data.access;
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return null;
    }
  };

  const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    let accessToken = tokens?.access;

    const makeRequest = async (token: string | null) => {
      const headers = new Headers(options.headers);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return fetch(url, { ...options, headers });
    };

    let response = await makeRequest(accessToken);

    // If unauthorized, try to refresh token
    if (response.status === 401 && tokens?.refresh) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        response = await makeRequest(newToken);
      }
    }

    return response;
  };

  const fetchProfile = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!tokens?.access) {
        return { success: false, error: "No hay sesión activa" };
      }

      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${tokens.access}`,
        },
      });

      if (!response.ok) {
        return { success: false, error: "Error al obtener el perfil" };
      }

      const data = await response.json();
      
      const userData: User = {
        id: data.id,
        email: data.email,
        name: data.full_name || `${data.first_name} ${data.last_name}`,
        first_name: data.first_name,
        last_name: data.last_name,
        bio: data.bio,
        avatar: data.avatar,
      };

      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error("Fetch profile error:", error);
      return { success: false, error: "Error de conexión" };
    }
  };

  const updateProfile = async (data: { first_name?: string; last_name?: string; bio?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!tokens?.access) {
        return { success: false, error: "No hay sesión activa" };
      }

      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokens.access}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        return { success: false, error: "Error al actualizar el perfil" };
      }

      const responseData = await response.json();
      
      const userData: User = {
        id: responseData.id,
        email: responseData.email,
        name: responseData.full_name || `${responseData.first_name} ${responseData.last_name}`,
        first_name: responseData.first_name,
        last_name: responseData.last_name,
        bio: responseData.bio,
        avatar: responseData.avatar,
      };

      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      
      return { success: true };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, error: "Error de conexión" };
    }
  };

  const verifyEmail = async (email: string, code: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-email/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { success: false, error: data.detail || data.message || data.error || "Código inválido o expirado" };
      }
      return { success: true, message: data.detail || data.message || "Correo verificado correctamente" };
    } catch (error) {
      return { success: false, error: "Error de conexión. Intenta de nuevo." };
    }
  };

  const resendVerification = async (email: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/resend-verification/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { success: false, error: data.detail || data.message || data.error || "No se pudo reenviar el código" };
      }
      return { success: true, message: data.detail || data.message || "Código reenviado" };
    } catch (error) {
      return { success: false, error: "Error de conexión. Intenta de nuevo." };
    }
  };

  const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/password-reset/request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { success: false, error: data.detail || data.message || data.error || "Error al solicitar recuperación" };
      }
      return { success: true, message: data.detail || data.message || "Código enviado a tu correo" };
    } catch (error) {
      return { success: false, error: "Error de conexión. Intenta de nuevo." };
    }
  };

  const verifyPasswordReset = async (email: string, code: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/password-reset/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { success: false, error: data.detail || data.message || data.error || "Código inválido" };
      }
      return { success: true, message: data.detail || data.message || "Código verificado" };
    } catch (error) {
      return { success: false, error: "Error de conexión. Intenta de nuevo." };
    }
  };

  const confirmPasswordReset = async (email: string, code: string, password: string, passwordConfirm: string): Promise<{ success: boolean; error?: string; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/password-reset/confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password, password_confirm: passwordConfirm }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        return { success: false, error: data.detail || data.message || data.error || "Error al actualizar contraseña" };
      }
      return { success: true, message: data.detail || data.message || "Contraseña actualizada correctamente" };
    } catch (error) {
      return { success: false, error: "Error de conexión. Intenta de nuevo." };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, isLoading, login, register, logout, getAccessToken, refreshAccessToken, authFetch, fetchProfile, updateProfile,
      verifyEmail, resendVerification, requestPasswordReset, verifyPasswordReset, confirmPasswordReset
    }}>
      {children}
    </AuthContext.Provider>
  );
};
