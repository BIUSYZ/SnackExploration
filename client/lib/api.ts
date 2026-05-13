import axios from 'axios';
import Constants from 'expo-constants';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL || 'http://localhost:9091/api/v1';

export const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
});
