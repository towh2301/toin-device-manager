// navigation/AppNavigator.tsx
import { NavigationRoutes, RootStackParamList } from '@navigation/types'; // Giả định
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { View } from 'tamagui';
import LoginScreen from '../screens/auth/LoginScreen';
import { useAuthStore } from '../store'; // Hoặc đường dẫn đúng
import TabNavigator from './components/TabNavigator'; // App Stack (Protected)

const RootStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
	// Tách biệt các state cần theo dõi từ Zustand
	const { user, access_token, setTokens } = useAuthStore();

	const [isLoading, setIsLoading] = React.useState(true);

	useEffect(() => {
		const bootstrapAsync = async () => {
			let token: string | null = null;
			try {
				// Khôi phục token khi khởi động app
				token = await AsyncStorage.getItem('accessToken');
				if (token) {
					// Cập nhật Zustand (chỉ cần access token để kiểm tra đăng nhập)
					setTokens(token, '');
				}
			} catch (e) {
				console.error('Failed to restore token:', e);
			} finally {
				setIsLoading(false);
			}
		};
		bootstrapAsync();
	}, [setTokens]); // setTokens được đảm bảo ổn định bởi Zustand

	if (isLoading) {
		// Màn hình loading khi đang kiểm tra token lần đầu
		return (
			<View flex={1} justifyContent="center" alignItems="center">
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<RootStack.Navigator screenOptions={{ headerShown: false }}>
			{access_token && user ? (
				// CÓ TOKEN: Hiển thị App Stack (Protected)
				<RootStack.Screen
					name={NavigationRoutes.MAIN} // Giả định MAIN dẫn đến TabNavigator
					component={TabNavigator}
				/>
			) : (
				// KHÔNG CÓ TOKEN: Hiển thị Auth Stack (Public)
				<RootStack.Screen
					name={NavigationRoutes.LOGIN} // Giả định LOGIN dẫn đến LoginNavigator
					component={LoginScreen}
				/>
			)}
		</RootStack.Navigator>
	);
};

export default AppNavigator;
