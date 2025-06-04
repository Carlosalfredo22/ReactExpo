// src/api/httpClient.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

const baseURL = Platform.OS === 'android'
  ? 'http://10.0.2.2:8000/api'    // Para emulador Android
  : 'http://localhost:8000/api';  // Para iOS simulador o desarrollo web

const httpClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar el token a cada solicitud
httpClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta globalmente (opcional)
httpClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.log('HTTP Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Unexpected error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default httpClient;
