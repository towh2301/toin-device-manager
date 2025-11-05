// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { TamaguiProvider } from 'tamagui';
import { tamaguiCustomConfig } from './config';
import AppNavigator from './navigation/AppNavigator';

// ------------------------------------------------------------------
// App entry point
// ------------------------------------------------------------------
const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<TamaguiProvider config={tamaguiCustomConfig} defaultTheme="light">
				<NavigationContainer>
					<AppNavigator />
				</NavigationContainer>
				<Toast />
			</TamaguiProvider>
		</QueryClientProvider>
	);
}
