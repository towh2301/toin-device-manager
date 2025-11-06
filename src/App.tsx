// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { TamaguiProvider } from 'tamagui';
import { tamaguiCustomConfig } from './config';
import AppNavigator from './navigation/AppNavigator';
import { useAuthStore } from './store/auth.store';

// ------------------------------------------------------------------
// App entry point
// ------------------------------------------------------------------
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: (failureCount, error) => {
				console.log(
					`🔄 [QueryClient] Retry attempt ${failureCount} for error:`,
					error
				);
				return failureCount < 2;
			},
			retryDelay: (attemptIndex) =>
				Math.min(1000 * 2 ** attemptIndex, 30000),
			staleTime: 5 * 60 * 1000, // 5 minutes
			gcTime: 10 * 60 * 1000, // 10 minutes
		},
	},
});

function AppContent() {
	const { initializeFromStorage } = useAuthStore();

	useEffect(() => {
		// Initialize auth state from storage when app starts
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
		<QueryClientProvider client={queryClient}>
			<TamaguiProvider config={tamaguiCustomConfig} defaultTheme="light">
				<AppContent />
				<Toast />
			</TamaguiProvider>
		</QueryClientProvider>
	);
}
