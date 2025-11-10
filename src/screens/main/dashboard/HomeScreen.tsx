import { AppColors } from '@/src/common/app-color';
import { StatusBadge } from '@/src/components/StatusBadge';
import { NavigationRoutes } from '@/src/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { DeviceStatus } from '@services/device/types';
import { useGetAllDevices } from '@services/device/useGetAllDevices';
import React, { useMemo } from 'react';
import {
	Button,
	Card,
	ScrollView,
	Separator,
	Text,
	XStack,
	YStack,
} from 'tamagui';

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

	const stats = useMemo(() => {
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

	return (
		<ScrollView
			backgroundColor={AppColors.background}
			contentContainerStyle={{
				paddingHorizontal: 16,
				paddingTop: 46,
				paddingBottom: 140,
			}}
		>
			<YStack gap="$4">
				{/* Header */}
				<YStack gap="$2">
					<Text fontSize={28} fontWeight="800" color={AppColors.text}>
						TOIN DASHBOARD
					</Text>
					<Text fontSize={14} color={AppColors.textSecondary}>
						Quản lý thiết bị của bạn
					</Text>
				</YStack>

				{/* Stats Cards */}
				<XStack gap="$3" flexWrap="wrap">
					{/* Total Card */}
					<Card
						padding="$4"
						bordered
						width="48%"
						backgroundColor={AppColors.primary}
						borderColor={AppColors.primaryDark}
						borderWidth={0}
						shadowColor={AppColors.shadowMedium}
						shadowRadius={8}
						shadowOffset={{ width: 0, height: 2 }}
						elevation={3}
					>
						<YStack gap="$1">
							<Text fontSize={13} color="white" opacity={0.9}>
								Tổng thiết bị
							</Text>
							<Text fontSize={32} fontWeight="900" color="white">
								{stats.total}
							</Text>
							<Text fontSize={11} color="white" opacity={0.8}>
								{isFetching
									? '⟳ Đang đồng bộ...'
									: '✓ Cập nhật'}
							</Text>
						</YStack>
					</Card>

					{/* Status Cards */}
					{Object.entries(stats.byStatus).map(([key, val]) => {
						const statusKey = key as DeviceStatus;
						const colors = statusColors[statusKey];
						return (
							<Card
								key={key}
								padding="$4"
								bordered
								width="48%"
								backgroundColor={colors.bg}
								borderColor={colors.text + '30'}
								borderWidth={1}
								shadowColor={AppColors.shadowLight}
								shadowRadius={4}
								shadowOffset={{ width: 0, height: 1 }}
								elevation={2}
							>
								<YStack gap="$1">
									<Text
										fontSize={12}
										color={colors.text}
										opacity={0.8}
									>
										{statusLabels[statusKey]}
									</Text>
									<Text
										fontSize={24}
										fontWeight="800"
										color={colors.text}
									>
										{val}
									</Text>
								</YStack>
							</Card>
						);
					})}
				</XStack>

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
						color="white"
						pressStyle={{
							backgroundColor: AppColors.primary,
							scale: 0.95,
						}}
						borderRadius="$8"
						fontWeight="600"
						onPress={() => onGetAllDevices()}
						height="auto"
					>
						Làm mới
					</Button>
				</XStack>

				{isLoading && (
					<Text color={AppColors.textSecondary}>Đang tải...</Text>
				)}
				{isError && (
					<Text color={AppColors.danger}>{error?.message}</Text>
				)}

				{/* Device List */}
				<YStack gap="$3">
					{deviceData.slice(0, 6).map((d) => (
						<Card
							key={d.id}
							padding="$4"
							bordered
							backgroundColor={AppColors.surface}
							borderColor={AppColors.border}
							borderWidth={1}
							shadowColor={AppColors.shadowLight}
							shadowRadius={4}
							shadowOffset={{ width: 0, height: 1 }}
							elevation={2}
							pressStyle={{
								scale: 0.98,
								borderColor: AppColors.primary,
							}}
							animation="quick"
							onPress={() =>
								navigation.navigate(NavigationRoutes.DEVICE, {
									screen: NavigationRoutes.DEVICE_DETAIL,
									params: { serialNumber: d.serialNumber },
								})
							}
						>
							<XStack
								justifyContent="space-between"
								alignItems="flex-start"
							>
								<YStack flex={1} gap="$2">
									<Text
										fontSize={16}
										fontWeight="700"
										color={AppColors.text}
										numberOfLines={1}
									>
										{d.name}
									</Text>
									<Text
										fontSize={13}
										color={AppColors.primary}
										fontWeight="600"
									>
										SN: {d.serialNumber}
									</Text>
									<XStack
										gap="$2"
										alignItems="center"
										flexWrap="wrap"
									>
										<Text
											fontSize={12}
											color={AppColors.textSecondary}
										>
											{d.brand}
										</Text>
										<Text
											fontSize={12}
											color={AppColors.textMuted}
										>
											•
										</Text>
										<Text
											fontSize={12}
											color={AppColors.textSecondary}
										>
											{d.type}
										</Text>
									</XStack>
									<Text
										fontSize={11}
										color={AppColors.textMuted}
									>
										Ngày mua:{' '}
										{d.purchasedDate
											? new Date(
													d.purchasedDate
												).toLocaleDateString('vi-VN', {
													day: '2-digit',
													month: '2-digit',
													year: 'numeric',
												})
											: 'N/A'}
									</Text>
								</YStack>
								<StatusBadge status={d.status} />
							</XStack>
						</Card>
					))}
				</YStack>

				<Separator borderColor={AppColors.border} />

				{/* Quick Actions */}
				<YStack gap="$3">
					<Text fontSize={20} fontWeight="700" color={AppColors.text}>
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
								backgroundColor: AppColors.primaryDark,
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
								navigation.navigate(NavigationRoutes.DEVICE)
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
								navigation.navigate(NavigationRoutes.DEVICE, {
									screen: NavigationRoutes.QR_SCAN,
								})
							}
							height="auto"
						>
							Quét QR
						</Button>
					</XStack>
				</YStack>
			</YStack>
		</ScrollView>
	);
};

export default HomeScreen;
