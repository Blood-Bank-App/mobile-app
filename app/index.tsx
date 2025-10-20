import { tokenManager } from '@/services/api';
import { Redirect } from 'expo-router';
import React, { useEffect, useState } from 'react';

export default function Index() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const token = await tokenManager.getAccessToken();
				setIsLoggedIn(!!token);
			} catch (error) {
				setIsLoggedIn(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	if (isLoading) {
		return null; // Or a loading spinner
	}

	return <Redirect href={isLoggedIn ? '/(tabs)/home' : '/auth/login'} />;
}
