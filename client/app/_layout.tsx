import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { COLORS } from '../constants/Theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ 
      headerShown: false, 
      contentStyle: { backgroundColor: COLORS.background } 
    }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="map" />
      <Stack.Screen name="add" options={{ presentation: 'modal' }} />
      <Stack.Screen name="settings" />
      <Stack.Screen name="snack/[id]" />
    </Stack>
  );
}
