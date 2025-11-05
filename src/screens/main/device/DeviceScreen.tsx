import React from 'react';
import { Text, YStack } from 'tamagui';

const DeviceScreen = () => {
	return (
		<YStack flex={1} justifyContent="center" alignItems="center">
			<Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
				Welcome to the Device Screen!
			</Text>
		</YStack>
	);
};

export default DeviceScreen;
