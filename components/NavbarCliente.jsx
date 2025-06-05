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
    backgroundColor: '#f9c5d1',
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  navButton: {
    backgroundColor: '#7c2d12',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 12,
    shadowColor: '#7c2d12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  navButtonText: {
    color: '#f9c5d1',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

