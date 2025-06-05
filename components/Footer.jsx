import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Footer() {
  const openLink = (url) => {
    Linking.openURL(url).catch(err => console.error("No se pudo abrir el enlace:", err));
  };

  const openFacebook = () => {
    openLink('http://www.carmabeshop.com/');
  };

  const openInstagram = () => {
    openLink('https://www.instagram.com/tu_usuario');
  };

  return (
    <View style={styles.footer}>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.navButton} onPress={openFacebook}>
          <FontAwesome name="facebook" size={32} color="#f9c5d1" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={openInstagram}>
          <FontAwesome name="instagram" size={32} color="#f9c5d1" style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        © Equipo Carmabe Shop 2025 | Elegancia para cada día. Derechos reservados.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 16,
    backgroundColor: '#d98cb3', // Fucsia poco intenso
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'column',
  },
  footerText: {
    fontSize: 14,
    color: '#000', // Texto en negro
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  navButton: {
    backgroundColor: '#1a1a1a', // Negro intenso
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f9c5d1', // Toque rosado en borde
    marginHorizontal: 10,
  },
  icon: {
    color: '#f9c5d1', // Color rosado para los iconos
  },
});





