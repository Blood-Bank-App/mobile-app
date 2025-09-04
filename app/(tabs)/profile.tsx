import { getUserProfile, saveUserProfile } from '@/lib/users';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    (async () => {
      const profile = await getUserProfile();
      if (profile) {
        setName(profile.name ?? '');
        setEmail(profile.email ?? '');
        setGender(profile.gender ?? '');
        setBloodGroup(profile.bloodGroup ?? '');
        setCity(profile.city ?? '');
        setAvailable(profile.available ?? true);
      }
    })();
  }, []);

  const onSave = async () => {
    await saveUserProfile({ name, email, gender, bloodGroup, city, available });
    Alert.alert('Saved', 'Profile updated');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <TextInput placeholder="Full Name" style={styles.input} value={name} onChangeText={setName} />
      <TextInput placeholder="Email (optional)" style={styles.input} value={email} onChangeText={setEmail} />
      <TextInput placeholder="Gender" style={styles.input} value={gender} onChangeText={setGender} />
      <TextInput placeholder="Blood Group" style={styles.input} value={bloodGroup} onChangeText={setBloodGroup} />
      <TextInput placeholder="City" style={styles.input} value={city} onChangeText={setCity} />
      <View style={styles.row}>
        <Text style={{ fontWeight: '600' }}>Availability</Text>
        <Switch value={available} onValueChange={setAvailable} />
      </View>
      <TouchableOpacity style={styles.primaryButton} onPress={onSave}>
        <Text style={styles.primaryText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  primaryButton: {
    marginTop: 8,
    backgroundColor: '#E11D48',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '600' },
});


