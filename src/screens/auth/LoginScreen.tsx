import { useLogin } from '@/src/services/auth/useLogin';
import { useAuthStore } from '@/src/store/auth.store';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { Button, Image, Input, View, YStack } from 'tamagui';

const LoginScreen = () => {
	const { setTokens, setUser } = useAuthStore();
	const navigation = useNavigation<any>(); // Add <any> if no types

	const [username, setUsername] = useState('admin');
	const [password, setPassword] = useState('admin123');

	const { onLogin, isPending } = useLogin({
		onSuccess: async (response) => {
			console.log('✅ [LoginScreen] Login success response:', response);

			try {
				const authData = response.data;
				const { access_token, refresh_token, user } = authData;

				Toast.show({ type: 'success', text1: 'Đăng nhập thành công' });

				// Use async setTokens and setUser
				await setTokens(access_token, refresh_token);
				await setUser(user);

				console.log('✅ [LoginScreen] Auth data saved successfully');
			} catch (error) {
				console.error(
					'❌ [LoginScreen] Error saving auth data:',
					error
				);
				Toast.show({
					type: 'error',
					text1: 'Lỗi lưu thông tin đăng nhập',
					text2: 'Vui lòng thử lại',
				});
			}
		},
		onError: (error: any) => {
			console.error('❌ [LoginScreen] Login failed:', error);

			let errorMessage = 'Lỗi không xác định';

			if (error.message?.includes('Network Error')) {
				errorMessage =
					'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.';
			} else if (error.message?.includes('timeout')) {
				errorMessage = 'Kết nối quá chậm. Vui lòng thử lại.';
			} else if (
				error.message?.includes('401') ||
				error.message?.includes('Unauthorized')
			) {
				errorMessage = 'Sai tên đăng nhập hoặc mật khẩu';
			} else if (error.message) {
				errorMessage = error.message;
			}

			Toast.show({
				type: 'error',
				text1: 'Đăng nhập thất bại',
				text2: errorMessage,
			});
		},
	});

	const handleLogin = () => {
		if (!username || !password) {
			Toast.show({ type: 'error', text1: 'Vui lòng nhập đầy đủ' });
			return;
		}
		onLogin({ username, password });
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				padding="$4"
				gap="$3"
				backgroundColor="$bg"
			>
				<ImageBackground
					source={require('../../assets/images/design.png')}
					style={{
						position: 'absolute',
						bottom: -140,
						alignSelf: 'center',
						width: '100%',
						height: '90%',
					}}
					resizeMode="cover"
				/>

				<View
					width="100%"
					maxWidth={400}
					height="110%"
					backgroundColor="$card"
					paddingVertical="$16"
					paddingHorizontal="$6"
					borderRadius="$4"
					gap={100}
				>
					{/* Logo */}
					<View
						justifyContent="center"
						alignItems="center"
						marginBottom="$4"
					>
						<Image
							source={require('../../assets/images/logo.png')}
							height={80}
							width={200}
							objectFit="contain"
						/>
					</View>

					{/* Form */}
					<YStack gap="$2" alignItems="center">
						<Input
							placeholder="Tên đăng nhập"
							value={username}
							onChangeText={setUsername}
							autoCapitalize="none"
							padding={10}
							borderWidth={1}
							borderRadius={4}
							height={40}
							width="100%"
						/>
						<Input
							placeholder="Mật khẩu"
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							padding={10}
							borderWidth={1}
							borderRadius={4}
							height={40}
							width="100%"
						/>
						<Button
							onPress={handleLogin}
							height={40}
							width="100%"
							borderRadius={4}
							backgroundColor="$buttonBackground"
							color="$buttonText"
							disabled={isPending}
							opacity={isPending ? 0.7 : 1}
						>
							{isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
						</Button>
					</YStack>
				</View>
			</YStack>
			<Toast />
		</SafeAreaView>
	);
};

export default LoginScreen;
