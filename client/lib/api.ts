import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'http://localhost:9091/api/v1';

export const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('snack_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // 去除 /api/v1 后缀，获取基础域名/IP
  const baseHost = BACKEND_URL.replace(/\/api\/v1\/?$/, '');
  return `${baseHost}${url.startsWith('/') ? '' : '/'}${url}`;
};
