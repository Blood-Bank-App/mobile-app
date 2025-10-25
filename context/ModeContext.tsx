import { getUserProfile, saveUserProfile } from '@/lib/users';
import { tokenManager } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AppMode = 'donor' | 'patient';

type ModeContextType = {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  isLoading: boolean;
};

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<AppMode>('patient');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mode from user profile and local storage
    (async () => {
      try {
        console.log('🔄 ModeProvider: Starting mode load...');
        // First check if user is authenticated
        const token = await tokenManager.getAccessToken();
        console.log('🔐 ModeProvider: Token check:', { hasToken: !!token });
        
        if (!token) {
          // User not authenticated, just load from local storage
          const savedMode = await AsyncStorage.getItem('app-mode');
          console.log('💾 ModeProvider: Loading from storage:', savedMode);
          if (savedMode && ['donor', 'patient'].includes(savedMode)) {
            setModeState(savedMode as AppMode);
          }
          setIsLoading(false);
          return;
        }

        // User is authenticated, try to get from user profile
        console.log('👤 ModeProvider: Loading from user profile...');
        const profile = await getUserProfile();
        console.log('👤 ModeProvider: Profile loaded:', { hasProfile: !!profile, mode: profile?.mode });
        
        if (profile?.mode) {
          setModeState(profile.mode);
        } else {
          // Fallback to local storage
          const savedMode = await AsyncStorage.getItem('app-mode');
          console.log('💾 ModeProvider: Fallback to storage:', savedMode);
          if (savedMode && ['donor', 'patient'].includes(savedMode)) {
            setModeState(savedMode as AppMode);
          }
        }
      } catch (e) {
        console.warn('❌ ModeProvider: Failed to load mode from profile/storage:', e);
        // Fallback to local storage on any error
        try {
          const savedMode = await AsyncStorage.getItem('app-mode');
          console.log('💾 ModeProvider: Error fallback to storage:', savedMode);
          if (savedMode && ['donor', 'patient'].includes(savedMode)) {
            setModeState(savedMode as AppMode);
          }
        } catch (storageError) {
          console.warn('❌ ModeProvider: Failed to load mode from storage:', storageError);
        }
      } finally {
        console.log('✅ ModeProvider: Loading complete');
        setIsLoading(false);
      }
    })();
  }, []);

  const setMode = async (newMode: AppMode) => {
    setModeState(newMode);
    try {
      // Save to local storage immediately
      await AsyncStorage.setItem('app-mode', newMode);
      
      // Only try to save to user profile if user is authenticated
      const token = await tokenManager.getAccessToken();
      if (token) {
        await saveUserProfile({ mode: newMode });
      }
    } catch (e) {
      console.warn('Failed to save mode to profile/storage:', e);
    }
  };

  const toggleMode = () => setMode(mode === 'patient' ? 'donor' : 'patient');

  const value = useMemo(
    () => ({ mode, setMode, toggleMode, isLoading }),
    [mode, isLoading]
  );
  return <ModeContext.Provider value={value}>{children}</ModeContext.Provider>;
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}


