import { useAuthStore } from '@/src/store/auth.store';
import { ImageBackground } from 'react-native';
import { Button, Image, Input, View, YStack } from 'tamagui';

const LoginScreen = () => {
	const { setUser, setTokens } = useAuthStore();

	return (
		<YStack
			flex={1}
			// backgroundColor="$bg"
			justifyContent="center"
			alignItems="center"
			padding="$4"
			gap="$3"
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
						objectFit="contain"
					/>
				</View>

				{/* Form */}
				<YStack gap="$2" alignItems="center">
					<Input
						placeholder="Tên đăng nhập"
						padding={10}
						borderWidth={1}
						borderRadius={4}
						height={40}
						width="100%"
					/>
					<Input
						placeholder="Mật khẩu"
						secureTextEntry
						padding={10}
						borderWidth={1}
						borderRadius={4}
						height={40}
						width="100%"
					/>
					<Button
						onPress={() => {
							// Handle login logic here
						}}
						height={40}
						width="100%"
						borderRadius={4}
						backgroundColor="$buttonBackground"
						color="$buttonText"
					>
						Đăng nhập
					</Button>
				</YStack>
			</View>
		</YStack>
	);
};

export default LoginScreen;
