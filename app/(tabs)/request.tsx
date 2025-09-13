import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { postRequest } from '@/lib/requests';

export default function RequestScreen() {
  const [patientName, setPatientName] = useState('');
  const [requiredBloodGroup, setRequiredBloodGroup] = useState('O+');
  const [city, setCity] = useState('Karachi');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit() {
    setLoading(true); setMessage(null);
    try {
      if (!patientName.trim() || !requiredBloodGroup.trim() || !city.trim()) throw new Error('Required fields missing');
      const id = await postRequest({ patientName: patientName.trim(), requiredBloodGroup: requiredBloodGroup.trim() as any, city: city.trim(), notes: notes.trim() });
      setMessage(`Request posted: ${id}`);
      setPatientName(''); setNotes('');
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12 }}>Post Blood Request</Text>
      <Text>Patient Name</Text>
      <TextInput value={patientName} onChangeText={setPatientName} style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <Text>Required Blood Group</Text>
      <TextInput value={requiredBloodGroup} onChangeText={setRequiredBloodGroup} style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <Text>City</Text>
      <TextInput value={city} onChangeText={setCity} style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <Text>Notes (optional)</Text>
      <TextInput value={notes} onChangeText={setNotes} style={{ borderWidth: 1, padding: 8, marginBottom: 12 }} />
      <Button title={loading ? 'Posting...' : 'Post Request'} onPress={onSubmit} disabled={loading} />
      {message && <Text style={{ marginTop: 12 }}>{message}</Text>}
    </View>
  );
}

