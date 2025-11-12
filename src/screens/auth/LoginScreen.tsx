import { AppColors } from '@/src/common/app-color';
import { NavigationRoutes } from '@/src/navigation/types';
import { useLogin } from '@/src/services/auth/useLogin';
import { useAuthStore } from '@/src/store/auth.store';
import { useNavigation } from '@react-navigation/native';
import { Eye, EyeOff, Lock, User } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import {
	ImageBackground,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	TouchableWithoutFeedback,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
	Button,
	Image,
	Input,
	Spinner,
	Text,
	View,
	XStack,
	YStack,
} from 'tamagui';

const LoginScreen = () => {
	const { setTokens, setUser } = useAuthStore();
	const navigation = useNavigation<any>();

	const [username, setUsername] = useState('admin');
	const [password, setPassword] = useState('admin123');
	const [showPassword, setShowPassword] = useState(false);
	const [focusedInput, setFocusedInput] = useState<string | null>(null);

	const { onLogin, isPending } = useLogin({
		onSuccess: async (response) => {
			console.log('Login success response:', response);
			try {
				const { access_token, refresh_token, user } = response.data;
				await setTokens(access_token, refresh_token);
				await setUser(user);
				Toast.show({ type: 'success', text1: 'Đăng nhập thành công' });
				navigation.replace(NavigationRoutes.DASHBOARD);
			} catch (error) {
				console.error('Error saving auth data:', error);
				Toast.show({
					type: 'error',
					text1: 'Lỗi lưu thông tin đăng nhập',
					text2: 'Vui lòng thử lại',
				});
			}
		},
		onError: (error: any) => {
			console.error('Login failed:', error);
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
			Toast.show({
				type: 'error',
				text1: 'Vui lòng nhập đầy đủ thông tin',
			});
			return;
		}
		onLogin({ username, password });
	};

	return (
		<YStack style={{ flex: 1 }}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<YStack flex={1} backgroundColor="$background">
						{/* Background */}
						<ImageBackground
							source={require('../../assets/images/design.png')}
							style={{
								position: 'absolute',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
							}}
							resizeMode="cover"
						>
							<View
								position="absolute"
								top={0}
								left={0}
								right={0}
								bottom={0}
								backgroundColor="rgba(0,0,0,0.3)"
							/>
						</ImageBackground>

						{/* Header */}
						<View
							flex={2}
							justifyContent="flex-end"
							alignItems="center"
							paddingBottom="$8"
						>
							<View
								backgroundColor="rgba(255,255,255,0.95)"
								padding="$6"
								borderRadius="$12"
								shadowColor="#000"
								shadowOffset={{ width: 0, height: 4 }}
								shadowOpacity={0.1}
								shadowRadius={12}
								elevationAndroid={8}
							>
								<Image
									source={require('../../assets/images/logo.png')}
									height={80}
									width={240}
									objectFit="contain"
								/>
							</View>

							<Text
								color="white"
								fontSize="$9"
								fontWeight="bold"
								marginTop="$4"
								textShadowColor="rgba(0,0,0,0.3)"
								textShadowOffset={{ width: 1, height: 1 }}
								textShadowRadius={4}
							>
								Chào mừng trở lại
							</Text>

							<Text
								color="rgba(255,255,255,0.9)"
								fontSize="$5"
								marginTop="$2"
								textAlign="center"
								paddingHorizontal="$4"
							>
								Đăng nhập để tiếp tục sử dụng ứng dụng
							</Text>
						</View>

						{/* Form */}
						<View
							flex={3}
							justifyContent="flex-start"
							paddingTop="$8"
						>
							<View
								backgroundColor="white"
								marginHorizontal="$4"
								paddingVertical="$8"
								paddingHorizontal="$6"
								borderRadius="$8"
								shadowColor="#000"
								shadowOffset={{ width: 0, height: 8 }}
								shadowOpacity={0.15}
								shadowRadius={20}
								elevationAndroid={16}
							>
								<YStack gap="$5">
									{/* Username */}
									<YStack gap="$2">
										<Text
											fontSize="$5"
											fontWeight="600"
											color="$color11"
										>
											Tên đăng nhập
										</Text>

										<XStack
											alignItems="center"
											borderWidth={2}
											borderColor={
												focusedInput === 'username'
													? '$blue8'
													: '$borderColor'
											}
											borderRadius="$4"
											backgroundColor={
												focusedInput === 'username'
													? 'rgba(0,122,255,0.05)'
													: '$background'
											}
										>
											<View paddingLeft="$3">
												<User
													size={20}
													color={
														focusedInput ===
														'username'
															? '$blue10'
															: '$color8'
													}
												/>
											</View>

											<Input
												flex={1}
												placeholder="Nhập tên đăng nhập"
												value={username}
												onChangeText={setUsername}
												autoCapitalize="none"
												paddingLeft="$2.5"
												paddingRight="$4"
												paddingVertical="$3"
												borderWidth={0}
												backgroundColor="transparent"
												fontSize="$5"
												onFocus={() =>
													setFocusedInput('username')
												}
												onBlur={() =>
													setFocusedInput(null)
												}
												focusStyle={{
													borderWidth: 0,
													outlineWidth: 0,
												}}
												hoverStyle={{ borderWidth: 0 }}
												height={'$9'}
											/>
										</XStack>
									</YStack>

									{/* Password */}
									<YStack gap="$2">
										<Text
											fontSize="$5"
											fontWeight="600"
											color="$color11"
										>
											Mật khẩu
										</Text>

										<XStack
											alignItems="center"
											borderWidth={2}
											borderColor={
												focusedInput === 'password'
													? '$blue8'
													: '$borderColor'
											}
											borderRadius="$4"
											backgroundColor={
												focusedInput === 'password'
													? 'rgba(0,122,255,0.05)'
													: '$background'
											}
										>
											<View paddingLeft="$3">
												<Lock
													size={20}
													color={
														focusedInput ===
														'password'
															? '$blue10'
															: '$color8'
													}
												/>
											</View>

											<Input
												flex={1}
												placeholder="Nhập mật khẩu"
												value={password}
												onChangeText={setPassword}
												secureTextEntry={!showPassword}
												paddingLeft="$2.5"
												paddingRight="$2"
												paddingVertical="$3"
												borderWidth={0}
												backgroundColor="transparent"
												fontSize="$5"
												onFocus={() =>
													setFocusedInput('password')
												}
												onBlur={() =>
													setFocusedInput(null)
												}
												focusStyle={{
													borderWidth: 0,
													outlineWidth: 0,
												}}
												hoverStyle={{ borderWidth: 0 }}
												height={'$9'}
											/>

											<Button
												chromeless
												paddingHorizontal="$3"
												pressStyle={{
													backgroundColor:
														'rgba(0,0,0,0.05)',
												}}
												onPress={() =>
													setShowPassword(
														!showPassword
													)
												}
											>
												{showPassword ? (
													<EyeOff
														size={18}
														color="$color8"
													/>
												) : (
													<Eye
														size={18}
														color="$color8"
													/>
												)}
											</Button>
										</XStack>
									</YStack>

									{/* Login Button */}
									<Button
										onPress={handleLogin}
										borderRadius="$4"
										backgroundColor={AppColors.primaryDark}
										color="white"
										fontSize="$6"
										fontWeight="bold"
										disabled={isPending}
										opacity={isPending ? 0.7 : 1}
										marginTop="$4"
										shadowColor={AppColors.primaryDark}
										shadowOffset={{ width: 0, height: 4 }}
										shadowOpacity={0.3}
										shadowRadius={8}
										elevation={4}
										height="$8"
										pressStyle={{
											backgroundColor: '$blue9',
											scale: 0.98,
										}}
										animation="bouncy"
									>
										{isPending ? (
											<XStack
												gap="$2"
												alignItems="center"
											>
												<Spinner
													size="small"
													color="white"
												/>
												<Text color="white">
													Đang đăng nhập...
												</Text>
											</XStack>
										) : (
											'Đăng nhập'
										)}
									</Button>
								</YStack>
							</View>
						</View>
					</YStack>
				</TouchableWithoutFeedback>
			</KeyboardAvoidingView>

			<Toast />
		</YStack>
	);
};

export default LoginScreen;
