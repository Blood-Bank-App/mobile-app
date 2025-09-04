import { auth } from '@/database/firebase';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert('Account created', 'Let’s complete your profile.');
      router.replace('/auth/onboarding');
    } catch (e: any) {
      Alert.alert('Sign up failed', e?.message ?? 'Try again');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo.jpg')} style={{ width: 96, height: 96, borderRadius: 16, alignSelf: 'center', marginBottom: 12 }} />
      <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Blood Donation App</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Create account</Text>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <TouchableOpacity style={styles.primaryButton} onPress={signup}>
          <Text style={styles.primaryText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 8, alignItems: 'center' }} onPress={() => router.push('/auth/login')}>
          <Text>Back to login</Text>
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


