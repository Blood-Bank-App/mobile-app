import React, { useRef, useState } from 'react';
import { View, StatusBar, Alert } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { app, auth } from '../database/firebase';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'types';

type PhoneAuthNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PhoneAuth'>;
type PhoneAuthRouteProp = RouteProp<RootStackParamList, 'PhoneAuth'>;

type Props = {
  navigation: PhoneAuthNavigationProp;
  route: PhoneAuthRouteProp;
};

export default function PhoneAuth({ navigation }: Props) {
  const recaptchaVerifier = useRef<FirebaseRecaptchaVerifierModal>(null);
  const [phone, setPhone] = useState<string>('+92');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  const send = async () => {
    try {
      setIsSending(true);
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber(phone, recaptchaVerifier.current!);
      setVerificationId(id);
    } catch (e: any) {
      Alert.alert(e?.message || 'Failed to send OTP');
    } finally {
      setIsSending(false);
    }
  };

  const verify = async () => {
    try {
      if (!verificationId) return;
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      navigation.replace('CompleteProfile');
    } catch (e: any) {
      Alert.alert(e?.message || 'Invalid code');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#b22222" />

      <View style={{
        height: '25%',
        backgroundColor: '#b22222',
        borderBottomLeftRadius: 70,
        justifyContent: 'center',
        paddingLeft: 30
      }}>
        <Text style={{ color: '#fff', fontSize: 34, fontWeight: 'bold' }}>Phone Verification</Text>
      </View>

      <Surface style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
        <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={app.options as any} />

        {!verificationId ? (
          <>
            <TextInput
              label="Phone Number"
              mode="outlined"
              keyboardType="phone-pad"
              style={{ marginBottom: 16 }}
              value={phone}
              onChangeText={setPhone}
            />
            <Button mode="contained" onPress={send} loading={isSending} style={{ borderRadius: 20, backgroundColor: '#b22222' }}>
              Send OTP
            </Button>
          </>
        ) : (
          <>
            <TextInput
              label="6-digit Code"
              mode="outlined"
              keyboardType="number-pad"
              style={{ marginBottom: 16 }}
              value={code}
              onChangeText={setCode}
            />
            <Button mode="contained" onPress={verify} style={{ borderRadius: 20, backgroundColor: '#b22222' }}>
              Verify OTP
            </Button>
          </>
        )}
      </Surface>
    </View>
  );
}


