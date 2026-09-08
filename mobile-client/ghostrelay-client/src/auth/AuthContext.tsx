import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  sessionService,
  type Session,
} from "./session";

/* ---------------- AUTH STATE ---------------- */

export type AuthStatus =
  | "loading"
  | "unauthenticated"
  | "authenticated"
  | "locked";

export interface AuthState {
  status: AuthStatus;
}

/* ---------------- CONTEXT ---------------- */

interface AuthContextValue {
  status: AuthStatus;

  session: Session | null;

  isAuthenticated: boolean;
  isLocked: boolean;

  createSession: () => Promise<void>;
  restoreSession: () => Promise<void>;
  lockSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

/* ---------------- PROVIDER ---------------- */

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [status, setStatus] =
    useState<AuthStatus>("loading");

  const [session, setSession] =
    useState<Session | null>(null);

  /* ---------------- CREATE SESSION ---------------- */

  async function createSession() {
    console.log("AUTH: createSession() START");
  
    const newSession =
      await sessionService.createSession();
  
    console.log("AUTH: session created:", newSession);
  
    setSession(newSession);
    setStatus("authenticated");
  
    console.log("AUTH: status set to authenticated");
  }

  /* ---------------- RESTORE SESSION ---------------- */

  async function restoreSession() {
    try {
      setStatus("loading");

      const result =
        await sessionService.restoreSession();

      if (
        result.authenticated &&
        result.session
      ) {
        setSession(result.session);
        setStatus("authenticated");

        return;
      }

      setSession(null);
      setStatus("unauthenticated");
    } catch (error) {
      console.error(
        "Session restoration failed:",
        error
      );

      setSession(null);
      setStatus("unauthenticated");
    }
  }

  /* ---------------- LOCK SESSION ---------------- */

  async function lockSession() {
    if (!session) {
      return;
    }

    await sessionService.lockSession(session);

    setStatus("locked");
  }

  /* ---------------- LOGOUT ---------------- */

  async function logout() {
    if (session) {
      await sessionService.destroySession(
        session
      );
    }

    setSession(null);
    setStatus("unauthenticated");
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      status,

      session,

      isAuthenticated:
        status === "authenticated",

      isLocked:
        status === "locked",

      createSession,
      restoreSession,
      lockSession,
      logout,
    }),
    [status, session]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/* ---------------- HOOK ---------------- */

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}