import React from 'react';
import { ActivityIndicator } from 'react-native';
import { View } from 'tamagui';

const LoadingIndicator: React.FC<{ data: string }> = ({ data }) => {
	return (
		<View
			style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
		>
			<ActivityIndicator size="large" color="#007BFF" />
		</View>
	);
};

export default LoadingIndicator;
