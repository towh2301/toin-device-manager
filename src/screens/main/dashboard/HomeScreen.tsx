import { AppColors } from '@/src/common/app-color';
import { StatusBadge } from '@/src/components/StatusBadge';
import { NavigationRoutes } from '@/src/navigation/types';
import { useGetAllAssignments, useGetAllDevices } from '@/src/services/device';
import { useGetAllToinUsers } from '@/src/services/toin-user';
import { useAuthStore } from '@/src/store';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DeviceResponse, DeviceStatus } from '@services/device/types';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, TouchableOpacity } from 'react-native';
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
	const { toinUserData } = useGetAllToinUsers();
	const { data: assignmentsResponse } = useGetAllAssignments();
	const navigation = useNavigation<any>();
	const { user } = useAuthStore();

	const [isStatsExpanded, setIsStatsExpanded] = React.useState(true);

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

	const userStats = useMemo(() => {
		const assignments = assignmentsResponse?.data || [];
		const activeAssignments = assignments.filter((a) => !a.returned_date);

		return {
			totalUsers: toinUserData?.length || 0,
			activeUsers: toinUserData?.filter((u) => !u.isDeleted).length || 0,
			totalAssignments: assignments.length,
			activeAssignments: activeAssignments.length,
		};
	}, [toinUserData, assignmentsResponse]);

	const recentDevices = useMemo(() => {
		if (!deviceData) return [];
		return deviceData.slice(0, 6);
	}, [deviceData]);

	const getGreeting = () => {
		const hour = new Date().getHours();
		if (hour < 12) return 'Chào buổi sáng';
		if (hour < 18) return 'Chào buổi chiều';
		return 'Chào buổi tối';
	};

	const getDeviceIcon = (type: string): keyof typeof Ionicons.glyphMap => {
		const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
			SMARTPHONE: 'phone-portrait',
			TABLET: 'tablet-portrait',
			LAPTOP: 'laptop',
			DESKTOP: 'desktop',
			MONITOR: 'tv',
			PRINTER: 'print',
			CAMERA: 'camera',
			ROUTER: 'wifi',
			SWITCH: 'git-network',
			OTHER: 'cube',
		};
		return iconMap[type] || 'cube-outline';
	};

	const renderDeviceItem = ({ item }: { item: DeviceResponse }) => {
		return (
			<Pressable
				key={item.id}
				onPress={() =>
					navigation.navigate(NavigationRoutes.DEVICE, {
						screen: NavigationRoutes.DEVICE_DETAIL,
						params: { serialNumber: item.serialNumber },
					})
				}
				style={({ pressed }) => [
					{
						transform: [{ scale: pressed ? 0.98 : 1 }],
					},
				]}
			>
				<Card
					padding="$3.5"
					bordered
					backgroundColor={AppColors.surface}
					borderColor={AppColors.border}
					borderWidth={1}
					shadowRadius={4}
					shadowOffset={{ width: 0, height: 2 }}
					elevation={2}
					animation="quick"
					borderRadius="$4"
					hoverStyle={{ scale: 0.98 }}
				>
					<XStack gap="$3" alignItems="center">
						{/* Device Icon */}
						<YStack
							width={44}
							height={44}
							backgroundColor={AppColors.primary + '15'}
							borderRadius="$3"
							justifyContent="center"
							alignItems="center"
						>
							<Ionicons
								name={getDeviceIcon(item.type)}
								size={22}
								color={AppColors.primary}
							/>
						</YStack>

						{/* Device Info */}
						<YStack flex={1} gap="$1.5">
							<XStack
								justifyContent="space-between"
								alignItems="center"
							>
								<Text
									fontSize={15}
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
									size={13}
									color={AppColors.textMuted}
								/>
								<Text
									fontSize={12}
									color={AppColors.textSecondary}
									numberOfLines={1}
								>
									{item.serialNumber}
								</Text>
							</XStack>

							<XStack gap="$3">
								<XStack gap="$1.5" alignItems="center">
									<Ionicons
										name="business-outline"
										size={12}
										color={AppColors.textMuted}
									/>
									<Text
										fontSize={11}
										color={AppColors.textMuted}
									>
										{item.brand}
									</Text>
								</XStack>
								<XStack gap="$1.5" alignItems="center">
									<Ionicons
										name="layers-outline"
										size={12}
										color={AppColors.textMuted}
									/>
									<Text
										fontSize={11}
										color={AppColors.textMuted}
									>
										{item.type}
									</Text>
								</XStack>
							</XStack>
						</YStack>

						{/* Arrow */}
						<Ionicons
							name="chevron-forward"
							size={18}
							color={AppColors.textMuted}
						/>
					</XStack>
				</Card>
			</Pressable>
		);
	};

	return (
		<YStack
			flex={1}
			backgroundColor={AppColors.background}
			paddingTop={46}
			paddingHorizontal={16}
		>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 120 }}
			>
				<YStack gap="$4">
					{/* Welcome Header - Simplified */}
					<YStack
						backgroundColor={AppColors.primary}
						padding="$4"
						borderRadius="$4"
						shadowColor={AppColors.shadowMedium}
						shadowRadius={8}
						shadowOffset={{ width: 0, height: 2 }}
						elevation={3}
					>
						<Text fontSize={14} color="white" opacity={0.9}>
							{getGreeting()} 👋
						</Text>
						<Text
							fontSize={22}
							fontWeight="800"
							color="white"
							marginTop="$1"
						>
							{user?.fullName || 'User'}
						</Text>
						<XStack gap="$2" alignItems="center" marginTop="$2">
							<Ionicons
								name="briefcase-outline"
								size={14}
								color="white"
							/>
							<Text
								fontSize={12}
								color="white"
								opacity={0.85}
								fontWeight="600"
							>
								{user?.role || 'Staff'}
							</Text>
						</XStack>
					</YStack>

					{/* Stats Section - Collapsible */}
					<Card
						bordered
						padding="$0"
						backgroundColor={AppColors.surface}
						borderColor={AppColors.border}
						borderWidth={1}
						shadowColor={AppColors.shadowLight}
						shadowRadius={4}
						shadowOffset={{ width: 0, height: 2 }}
						elevation={2}
						borderRadius="$4"
						overflow="hidden"
					>
						{/* Header */}
						<TouchableOpacity
							onPress={() => setIsStatsExpanded(!isStatsExpanded)}
							activeOpacity={0.7}
						>
							<XStack
								padding="$3.5"
								justifyContent="space-between"
								alignItems="center"
								backgroundColor={AppColors.background}
							>
								<YStack flex={1}>
									<Text
										fontSize={16}
										fontWeight="700"
										color={AppColors.text}
									>
										Tổng quan
									</Text>
									<Text
										fontSize={12}
										color={AppColors.textSecondary}
										marginTop="$0.5"
									>
										{stats.total} thiết bị
									</Text>
								</YStack>
								<XStack gap="$2" alignItems="center">
									<Button
										size="$2"
										chromeless
										circular
										icon={
											<Ionicons
												name="refresh"
												size={16}
												color={AppColors.primary}
											/>
										}
										onPress={(e) => {
											e.stopPropagation();
											onGetAllDevices();
										}}
										opacity={isFetching ? 0.5 : 1}
									/>
									<YStack
										width={32}
										height={32}
										backgroundColor={
											AppColors.primary + '10'
										}
										borderRadius="$8"
										justifyContent="center"
										alignItems="center"
									>
										<Ionicons
											name={
												isStatsExpanded
													? 'chevron-up'
													: 'chevron-down'
											}
											size={18}
											color={AppColors.primary}
										/>
									</YStack>
								</XStack>
							</XStack>
						</TouchableOpacity>

						{/* Expanded Content */}
						{isStatsExpanded && (
							<YStack>
								<Separator borderColor={AppColors.border} />

								{/* Stats Grid */}
								<YStack padding="$3.5" gap="$3">
									{/* Total Card - Full Width */}
									<Card
										padding="$3.5"
										backgroundColor={AppColors.primary}
										borderWidth={0}
										shadowColor={AppColors.primary}
										shadowRadius={6}
										shadowOffset={{ width: 0, height: 2 }}
										elevation={2}
										borderRadius="$3"
									>
										<XStack
											justifyContent="space-between"
											alignItems="center"
										>
											<YStack>
												<Text
													fontSize={13}
													color="white"
													opacity={0.9}
												>
													Tổng thiết bị
												</Text>
												<Text
													fontSize={36}
													fontWeight="900"
													color="white"
													lineHeight={40}
												>
													{stats.total}
												</Text>
											</YStack>
											<YStack
												width={56}
												height={56}
												backgroundColor="white"
												opacity={0.2}
												borderRadius="$8"
												justifyContent="center"
												alignItems="center"
											>
												<Ionicons
													name="apps"
													size={32}
													color="white"
												/>
											</YStack>
										</XStack>
									</Card>

									{/* Status Cards - 2x2 Grid */}
									<XStack gap="$2.5" flexWrap="wrap">
										{Object.entries(stats.byStatus).map(
											([key, val]) => {
												const statusKey =
													key as DeviceStatus;
												const colors =
													statusColors[statusKey];
												const statusIcons: Record<
													DeviceStatus,
													keyof typeof Ionicons.glyphMap
												> = {
													[DeviceStatus.AVAILABLE]:
														'checkmark-circle',
													[DeviceStatus.IN_USE]:
														'time',
													[DeviceStatus.MAINTENANCE]:
														'construct',
													[DeviceStatus.RETIREMENT]:
														'close-circle',
												};
												return (
													<Card
														key={key}
														padding="$3"
														flex={1}
														minWidth="47%"
														backgroundColor={
															colors.bg
														}
														borderWidth={0}
														shadowColor={
															colors.text
														}
														shadowRadius={3}
														shadowOffset={{
															width: 0,
															height: 1,
														}}
														elevation={1}
														borderRadius="$3"
													>
														<XStack
															justifyContent="space-between"
															alignItems="flex-start"
														>
															<YStack gap="$1">
																<Text
																	fontSize={
																		11
																	}
																	color={
																		colors.text
																	}
																	opacity={
																		0.8
																	}
																	fontWeight="600"
																>
																	{
																		statusLabels[
																			statusKey
																		]
																	}
																</Text>
																<Text
																	fontSize={
																		24
																	}
																	fontWeight="900"
																	color={
																		colors.text
																	}
																	lineHeight={
																		26
																	}
																>
																	{val}
																</Text>
															</YStack>
															<YStack
																width={32}
																height={32}
																backgroundColor={
																	colors.text +
																	'20'
																}
																borderRadius="$6"
																justifyContent="center"
																alignItems="center"
															>
																<Ionicons
																	name={
																		statusIcons[
																			statusKey
																		]
																	}
																	size={16}
																	color={
																		colors.text
																	}
																/>
															</YStack>
														</XStack>
													</Card>
												);
											}
										)}
									</XStack>
								</YStack>

								<Separator borderColor={AppColors.border} />

								{/* User & Assignment Stats */}
								<YStack padding="$3.5" gap="$3">
									<Text
										fontSize={15}
										fontWeight="700"
										color={AppColors.text}
									>
										Nhân viên & Giao thiết bị
									</Text>
									<XStack gap="$2.5" flexWrap="wrap">
										<Card
											padding="$3"
											flex={1}
											minWidth="47%"
											backgroundColor={
												AppColors.accent1 + '20'
											}
											borderWidth={1}
											borderColor={
												AppColors.accent1 + '30'
											}
											borderRadius="$3"
										>
											<YStack gap="$1">
												<XStack
													justifyContent="space-between"
													alignItems="center"
												>
													<Text
														fontSize={11}
														color={
															AppColors.textSecondary
														}
														fontWeight="600"
													>
														Tổng nhân viên
													</Text>
													<Ionicons
														name="people"
														size={18}
														color={
															AppColors.accent1
														}
													/>
												</XStack>
												<Text
													fontSize={24}
													fontWeight="800"
													color={AppColors.accent1}
												>
													{userStats.totalUsers}
												</Text>
												<Text
													fontSize={10}
													color={AppColors.textMuted}
												>
													{userStats.activeUsers} đang
													hoạt động
												</Text>
											</YStack>
										</Card>

										<Card
											padding="$3"
											flex={1}
											minWidth="47%"
											backgroundColor={
												AppColors.success + '20'
											}
											borderWidth={1}
											borderColor={
												AppColors.success + '30'
											}
											borderRadius="$3"
										>
											<YStack gap="$1">
												<XStack
													justifyContent="space-between"
													alignItems="center"
												>
													<Text
														fontSize={11}
														color={
															AppColors.textSecondary
														}
														fontWeight="600"
													>
														Đang giao
													</Text>
													<Ionicons
														name="git-commit"
														size={18}
														color={
															AppColors.success
														}
													/>
												</XStack>
												<Text
													fontSize={24}
													fontWeight="800"
													color={AppColors.success}
												>
													{
														userStats.activeAssignments
													}
												</Text>
												<Text
													fontSize={10}
													color={AppColors.textMuted}
												>
													{userStats.totalAssignments}{' '}
													tổng cộng
												</Text>
											</YStack>
										</Card>
									</XStack>
								</YStack>

								<Separator borderColor={AppColors.border} />

								{/* Quick Actions */}
								<YStack padding="$3.5" gap="$3">
									<Text
										fontSize={15}
										fontWeight="700"
										color={AppColors.text}
									>
										Thao tác nhanh
									</Text>
									<XStack gap="$2.5">
										<Button
											flex={1}
											size="$3"
											backgroundColor={AppColors.primary}
											color="white"
											icon={
												<Ionicons
													name="add-circle-outline"
													size={18}
												/>
											}
											onPress={() =>
												navigation.navigate(
													NavigationRoutes.DEVICE
												)
											}
											borderRadius="$3"
											fontWeight="600"
										>
											Thêm thiết bị
										</Button>
										<Button
											flex={1}
											size="$3"
											backgroundColor={AppColors.accent1}
											color="white"
											icon={
												<Ionicons
													name="person-add-outline"
													size={18}
												/>
											}
											onPress={() =>
												navigation.navigate(
													NavigationRoutes.TOIN_USER
												)
											}
											borderRadius="$3"
											fontWeight="600"
										>
											Thêm nhân viên
										</Button>
									</XStack>
								</YStack>

								<Separator borderColor={AppColors.border} />

								{/* Recent Devices */}
								<YStack padding="$3.5" gap="$3">
									<XStack
										justifyContent="space-between"
										alignItems="center"
									>
										<Text
											fontSize={15}
											fontWeight="700"
											color={AppColors.text}
										>
											Thiết bị gần đây
										</Text>
										<Text
											fontSize={11}
											color={AppColors.textMuted}
										>
											{recentDevices.length} thiết bị
										</Text>
									</XStack>

									{isLoading && (
										<Text
											fontSize={12}
											color={AppColors.textSecondary}
										>
											Đang tải...
										</Text>
									)}
									{isError && (
										<Text
											fontSize={12}
											color={AppColors.danger}
										>
											{error?.message}
										</Text>
									)}

									{!isLoading && !isError && (
										<YStack gap="$2.5">
											{recentDevices.map((item) => (
												<React.Fragment key={item.id}>
													{renderDeviceItem({ item })}
												</React.Fragment>
											))}
										</YStack>
									)}

									{deviceData && deviceData.length > 6 && (
										<Button
											size="$3"
											backgroundColor="transparent"
											borderColor={AppColors.primary}
											borderWidth={1.5}
											pressStyle={{
												backgroundColor:
													AppColors.primaryLight,
												scale: 0.96,
											}}
											borderRadius="$3"
											fontWeight="700"
											color={AppColors.primary}
											onPress={() =>
												navigation.navigate(
													NavigationRoutes.DEVICE
												)
											}
											marginTop="$1"
											height={40}
										>
											<Text>
												Xem tất cả {deviceData.length}{' '}
												thiết bị →
											</Text>
										</Button>
									)}
								</YStack>
							</YStack>
						)}
					</Card>

					{/* Quick Actions - Compact */}
					<YStack gap="$2.5">
						<Text
							fontSize={15}
							fontWeight="700"
							color={AppColors.text}
						>
							Tác vụ nhanh
						</Text>
						<XStack gap="$2.5">
							<Button
								flex={1}
								size="$3.5"
								backgroundColor={AppColors.primary}
								color="white"
								pressStyle={{
									backgroundColor: AppColors.primaryDark,
									scale: 0.98,
								}}
								borderRadius="$3"
								fontWeight="700"
								icon={
									<Ionicons
										name="apps"
										size={18}
										color="white"
									/>
								}
								onPress={() =>
									navigation.navigate(
										NavigationRoutes.DEVICE,
										{
											screen: NavigationRoutes.DEVICE_LIST,
										}
									)
								}
							>
								Quản lý
							</Button>
							<Button
								flex={1}
								size="$3.5"
								backgroundColor={AppColors.info}
								color="white"
								pressStyle={{
									backgroundColor: AppColors.infoDark,
									scale: 0.98,
								}}
								borderRadius="$3"
								fontWeight="700"
								icon={
									<Ionicons
										name="qr-code"
										size={18}
										color="white"
									/>
								}
								onPress={() =>
									navigation.navigate(
										NavigationRoutes.DEVICE,
										{
											screen: NavigationRoutes.QR_SCAN,
										}
									)
								}
							>
								Quét QR
							</Button>
						</XStack>
					</YStack>
				</YStack>
			</ScrollView>
		</YStack>
	);
};

export default HomeScreen;
