/* ---------------- SESSION TYPES ---------------- */

export interface Session {
  sessionId: string;
  createdAt: number;
  expiresAt: number;
}

export interface SessionResult {
  session: Session | null;
  authenticated: boolean;
}

/* ---------------- SESSION SERVICE ---------------- */

export interface SessionService {
  createSession(): Promise<Session>;

  restoreSession(): Promise<SessionResult>;

  validateSession(session: Session): Promise<boolean>;

  lockSession(session: Session): Promise<void>;

  destroySession(session: Session): Promise<void>;
}

/* ---------------- TEMPORARY SESSION STORAGE ---------------- */

/*
 * Development-only in-memory session.
 *
 * IMPORTANT:
 * This is deliberately NOT secure persistent storage.
 *
 * The Rust security core will eventually own:
 *
 * - session persistence
 * - session validation
 * - secure key access
 * - session expiration
 * - locking
 * - destruction
 */

let activeSession: Session | null = null;

const SESSION_DURATION = 1000 * 60 * 60;

/* ---------------- CREATE SESSION ---------------- */

async function createSession(): Promise<Session> {
  const now = Date.now();

  const session: Session = {
    sessionId: crypto.randomUUID(),
    createdAt: now,
    expiresAt: now + SESSION_DURATION,
  };

  activeSession = session;

  return session;
}

/* ---------------- RESTORE SESSION ---------------- */

async function restoreSession(): Promise<SessionResult> {
  /*
   * No session currently exists.
   */

  if (!activeSession) {
    return {
      session: null,
      authenticated: false,
    };
  }

  /*
   * A session exists, so validate it before restoring it.
   */

  const valid = await validateSession(activeSession);

  /*
   * Invalid or expired sessions must never be restored.
   */

  if (!valid) {
    activeSession = null;

    return {
      session: null,
      authenticated: false,
    };
  }

  /*
   * Session is valid.
   */

  return {
    session: activeSession,
    authenticated: true,
  };
}

/* ---------------- VALIDATE SESSION ---------------- */

async function validateSession(
  session: Session
): Promise<boolean> {
  /*
   * Basic session sanity check.
   */

  if (!session.sessionId) {
    return false;
  }

  /*
   * Check expiration.
   */

  if (Date.now() >= session.expiresAt) {
    return false;
  }

  /*
   * Ensure this is the currently active session.
   */

  return (
    activeSession?.sessionId === session.sessionId
  );
}

/* ---------------- LOCK SESSION ---------------- */

async function lockSession(
  session: Session
): Promise<void> {
  if (
    activeSession?.sessionId ===
    session.sessionId
  ) {
    /*
     * Temporary implementation.
     *
     * The Rust security core will eventually
     * perform the actual secure lock operation.
     */
  }
}

/* ---------------- DESTROY SESSION ---------------- */

async function destroySession(
  session: Session
): Promise<void> {
  if (
    activeSession?.sessionId ===
    session.sessionId
  ) {
    activeSession = null;
  }
}

/* ---------------- EXPORTED SERVICE ---------------- */

export const sessionService: SessionService = {
  createSession,
  restoreSession,
  validateSession,
  lockSession,
  destroySession,
};