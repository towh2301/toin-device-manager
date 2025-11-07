// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { TamaguiProvider } from 'tamagui';

import { tamaguiCustomConfig } from './config';
import AppNavigator from './navigation/AppNavigator';
import { useAuthStore } from './store/auth.store';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: (count, error) => count < 2,
			staleTime: 5 * 60 * 1000,
		},
	},
});

function AppContent() {
	const { initializeFromStorage } = useAuthStore();

	useEffect(() => {
		initializeFromStorage();
	}, [initializeFromStorage]);

	return (
		<NavigationContainer>
			<AppNavigator />
		</NavigationContainer>
	);
}

export default function App() {
	return (
		<TamaguiProvider config={tamaguiCustomConfig} defaultTheme="light">
			<QueryClientProvider client={queryClient}>
				<AppContent />
				<Toast />
			</QueryClientProvider>
		</TamaguiProvider>
	);
}
