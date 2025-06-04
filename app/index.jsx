// src/index.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import httpClient from './api/httpClient';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    if (!router) {
      console.warn('router is undefined or null. Verifica la configuración de expo-router.');
    }
  }, [router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }

    try {
      const response = await httpClient.post('/login', { email, password });

      const token = response.data.access_token ?? '';
      const role = response.data.role ?? [];

      console.log('Login response:', response.data);

      if (Array.isArray(role) && role.includes('cliente')) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('role', 'cliente');
        Alert.alert('Bienvenido', 'Acceso concedido como cliente');

        if (router) {
          router.replace('/homecliente');
        } else {
          Alert.alert('Error', 'No se pudo navegar: router no disponible');
        }
      } else {
        Alert.alert('Acceso Denegado', 'Solo los clientes pueden iniciar sesión.');
      }
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 422 && data.errors) {
          const mensajes = Object.values(data.errors).flat().join('\n');
          Alert.alert('Errores de validación', mensajes);
        } else if (status === 401) {
          Alert.alert('Error de autenticación', 'Correo o contraseña incorrectos.');
        } else if (status >= 500) {
          Alert.alert('Error del servidor', 'Inténtalo más tarde.');
        } else {
          Alert.alert('Error', data.message || 'Ocurrió un error inesperado.');
        }
      } else if (error.request) {
        Alert.alert('Error de red', 'No se pudo conectar con el servidor.');
      } else {
        Alert.alert('Error', 'Ocurrió un error inesperado: ' + error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#888',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
