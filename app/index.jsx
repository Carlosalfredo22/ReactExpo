import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false); // <-- Estado para loading
 
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
 
  const styles = getStyles(isDarkMode);
 
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa email y contraseña');
      return;
    }
 
    setLoading(true); // <-- Comenzar loading
 
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
    } finally {
      setLoading(false); // <-- Finalizar loading
    }
  };
 
  return (
<KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
>
<TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
<Icon
          name={isDarkMode ? 'sun' : 'moon'}
          size={24}
          color={isDarkMode ? '#fcd34d' : '#1f2937'}
        />
</TouchableOpacity>
 
      <Text style={styles.title}>Iniciar Sesión</Text>
 
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
 
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={isDarkMode ? '#aaa' : '#888'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
 
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
<ActivityIndicator color="#fff" /> // <-- Indicador mientras carga
        ) : (
<Text style={styles.buttonText}>Ingresar</Text>
        )}
</TouchableOpacity>
</KeyboardAvoidingView>
  );
}
 
const getStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 30,
      backgroundColor: isDarkMode ? '#121212' : '#fff',
    },
    themeToggle: {
      position: 'absolute',
      top: 50,
      right: 20,
      zIndex: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
      color: isDarkMode ? '#fff' : '#000',
    },
    input: {
      height: 50,
      borderColor: isDarkMode ? '#aaa' : '#888',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 20,
      backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
      color: isDarkMode ? '#fff' : '#000',
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