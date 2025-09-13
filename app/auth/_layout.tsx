import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const { user, initializing } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!initializing) {
      if (user) router.replace('/(tabs)/home');
    }
  }, [initializing, user]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="reset" options={{ title: 'Reset Password' }} />
      <Stack.Screen name="onboarding" options={{ title: 'Onboarding' }} />
    </Stack>
  );
}

import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
      <Stack.Screen name="reset" options={{ title: 'Reset Password' }} />
      <Stack.Screen name="onboarding" options={{ title: 'Onboarding' }} />
    </Stack>
  );
}


