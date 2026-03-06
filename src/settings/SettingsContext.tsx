import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { SettingsContext } from './context';
import { DEFAULT_SETTINGS } from './settingsDefaults';
import type { AppSettings } from '../types/settings';

const STORAGE_KEY = 'prd_settings';

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        roleNames: { ...DEFAULT_SETTINGS.roleNames, ...(parsed.roleNames || {}) },
      };
    }
  } catch {
    /* ignore */
  }
  return { ...DEFAULT_SETTINGS };
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-primary', settings.brandColor);
  }, [settings.brandColor]);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        ...partial,
        roleNames: {
          ...prev.roleNames,
          ...(partial.roleNames || {}),
        },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    const defaults = { ...DEFAULT_SETTINGS };
    setSettings(defaults);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <SettingsContext value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext>
  );
}
