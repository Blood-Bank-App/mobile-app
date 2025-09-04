import { Colors } from '@/constants/Colors';
import { auth } from '@/database/firebase';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
	const colorScheme = useColorScheme();
	const isLoggedIn = !!auth.currentUser;
	if (!isLoggedIn) {
		return <Redirect href="/auth/login" />;
	}

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
				headerShown: true,
				headerTitleAlign: 'center',
				headerStyle: { backgroundColor: '#b22222' },
				headerTintColor: '#fff',
				tabBarStyle: Platform.select({
					ios: { position: 'absolute' },
					default: {},
				}),
			}}>
			<Tabs.Screen
				name="home"
				options={{
					title: 'Home',
					tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size ?? 24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="donors"
				options={{
					title: 'Donors',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="people" size={size ?? 24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="request"
				options={{
					title: 'Request',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="medkit" size={size ?? 24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="history"
				options={{
					title: 'History',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="time" size={size ?? 24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person" size={size ?? 24} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
