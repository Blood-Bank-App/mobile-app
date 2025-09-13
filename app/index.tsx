import { Redirect } from 'expo-router';
import React from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { user, initializing } = useAuth();
  if (initializing) return null;
  return <Redirect href={user ? '/(tabs)/home' : '/auth/login'} />;
}

import { auth } from '@/database/firebase';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
	const isLoggedIn = !!auth.currentUser;
	return <Redirect href={isLoggedIn ? '/(tabs)/home' : '/auth/login'} />;
}
