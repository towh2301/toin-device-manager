import React from 'react';
import { Text, YStack } from 'tamagui';

const ToinUserScreen = () => {
	return (
		<YStack flex={1} justifyContent="center" alignItems="center">
			<Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>
				Welcome to the Toin User Screen!
			</Text>
		</YStack>
	);
};
export default ToinUserScreen;
