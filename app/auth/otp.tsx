import { auth } from '@/database/firebase';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function OtpScreen() {
  const router = useRouter();
  const { verificationId } = useLocalSearchParams<{ verificationId: string }>();
  const [code, setCode] = useState('');

  const verify = async () => {
    try {
      if (!verificationId) throw new Error('Missing verificationId');
      const credential = PhoneAuthProvider.credential(String(verificationId), code);
      await signInWithCredential(auth, credential);
      router.replace('/(tabs)/home');
    } catch (e: any) {
      Alert.alert('Verification failed', e?.message ?? 'Please try again');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <TextInput
        placeholder="6-digit code"
        keyboardType="number-pad"
        style={styles.input}
        value={code}
        onChangeText={setCode}
        maxLength={6}
      />
      <TouchableOpacity style={styles.primaryButton} onPress={verify}>
        <Text style={styles.primaryText}>Verify OTP</Text>
      </TouchableOpacity>
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
    textAlign: 'center',
    letterSpacing: 6,
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


