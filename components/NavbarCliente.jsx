import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NavbarCliente() {
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
    <View style={styles.navbar}>
      <Text style={styles.title}>Panel Cliente</Text>

      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => router.push('/cliente/categorias')}>
          <Text style={styles.link}>Prendas</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/cliente/metodos-pago')}>
          <Text style={styles.link}>Opciones de Pagos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={[styles.link, styles.logout]}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#1e40af',
    paddingTop: 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  linksContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  link: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  logout: {
    fontWeight: 'bold',
    color: '#f87171',
  },
});
