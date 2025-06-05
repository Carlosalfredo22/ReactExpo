import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Footer from '../components/Footer';
import NavbarCliente from '../components/NavbarCliente';

export default function HomeCliente() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('role');
      router.replace('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      <NavbarCliente />

      <View style={styles.content}>
        <Text style={styles.title}>¡Hola! Estamos felices de verte aquí.</Text>
        <Text style={styles.text}>
          En Carmabe Shop, valoramos tu presencia y estamos comprometidos a ofrecerte la mejor experiencia. 
          Tu satisfacción es nuestra prioridad, y estamos aquí para ayudarte en todo lo que necesites.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Salir</Text>
        </TouchableOpacity>
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#fff', // Fondo blanco
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1a1a1a',
  },
  text: {
    fontSize: 16,
    marginBottom: 40, // Más espacio para separar del botón
    textAlign: 'center',
    color: '#1a1a1a',
  },
  button: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#f9c5d1',
    marginBottom: 20, // Espacio extra abajo del botón
  },
  buttonText: {
    color: '#f9c5d1',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


