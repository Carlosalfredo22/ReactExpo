import axios from 'axios';
import { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
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

  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState('');

  const getAuthConfig = () => {
    // Cambia según donde guardes tu token en React Native (AsyncStorage por ejemplo)
    // Aquí uso un token fijo para ejemplo:
    const token = 'TU_TOKEN_AQUI';
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchMetodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8000/api/cliente/metodos-pago', getAuthConfig());
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
      await axios.post('http://localhost:8000/api/cliente/metodos-pago', { nombre, descripcion }, getAuthConfig());
      setSuccessMessage('Método de pago registrado correctamente.');
      setNombre('');
      setDescripcion('');
      fetchMetodos();
    } catch (err) {
      setFormError('Error al registrar método de pago');
      console.error(err);
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
      await axios.put(`http://localhost:8000/api/cliente/metodos-pago/${editandoId}`, {
        nombre: editNombre,
        descripcion: editDescripcion,
      }, getAuthConfig());
      setEditandoId(null);
      setFormError('');
      setSuccessMessage('Método de pago actualizado correctamente.');
      fetchMetodos();
    } catch (err) {
      setFormError('Error al actualizar el método de pago');
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de eliminar este método de pago?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`http://localhost:8000/api/cliente/metodos-pago/${id}`, getAuthConfig());
              fetchMetodos();
            } catch (err) {
              setError('Error al eliminar el método de pago');
              console.error(err);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <NavbarCliente />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Opciones de Pago</Text>

        {/* Formulario creación */}
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

        <Button title="Registrar método" onPress={handleSubmit} />

        {!!formError && <Text style={styles.errorMsg}>{formError}</Text>}
        {!!successMessage && <Text style={styles.successMsg}>{successMessage}</Text>}

        {/* Lista métodos */}
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
                  {metodo.descripcion ? <Text style={styles.metodoDescripcion}>{metodo.descripcion}</Text> : null}
                  <View style={styles.botonesEditar}>
                    <Button title="Actualizar" onPress={() => iniciarEdicion(metodo)} />
                    <Button title="Eliminar" color="red" onPress={() => handleDelete(metodo.id)} />
                  </View>
                </>
              )}
            </View>
          ))
        )}
      </ScrollView>
      <Footer />
    </View>
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
