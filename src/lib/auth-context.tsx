"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  contact?: string | null;
  role?: string;
};

type AuthResult = {
  ok: boolean;
  message?: string;
};

type LoginPayload = {
  email: string;
  password: string;
  deviceName?: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  contact: string;
  password: string;
  passwordConfirmation: string;
  deviceName?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AuthResult>;
  register: (payload: RegisterPayload) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_ENDPOINT ?? "";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }, []);

  const fetchMe = useCallback(async (token: string): Promise<AuthUser | null> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json().catch(() => null);
    if (data?.user && typeof data.user === "object") {
      return data.user as AuthUser;
    }

    return null;
  }, []);

  const refresh = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const me = await fetchMe(token);

    if (!me) {
      setToken(null);
      setUser(null);
      setIsLoading(false);
      return;
    }

    setUser(me);
    setIsLoading(false);
  }, [fetchMe, setToken]);

  const login = useCallback(
    async ({ email, password, deviceName }: LoginPayload): Promise<AuthResult> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            device_name: deviceName ?? "web",
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          return {
            ok: false,
            message: getErrorMessage(data) ?? "로그인에 실패했습니다.",
          };
        }

        if (data?.token) {
          setToken(data.token as string);
        }

        if (data?.user) {
          setUser(data.user as AuthUser);
        } else if (data?.token) {
          await refresh();
        }

        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : "로그인에 실패했습니다.",
        };
      }
    },
    [refresh, setToken],
  );

  const register = useCallback(
    async ({ name, email, contact, password, passwordConfirmation, deviceName }: RegisterPayload): Promise<AuthResult> => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            contact,
            password,
            password_confirmation: passwordConfirmation,
            device_name: deviceName ?? "web",
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          return {
            ok: false,
            message: getErrorMessage(data) ?? "회원가입에 실패했습니다.",
          };
        }

        if (data?.token) {
          setToken(data.token as string);
        }

        if (data?.user) {
          setUser(data.user as AuthUser);
        } else if (data?.token) {
          await refresh();
        }

        return { ok: true };
      } catch (error) {
        return {
          ok: false,
          message: error instanceof Error ? error.message : "회원가입에 실패했습니다.",
        };
      }
    },
    [refresh, setToken],
  );

  const logout = useCallback(async () => {
    const token = localStorage.getItem("auth_token");
    setToken(null);
    setUser(null);

    if (!token) {
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      return;
    }
  }, [setToken]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const syncFromStorage = () => {
      void refresh();
    };

    window.addEventListener("storage", syncFromStorage);

    return () => {
      window.removeEventListener("storage", syncFromStorage);
    };
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      refresh,
    }),
    [user, isLoading, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

function getErrorMessage(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  if ("message" in data && typeof data.message === "string") {
    return data.message;
  }

  if ("errors" in data && data.errors && typeof data.errors === "object") {
    const errors = Object.values(data.errors as Record<string, string[]>).flat();
    if (errors.length > 0) {
      return errors[0];
    }
  }

  return null;
}
