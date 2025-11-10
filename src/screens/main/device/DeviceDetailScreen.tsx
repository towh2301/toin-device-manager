import { AppColors } from '@/src/common/app-color';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import { StatusBadge } from '@/src/components/StatusBadge';
import { TypeBadge } from '@/src/components/TypeBadge';
import { DeviceStackParamList, NavigationRoutes } from '@/src/navigation/types';
import { useGetDeviceBySerialNumber } from '@/src/services/device';
import { DeviceType } from '@/src/services/device/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
	ArrowLeft,
	Calendar,
	Copy,
	Package,
	Share2,
	Tag,
} from '@tamagui/lucide-icons';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Alert, ScrollView, Share } from 'react-native';
import { Button, Card, Separator, Text, XStack, YStack } from 'tamagui';

type DeviceDetailRouteProp = RouteProp<
	DeviceStackParamList,
	NavigationRoutes.DEVICE_DETAIL
>;

export default function DeviceDetailScreen() {
	const route = useRoute<DeviceDetailRouteProp>();
	const navigation = useNavigation();
	const serialNumber = route.params?.serialNumber || '';

	const { deviceData, isLoading, isError, error } =
		useGetDeviceBySerialNumber(serialNumber);

	if (isLoading) {
		return <LoadingIndicator data={''} />;
	}

	if (isError) {
		return (
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				padding="$4"
				gap="$4"
				backgroundColor={AppColors.background}
			>
				<Text fontSize={18} fontWeight="700" color={AppColors.danger}>
					⚠️ Lỗi
				</Text>
				<Text color={AppColors.textSecondary} textAlign="center">
					{error?.message || 'Không thể tải dữ liệu thiết bị'}
				</Text>
				<Button
					backgroundColor={AppColors.primary}
					color="white"
					onPress={() => navigation.goBack()}
				>
					Quay lại
				</Button>
			</YStack>
		);
	}

	if (!deviceData) {
		return (
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				padding="$4"
				backgroundColor={AppColors.background}
			>
				<Text fontSize={16} color={AppColors.textSecondary}>
					Không có dữ liệu thiết bị
				</Text>
				<Button
					marginTop="$3"
					backgroundColor={AppColors.primary}
					color="white"
					onPress={() => navigation.goBack()}
				>
					Quay lại
				</Button>
			</YStack>
		);
	}

	const copySN = async () => {
		await Clipboard.setStringAsync(deviceData.serialNumber);
		Alert.alert(
			'✓ Đã sao chép',
			'Serial Number đã được sao chép vào clipboard.'
		);
	};

	const shareInfo = async () => {
		try {
			await Share.share({
				message: `🔧 ${deviceData.name}\n📦 Brand: ${deviceData.brand}\n🏷️ Type: ${deviceData.type}\n🔢 SN: ${deviceData.serialNumber}\n📅 Ngày mua: ${new Date(deviceData.purchasedDate).toLocaleDateString('vi-VN')}`,
			});
		} catch {}
	};

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
				{/* Header with Back Button */}
				<XStack alignItems="center" gap="$3" marginBottom="$2">
					<Button
						size="$8"
						circular
						chromeless
						icon={ArrowLeft}
						backgroundColor={AppColors.surface}
						borderWidth={1}
						borderColor={AppColors.border}
						color={AppColors.text}
						pressStyle={{
							backgroundColor: AppColors.surfaceElevated,
							scale: 0.95,
						}}
						onPress={() => navigation.goBack()}
					/>
					<YStack flex={1}>
						<Text fontSize={13} color={AppColors.textMuted}>
							Chi tiết thiết bị
						</Text>
						<Text
							fontSize={24}
							fontWeight="800"
							color={AppColors.text}
						>
							{deviceData.name}
						</Text>
					</YStack>
				</XStack>

				{/* Device Icon Card */}
				<Card
					backgroundColor={AppColors.primary}
					padding="$6"
					borderRadius="$10"
					bordered={false}
					shadowColor={AppColors.shadowMedium}
					shadowRadius={12}
					shadowOffset={{ width: 0, height: 4 }}
					elevation={4}
				>
					<YStack alignItems="center" gap="$3">
						<YStack
							width={80}
							height={80}
							borderRadius="$10"
							backgroundColor="white"
							alignItems="center"
							justifyContent="center"
						>
							<Text fontSize={40}>
								{deviceData.type === DeviceType.LAPTOP
									? '💻'
									: deviceData.type === DeviceType.DESKTOP
										? '🖥️'
										: deviceData.type ===
											  DeviceType.SMARTPHONE
											? '📱'
											: deviceData.type ===
												  DeviceType.TABLET
												? '📱'
												: deviceData.type ===
													  DeviceType.PRINTER
													? '🖨️'
													: deviceData.type ===
														  DeviceType.CAMERA
														? '📷'
														: deviceData.type ===
															  DeviceType.ROUTER
															? '📡'
															: deviceData.type ===
																  DeviceType.SWITCH
																? '🔀'
																: deviceData.type ===
																	  'monitor'
																	? '🖥️'
																	: '📦'}
							</Text>
						</YStack>
						<XStack gap="$2" alignItems="center">
							<StatusBadge status={deviceData.status} />
							<TypeBadge
								type={deviceData.type}
								backgroundColor={AppColors.infoLight}
							/>
						</XStack>
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
						{/* ID */}
						<XStack gap="$3" alignItems="center">
							<YStack
								width={40}
								height={40}
								borderRadius="$8"
								backgroundColor={AppColors.primaryLight + '20'}
								alignItems="center"
								justifyContent="center"
							>
								<Tag size={20} color={AppColors.primary} />
							</YStack>
							<YStack flex={1}>
								<Text fontSize={12} color={AppColors.textMuted}>
									ID Thiết bị
								</Text>
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									{deviceData.id}
								</Text>
							</YStack>
						</XStack>

						<Separator borderColor={AppColors.border} />

						{/* Serial Number */}
						<XStack gap="$3" alignItems="center">
							<YStack
								width={40}
								height={40}
								borderRadius="$8"
								backgroundColor={AppColors.info + '20'}
								alignItems="center"
								justifyContent="center"
							>
								<Package size={20} color={AppColors.info} />
							</YStack>
							<YStack flex={1}>
								<Text fontSize={12} color={AppColors.textMuted}>
									Serial Number
								</Text>
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									{deviceData.serialNumber}
								</Text>
							</YStack>
						</XStack>

						<Separator borderColor={AppColors.border} />

						{/* Brand */}
						<XStack gap="$3" alignItems="center">
							<YStack
								width={40}
								height={40}
								borderRadius="$8"
								backgroundColor={AppColors.accent3 + '20'}
								alignItems="center"
								justifyContent="center"
							>
								<Text fontSize={20}>🏢</Text>
							</YStack>
							<YStack flex={1}>
								<Text fontSize={12} color={AppColors.textMuted}>
									Thương hiệu
								</Text>
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									{deviceData.brand}
								</Text>
							</YStack>
						</XStack>

						<Separator borderColor={AppColors.border} />

						{/* Purchase Date */}
						<XStack gap="$3" alignItems="center">
							<YStack
								width={40}
								height={40}
								borderRadius="$8"
								backgroundColor={AppColors.warning + '20'}
								alignItems="center"
								justifyContent="center"
							>
								<Calendar size={20} color={AppColors.warning} />
							</YStack>
							<YStack flex={1}>
								<Text fontSize={12} color={AppColors.textMuted}>
									Ngày mua
								</Text>
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									{new Date(
										deviceData.purchasedDate
									).toLocaleDateString('vi-VN', {
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
									})}
								</Text>
							</YStack>
						</XStack>
					</YStack>
				</Card>

				{/* Action Buttons */}
				<XStack gap="$3" flexWrap="wrap">
					<Button
						flex={1}
						minWidth={150}
						size="$4"
						backgroundColor={AppColors.info}
						color="white"
						icon={Copy}
						fontWeight="700"
						borderRadius="$10"
						pressStyle={{
							backgroundColor: AppColors.infoDark,
							scale: 0.97,
						}}
						onPress={copySN}
						height={'40'}
					>
						Sao chép SN
					</Button>
					<Button
						flex={1}
						minWidth={150}
						size="$4"
						backgroundColor={AppColors.success}
						color="white"
						icon={Share2}
						fontWeight="700"
						borderRadius="$10"
						pressStyle={{
							backgroundColor: AppColors.successDark,
							scale: 0.97,
						}}
						onPress={shareInfo}
						height={'40'}
					>
						Chia sẻ
					</Button>
				</XStack>
			</YStack>
		</ScrollView>
	);
}
