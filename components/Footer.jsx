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
        <TouchableOpacity onPress={openFacebook}>
          <FontAwesome name="facebook" size={32} color="#7c2d12" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openInstagram}>
          <FontAwesome name="instagram" size={32} color="#7c2d12" style={styles.icon} />
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
    flexDirection: 'column',
  },
  footerText: {
    fontSize: 14,
    color: '#7c2d12',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginHorizontal: 15,
  },
});




