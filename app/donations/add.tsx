import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AddDonationScreen() {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');

  const onSubmit = async () => {
    if (!amount) { Alert.alert('Missing amount'); return; }
    // TODO: integrate Stripe checkout
    Alert.alert('Not implemented', 'Stripe integration coming soon.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Donate Amount</Text>
      <TextInput placeholder="Amount" keyboardType="decimal-pad" style={styles.input} value={amount} onChangeText={setAmount} />
      <TextInput placeholder="Purpose (optional)" style={styles.input} value={purpose} onChangeText={setPurpose} />
      <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
        <Text style={styles.primaryText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 24, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 12 },
  primaryButton: { marginTop: 8, backgroundColor: '#E11D48', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  primaryText: { color: '#fff', fontWeight: '600' },
});


