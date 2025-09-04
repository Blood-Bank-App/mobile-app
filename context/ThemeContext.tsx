import React, { createContext, useContext, useMemo, useState } from 'react';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark';
type ThemeContextType = {
  theme: Theme;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProviderCustom({ children }: { children: React.ReactNode }) {
  const sys = (Appearance.getColorScheme() ?? 'light') as Theme;
  const [theme, setTheme] = useState<Theme>(sys);
  const value = useMemo(() => ({ theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeCustom() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeCustom must be used within ThemeProviderCustom');
  return ctx;
}


