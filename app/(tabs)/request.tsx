import { postRequest } from '@/lib/requests';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RequestBloodScreen() {
  const [patientName, setPatientName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [city, setCity] = useState('');
  const [gender, setGender] = useState('');
  const [hospital, setHospital] = useState('');
  const [units, setUnits] = useState('');
  const [notes, setNotes] = useState('');

  const onSubmit = async () => {
    if (!patientName || !bloodGroup || !city) {
      Alert.alert('Missing fields', 'Please fill patient name, blood group and city.');
      return;
    }
    await postRequest({
      patientName,
      requiredBloodGroup: bloodGroup,
      city,
      gender,
      hospital,
      unitsRequired: units ? Number(units) : undefined,
      notes,
    });
    Alert.alert('Posted', 'Your request has been posted.');
    setPatientName('');
    setBloodGroup('');
    setCity('');
    setGender('');
    setHospital('');
    setUnits('');
    setNotes('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request Blood</Text>
      <TextInput placeholder="Patient Name" style={styles.input} value={patientName} onChangeText={setPatientName} />
      <TextInput placeholder="Blood Group (e.g., O+)" style={styles.input} value={bloodGroup} onChangeText={setBloodGroup} />
      <TextInput placeholder="City" style={styles.input} value={city} onChangeText={setCity} />
      <TextInput placeholder="Gender" style={styles.input} value={gender} onChangeText={setGender} />
      <TextInput placeholder="Hospital/Location" style={styles.input} value={hospital} onChangeText={setHospital} />
      <TextInput placeholder="Units Required" keyboardType="number-pad" style={styles.input} value={units} onChangeText={setUnits} />
      <TextInput placeholder="Additional Notes" style={[styles.input, styles.textarea]} value={notes} onChangeText={setNotes} multiline />
      <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
        <Text style={styles.primaryText}>Post Request</Text>
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
  textarea: { height: 100, textAlignVertical: 'top' },
  primaryButton: {
    marginTop: 8,
    backgroundColor: '#E11D48',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '600' },
});


