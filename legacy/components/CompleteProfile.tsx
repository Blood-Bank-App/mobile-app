import React, { useEffect, useState } from 'react';
import { View, ScrollView, StatusBar, Alert } from 'react-native';
import { Button, Surface, Text, TextInput, Switch } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { auth, database } from '../database/firebase';
import { ref, set, update, onValue } from 'firebase/database';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'types';

type CompleteProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CompleteProfile'>;
type CompleteProfileRouteProp = RouteProp<RootStackParamList, 'CompleteProfile'>;

type Props = {
  navigation: CompleteProfileNavigationProp;
  route: CompleteProfileRouteProp;
};

type FormState = {
  displayName: string;
  email: string;
  gender: string;
  blood: string;
  city: string;
  cnic: string;
  availability: boolean;
};

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function CompleteProfile({ navigation }: Props) {
  const [form, setForm] = useState<FormState>({
    displayName: '',
    email: '',
    gender: '',
    blood: '',
    city: '',
    cnic: '',
    availability: false,
  });

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const r = ref(database, 'users/' + uid);
    const off = onValue(r, (s) => {
      const v = s.val() || {};
      setForm((p) => ({
        ...p,
        displayName: v.DisplayName || p.displayName,
        email: v.Email || p.email,
        gender: v.Gender || p.gender,
        blood: v.Blood || p.blood,
        city: v.City || p.city,
        cnic: v.CNIC || p.cnic,
        availability: !!v.availability,
      }));
    });
    return () => off();
  }, [uid]);

  const updateField = (k: keyof FormState, val: any) => setForm((p) => ({ ...p, [k]: val }));

  const save = async () => {
    if (!uid) return Alert.alert('Please login first');
    if (!form.displayName || !form.city || !form.blood || !form.gender) {
      Alert.alert('Please fill all required fields');
      return;
    }
    await set(ref(database, 'users/' + uid), {
      uid,
      DisplayName: form.displayName,
      Email: form.email,
      Gender: form.gender,
      Blood: form.blood,
      City: form.city,
      CNIC: form.cnic,
      availability: form.availability,
    });
    Alert.alert('Profile saved');
    navigation.replace('Dashboard');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="light-content" backgroundColor="#b22222" />

      <View style={{
        height: '22%',
        backgroundColor: '#b22222',
        borderBottomLeftRadius: 70,
        justifyContent: 'center',
        paddingLeft: 30
      }}>
        <Text style={{ color: '#fff', fontSize: 34, fontWeight: 'bold' }}>Complete Profile</Text>
      </View>

      <Surface style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <TextInput label="Full Name" mode="outlined" style={{ marginBottom: 16 }} value={form.displayName} onChangeText={(t)=>updateField('displayName', t)} />
          <TextInput label="Email (optional)" mode="outlined" style={{ marginBottom: 16 }} value={form.email} onChangeText={(t)=>updateField('email', t)} keyboardType="email-address" />

          <View style={{ marginBottom: 16 }}>
            <Dropdown label="Gender" placeholder="Select Gender" options={GENDERS.map(g=>({label:g,value:g,key:g}))} value={form.gender} onSelect={(v?:string)=>updateField('gender', v||'')} />
          </View>

          <View style={{ marginBottom: 16 }}>
            <Dropdown label="Blood Group" placeholder="Select Blood Group" options={BLOOD_GROUPS.map(g=>({label:g,value:g,key:g}))} value={form.blood} onSelect={(v?:string)=>updateField('blood', v||'')} />
          </View>

          <TextInput label="City" mode="outlined" style={{ marginBottom: 16 }} value={form.city} onChangeText={(t)=>updateField('city', t)} />
          <TextInput label="CNIC (optional)" mode="outlined" style={{ marginBottom: 16 }} value={form.cnic} onChangeText={(t)=>updateField('cnic', t)} keyboardType="numeric" />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <Switch value={form.availability} onValueChange={(v)=>updateField('availability', v)} />
            <Text style={{ marginLeft: 8 }}>Available to Donate</Text>
          </View>

          <Button mode="contained" onPress={save} style={{ marginTop: 10, borderRadius: 20, backgroundColor: '#b22222' }} contentStyle={{ height: 50, justifyContent: 'center' }} labelStyle={{ fontSize: 18, fontWeight: 'bold' }}>
            Save & Continue
          </Button>
        </ScrollView>
      </Surface>
    </View>
  );
}


