import { useState, useEffect } from 'react';
import { getSiteSettings } from '../services/api';

/**
 * Shared hook to fetch and cache site settings.
 * Uses a module-level cache so only one network request is made
 * across all components using this hook during a session.
 */
let cachedSettings = null;
let fetchPromise = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState(cachedSettings);
  const [loading, setLoading] = useState(!cachedSettings);

  useEffect(() => {
    if (cachedSettings) {
      setSettings(cachedSettings);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = getSiteSettings()
        .then((res) => {
          cachedSettings = res.data.data;
          return cachedSettings;
        })
        .catch(() => null);
    }

    fetchPromise.then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}
