import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Navbar() {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navButton}>
        <Text style={styles.navButtonText}>Inicio</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Text style={styles.navButtonText}>Productos</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Text style={styles.navButtonText}>Nosotros</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Text style={styles.navButtonText}>Contacto</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    backgroundColor: '#d98cb3', // Fucsia poco intenso
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    // Sin sombra ni barra dorada
  },
  navButton: {
    backgroundColor: '#1a1a1a', // Negro intenso
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f9c5d1', // Toque rosado en borde
    shadowColor: '#f9c5d1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  navButtonText: {
    color: '#f9c5d1', // Texto rosado
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});






