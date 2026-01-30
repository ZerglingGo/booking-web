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

function getXsrfToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const token = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("XSRF-TOKEN="));

  if (!token) {
    return null;
  }

  return decodeURIComponent(token.replace("XSRF-TOKEN=", ""));
}

type AuthProviderProps = {
  children: React.ReactNode;
  initialHasToken?: boolean;
};

export function AuthProvider({ children, initialHasToken = false }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(initialHasToken));
  const [hasSession, setHasSession] = useState(() => Boolean(initialHasToken));

  const fetchMe = useCallback(async (): Promise<AuthUser | null> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
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
    setIsLoading(true);
    const me = await fetchMe();

    if (!me) {
      setUser(null);
      setHasSession(false);
      setIsLoading(false);
      return;
    }

    setUser(me);
    setHasSession(true);
    setIsLoading(false);
  }, [fetchMe]);

  const login = useCallback(
    async ({ email, password, deviceName }: LoginPayload): Promise<AuthResult> => {
      try {
        await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
          credentials: "include",
        });

        const xsrfToken = getXsrfToken();

        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
          },
          credentials: "include",
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

        if (data?.user) {
          setUser(data.user as AuthUser);
          setHasSession(true);
        } else {
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
    [refresh],
  );

  const register = useCallback(
    async ({ name, email, contact, password, passwordConfirmation, deviceName }: RegisterPayload): Promise<AuthResult> => {
      try {
        await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
          credentials: "include",
        });

        const xsrfToken = getXsrfToken();

        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
          },
          credentials: "include",
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

        if (data?.user) {
          setUser(data.user as AuthUser);
          setHasSession(true);
        } else {
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
    [refresh],
  );

  const logout = useCallback(async () => {
    setUser(null);
    setHasSession(false);

    try {
      const xsrfToken = getXsrfToken();

      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
        },
      });
    } catch {
      return;
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user) || hasSession,
      isLoading,
      login,
      register,
      logout,
      refresh,
    }),
    [user, hasSession, isLoading, login, register, logout, refresh],
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
