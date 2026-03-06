import { useState, useCallback } from 'react';
import type { PrdSession, RoleId } from '../types/session';

const SESSION_PREFIX = 'prd_sess_';
const INDEX_KEY = 'prd_sessions_index';

function genCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)],
  ).join('');
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function loadIndex(): string[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveIndex(ids: string[]) {
  try {
    localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

function loadSession(id: string): PrdSession | null {
  try {
    const raw = localStorage.getItem(SESSION_PREFIX + id);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(session: PrdSession) {
  try {
    localStorage.setItem(SESSION_PREFIX + session.id, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function useSessions() {
  const [sessions, setSessions] = useState<PrdSession[]>(() => {
    const ids = loadIndex();
    return ids.map(loadSession).filter((s): s is PrdSession => s !== null);
  });

  const [activeSession, setActiveSession] = useState<PrdSession | null>(null);

  const createSession = useCallback((): PrdSession => {
    const now = new Date().toISOString();
    const session: PrdSession = {
      id: genId(),
      code: genCode(),
      productName: '',
      contributions: {},
      complianceData: { answers: {}, frameworks: [] },
      createdAt: now,
      updatedAt: now,
    };
    persistSession(session);
    setSessions((prev) => {
      const next = [session, ...prev];
      saveIndex(next.map((s) => s.id));
      return next;
    });
    setActiveSession(session);
    return session;
  }, []);

  const updateSession = useCallback(
    (id: string, updates: Partial<PrdSession>) => {
      const apply = (s: PrdSession): PrdSession => ({
        ...s,
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      setSessions((prev) => {
        const next = prev.map((s) => (s.id === id ? apply(s) : s));
        const updated = next.find((s) => s.id === id);
        if (updated) persistSession(updated);
        return next;
      });
      setActiveSession((prev) => (prev?.id === id ? apply(prev) : prev));
    },
    [],
  );

  const saveContribution = useCallback(
    (
      sessionId: string,
      role: RoleId,
      answers: Record<string, string | string[]>,
    ) => {
      setSessions((prev) => {
        const next = prev.map((s) => {
          if (s.id !== sessionId) return s;
          const updated: PrdSession = {
            ...s,
            contributions: { ...s.contributions, [role]: answers },
            productName:
              (typeof answers.name === 'string' && answers.name) ||
              s.productName,
            updatedAt: new Date().toISOString(),
          };
          persistSession(updated);
          return updated;
        });
        return next;
      });
      setActiveSession((prev) => {
        if (prev?.id !== sessionId) return prev;
        const updated: PrdSession = {
          ...prev,
          contributions: { ...prev.contributions, [role]: answers },
          productName:
            (typeof answers.name === 'string' && answers.name) ||
            prev.productName,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      });
    },
    [],
  );

  const deleteSession = useCallback((id: string) => {
    try {
      localStorage.removeItem(SESSION_PREFIX + id);
    } catch {
      /* ignore */
    }
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveIndex(next.map((s) => s.id));
      return next;
    });
    setActiveSession((prev) => (prev?.id === id ? null : prev));
  }, []);

  const findByCode = useCallback(
    (code: string): PrdSession | null => {
      return sessions.find((s) => s.code === code) || null;
    },
    [sessions],
  );

  const openSession = useCallback(
    (id: string) => {
      const s = sessions.find((s) => s.id === id) || loadSession(id);
      setActiveSession(s);
    },
    [sessions],
  );

  return {
    sessions,
    activeSession,
    setActiveSession,
    createSession,
    updateSession,
    saveContribution,
    deleteSession,
    findByCode,
    openSession,
  };
}
