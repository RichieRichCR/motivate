'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';
type WeightUnit = 'kg' | 'lbs';
type DistanceUnit = 'km' | 'miles';

interface PreferencesContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  weightUnit: WeightUnit;
  setWeightUnit: (unit: WeightUnit) => void;
  distanceUnit: DistanceUnit;
  setDistanceUnit: (unit: DistanceUnit) => void;
  reducedMotion: boolean;
  setReducedMotion: (enabled: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined,
);

export const PreferencesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Initialize from localStorage if available
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  const [weightUnit, setWeightUnitState] = useState<WeightUnit>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('weightUnit') as WeightUnit) || 'kg';
    }
    return 'kg';
  });

  const [distanceUnit, setDistanceUnitState] = useState<DistanceUnit>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('distanceUnit') as DistanceUnit) || 'km';
    }
    return 'km';
  });

  const [reducedMotion, setReducedMotionState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('reducedMotion');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Watch for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const savedReducedMotion = localStorage.getItem('reducedMotion');

    const handleChange = (e: MediaQueryListEvent) => {
      if (savedReducedMotion === null) {
        setReducedMotionState(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Apply theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setWeightUnit = (unit: WeightUnit) => {
    setWeightUnitState(unit);
    localStorage.setItem('weightUnit', unit);
  };

  const setDistanceUnit = (unit: DistanceUnit) => {
    setDistanceUnitState(unit);
    localStorage.setItem('distanceUnit', unit);
  };

  const setReducedMotion = (enabled: boolean) => {
    setReducedMotionState(enabled);
    localStorage.setItem('reducedMotion', String(enabled));
  };

  return (
    <PreferencesContext.Provider
      value={{
        theme,
        setTheme,
        weightUnit,
        setWeightUnit,
        distanceUnit,
        setDistanceUnit,
        reducedMotion,
        setReducedMotion,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = (): PreferencesContextType => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};
