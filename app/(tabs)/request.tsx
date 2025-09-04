import SelectModal from '@/components/SelectModal';
import { BLOOD_GROUPS, CITIES_PK, GENDERS } from '@/data/pk';
import { postRequest } from '@/lib/requests';
import { getUserProfile } from '@/lib/users';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RequestBloodScreen() {
	const [patientName, setPatientName] = useState('');
	const [bloodGroup, setBloodGroup] = useState('');
	const [city, setCity] = useState('');
	const [gender, setGender] = useState('');
	const [hospital, setHospital] = useState('');
	const [units, setUnits] = useState('');
	const [notes, setNotes] = useState('');
	const [neededBy, setNeededBy] = useState('');
	const [openPicker, setOpenPicker] = useState<null | 'gender' | 'city' | 'blood'>(null);

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
				neededBy: neededBy ? Number(neededBy) : undefined,
				notes,
			});
			Alert.alert('Posted', 'Your request has been posted.');
			setPatientName('');
			setBloodGroup('');
			setCity('');
			setGender('');
			setHospital('');
			setUnits('');
			setNeededBy('');
			setNotes('');
		} catch (e: any) {
			Alert.alert('Post failed', e?.message ?? 'Could not post request. Are you logged in?');
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Request Blood</Text>
			<TextInput placeholder="Patient Name" style={styles.input} value={patientName} onChangeText={setPatientName} />
			<TouchableOpacity style={styles.input} onPress={() => setOpenPicker('blood')}>
				<Text>{bloodGroup || 'Blood Group'}</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.input} onPress={() => setOpenPicker('city')}>
				<Text>{city || 'City'}</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.input} onPress={() => setOpenPicker('gender')}>
				<Text>{gender || 'Gender'}</Text>
			</TouchableOpacity>
			<TextInput placeholder="Hospital/Location" style={styles.input} value={hospital} onChangeText={setHospital} />
			<TextInput placeholder="Quantity (units)" keyboardType="number-pad" style={styles.input} value={units} onChangeText={setUnits} />
			<TextInput placeholder="Needed By (timestamp ms, optional)" keyboardType="number-pad" style={styles.input} value={neededBy} onChangeText={setNeededBy} />
			<TextInput placeholder="Additional Notes" style={[styles.input, styles.textarea]} value={notes} onChangeText={setNotes} multiline />
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


