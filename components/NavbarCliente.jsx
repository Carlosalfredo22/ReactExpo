import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NavbarCliente() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('role');
      router.replace('/');
    } catch (error) {
      Alert.alert('Error', 'No se pudo cerrar sesión. Inténtalo nuevamente.');
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/cliente/categorias')}
      >
        <Text style={styles.navButtonText}>Categorías</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() => router.push('/cliente/metodos-pago')}
      >
        <Text style={styles.navButtonText}>Métodos de Pago</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navButton, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.navButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#d98cb3',
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  navButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f9c5d1',
    shadowColor: '#f9c5d1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  navButtonText: {
    color: '#f9c5d1',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#a12a2a', // Color diferente para el logout (opcional)
    borderColor: '#f95c5c',
  },
});
