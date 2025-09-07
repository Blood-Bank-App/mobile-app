import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Text, View } from 'react-native';
import 'react-native-reanimated';

import { STRIPE_CONFIG } from '@/config/stripe';
import { Colors } from '@/constants/Colors';
import { ModeProvider } from '@/context/ModeContext';
import { ThemeProviderCustom, useThemeCustom } from '@/context/ThemeContext';

function RootLayoutInner() {
  const { theme } = useThemeCustom();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  // Create custom navigation theme based on our Colors
  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.linkText,
      background: Colors.light.background,
      card: Colors.light.cardBackground,
      text: Colors.light.text,
      border: Colors.light.border,
      notification: '#E11D48',
    },
  };

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.dark.linkText,
      background: Colors.dark.background,
      card: Colors.dark.cardBackground,
      text: Colors.dark.text,
      border: Colors.dark.border,
      notification: '#E11D48',
    },
  };

  return (
    <ThemeProvider value={theme === 'dark' ? customDarkTheme : customLightTheme}>
      <StripeProvider publishableKey={STRIPE_CONFIG.publishableKey}>
      <Stack screenOptions={{
        headerTitle: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Image source={require('@/assets/images/logo.jpg')} style={{ width: 24, height: 24, borderRadius: 6 }} />
            <Text style={{ fontWeight: '700', color: Colors[theme].text }}>Blood Donation App</Text>
          </View>
        ),
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: Colors[theme].background,
        },
        headerTintColor: Colors[theme].text,
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </StripeProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProviderCustom>
      <ModeProvider>
        <RootLayoutInner />
      </ModeProvider>
    </ThemeProviderCustom>
  );
}
