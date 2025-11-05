import { ActivityIndicator } from 'react-native';
import { View } from 'tamagui';

const LoadingScreen = () => (
	<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
		<ActivityIndicator size="large" color="#007BFF" />
	</View>
);
export default LoadingScreen;
