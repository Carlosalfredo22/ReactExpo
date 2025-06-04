import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import defaultImage from '../../assets/images/camisa y pantalon.jpg';
import Footer from '../../components/Footer';
import NavbarCliente from '../../components/NavbarCliente';

// Descripciones adicionales por categoría
const descripcionesLargas = {
  vestidura: 'La vestidura es un conjunto de prendas que brindan elegancia y comodidad. Ideal para ocasiones formales o casuales.',
  camisas: 'Camisas de alta calidad con distintos estilos y tejidos, perfectas para cualquier ocasión, desde trabajo hasta eventos sociales.',
  pantalones: 'Pantalones confeccionados con materiales duraderos y diseños modernos para un estilo único y confortable.',
  pantalon: 'Pantalones confeccionados con materiales duraderos y diseños modernos para un estilo único y confortable.',
};

// Función para limpiar tildes y pasar a minúsculas
function normalizarTexto(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function CategoriasCliente() {
  const [categorias, setCategorias] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const token = await AsyncStorage.getItem('token'); // React Native storage
        const response = await axios.get('http://localhost:8000/api/cliente/categorias', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const categoriasConExtras = response.data.map(cat => {
          const clave = normalizarTexto(cat.nombre);
          let precio = parseFloat(cat.precio);
          if (isNaN(precio)) {
            precio = Math.floor(Math.random() * 50) + 50;
          }
          return {
            ...cat,
            precio,
            stock: cat.stock || 10,
            descripcion_larga: descripcionesLargas[clave] || 'No hay más información disponible.',
          };
        });

        setCategorias(categoriasConExtras);
      } catch (error) {
        setMensaje('No se pudieron cargar las categorías.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const agregarAlCarrito = (categoria) => {
    setMensaje('');
    setPedidoEnviado(false);
    setCarrito(prev => {
      const existe = prev.find(item => item.categoria.id === categoria.id);
      if (existe) {
        return prev.map(item =>
          item.categoria.id === categoria.id
            ? { ...item, cantidad: Math.min(item.cantidad + 1, categoria.stock) }
            : item
        );
      } else {
        return [...prev, { categoria, cantidad: 1 }];
      }
    });
  };

  const cambiarCantidad = (categoriaId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    setCarrito(prev => prev.map(item =>
      item.categoria.id === categoriaId
        ? { ...item, cantidad: Math.min(nuevaCantidad, item.categoria.stock) }
        : item
    ));
  };

  const reducirCantidad = (categoriaId) => {
    setCarrito(prev =>
      prev
        .map(item =>
          item.categoria.id === categoriaId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter(item => item.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (categoriaId) => {
    setCarrito(prev => prev.filter(item => item.categoria.id !== categoriaId));
  };

  const enviarPedido = async () => {
    if (carrito.length === 0) {
      setMensaje('El carrito está vacío');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      const data = {
        total: calcularTotal(),
        productos: carrito.map(item => ({
          producto_id: item.categoria.id,
          cantidad: item.cantidad,
          precio_unitario: item.categoria.precio
        }))
      };
      await axios.post('http://localhost:8000/api/cliente/pedidos', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensaje('Pedido enviado con éxito');
      setPedidoEnviado(true);
      setCarrito([]);
    } catch (err) {
      const mensajeError = err.response?.data?.message || 'Error al enviar el pedido';
      setMensaje(mensajeError);
    }
  };

  const calcularTotal = () => {
    return carrito
      .reduce((total, item) => total + item.categoria.precio * item.cantidad, 0)
      .toFixed(2);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <NavbarCliente />
        <View style={styles.loadingContainer}>
          <Text>Cargando categorías...</Text>
        </View>
        <Footer />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavbarCliente />

      <ScrollView contentContainerStyle={styles.content}>

        <Text style={styles.title}>Prendas disponibles</Text>

        {categorias.length === 0 ? (
          <Text>No hay categorías disponibles.</Text>
        ) : (
          categorias.map(categoria => (
            <View key={categoria.id} style={styles.card}>
              <Image
                source={categoria.imagen ? { uri: categoria.imagen } : defaultImage}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{categoria.nombre}</Text>
                <Text>{categoria.descripcion || 'Sin descripción'}</Text>
                <Text><Text style={{ fontWeight: 'bold' }}>Precio:</Text> ${categoria.precio.toFixed(2)}</Text>
                <Text style={styles.stock}>Stock: {categoria.stock}</Text>

                <TouchableOpacity
                  onPress={() => agregarAlCarrito(categoria)}
                  disabled={categoria.stock <= 0}
                  style={[styles.button, categoria.stock <= 0 && styles.buttonDisabled]}
                >
                  <Text style={styles.buttonText}>
                    {categoria.stock > 0 ? 'Agregar al carrito' : 'Sin stock'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => toggleExpand(categoria.id)}>
                  <Text style={styles.expandText}>
                    {expandedId === categoria.id ? 'Ver menos' : 'Ver más'}
                  </Text>
                </TouchableOpacity>

                {expandedId === categoria.id && (
                  <View style={styles.detalles}>
                    <Text style={{ fontWeight: 'bold' }}>Detalles:</Text>
                    <Text>{categoria.descripcion_larga}</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}

        <View style={styles.divider} />

        <Text style={styles.title}>Carrito</Text>

        {carrito.length === 0 ? (
          <Text>No hay productos en el carrito.</Text>
        ) : (
          carrito.map(({ categoria, cantidad }) => (
            <View key={categoria.id} style={styles.carritoItem}>
              <Text style={styles.carritoNombre}>{categoria.nombre}</Text>
              <View style={styles.cantidadContainer}>
                <TouchableOpacity 
                  style={styles.cantidadBtn} 
                  onPress={() => reducirCantidad(categoria.id)}
                >
                  <Text>-</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.cantidadInput}
                  keyboardType="numeric"
                  value={cantidad.toString()}
                  onChangeText={text => {
                    const num = parseInt(text, 10);
                    if (!isNaN(num)) cambiarCantidad(categoria.id, num);
                  }}
                />
                <TouchableOpacity
                  style={styles.cantidadBtn}
                  onPress={() => agregarAlCarrito(categoria)}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
              <Text>Precio unitario: ${categoria.precio.toFixed(2)}</Text>
              <Text>Subtotal: ${(categoria.precio * cantidad).toFixed(2)}</Text>
              <TouchableOpacity
                style={styles.eliminarBtn}
                onPress={() => eliminarDelCarrito(categoria.id)}
              >
                <Text style={{ color: 'white' }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {carrito.length > 0 && (
          <>
            <Text style={styles.total}>Total: ${calcularTotal()}</Text>
            <TouchableOpacity
              style={[styles.button, pedidoEnviado && styles.buttonDisabled]}
              onPress={enviarPedido}
              disabled={pedidoEnviado}
            >
              <Text style={styles.buttonText}>
                {pedidoEnviado ? 'Pedido Enviado' : 'Enviar Pedido'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        {mensaje !== '' && (
          <View style={styles.mensajeContainer}>
            <Text>{mensaje}</Text>
          </View>
        )}

      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: '100%', height: 180 },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  stock: { fontSize: 12, color: '#666', marginBottom: 10 },
  button: {
    backgroundColor: '#198754',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 6,
  },
  buttonDisabled: { backgroundColor: '#94d3a2' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  expandText: { color: '#0d6efd', fontWeight: '600', textAlign: 'center', marginBottom: 8 },
  detalles: { marginTop: 6 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#ccc', marginVertical: 16 },
  carritoItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  carritoNombre: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  cantidadContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cantidadBtn: {
    backgroundColor: '#0d6efd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cantidadInput: {
    width: 50,
    height: 30,
    borderColor: '#ccc',
    borderWidth: 1,
    marginHorizontal: 8,
    borderRadius: 4,
    textAlign: 'center',
  },
  eliminarBtn: {
    backgroundColor: '#dc3545',
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 6,
  },
  total: { fontSize: 18, fontWeight: 'bold', marginVertical: 12, textAlign: 'center' },
  mensajeContainer: {
    backgroundColor: '#e7f3fe',
    padding: 10,
    borderRadius: 4,
    marginTop: 10,
  },
});
