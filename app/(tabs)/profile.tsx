import SelectModal from '@/components/SelectModal';
import { BLOOD_GROUPS, CITIES_PK, GENDERS } from '@/data/pk';
import { auth } from '@/database/firebase';
import { getUserProfile, saveUserProfile } from '@/lib/users';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [gender, setGender] = useState('');
	const [bloodGroup, setBloodGroup] = useState('');
	const [city, setCity] = useState('');
	const [phone, setPhone] = useState('+92');
	const [cnic, setCnic] = useState('');
	const [available, setAvailable] = useState(true);
	const [openPicker, setOpenPicker] = useState<null | 'gender' | 'city' | 'blood'>(null);

	const normalizePhone = (value: string) => {
		if (!value.startsWith('+92')) return '+92';
		const digits = value.replace(/[^\d+]/g, '');
		return digits.slice(0, 13);
	};

	useEffect(() => {
		(async () => {
			const profile = await getUserProfile();
			if (profile) {
				setName(profile.name ?? '');
				setEmail(profile.email ?? '');
				setGender(profile.gender ?? '');
				setBloodGroup(profile.bloodGroup ?? '');
				setCity(profile.city ?? '');
				setPhone(profile.phone ?? '+92');
				setCnic(profile.cnic ?? '');
				setAvailable(profile.available ?? true);
			}
		})();
	}, []);

	const onSave = async () => {
		await saveUserProfile({ name, email, gender, bloodGroup, city, phone, cnic, available });
		Alert.alert('Saved', 'Profile updated');
	};

	const onLogout = async () => {
		try {
			await signOut(auth);
			router.replace('/auth/login');
		} catch (e: any) {
			Alert.alert('Logout failed', e?.message ?? 'Try again');
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Profile</Text>
			<TextInput placeholder="Full Name" style={styles.input} value={name} onChangeText={setName} />
			<TextInput placeholder="Email" style={[styles.input, styles.inputDisabled]} value={email} onChangeText={setEmail} editable={false} />
			<TouchableOpacity style={styles.input} onPress={() => setOpenPicker('gender')}>
				<Text>{gender || 'Gender'}</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.input} onPress={() => setOpenPicker('blood')}>
				<Text>{bloodGroup || 'Blood Group'}</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.input} onPress={() => setOpenPicker('city')}>
				<Text>{city || 'City'}</Text>
			</TouchableOpacity>
			<TextInput placeholder="Phone (+92...)" style={styles.input} value={phone} onChangeText={(v)=>setPhone(normalizePhone(v))} keyboardType="phone-pad" />
			<TextInput placeholder="CNIC (optional)" style={styles.input} value={cnic} onChangeText={setCnic} />
			<View style={styles.row}>
				<Text style={{ fontWeight: '600' }}>Availability</Text>
				<Switch value={available} onValueChange={setAvailable} />
			</View>
			<TouchableOpacity style={styles.primaryButton} onPress={onSave}>
				<Text style={styles.primaryText}>Save Profile</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.secondaryButton} onPress={onLogout}>
				<Text style={styles.secondaryText}>Logout</Text>
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
	inputDisabled: { backgroundColor: '#f3f4f6' },
	row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
	primaryButton: {
		marginTop: 8,
		backgroundColor: '#E11D48',
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: 'center',
	},
	primaryText: { color: '#fff', fontWeight: '600' },
	secondaryButton: {
		marginTop: 8,
		borderColor: '#111827',
		borderWidth: 1,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: 'center',
	},
	secondaryText: { color: '#111827', fontWeight: '600' },
});


