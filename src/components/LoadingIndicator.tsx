import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Text } from 'tamagui';

const LoadingIndicator: React.FC<{ data: string }> = ({ data }) => {
	return (
		<>
			<Text>{data}</Text>
			<ActivityIndicator size="large" color="#0000ff" />
		</>
	);
};

export default LoadingIndicator;
