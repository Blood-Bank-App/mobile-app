import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DonationHistoryScreen() {
  // Placeholder until Stripe webhooks/records integrated
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donation History</Text>
      <Text style={{ opacity: 0.7, marginTop: 8 }}>Stripe integration pending.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: '700' },
});


