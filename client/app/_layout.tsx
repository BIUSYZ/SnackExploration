import { Stack, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { 
  Inter_400Regular, 
  Inter_500Medium, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';
import { COLORS } from '../constants/Theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('snack_token');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }
        
        // 可选：调用后端验证token是否过期
        const res = await api.get('/auth/verify');
        if (res.data.success) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          await AsyncStorage.removeItem('snack_token');
        }
      } catch (err) {
        setIsAuthenticated(false);
        await AsyncStorage.removeItem('snack_token');
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (loaded && isAuthenticated !== null) {
      SplashScreen.hideAsync();
      if (!isAuthenticated) {
        // 使用 setTimeout 确保在布局挂载后跳转
        setTimeout(() => router.replace('/login'), 100);
      }
    }
  }, [loaded, isAuthenticated]);

  if (!loaded || isAuthenticated === null) {
    return null;
  }

  return (
    <Stack screenOptions={{ 
      headerShown: false, 
      contentStyle: { backgroundColor: COLORS.background } 
    }}>
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="index" />
      <Stack.Screen name="map" />
      <Stack.Screen name="add" options={{ presentation: 'modal' }} />
      <Stack.Screen name="settings" />
      <Stack.Screen name="snack/[id]" />
    </Stack>
  );
}
