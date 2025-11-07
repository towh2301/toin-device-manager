// 2. Tạo component cho Màn hình Đăng nhập (Auth Stack)
// navigation/AuthStack.tsx
import LoginScreen from '@/src/screens/auth/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { NavigationRoutes, RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name={NavigationRoutes.LOGIN}
				component={LoginScreen}
			/>
		</Stack.Navigator>
	);
};

export default AuthStack;
