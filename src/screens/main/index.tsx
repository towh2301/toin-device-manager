import { NavigationRoutes } from '@/src/navigation/types';
import LoadingScreen from '@screens/components/LoadingScreen';
import { useNavigation } from 'expo-router';
import React, { Suspense } from 'react';
import { Button, H1, Text, YStack } from 'tamagui';

const MainScreen = () => {
	const navigation = useNavigation();

	return (
		<Suspense fallback={<LoadingScreen />}>
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				backgroundColor="$background"
				padding="$4"
			>
				<H1 color="$blue10">Chào mừng đến với Tamagui App!</H1>
				<Text fontSize="$5" marginVertical="$3" color="$color">
					Đây là màn hình Trang Chủ, được xây dựng bằng Tamagui.
				</Text>

				{/* Ví dụ về một component Tamagui */}
				<Button
					onPress={() => navigation.navigate(NavigationRoutes.LOGIN)}
					size="$4"
					theme="blue" // Áp dụng một theme cục bộ cho Button
				>
					Đi đến Đăng Nhập
				</Button>
			</YStack>
		</Suspense>
	);
};

export default MainScreen;
