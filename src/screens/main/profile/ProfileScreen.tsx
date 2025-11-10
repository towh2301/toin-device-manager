import { AppColors } from '@/src/common/app-color';
import { useAuthStore } from '@/src/store';
import avatar from '@assets/images/person.png';
import { IdCard, LogOut, Mail, Shield, User } from '@tamagui/lucide-icons';
import React from 'react';
import { Alert, ScrollView } from 'react-native';
import {
	Avatar,
	Button,
	Card,
	Separator,
	Spinner,
	Text,
	XStack,
	YStack,
} from 'tamagui';

const ProfileScreen = () => {
	const { user, signOut } = useAuthStore();

	const handleLogout = () => {
		Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', [
			{ text: 'Hủy', style: 'cancel' },
			{
				text: 'Đăng xuất',
				style: 'destructive',
				onPress: () => signOut(),
			},
		]);
	};

	if (!user) {
		return (
			<YStack
				fullscreen
				flex={1}
				alignItems="center"
				justifyContent="center"
				gap="$4"
				backgroundColor={AppColors.background}
			>
				<Spinner size="large" color={AppColors.primary} />
				<Text color={AppColors.textSecondary}>Đang tải hồ sơ...</Text>
			</YStack>
		);
	}

	return (
		<ScrollView
			style={{
				flex: 1,
				backgroundColor: AppColors.background,
			}}
			contentContainerStyle={{
				paddingHorizontal: 16,
				paddingTop: 60,
				paddingBottom: 140,
			}}
		>
			<YStack gap="$4">
				{/* Header */}
				<YStack gap="$2" marginBottom="$3">
					<Text fontSize={13} color={AppColors.textMuted}>
						Hồ sơ cá nhân
					</Text>
					<Text fontSize={28} fontWeight="800" color={AppColors.text}>
						Tài khoản
					</Text>
				</YStack>

				{/* Avatar Card */}
				<Card
					bordered={false}
					padding="$5"
					backgroundColor={AppColors.surface}
					borderRadius="$10"
					shadowColor={AppColors.shadowLight}
					shadowRadius={8}
					shadowOffset={{ width: 0, height: 3 }}
					elevation={3}
				>
					<YStack alignItems="center" gap="$4">
						<YStack
							width={100}
							height={100}
							borderRadius={50}
							borderWidth={4}
							borderColor={AppColors.primary}
							overflow="hidden"
							shadowColor={AppColors.shadowMedium}
							shadowRadius={12}
							shadowOffset={{ width: 0, height: 4 }}
							elevation={5}
						>
							<Avatar circular size="$10">
								<Avatar.Image source={avatar} />
								<Avatar.Fallback
									backgroundColor={AppColors.primary}
								/>
							</Avatar>
						</YStack>
						<YStack alignItems="center" gap="$1">
							<Text
								fontSize={22}
								fontWeight="800"
								color={AppColors.text}
							>
								{user.username}
							</Text>
							<XStack
								paddingHorizontal="$3"
								paddingVertical="$1.5"
								borderRadius="$8"
								backgroundColor={AppColors.primaryLight + '20'}
							>
								<Text
									fontSize={13}
									fontWeight="700"
									color={AppColors.primary}
									textTransform="uppercase"
								>
									{user.role.join(', ')}
								</Text>
							</XStack>
						</YStack>
					</YStack>
				</Card>

				{/* Info Card */}
				<Card
					bordered
					padding="$4"
					backgroundColor={AppColors.surface}
					borderColor={AppColors.border}
					borderRadius="$10"
					shadowColor={AppColors.shadowLight}
					shadowRadius={4}
					shadowOffset={{ width: 0, height: 2 }}
					elevation={2}
				>
					<YStack gap="$3">
						{/* Email */}
						<XStack gap="$3" alignItems="center">
							<YStack
								width={40}
								height={40}
								borderRadius="$8"
								backgroundColor={AppColors.info + '20'}
								alignItems="center"
								justifyContent="center"
							>
								<Mail size={20} color={AppColors.info} />
							</YStack>
							<YStack flex={1}>
								<Text fontSize={12} color={AppColors.textMuted}>
									Email
								</Text>
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									{user.email}
								</Text>
							</YStack>
						</XStack>

						<Separator borderColor={AppColors.border} />

						{/* Username */}
						<XStack gap="$3" alignItems="center">
							<YStack
								width={40}
								height={40}
								borderRadius="$8"
								backgroundColor={AppColors.primary + '20'}
								alignItems="center"
								justifyContent="center"
							>
								<User size={20} color={AppColors.primary} />
							</YStack>
							<YStack flex={1}>
								<Text fontSize={12} color={AppColors.textMuted}>
									Tên đăng nhập
								</Text>
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									{user.username}
								</Text>
							</YStack>
						</XStack>

						<Separator borderColor={AppColors.border} />

						{/* User ID */}
						<XStack gap="$3" alignItems="center">
							<YStack
								width={40}
								height={40}
								borderRadius="$8"
								backgroundColor={AppColors.accent3 + '20'}
								alignItems="center"
								justifyContent="center"
							>
								<IdCard size={20} color={AppColors.accent3} />
							</YStack>
							<YStack flex={1}>
								<Text fontSize={12} color={AppColors.textMuted}>
									ID Người dùng
								</Text>
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									{user.id}
								</Text>
							</YStack>
						</XStack>

						<Separator borderColor={AppColors.border} />

						{/* Role */}
						<XStack gap="$3" alignItems="center">
							<YStack
								width={40}
								height={40}
								borderRadius="$8"
								backgroundColor={AppColors.success + '20'}
								alignItems="center"
								justifyContent="center"
							>
								<Shield size={20} color={AppColors.success} />
							</YStack>
							<YStack flex={1}>
								<Text fontSize={12} color={AppColors.textMuted}>
									Vai trò
								</Text>
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									{user.role.join(', ')}
								</Text>
							</YStack>
						</XStack>
					</YStack>
				</Card>

				{/* Logout Button */}
				<Button
					size="$4"
					backgroundColor={AppColors.danger}
					color="white"
					icon={LogOut}
					fontWeight="700"
					borderRadius="$10"
					marginTop="$2"
					pressStyle={{
						backgroundColor: AppColors.dangerDark,
						scale: 0.97,
					}}
					onPress={handleLogout}
					height={60}
				>
					Đăng xuất
				</Button>
			</YStack>
		</ScrollView>
	);
};

export default ProfileScreen;
