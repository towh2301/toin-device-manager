import { AppColors } from '@/src/common/app-color';
import { NavigationRoutes } from '@/src/navigation/types';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import React from 'react';
// Loại bỏ import { StyleSheet } from 'react-native'; vì chúng ta sẽ dùng props thay thế.
import { Button, Card, Text, XStack, YStack } from 'tamagui';

// Helper function to map route names to icons
const getIcon = (routeName: string, isFocused: boolean) => {
	switch (routeName) {
		case NavigationRoutes.DASHBOARD:
			return isFocused ? 'grid' : 'grid-outline';
		case NavigationRoutes.DEVICE:
			return isFocused ? 'phone-portrait' : 'phone-portrait-outline';
		case NavigationRoutes.TOIN_USER:
			return isFocused ? 'person' : 'person-outline';
		case NavigationRoutes.PROFILE:
			return isFocused ? 'person-circle' : 'person-circle-outline';
		default:
			return 'ellipse';
	}
};

const CustomFloatingBar: React.FC<BottomTabBarProps> = ({
	state,
	descriptors,
	navigation,
}) => {
	// Chúng ta không cần theme, vì đã hardcode màu từ AppColors.
	// const theme = useTheme();

	const primaryColor = AppColors.primary;
	const secondaryColor = AppColors.secondary;
	const backgroundColor = AppColors.background;

	return (
		<YStack
			position="absolute"
			// Vị trí và kích thước của thanh tab nổi
			bottom="$7"
			left="$4"
			right="$4"
			zIndex={100}
		>
			<Card
				backgroundColor="transparent"
				borderRadius="$6" // Bo tròn mạnh
				overflow="hidden" // Cần thiết để clip BlurView
				// Tùy chỉnh Shadow
				shadowColor={primaryColor}
				shadowOpacity={0.15}
				shadowRadius={10}
				elevation={4}
			>
				{/* 1. BLUR VIEW làm nền cho thanh tab (Fix: Dùng props thay cho StyleSheet.absoluteFillObject) */}
				<BlurView
					intensity={60}
					tint="light"
					// 🎯 FIX LỖI TS: Thay thế StyleSheet.absoluteFillObject bằng inline style props
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: 0,
						bottom: 0,
					}}
				/>

				{/* 2. OVERLAY tạo lớp phủ màu nhẹ (Fix: Dùng props thay cho StyleSheet.absoluteFillObject) */}
				<YStack
					backgroundColor={backgroundColor}
					opacity={0.85}
					position="absolute"
					left={0}
					right={0}
					top={0}
					bottom={0}
				/>

				{/* 3. NỘI DUNG THANH TAB */}
				<XStack
					alignItems="center"
					justifyContent="space-around"
					paddingVertical="$2"
					paddingHorizontal="$1.5"
					gap="$0.5"
				>
					{state.routes.map((route, index) => {
						const { options } = descriptors[route.key];
						const label = options.tabBarLabel as string;
						const isFocused = state.index === index;
						const iconName = getIcon(route.name, isFocused);

						const iconColor = isFocused
							? primaryColor
							: secondaryColor;
						const textColor = isFocused
							? primaryColor
							: secondaryColor;

						const onPress = () => {
							const event = navigation.emit({
								type: 'tabPress',
								target: route.key,
								canPreventDefault: true,
							});

							if (!isFocused && !event.defaultPrevented) {
								navigation.navigate(route.name);
							}
						};

						return (
							<Button
								key={route.key}
								onPress={onPress}
								flex={1}
								minHeight={60}
								maxWidth={80}
								chromeless
								backgroundColor="transparent" // Trạng thái bình thường
								pressStyle={{
									// Đảm bảo không có nền hoặc bóng khi nhấn
									backgroundColor: 'transparent',
									shadowColor: 'transparent',
									shadowOffset: { width: 0, height: 0 },
									shadowRadius: 0,
									elevation: 0,
									// Hiệu ứng scale nhẹ khi nhấn
									transform: [{ scale: 0.95 }],
								}}
								animation="bouncy"
								// Áp dụng style cho trạng thái Active
								style={{
									borderRadius: 999,
									// Highlight nền nhẹ cho tab active (Màu chính + opacity 10%)
									backgroundColor: isFocused
										? `${primaryColor}10`
										: 'transparent',
									transition: 'all 0.15s ease-in-out',
								}}
							>
								<YStack
									alignItems="center"
									justifyContent="center"
									gap="$1"
								>
									<Ionicons
										name={iconName}
										size={24}
										color={iconColor}
									/>
									<Text
										fontSize="$2"
										color={textColor}
										fontWeight={isFocused ? '700' : '400'}
									>
										{label}
									</Text>
								</YStack>
							</Button>
						);
					})}
				</XStack>
			</Card>
		</YStack>
	);
};

export default CustomFloatingBar;
