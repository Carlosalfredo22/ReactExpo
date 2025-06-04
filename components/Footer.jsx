import { StyleSheet, Text, View } from 'react-native';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2025 Tu App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 50,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#4b5563',
  },
});
