"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { login as apiLogin } from "@/lib/api";

interface AdminUser {
  token: string;
  admin_id: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const name = localStorage.getItem("admin_name");
    const role = localStorage.getItem("admin_role");
    const admin_id = localStorage.getItem("admin_id");
    if (token && name) {
      setUser({ token, admin_id: admin_id || "", name, role: role || "" });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user && pathname !== "/") {
      router.push("/");
    }
  }, [user, loading, pathname, router]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    localStorage.setItem("admin_token", res.token);
    localStorage.setItem("admin_name", res.name);
    localStorage.setItem("admin_role", res.role);
    localStorage.setItem("admin_id", res.admin_id);
    setUser(res);
    router.push("/dashboard");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_name");
    localStorage.removeItem("admin_role");
    localStorage.removeItem("admin_id");
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
