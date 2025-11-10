import { AppColors } from '@/src/common/app-color';
import { StatusBadge } from '@/src/components/StatusBadge';
import { NavigationRoutes } from '@/src/navigation/types';
import { useAuthStore } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DeviceResponse, DeviceStatus } from '@services/device/types';
import { useGetAllDevices } from '@services/device/useGetAllDevices';
import React, { useMemo } from 'react';
import { FlatList } from 'react-native';
import { Button, Card, Separator, Text, XStack, YStack } from 'tamagui';

const statusLabels: Record<DeviceStatus, string> = {
	[DeviceStatus.AVAILABLE]: 'Sẵn sàng',
	[DeviceStatus.IN_USE]: 'Đang dùng',
	[DeviceStatus.MAINTENANCE]: 'Bảo trì',
	[DeviceStatus.RETIREMENT]: 'Ngưng dùng',
};

const statusColors: Record<DeviceStatus, { bg: string; text: string }> = {
	[DeviceStatus.AVAILABLE]: {
		bg: AppColors.successLight,
		text: AppColors.successDark,
	},
	[DeviceStatus.IN_USE]: {
		bg: AppColors.infoLight,
		text: AppColors.infoDark,
	},
	[DeviceStatus.MAINTENANCE]: {
		bg: AppColors.warningLight,
		text: AppColors.warningDark,
	},
	[DeviceStatus.RETIREMENT]: {
		bg: '#F3F4F6',
		text: '#6B7280',
	},
};

