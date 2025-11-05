// 2. Tạo component cho Màn hình Đăng nhập (Auth Stack)
// navigation/AuthStack.tsx
import LoginScreen from '@/src/screens/auth/LoginScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="Login" component={LoginScreen} />
		</Stack.Navigator>
	);
};
