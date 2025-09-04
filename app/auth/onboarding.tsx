import SelectModal from '@/components/SelectModal';
import { BLOOD_GROUPS, CITIES_PK, GENDERS } from '@/data/pk';
import { auth } from '@/database/firebase';
import { saveUserProfile } from '@/lib/users';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+92');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [available, setAvailable] = useState(true);
  const [openPicker, setOpenPicker] = useState<null | 'gender' | 'city' | 'blood'>(null);

  const normalizePhone = (value: string) => {
    if (!value.startsWith('+92')) return '+92';
    const digits = value.replace(/[^\d+]/g, '');
    return digits.slice(0, 13);
  };

  const onSave = async () => {
    if (!name || !bloodGroup || !city) {
      Alert.alert('Missing fields', 'Please fill name, blood group and city.');
      return;
    }
    try {
      await saveUserProfile({ name, email, phone, gender, bloodGroup, city, available });
      Alert.alert('Saved', 'Welcome!');
      router.replace('/(tabs)/home');
    } catch (e: any) {
      const message = e?.message ?? 'Could not save profile. Are you logged in?';
      Alert.alert('Save failed', message);
    }
  };

  useEffect(() => {
    const currentEmail = auth.currentUser?.email ?? '';
    if (currentEmail) setEmail(currentEmail);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo.jpg')} style={{ width: 96, height: 96, borderRadius: 16, alignSelf: 'center', marginBottom: 12 }} />
      <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: '700', marginBottom: 12 }}>Blood Donation App</Text>
      <View style={styles.card}>
        <Text style={styles.title}>Complete Profile</Text>
        <TextInput placeholder="Full Name" style={styles.input} value={name} onChangeText={setName} />
        <TextInput placeholder="Email" style={[styles.input, styles.inputDisabled]} value={email} onChangeText={setEmail} editable={false} />
        <TextInput placeholder="Phone (+92...)" style={styles.input} value={phone} onChangeText={(v)=>setPhone(normalizePhone(v))} keyboardType="phone-pad" />
        <TouchableOpacity style={styles.input} onPress={() => setOpenPicker('gender')}>
          <Text>{gender || 'Gender'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.input} onPress={() => setOpenPicker('blood')}>
          <Text>{bloodGroup || 'Blood Group'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.input} onPress={() => setOpenPicker('city')}>
          <Text>{city || 'City'}</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontWeight: '600' }}>Available as Donor</Text>
          <Switch value={available} onValueChange={setAvailable} />
        </View>
        <TouchableOpacity style={styles.primaryButton} onPress={onSave}>
          <Text style={styles.primaryText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>

      <SelectModal visible={openPicker==='gender'} title="Select Gender" options={GENDERS} onClose={()=>setOpenPicker(null)} onSelect={(v)=>{setGender(v); setOpenPicker(null);}} />
      <SelectModal visible={openPicker==='blood'} title="Select Blood Group" options={BLOOD_GROUPS} onClose={()=>setOpenPicker(null)} onSelect={(v)=>{setBloodGroup(v); setOpenPicker(null);}} />
      <SelectModal visible={openPicker==='city'} title="Select City" options={CITIES_PK} onClose={()=>setOpenPicker(null)} onSelect={(v)=>{setCity(v); setOpenPicker(null);}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10, justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
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


