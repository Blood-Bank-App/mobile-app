import { auth, firebaseConfig } from '@/database/firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useRouter } from 'expo-router';
import { PhoneAuthProvider } from 'firebase/auth';
import React, { useRef, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('+92');
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  const sendOtp = async () => {
    if (!recaptchaVerifier.current) return;
    const provider = new PhoneAuthProvider(auth);
    const id = await provider.verifyPhoneNumber(phone, recaptchaVerifier.current);
    setVerificationId(id);
    router.push({ pathname: '/auth/otp', params: { verificationId: id } });
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={Platform.OS !== 'web'}
      />
      <Text style={styles.title}>Continue with Phone</Text>
      <TextInput
        placeholder="Phone (+92...)"
        keyboardType="phone-pad"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity style={styles.primaryButton} onPress={sendOtp}>
        <Text style={styles.primaryText}>Send OTP</Text>
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


