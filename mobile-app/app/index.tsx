import { auth } from '@/database/firebase';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
	const isLoggedIn = !!auth.currentUser;
	return <Redirect href={isLoggedIn ? '/(tabs)/home' : '/auth/login'} />;
}
