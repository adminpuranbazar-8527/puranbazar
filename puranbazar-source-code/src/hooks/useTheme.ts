import { useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem('puranbazar_theme') as ThemeMode | null;
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch (e) {
      console.error(e);
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('puranbazar_theme');
    if (stored === 'dark') return 'dark';
    if (stored === 'light') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (currentMode: ThemeMode) => {
      let isDark = false;
      if (currentMode === 'system') {
        isDark = mediaQuery.matches;
      } else {
        isDark = currentMode === 'dark';
      }

      setResolvedTheme(isDark ? 'dark' : 'light');

      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    applyTheme(theme);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('puranbazar_theme', nextTheme);
    } catch (e) {
      console.error(e);
    }
  };

  const setExplicitTheme = (mode: ThemeMode) => {
    setTheme(mode);
    try {
      localStorage.setItem('puranbazar_theme', mode);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    theme,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    toggleTheme,
    setExplicitTheme
  };
}
