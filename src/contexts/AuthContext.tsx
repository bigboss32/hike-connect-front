import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
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

// Test user credentials
const TEST_USER = {
  id: "test-user-123",
  email: "demo@senderoconnect.com",
  password: "demo123",
  name: "Usuario Demo",
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize test user if not exists
    const users = JSON.parse(localStorage.getItem("registered_users") || "[]");
    if (!users.some((u: any) => u.email === TEST_USER.email)) {
      users.push(TEST_USER);
      localStorage.setItem("registered_users", JSON.stringify(users));
    }

    // Check for existing session
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate login - in real app this would call backend API
    const users = JSON.parse(localStorage.getItem("registered_users") || "[]");
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      return { success: true };
    }
    
    return { success: false, error: "Correo o contraseña incorrectos" };
  };

  const register = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate registration - in real app this would call backend API
    const users = JSON.parse(localStorage.getItem("registered_users") || "[]");
    
    if (users.some((u: any) => u.email === email)) {
      return { success: false, error: "Este correo ya está registrado" };
    }
    
    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
    };
    
    users.push(newUser);
    localStorage.setItem("registered_users", JSON.stringify(users));
    
    const userData = { id: newUser.id, email: newUser.email, name: newUser.name };
    setUser(userData);
    localStorage.setItem("auth_user", JSON.stringify(userData));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
