// App.tsx
import React from 'react';
import { TamaguiProvider, Theme } from 'tamagui';
import { tamaguiCustomConfig } from './config';
import LoginScreen from './screens/auth';

// ------------------------------------------------------------------
// App entry point
// ------------------------------------------------------------------
export default function App() {
	// You can toggle `defaultTheme` or use a state to switch themes
	return (
		<TamaguiProvider config={tamaguiCustomConfig} defaultTheme="light">
			{/* Force dark theme on the whole app – remove to use OS preference */}
			<Theme name="light">
				<LoginScreen />
			</Theme>
		</TamaguiProvider>
	);
}
