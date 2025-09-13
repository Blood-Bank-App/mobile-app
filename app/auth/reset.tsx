import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function ResetScreen() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setLoading(true); setError(null); setMessage(null);
    try {
      await resetPassword(email.trim());
      setMessage('Reset email sent.');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: '600', marginBottom: 12 }}>Reset Password</Text>
      {message && <Text style={{ color: 'green' }}>{message}</Text>}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <Button title={loading ? 'Sending...' : 'Send Reset Email'} onPress={onSubmit} disabled={loading} />
    </View>
  );
}

import { Colors } from '@/constants/Colors';
import { auth } from '@/database/firebase';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Image } from 'expo-image';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ResetScreen() {
  const [email, setEmail] = useState('');
  const colorScheme = useColorScheme() ?? 'light';

  const reset = async () => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Reset email sent', 'Check your inbox for reset instructions.');
    } catch (e: any) {
      Alert.alert('Reset failed', e?.message ?? 'Try again');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <Image source={require('@/assets/images/logo.jpg')} style={{ width: 96, height: 96, borderRadius: 16, alignSelf: 'center', marginBottom: 12 }} />
      <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700', marginBottom: 12, color: Colors[colorScheme].text }}>Blood Donation App</Text>
      <View style={[styles.card, { backgroundColor: Colors[colorScheme].cardBackground, borderColor: Colors[colorScheme].border }]}>
        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Reset Password</Text>
        <TextInput 
          placeholder="Email" 
          placeholderTextColor={Colors[colorScheme].secondaryText}
          value={email} 
          onChangeText={setEmail} 
          style={[styles.input, { 
            color: Colors[colorScheme].text, 
            backgroundColor: Colors[colorScheme].inputBackground, 
            borderColor: Colors[colorScheme].border 
          }]} 
          autoCapitalize="none" 
        />
        <TouchableOpacity style={styles.primaryButton} onPress={reset}>
          <Text style={styles.primaryText}>Send Reset Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    gap: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: '#E11D48',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '600' },
});


