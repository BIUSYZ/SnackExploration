import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../lib/api';
import { COLORS, LAYOUT, SHADOWS } from '../constants/Theme';

export default function LoginScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password) {
      Alert.alert('提示', '请输入密码');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/login', { password });
      if (response.data.success) {
        await AsyncStorage.setItem('snack_token', response.data.data.token);
        router.replace('/');
      }
    } catch (error: any) {
      const msg = error.response?.data?.error || '登录失败，请检查网络或密码';
      Alert.alert('验证失败', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>零食记</Text>
        <Text style={styles.subtitle}>请输入访问密码以继续</Text>
        
        <TextInput 
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="请输入密码"
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry
          autoCapitalize="none"
        />

        <Pressable 
          style={[styles.btn, loading && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>登录</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 30,
    borderRadius: 24,
    ...SHADOWS.soft,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: COLORS.surfaceWarm,
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  btn: {
    width: '100%',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...SHADOWS.light,
  },
  btnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#FFF',
  }
});
