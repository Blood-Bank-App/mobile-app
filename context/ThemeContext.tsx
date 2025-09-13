import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';

type ThemePref = 'system' | 'light' | 'dark';

type Ctx = {
  preference: ThemePref;
  colorScheme: ColorSchemeName;
  setPreference: (pref: ThemePref) => Promise<void>;
};

const THEME_KEY = 'theme_pref_v1';

const ThemeContext = createContext<Ctx | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [preference, setPreferenceState] = useState<ThemePref>('system');
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(THEME_KEY);
      if (stored === 'system' || stored === 'light' || stored === 'dark') setPreferenceState(stored);
    })();
    const sub = Appearance.addChangeListener(({ colorScheme }) => setColorScheme(colorScheme));
    return () => sub.remove();
  }, []);

  async function setPreference(pref: ThemePref) {
    setPreferenceState(pref);
    await AsyncStorage.setItem(THEME_KEY, pref);
  }

  const value = useMemo<Ctx>(() => ({ preference, colorScheme, setPreference }), [preference, colorScheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useThemePreference() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemePreference must be used within ThemeProvider');
  return ctx;
}

import { getUserProfile, saveUserProfile } from '@/lib/users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, StatusBar } from 'react-native';

type ThemeMode = 'system' | 'light' | 'dark';
type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isLoading: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProviderCustom({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemTheme, setSystemTheme] = useState<Theme>((Appearance.getColorScheme() ?? 'light') as Theme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load saved theme mode from user profile and storage
    (async () => {
      try {
        // First try to get from user profile
        const profile = await getUserProfile();
        if (profile?.themePreference) {
          setModeState(profile.themePreference);
        } else {
          // Fallback to local storage
          const saved = await AsyncStorage.getItem('theme-mode');
          if (saved && ['system', 'light', 'dark'].includes(saved)) {
            setModeState(saved as ThemeMode);
          }
        }
      } catch (e) {
        console.warn('Failed to load theme mode from profile/storage');
      } finally {
        setIsLoading(false);
      }
    })();

    // Listen to system theme changes
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme((colorScheme ?? 'light') as Theme);
    });

    return () => subscription?.remove();
  }, []);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    try {
      // Save to local storage immediately
      await AsyncStorage.setItem('theme-mode', newMode);
      // Save to user profile
      await saveUserProfile({ themePreference: newMode });
    } catch (e) {
      console.warn('Failed to save theme mode to profile/storage');
    }
  };

  const theme: Theme = mode === 'system' ? systemTheme : mode === 'dark' ? 'dark' : 'light';

  // Update status bar style based on theme
  useEffect(() => {
    StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content', true);
  }, [theme]);

  const value = useMemo(() => ({ theme, mode, setMode, isLoading }), [theme, mode, isLoading]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeCustom() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeCustom must be used within ThemeProviderCustom');
  return ctx;
}


