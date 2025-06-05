import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Footer() {
  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("No se pudo abrir el enlace:", err));
  };

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        © Equipo Carmabe Shop 2025 | Elegancia para cada día. Derechos reservados.
      </Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => openLink('https://www.facebook.com/tu_pagina')}>
          <FontAwesome name="facebook" size={24} color="#7c2d12" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openLink('https://www.instagram.com/tu_usuario')}>
          <FontAwesome name="instagram" size={24} color="#7c2d12" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 12,
    backgroundColor: '#f9c5d1',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  footerText: {
    fontSize: 14,
    color: '#7c2d12',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  icon: {
    marginHorizontal: 10,
  },
});