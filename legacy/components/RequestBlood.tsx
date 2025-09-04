import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StatusBar, Alert } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-paper-dropdown';
import { onValue, ref } from 'firebase/database';
import { auth, database } from '../database/firebase';
import { postRequest } from '../lib/requests';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'types';

type RequestBloodNavigationProp = NativeStackNavigationProp<RootStackParamList, 'RequestBlood'>;
type RequestBloodRouteProp = RouteProp<RootStackParamList, 'RequestBlood'>;

type Props = {
  navigation: RequestBloodNavigationProp;
  route: RequestBloodRouteProp;
};

type FormState = {
  patientName: string;
  bloodGroup: string;
  city: string;
  gender: string;
  hospital: string;
  units: string;
  neededBy: string;
  notes: string;
};

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const GENDERS = ['Male', 'Female', 'Other'];

export default function RequestBlood({ navigation }: Props) {
  const [form, setForm] = useState<FormState>({
    patientName: '',
    bloodGroup: '',
    city: '',
    gender: '',
    hospital: '',
    units: '',
    neededBy: '',
    notes: '',
  });

  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    const userRef = ref(database, 'users/' + uid);
    const unsub = onValue(userRef, (snap) => {
      const u = snap.val() || {};
      setForm((prev) => ({
        ...prev,
        patientName: prev.patientName || u.DisplayName || '',
        bloodGroup: prev.bloodGroup || u.Blood || '',
        city: prev.city || u.City || '',
        gender: prev.gender || u.Gender || '',
      }));
    });
    return () => unsub();
  }, [uid]);

  const update = (key: keyof FormState, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const canSubmit = useMemo(() => {
    return (
      !!form.patientName &&
      !!form.bloodGroup &&
      !!form.city &&
      !!form.gender &&
      !!form.hospital &&
      !!form.units &&
      Number(form.units) > 0 &&
      !!form.neededBy
    );
  }, [form]);

  const submit = async () => {
    if (!uid) {
      Alert.alert('Please login first');
      return;
    }
    if (!canSubmit) {
      Alert.alert('Please complete all required fields');
      return;
    }
    try {
      const id = await postRequest(uid, {
        patientName: form.patientName,
        bloodGroup: form.bloodGroup,
        city: form.city,
        gender: form.gender,
        hospital: form.hospital,
        units: Number(form.units),
        neededBy: form.neededBy,
        notes: form.notes,
      });
      Alert.alert('Request posted');
      navigation.navigate('RequestDetail', { id });
    } catch (e: any) {
      Alert.alert(e?.message || 'Failed to post request');
    }
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
        <Text style={{ color: '#fff', fontSize: 34, fontWeight: 'bold' }}>Request Blood</Text>
      </View>

      <Surface style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
          <TextInput
            label="Patient Name"
            mode="outlined"
            style={{ marginBottom: 16 }}
            value={form.patientName}
            onChangeText={(t) => update('patientName', t)}
          />

          <View style={{ marginBottom: 16 }}>
            <Dropdown
              label="Required Blood Group"
              placeholder="Select Blood Group"
              options={BLOOD_GROUPS.map((g) => ({ label: g, value: g, key: g }))}
              value={form.bloodGroup}
              onSelect={(val?: string) => update('bloodGroup', val || '')}
            />
          </View>

          <TextInput
            label="City"
            mode="outlined"
            style={{ marginBottom: 16 }}
            value={form.city}
            onChangeText={(t) => update('city', t)}
          />

          <View style={{ marginBottom: 16 }}>
            <Dropdown
              label="Gender"
              placeholder="Select Gender"
              options={GENDERS.map((g) => ({ label: g, value: g, key: g }))}
              value={form.gender}
              onSelect={(val?: string) => update('gender', val || '')}
            />
          </View>

          <TextInput
            label="Hospital/Location"
            mode="outlined"
            style={{ marginBottom: 16 }}
            value={form.hospital}
            onChangeText={(t) => update('hospital', t)}
          />

          <TextInput
            label="Units Required"
            mode="outlined"
            keyboardType="numeric"
            style={{ marginBottom: 16 }}
            value={form.units}
            onChangeText={(t) => update('units', t)}
          />

          <TextInput
            label="Needed By (YYYY-MM-DD HH:mm)"
            mode="outlined"
            placeholder="2025-09-20 14:30"
            style={{ marginBottom: 16 }}
            value={form.neededBy}
            onChangeText={(t) => update('neededBy', t)}
          />

          <TextInput
            label="Additional Notes"
            mode="outlined"
            multiline
            numberOfLines={3}
            style={{ marginBottom: 16 }}
            value={form.notes}
            onChangeText={(t) => update('notes', t)}
          />

          <Button
            mode="contained"
            onPress={submit}
            disabled={!canSubmit}
            style={{ marginTop: 10, borderRadius: 20, backgroundColor: '#b22222' }}
            contentStyle={{ height: 50, justifyContent: 'center' }}
            labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
          >
            Post Request
          </Button>
        </ScrollView>
      </Surface>
    </View>
  );
}


