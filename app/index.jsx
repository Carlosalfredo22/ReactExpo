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
import httpClient from './api/httpClient'; // Ajusta según tu estructura

export default function Login() {
  const router = useRouter();

  // Verifica que router esté disponible
  useEffect(() => {
    if (!router) {
      console.warn('router is undefined or null. Verifica la configuración de expo-router.');
    } else {
      console.log('router:', router);
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

      console.log('Respuesta login:', response.data);
      console.log('Token:', token);
      console.log('Role:', role);

      if (Array.isArray(role) && role.includes('cliente')) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('role', 'cliente');
        Alert.alert('Bienvenido', 'Acceso concedido como cliente');
        if (router) {
          router.replace('/homecliente');
        } else {
          Alert.alert('Error', 'No se pudo navegar: router no está disponible');
        }
      } else {
        Alert.alert('Acceso Denegado', 'Solo los clientes pueden iniciar sesión.');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Credenciales inválidas o error de servidor.');
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
