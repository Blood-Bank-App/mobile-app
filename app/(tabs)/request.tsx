import SelectModal from '@/components/SelectModal';
import { Colors } from '@/constants/Colors';
import { useThemeCustom } from '@/context/ThemeContext';
import { BLOOD_GROUPS, CITIES_PK, GENDERS } from '@/data/pk';
import { postRequest } from '@/lib/requests';
import { getUserProfile } from '@/lib/users';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
	const [requestedTo, setRequestedTo] = useState<string | undefined>(
		typeof params.requestedTo === 'string' ? params.requestedTo : undefined
	);
	const [targetedUserName, setTargetedUserName] = useState<string>('');
	const [locationLat, setLocationLat] = useState<number | undefined>();
	const [locationLng, setLocationLng] = useState<number | undefined>();
	const [gettingLocation, setGettingLocation] = useState(false);

	// Update requestedTo when params change
	useEffect(() => {
		const paramRequestedTo = typeof params.requestedTo === 'string' ? params.requestedTo : undefined;
		if (paramRequestedTo !== requestedTo) {
			setRequestedTo(paramRequestedTo);
		}
	}, [params.requestedTo]);

	useEffect(() => {
		(async () => {
			const profile = await getUserProfile();
			if (profile) {
				if (!patientName) setPatientName(profile.name ?? '');
				if (!bloodGroup && profile.bloodGroup) setBloodGroup(profile.bloodGroup);
				if (!city && profile.city) setCity(profile.city);
				if (!gender && profile.gender) setGender(profile.gender);
			}

			// Get current location
			setGettingLocation(true);
			try {
				const { status } = await Location.requestForegroundPermissionsAsync();
				if (status === 'granted') {
					const location = await Location.getCurrentPositionAsync({});
					setLocationLat(location.coords.latitude);
					setLocationLng(location.coords.longitude);
				} else {
					Alert.alert(
						'Location Permission',
						'Location permission is needed to find nearby donors. You can still create a request without it.'
					);
				}
			} catch (error) {
				console.error('Error getting location:', error);
			} finally {
				setGettingLocation(false);
			}
		})();
	}, []);

	// Load targeted user name when requestedTo changes
	useEffect(() => {
		(async () => {
			if (requestedTo) {
				try {
					const targetedUser = await getUserProfile(requestedTo);
					if (targetedUser) {
						setTargetedUserName(targetedUser.name);
					}
				} catch (error) {
					console.error('Error getting targeted user:', error);
					setTargetedUserName('');
				}
			} else {
				setTargetedUserName('');
			}
		})();
	}, [requestedTo]);


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
				locationLat,
				locationLng,
				unitsRequired: units ? Number(units) : undefined,
				notes,
				requestedTo: requestedTo || undefined,
			});
			Alert.alert('Posted', 'Your request has been posted.');
			setPatientName('');
			setBloodGroup('');
			setCity('');
			setGender('');
			setHospital('');
			setUnits('');
			setNotes('');
			setRequestedTo(undefined);
			setTargetedUserName('');
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
			
			{gettingLocation && (
				<View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
					<ActivityIndicator size="small" color={isDark ? '#fff' : '#111827'} />
					<Text style={{ color: isDark ? '#D1D5DB' : '#6B7280', fontSize: 12 }}>
						Getting your location...
					</Text>
				</View>
			)}

			{requestedTo && targetedUserName ? (
				<View style={[styles.targetedUserContainer, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6', borderColor: '#E11D48', borderWidth: 2 }]}>
					<View style={{ flex: 1 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
							<Ionicons name="person-circle" size={16} color="#E11D48" />
							<Text style={{ color: '#E11D48', fontSize: 12, fontWeight: '600' }}>
								Targeted Request
							</Text>
						</View>
						<Text style={{ color: isDark ? '#fff' : '#111827', fontWeight: '600', fontSize: 16 }}>
							{targetedUserName}
						</Text>
						<Text style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: 11, marginTop: 4 }}>
							Only this donor will be notified. Remove to make it a general request.
						</Text>
					</View>
					<TouchableOpacity
						onPress={() => {
							setRequestedTo(undefined);
							setTargetedUserName('');
						}}
						style={[styles.removeButton, { backgroundColor: isDark ? '#374151' : '#E5E7EB' }]}
					>
						<Ionicons name="close-circle" size={20} color={isDark ? '#fff' : '#111827'} />
					</TouchableOpacity>
				</View>
			) : (
				<View style={[styles.generalRequestInfo, { backgroundColor: isDark ? '#1F2937' : '#F3F4F6', borderColor: isDark ? '#374151' : '#E5E7EB' }]}>
					<Ionicons name="globe" size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
					<Text style={{ color: isDark ? '#9CA3AF' : '#6B7280', fontSize: 12, marginLeft: 6 }}>
						General request - All matching donors will be notified
					</Text>
				</View>
			)}

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
	targetedUserContainer: {
		marginTop: 12,
		padding: 12,
		borderRadius: 10,
		borderWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	removeButton: {
		padding: 8,
		borderRadius: 6,
		alignItems: 'center',
		justifyContent: 'center',
	},
	generalRequestInfo: {
		marginTop: 12,
		padding: 12,
		borderRadius: 10,
		borderWidth: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
});


