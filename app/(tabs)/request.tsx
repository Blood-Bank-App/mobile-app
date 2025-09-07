import SelectModal from '@/components/SelectModal';
import { Colors } from '@/constants/Colors';
import { useThemeCustom } from '@/context/ThemeContext';
import { BLOOD_GROUPS, CITIES_PK, GENDERS } from '@/data/pk';
import { postRequest } from '@/lib/requests';
import { getUserProfile } from '@/lib/users';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
	const [locationAddress, setLocationAddress] = useState('');
	const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
	const [neededBy, setNeededBy] = useState('');
	const [openPicker, setOpenPicker] = useState<null | 'gender' | 'city' | 'blood'>(null);
	const [requestingLocation, setRequestingLocation] = useState(false);
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

	const onUseCurrentLocation = async () => {
		try {
			setRequestingLocation(true);
			const Location = await import('expo-location');
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert('Permission denied', 'Location permission is required to use current location.');
				return;
			}
			const pos = await Location.getCurrentPositionAsync({});
			setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
			// Reverse geocode best-effort
			const places = await Location.reverseGeocodeAsync({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
			if (places && places.length > 0) {
				const p = places[0];
				const addr = [p.name, p.street, p.city, p.region].filter(Boolean).join(', ');
				setLocationAddress(addr);
			}
		} catch (e) {
			Alert.alert('Location error', 'Unable to fetch current location.');
		} finally {
			setRequestingLocation(false);
		}
	};

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
				locationAddress: locationAddress || undefined,
				locationLat: coords?.lat,
				locationLng: coords?.lng,
				requestedTo,
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
			setLocationAddress('');
			setCoords(null);
		} catch (e: any) {
			Alert.alert('Post failed', e?.message ?? 'Could not post request. Are you logged in?');
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: Colors[theme].background }] }>
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
			<TextInput placeholder="Location Address (optional)" placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'} style={[styles.input, { color: isDark ? '#fff' : '#111827', borderColor: isDark ? '#374151' : '#e5e7eb', backgroundColor: isDark ? '#111827' : '#fff' }]} value={locationAddress} onChangeText={setLocationAddress} />
			<View style={{ flexDirection: 'row', gap: 8 }}>
				<TouchableOpacity style={[styles.smallButton, { backgroundColor: '#111827' }]} onPress={() => Alert.alert('Map picker', 'Map picker not implemented in this demo.')}>
					<Text style={{ color: '#fff', fontWeight: '600' }}>Pick on Map</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.smallButton, { backgroundColor: requestingLocation ? '#6B7280' : '#374151' }]} onPress={onUseCurrentLocation} disabled={requestingLocation}>
					<Text style={{ color: '#fff', fontWeight: '600' }}>{requestingLocation ? 'Locating...' : 'Use current location'}</Text>
				</TouchableOpacity>
			</View>
			<TextInput placeholder="Quantity (units)" placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'} keyboardType="number-pad" style={[styles.input, { color: isDark ? '#fff' : '#111827', borderColor: isDark ? '#374151' : '#e5e7eb', backgroundColor: isDark ? '#111827' : '#fff' }]} value={units} onChangeText={setUnits} />
			<TextInput placeholder="Needed By (timestamp ms, optional)" placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'} keyboardType="number-pad" style={[styles.input, { color: isDark ? '#fff' : '#111827', borderColor: isDark ? '#374151' : '#e5e7eb', backgroundColor: isDark ? '#111827' : '#fff' }]} value={neededBy} onChangeText={setNeededBy} />
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
	smallButton: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
});


