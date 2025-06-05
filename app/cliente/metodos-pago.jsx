import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Footer from '../../components/Footer';
import NavbarCliente from '../../components/NavbarCliente';

export default function MetodosPagoCliente() {
  const [metodos, setMetodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');

  const getAuthConfig = async () => {
    const token = await AsyncStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    };
  };

  const fetchMetodos = async () => {
    try {
      setLoading(true);
      const config = await getAuthConfig();
      const res = await axios.get('http://localhost:8000/api/cliente/metodos-pago', config);
      setMetodos(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los métodos de pago.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetodos();
  }, []);

  const handleSubmit = async () => {
    setFormError('');
    setSuccessMessage('');
    if (nombre.trim() === '') {
      setFormError('El nombre es obligatorio');
      return;
    }

    try {
      setIsSubmitting(true);
      const config = await getAuthConfig();
      await axios.post(
        'http://localhost:8000/api/cliente/metodos-pago',
        { nombre, descripcion },
        config
      );
      setSuccessMessage('Método de pago registrado correctamente.');
      setNombre('');
      setDescripcion('');
      fetchMetodos();
    } catch (err) {
      console.error(err.response?.data || err);
      setFormError('Error al registrar método de pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  const iniciarEdicion = (metodo) => {
    setEditandoId(metodo.id);
    setEditNombre(metodo.nombre);
    setEditDescripcion(metodo.descripcion || '');
    setFormError('');
    setSuccessMessage('');
  };

  const handleUpdate = async () => {
    if (editNombre.trim() === '') {
      setFormError('El nombre es obligatorio');
      return;
    }

    try {
      const config = await getAuthConfig();
      await axios.put(
        `http://localhost:8000/api/cliente/metodos-pago/${editandoId}`,
        {
          nombre: editNombre,
          descripcion: editDescripcion,
        },
        config
      );
      setEditandoId(null);
      setSuccessMessage('Método de pago actualizado correctamente.');
      fetchMetodos();
    } catch (err) {
      console.error(err.response?.data || err);
      setFormError('Error al actualizar el método de pago');
    }
  };

  const handleDelete = (id) => {
    Alert.alert('Confirmar', '¿Estás seguro de eliminar este método de pago?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const config = await getAuthConfig();
            await axios.delete(
              `http://localhost:8000/api/cliente/metodos-pago/${id}`,
              config
            );
            fetchMetodos();
          } catch (err) {
            console.error(err.response?.data || err);
            setError('Error al eliminar el método de pago');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <NavbarCliente />
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Opciones de Pago</Text>

            <View style={styles.formGroup}>
              <Text>Nombre:</Text>
              <TextInput
                style={styles.input}
                value={nombre}
                onChangeText={setNombre}
                maxLength={100}
                placeholder="Nombre del método"
              />
            </View>

            <View style={styles.formGroup}>
              <Text>Descripción:</Text>
              <TextInput
                style={styles.input}
                value={descripcion}
                onChangeText={setDescripcion}
                placeholder="Descripción opcional"
              />
            </View>

            <Button title="Registrar método" onPress={handleSubmit} disabled={isSubmitting} />

            {!!formError && <Text style={styles.errorMsg}>{formError}</Text>}
            {!!successMessage && <Text style={styles.successMsg}>{successMessage}</Text>}

            {loading ? (
              <Text>Cargando métodos de pago...</Text>
            ) : error ? (
              <Text style={styles.errorMsg}>{error}</Text>
            ) : metodos.length === 0 ? (
              <Text>No hay métodos de pago disponibles.</Text>
            ) : (
              metodos.map((metodo) => (
                <View key={metodo.id} style={styles.metodoItem}>
                  {editandoId === metodo.id ? (
                    <>
                      <TextInput
                        style={styles.input}
                        value={editNombre}
                        onChangeText={setEditNombre}
                        maxLength={100}
                      />
                      <TextInput
                        style={styles.input}
                        value={editDescripcion}
                        onChangeText={setEditDescripcion}
                      />
                      <View style={styles.botonesEditar}>
                        <Button title="Guardar" onPress={handleUpdate} />
                        <Button
                          title="Cancelar"
                          color="gray"
                          onPress={() => {
                            setEditandoId(null);
                            setFormError('');
                            setSuccessMessage('');
                          }}
                        />
                      </View>
                    </>
                  ) : (
                    <>
                      <Text style={styles.metodoNombre}>{metodo.nombre}</Text>
                      {metodo.descripcion ? (
                        <Text style={styles.metodoDescripcion}>{metodo.descripcion}</Text>
                      ) : null}
                      <View style={styles.botonesEditar}>
                        <Button title="Actualizar" onPress={() => iniciarEdicion(metodo)} />
                        <Button
                          title="Eliminar"
                          color="red"
                          onPress={() => handleDelete(metodo.id)}
                        />
                      </View>
                    </>
                  )}
                </View>
              ))
            )}
          </ScrollView>
          <Footer />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
  },
  errorMsg: {
    color: 'red',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  successMsg: {
    color: 'green',
    marginTop: 8,
    marginBottom: 8,
    textAlign: 'center',
  },
  metodoItem: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  metodoNombre: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  metodoDescripcion: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  botonesEditar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