const HomeScreen = () => {
	const {
		deviceData,
		isLoading,
		isError,
		error,
		onGetAllDevices,
		isFetching,
	} = useGetAllDevices();
	const navigation = useNavigation<any>();
	const { user } = useAuthStore();

	const stats = useMemo(() => {
		if (!deviceData) {
			return {
				total: 0,
				byStatus: {
					[DeviceStatus.AVAILABLE]: 0,
					[DeviceStatus.IN_USE]: 0,
					[DeviceStatus.MAINTENANCE]: 0,
					[DeviceStatus.RETIREMENT]: 0,
				},
			};
		}

		const total = deviceData.length;
		const byStatus: Record<DeviceStatus, number> = {
			[DeviceStatus.AVAILABLE]: 0,
			[DeviceStatus.IN_USE]: 0,
			[DeviceStatus.MAINTENANCE]: 0,
			[DeviceStatus.RETIREMENT]: 0,
		};
		for (const d of deviceData)
			byStatus[d.status] = (byStatus[d.status] || 0) + 1;
		return { total, byStatus };
	}, [deviceData]);

	// Lấy 6 thiết bị mới nhất
	const recentDevices = useMemo(() => {
		if (!deviceData) return [];
		return deviceData.slice(0, 6);
	}, [deviceData]);

	// Get greeting based on time
	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return 'Chào buổi sáng';
		if (hour < 18) return 'Chào buổi chiều';
		return 'Chào buổi tối';
	};

	// Nhận 1 device duy nhất - Thiết kế mới đẹp hơn
	const renderDeviceItem = ({ item }: { item: DeviceResponse }) => {
		return (
			<Card
				key={item.id}
				padding="$4"
				bordered
				backgroundColor={AppColors.surface}
				borderColor={AppColors.border}
				borderWidth={1}
				shadowColor={AppColors.shadowLight}
				shadowRadius={6}
				shadowOffset={{ width: 0, height: 2 }}
				elevation={3}
				pressStyle={{
					scale: 0.97,
					borderColor: AppColors.primary,
					shadowRadius: 8,
				}}
				animation="quick"
				borderRadius="$4"
				onPress={() =>
					navigation.navigate(NavigationRoutes.DEVICE, {
						screen: NavigationRoutes.DEVICE_DETAIL,
						params: { serialNumber: item.serialNumber },
					})
				}
			>
				<XStack gap="$3" alignItems="flex-start">
					{/* Device Icon */}
					<YStack
						width={52}
						height={52}
						backgroundColor={AppColors.primaryLight + '30'}
						borderRadius="$3"
						justifyContent="center"
						alignItems="center"
						borderWidth={1}
						borderColor={AppColors.primary + '20'}
					>
						<Ionicons
							name="phone-portrait-outline"
							size={26}
							color={AppColors.primary}
						/>
					</YStack>

					{/* Device Info */}
					<YStack flex={1} gap="$2">
						<XStack
							justifyContent="space-between"
							alignItems="flex-start"
						>
							<Text
								fontSize={16}
								fontWeight="700"
								color={AppColors.text}
								numberOfLines={1}
								flex={1}
							>
								{item.name}
							</Text>
							<StatusBadge status={item.status} />
						</XStack>

						<XStack gap="$2" alignItems="center">
							<Ionicons
								name="pricetag-outline"
								size={14}
								color={AppColors.primary}
							/>
							<Text
								fontSize={13}
								color={AppColors.primary}
								fontWeight="600"
							>
								{item.serialNumber}
							</Text>
						</XStack>

						<XStack gap="$2" alignItems="center" flexWrap="wrap">
							<Text fontSize={12} color={AppColors.textSecondary}>
								{item.brand}
							</Text>
							<Text fontSize={12} color={AppColors.textMuted}>
								•
							</Text>
							<Text fontSize={12} color={AppColors.textSecondary}>
								{item.type}
							</Text>
						</XStack>

						<XStack gap="$2" alignItems="center">
							<Ionicons
								name="calendar-outline"
								size={12}
								color={AppColors.textMuted}
							/>
							<Text fontSize={11} color={AppColors.textMuted}>
								{item.purchasedDate
									? new Date(
											item.purchasedDate
										).toLocaleDateString('vi-VN', {
											day: '2-digit',
											month: '2-digit',
											year: 'numeric',
										})
									: 'N/A'}
							</Text>
						</XStack>
					</YStack>
				</XStack>
			</Card>
		);
	};

	return (
		<YStack
			flex={1}
			backgroundColor={AppColors.background}
			paddingTop={46}
			paddingHorizontal={16}
		>
			{/* Dashboard cố định */}
			<YStack gap="$4" paddingBottom="$4">
				{/* Welcome Banner */}
				<Card
					padding="$4"
					backgroundColor={AppColors.primary}
					borderWidth={0}
					shadowColor={AppColors.shadowMedium}
					shadowRadius={12}
					shadowOffset={{ width: 0, height: 4 }}
					elevation={4}
					borderRadius="$4"
				>
					<YStack gap="$2">
						<Text fontSize={15} color="white" opacity={0.95}>
							{getGreeting()} 👋
						</Text>
						<Text fontSize={24} fontWeight="800" color="white">
							{user?.fullName || 'User'}
						</Text>
						<XStack gap="$2" alignItems="center" marginTop="$1">
							<Ionicons
								name="briefcase-outline"
								size={16}
								color="white"
							/>
							<Text
								fontSize={13}
								color="white"
								opacity={0.9}
								fontWeight="600"
							>
								{user?.role || 'Staff'}
							</Text>
						</XStack>
					</YStack>
				</Card>

				{/* Stats Cards - Thiết kế mới */}
				<YStack gap="$2">
					<Text fontSize={18} fontWeight="700" color={AppColors.text}>
						Thống kê thiết bị
					</Text>
					<XStack gap="$3" flexWrap="wrap">
						{/* Total Card */}
						<Card
							padding="$4"
							bordered
							flex={1}
							minWidth="100%"
							backgroundColor={AppColors.primary}
							borderColor={AppColors.primaryDark}
							borderWidth={0}
							shadowColor={AppColors.shadowMedium}
							shadowRadius={10}
							shadowOffset={{ width: 0, height: 3 }}
							elevation={4}
							borderRadius="$4"
						>
							<XStack
								justifyContent="space-between"
								alignItems="center"
							>
								<YStack gap="$1" flex={1}>
									<Text
										fontSize={14}
										color="white"
										opacity={0.95}
									>
										Tổng thiết bị
									</Text>
									<Text
										fontSize={40}
										fontWeight="900"
										color="white"
										lineHeight={44}
									>
										{stats.total}
									</Text>
									<Text
										fontSize={12}
										color="white"
										opacity={0.85}
									>
										{isFetching
											? '⟳ Đang đồng bộ...'
											: '✓ Đã cập nhật'}
									</Text>
								</YStack>
								<YStack
									width={70}
									height={70}
									backgroundColor="white"
									opacity={0.2}
									borderRadius="$10"
									justifyContent="center"
									alignItems="center"
								>
									<Ionicons
										name="apps"
										size={40}
										color="white"
									/>
								</YStack>
							</XStack>
						</Card>

						{/* Status Cards */}
						{Object.entries(stats.byStatus).map(([key, val]) => {
							const statusKey = key as DeviceStatus;
							const colors = statusColors[statusKey];
							const statusIcons: Record<
								DeviceStatus,
								keyof typeof Ionicons.glyphMap
							> = {
								[DeviceStatus.AVAILABLE]:
									'checkmark-circle-outline',
								[DeviceStatus.IN_USE]: 'time-outline',
								[DeviceStatus.MAINTENANCE]: 'construct-outline',
								[DeviceStatus.RETIREMENT]:
									'close-circle-outline',
							};
							return (
								<Card
									key={key}
									padding="$4"
									bordered
									flex={1}
									minWidth="47%"
									backgroundColor={colors.bg}
									borderColor={colors.text + '20'}
									borderWidth={1.5}
									shadowColor={AppColors.shadowLight}
									shadowRadius={6}
									shadowOffset={{ width: 0, height: 2 }}
									elevation={2}
									borderRadius="$4"
								>
									<YStack gap="$2">
										<XStack
											justifyContent="space-between"
											alignItems="flex-start"
										>
											<YStack gap="$1" flex={1}>
												<Text
													fontSize={12}
													color={colors.text}
													opacity={0.85}
													fontWeight="600"
												>
													{statusLabels[statusKey]}
												</Text>
												<Text
													fontSize={28}
													fontWeight="900"
													color={colors.text}
													lineHeight={32}
												>
													{val}
												</Text>
											</YStack>
											<YStack
												width={38}
												height={38}
												backgroundColor={
													colors.text + '20'
												}
												borderRadius="$8"
												justifyContent="center"
												alignItems="center"
											>
												<Ionicons
													name={
														statusIcons[statusKey]
													}
													size={20}
													color={colors.text}
												/>
											</YStack>
										</XStack>
									</YStack>
								</Card>
							);
						})}
					</XStack>
				</YStack>

				<Separator borderColor={AppColors.border} />

				{/* Recent Devices Section */}
				<XStack justifyContent="space-between" alignItems="center">
					<YStack>
						<Text
							fontSize={20}
							fontWeight="700"
							color={AppColors.text}
						>
							Thiết bị mới nhất
						</Text>
						<Text fontSize={13} color={AppColors.textSecondary}>
							6 thiết bị gần đây
						</Text>
					</YStack>
					<Button
						size="$3"
						backgroundColor={AppColors.primaryLight}
						pressStyle={{
							backgroundColor: AppColors.primary,
							scale: 0.95,
						}}
						borderRadius="$8"
						fontWeight="600"
						onPress={() => onGetAllDevices()}
						height="auto"
						color={AppColors.infoLight}
						paddingVertical={4}
					>
						<Ionicons
							name="refresh-circle-outline"
							size={20}
							color={AppColors.infoLight}
						/>
						Làm mới
					</Button>
				</XStack>

				{isLoading && (
					<Text color={AppColors.textSecondary}>Đang tải...</Text>
				)}
				{isError && (
					<Text color={AppColors.danger}>{error?.message}</Text>
				)}
			</YStack>

			{/* Device List - Chỉ phần này scroll */}
			<FlatList
				data={recentDevices}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => renderDeviceItem({ item })}
				contentContainerStyle={{ paddingBottom: 140, gap: 12 }}
				showsVerticalScrollIndicator={false}
				ListFooterComponent={
					deviceData && deviceData.length > 6 ? (
						<YStack gap="$4" paddingTop="$3">
							<Button
								size="$4"
								backgroundColor={AppColors.surface}
								borderColor={AppColors.primary}
								borderWidth={2}
								pressStyle={{
									backgroundColor: AppColors.primaryLight,
									scale: 0.97,
								}}
								borderRadius="$10"
								fontWeight="700"
								color={AppColors.primary}
								onPress={() =>
									navigation.navigate(NavigationRoutes.DEVICE)
								}
							>
								Xem tất cả {deviceData.length} thiết bị →
							</Button>

							<Separator borderColor={AppColors.border} />

							{/* Quick Actions */}
							<YStack gap="$3">
								<Text
									fontSize={20}
									fontWeight="700"
									color={AppColors.text}
								>
									Tác vụ nhanh
								</Text>
								<XStack gap="$3" flexWrap="wrap">
									<Button
										flex={1}
										minWidth={150}
										size="$4"
										backgroundColor={AppColors.primary}
										color="white"
										pressStyle={{
											backgroundColor:
												AppColors.primaryDark,
											scale: 0.97,
										}}
										borderRadius="$10"
										fontWeight="700"
										fontSize={15}
										icon={
											<Text fontSize={18} color="white">
												📱
											</Text>
										}
										onPress={() =>
											navigation.navigate(
												NavigationRoutes.DEVICE
											)
										}
										height={30}
									>
										Quản lý thiết bị
									</Button>
									<Button
										flex={1}
										minWidth={150}
										size="$4"
										backgroundColor={AppColors.info}
										color="white"
										pressStyle={{
											backgroundColor: AppColors.infoDark,
											scale: 0.97,
										}}
										borderRadius="$10"
										fontWeight="700"
										fontSize={15}
										icon={
											<Text fontSize={18} color="white">
												📷
											</Text>
										}
										onPress={() =>
											navigation.navigate(
												NavigationRoutes.DEVICE,
												{
													screen: NavigationRoutes.QR_SCAN,
												}
											)
										}
										height="auto"
									>
										Quét QR
									</Button>
								</XStack>
							</YStack>
						</YStack>
					) : null
				}
			/>
		</YStack>
	);
};

export default HomeScreen;