import SelectModal from '@/components/SelectModal';
import { Colors } from '@/constants/Colors';
import { useThemeCustom } from '@/context/ThemeContext';
import { BLOOD_GROUPS, CITIES_PK, GENDERS } from '@/data/pk';
import { postRequest } from '@/lib/requests';
import { getUserProfile } from '@/lib/users';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RequestBloodScreen() {
	const { theme } = useThemeCustom();
	const isDark = theme === 'dark';
	const params = useLocalSearchParams<{ requestedTo?: string }>();
	const [patientName, setPatientName] = useState('');
	const [bloodGroup, setBloodGroup] = useState('');
	const [city, setCity] = useState('');
	const [gender, setGender] = useState('');
	const [hospital, setHospital] = useState('');
	const [units, setUnits] = useState('');
	const [notes, setNotes] = useState('');
	const [openPicker, setOpenPicker] = useState<null | 'gender' | 'city' | 'blood'>(null);
	const requestedTo = typeof params.requestedTo === 'string' ? params.requestedTo : undefined;

	useEffect(() => {
		(async () => {
			const profile = await getUserProfile();
			if (profile) {
				if (!patientName) setPatientName(profile.name ?? '');
				if (!bloodGroup && profile.bloodGroup) setBloodGroup(profile.bloodGroup);
				if (!city && profile.city) setCity(profile.city);
				if (!gender && profile.gender) setGender(profile.gender);
			}
		})();
	}, []);


	const onSubmit = async () => {
		if (!patientName || !bloodGroup || !city) {
			Alert.alert('Missing fields', 'Please fill patient name, blood group and city.');
			return;
		}
		try {
			await postRequest({
				patientName,
				requiredBloodGroup: bloodGroup,
				city,
				gender,
				hospital,
				unitsRequired: units ? Number(units) : undefined,
				notes,
				requestedTo,
			});
			Alert.alert('Posted', 'Your request has been posted.');
			setPatientName('');
			setBloodGroup('');
			setCity('');
			setGender('');
			setHospital('');
			setUnits('');
			setNotes('');
		} catch (e: any) {
			Alert.alert('Post failed', e?.message ?? 'Could not post request. Are you logged in?');
		}
	};

	return (
		<ScrollView 
			style={[styles.scrollContainer, { backgroundColor: Colors[theme].background }]}
			contentContainerStyle={styles.scrollContent}
			showsVerticalScrollIndicator={false}
			keyboardShouldPersistTaps="handled"
		>
			<Text style={[styles.title, { color: isDark ? '#fff' : Colors[theme].text }]}>Request Blood</Text>
			<TextInput placeholder="Patient Name" placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'} style={[styles.input, { color: isDark ? '#fff' : '#111827', borderColor: isDark ? '#374151' : '#e5e7eb', backgroundColor: isDark ? '#111827' : '#fff' }]} value={patientName} onChangeText={setPatientName} />
			<TouchableOpacity style={[styles.input, { borderColor: isDark ? '#374151' : '#e5e7eb', backgroundColor: isDark ? '#111827' : '#fff' }]} onPress={() => setOpenPicker('blood')}>
				<Text style={{ color: isDark ? (bloodGroup ? '#fff' : '#9CA3AF') : '#111827' }}>{bloodGroup || 'Blood Group'}</Text>
			</TouchableOpacity>
			<TouchableOpacity style={[styles.input, { borderColor: isDark ? '#374151' : '#e5e7eb', backgroundColor: isDark ? '#111827' : '#fff' }]} onPress={() => setOpenPicker('city')}>
				<Text style={{ color: isDark ? (city ? '#fff' : '#9CA3AF') : '#111827' }}>{city || 'City'}</Text>
			</TouchableOpacity>
			<TouchableOpacity style={[styles.input, { borderColor: isDark ? '#374151' : '#e5e7eb', backgroundColor: isDark ? '#111827' : '#fff' }]} onPress={() => setOpenPicker('gender')}>
				<Text style={{ color: isDark ? (gender ? '#fff' : '#9CA3AF') : '#111827' }}>{gender || 'Gender'}</Text>
			</TouchableOpacity>
			<TextInput placeholder="Hospital/Location" placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'} style={[styles.input, { color: isDark ? '#fff' : '#111827', borderColor: isDark ? '#374151' : '#e5e7eb', backgroundColor: isDark ? '#111827' : '#fff' }]} value={hospital} onChangeText={setHospital} />
			<TextInput placeholder="Quantity (units)" placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'} keyboardType="number-pad" style={[styles.input, { color: isDark ? '#fff' : '#111827', borderColor: isDark ? '#374151' : '#e5e7eb', backgroundColor: isDark ? '#111827' : '#fff' }]} value={units} onChangeText={setUnits} />
			<TextInput placeholder="Additional Notes" placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'} style={[styles.input, styles.textarea, { color: isDark ? '#fff' : '#111827', borderColor: isDark ? '#374151' : '#e5e7eb', backgroundColor: isDark ? '#111827' : '#fff' }]} value={notes} onChangeText={setNotes} multiline />
			{requestedTo ? (
				<View style={{ marginTop: 4 }}>
					<Text style={{ color: isDark ? '#D1D5DB' : '#6B7280' }}>Requesting a specific donor</Text>
				</View>
			) : null}
			<TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
				<Text style={styles.primaryText}>Post Request</Text>
			</TouchableOpacity>

			<SelectModal
				visible={openPicker === 'gender'}
				title="Select Gender"
				options={GENDERS}
				onClose={() => setOpenPicker(null)}
				onSelect={(v) => { setGender(v); setOpenPicker(null); }}
			/>
			<SelectModal
				visible={openPicker === 'city'}
				title="Select City"
				options={CITIES_PK}
				onClose={() => setOpenPicker(null)}
				onSelect={(v) => { setCity(v); setOpenPicker(null); }}
			/>
			<SelectModal
				visible={openPicker === 'blood'}
				title="Select Blood Group"
				options={BLOOD_GROUPS}
				onClose={() => setOpenPicker(null)}
				onSelect={(v) => { setBloodGroup(v); setOpenPicker(null); }}
			/>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	scrollContainer: { flex: 1 },
	scrollContent: { 
		padding: 16, 
		paddingBottom: 40, 
		gap: 10,
		flexGrow: 1 
	},
	title: { fontSize: 24, fontWeight: '700', marginBottom: 4 },
	input: {
		borderWidth: 1,
		borderColor: '#e5e7eb',
		borderRadius: 10,
		padding: 12,
	},
	textarea: { minHeight: 100, textAlignVertical: 'top' },
	primaryButton: {
		marginTop: 16,
		marginBottom: 8,
		backgroundColor: '#E11D48',
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: 'center',
	},
	primaryText: { color: '#fff', fontWeight: '600' },
});


