import React from 'react';
import { Text, YStack } from 'tamagui';

const HomeScreen = () => {
	return (
		<YStack flex={1} justifyContent="center" alignItems="center">
			<Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
				Welcome to the Dashboard!
			</Text>
		</YStack>
	);
};
export default HomeScreen;
