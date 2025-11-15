import { AppColors } from '@/src/common/app-color';
import AssignDeviceModal from '@/src/components/AssignDeviceModal';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import { StatusBadge } from '@/src/components/StatusBadge';
import { TypeBadge } from '@/src/components/TypeBadge';
import { DeviceStackParamList, NavigationRoutes } from '@/src/navigation/types';
import {
	useGetDeviceAssignments,
	useGetDeviceBySerialNumber,
	useGetDeviceSoftware,
	useUnassignDevice,
	useUnlinkSoftware,
} from '@/src/services/device';
import { DeviceType } from '@/src/services/device/types';
import { SoftwareResponse } from '@/src/services/software';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
	ArrowLeft,
	Calendar,
	Copy,
	Key,
	Monitor,
	Package,
	Share2,
	Tag,
	User,
} from '@tamagui/lucide-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, ScrollView, Share } from 'react-native';
import { Button, Card, Separator, Text, XStack, YStack } from 'tamagui';
import PrintQRModal from './printer/PrintQRModal';
import SoftwareCard from './software/SoftwareCard';
import SoftwareEditModal from './software/SoftwareEditModal';
import SoftwareModal from './software/SoftwareModal';

type DeviceDetailRouteProp = RouteProp<
	DeviceStackParamList,
	NavigationRoutes.DEVICE_DETAIL
>;

type EditSoftwareProps = {
	id: string;
	data?: SoftwareResponse;
};

export default function DeviceDetailScreen() {
	const [showAssignModal, setShowAssignModal] = useState(false);
	const [showSoftwareModal, setShowSoftwareModal] = useState(false);
	const [expandedSoftware, setExpandedSoftware] = useState<string[]>([]);
	const [showPrintQRModal, setShowPrintQRModal] = useState(false);
	const [editingSoftware, setEditingSoftware] =
		useState<EditSoftwareProps | null>(null);
	const route = useRoute<DeviceDetailRouteProp>();
	const navigation = useNavigation<any>();
	const serialNumber = route.params?.serialNumber || '';

	const { deviceData, isLoading, isError, error } =
		useGetDeviceBySerialNumber(serialNumber);

	// Get device assignments and software - MUST be called before any conditional returns
	const { data: assignmentsResponse, refetch: refetchAssignments } =
		useGetDeviceAssignments(deviceData?.id || '');
	const { data: softwareResponse, refetch: refetchSoftware } =
		useGetDeviceSoftware(deviceData?.id || '');

	// Mutations - MUST be called before any conditional returns
	const unassignMutation = useUnassignDevice();
	const unlinkSoftwareMutation = useUnlinkSoftware();

	// Extract data from API responses
	const assignments = assignmentsResponse?.data || [];
	const softwareList = softwareResponse?.data || [];

	// Find current assignment (returned_date is null/undefined)
	const currentAssignment = assignments.find(
		(assignment) => !assignment.returned_date
	);

	// Early returns after all hooks
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

	// Callbacks - MUST be called before any conditional returns
	const handleUnlinkSoftware = async (
		softwareIdParam: string,
		softwareName: string
	) => {
		Alert.alert(
			'Xác nhận gỡ',
			`Bạn có chắc muốn gỡ phần mềm "${softwareName}" khỏi thiết bị này?`,
			[
				{ text: 'Hủy', style: 'cancel' },
				{
					text: 'Gỡ',
					style: 'destructive',
					onPress: async () => {
						if (!deviceData?.id) {
							Alert.alert('Lỗi', 'Không tìm thấy Device ID');
							return;
						}
						if (!softwareIdParam) {
							Alert.alert('Lỗi', 'Không tìm thấy Software ID');
							return;
						}
						try {
							console.log('🔄 [Unlink] Sending request:', {
								deviceId: deviceData?.id,
								softwareId: softwareIdParam,
							});

							await unlinkSoftwareMutation.mutateAsync({
								deviceId: deviceData?.id,
								softwareId: softwareIdParam,
							});

							await refetchSoftware();
							Alert.alert(
								'✓ Thành công',
								'Đã gỡ phần mềm khỏi thiết bị'
							);
						} catch (error: any) {
							console.error('❌ [Unlink] Error:', error);
							Alert.alert(
								'Lỗi',
								error?.message || 'Không thể gỡ phần mềm'
							);
						}
					},
				},
			]
		);
	};

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

	const handleUnassign = async () => {
		if (!currentAssignment) return;

		Alert.alert(
			'Xác nhận thu hồi',
			`Bạn có chắc muốn thu hồi thiết bị này từ ${currentAssignment.assigned_to?.fullname || 'Không rõ'}?`,
			[
				{ text: 'Hủy', style: 'cancel' },
				{
					text: 'Thu hồi',
					style: 'destructive',
					onPress: async () => {
						try {
							await unassignMutation.mutateAsync({
								assignmentId: currentAssignment.id,
								deviceId: deviceData?.id || '',
							});
							try {
								// Reset current assignment
								await refetchAssignments();
								Alert.alert(
									'✓ Thành công',
									'Đã thu hồi thiết bị và cập nhật trạng thái'
								);
							} catch (error) {
								Alert.alert(
									'Lỗi',
									'Không thể cập nhật trạng thái thiết bị'
								);
							}
						} catch (error: any) {
							Alert.alert(
								'Lỗi',
								error?.message || 'Không thể thu hồi thiết bị'
							);
						}
					},
				},
			]
		);
	};

	const toggleSoftwareExpand = (softwareId: string) => {
		setExpandedSoftware((prev) =>
			prev.includes(softwareId)
				? prev.filter((id) => id !== softwareId)
				: [...prev, softwareId]
		);
	};

	return (
		<>
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
							onPress={() =>
								navigation.navigate(
									NavigationRoutes.DEVICE_LIST
								)
							}
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
						borderRadius="$4"
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
								borderRadius="$4"
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
						borderRadius="$4"
						shadowColor={AppColors.shadowLight}
						shadowRadius={4}
						shadowOffset={{ width: 0, height: 2 }}
						elevation={2}
					>
						<YStack gap="$3">
							{/* Status */}
							<XStack gap="$3" alignItems="center">
								<YStack
									width={40}
									height={40}
									borderRadius="$4"
									backgroundColor={
										deviceData.status === 'AVAILABLE'
											? AppColors.success + '20'
											: deviceData.status === 'IN_USE'
												? AppColors.info + '20'
												: deviceData.status ===
													  'MAINTENANCE'
													? AppColors.warning + '20'
													: AppColors.danger + '20'
									}
									alignItems="center"
									justifyContent="center"
								>
									<Text fontSize={20}>
										{deviceData.status === 'AVAILABLE'
											? '✅'
											: deviceData.status === 'IN_USE'
												? '👤'
												: deviceData.status ===
													  'MAINTENANCE'
													? '🔧'
													: '🚫'}
									</Text>
								</YStack>
								<YStack flex={1}>
									<Text
										fontSize={12}
										color={AppColors.textMuted}
									>
										Trạng thái
									</Text>
									<XStack alignItems="center" gap="$2">
										<StatusBadge
											status={deviceData.status}
										/>
									</XStack>
								</YStack>
							</XStack>

							<Separator borderColor={AppColors.border} />

							{/* ID */}
							<XStack gap="$3" alignItems="center">
								<YStack
									width={40}
									height={40}
									borderRadius="$4"
									backgroundColor={
										AppColors.primaryLight + '20'
									}
									alignItems="center"
									justifyContent="center"
								>
									<Tag size={20} color={AppColors.primary} />
								</YStack>
								<YStack flex={1}>
									<Text
										fontSize={12}
										color={AppColors.textMuted}
									>
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
									borderRadius="$4"
									backgroundColor={AppColors.info + '20'}
									alignItems="center"
									justifyContent="center"
								>
									<Package size={20} color={AppColors.info} />
								</YStack>
								<YStack flex={1}>
									<Text
										fontSize={12}
										color={AppColors.textMuted}
									>
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
									borderRadius="$4"
									backgroundColor={AppColors.accent3 + '20'}
									alignItems="center"
									justifyContent="center"
								>
									<Text fontSize={20}>🏢</Text>
								</YStack>
								<YStack flex={1}>
									<Text
										fontSize={12}
										color={AppColors.textMuted}
									>
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
									borderRadius="$4"
									backgroundColor={AppColors.warning + '20'}
									alignItems="center"
									justifyContent="center"
								>
									<Calendar
										size={20}
										color={AppColors.warning}
									/>
								</YStack>
								<YStack flex={1}>
									<Text
										fontSize={12}
										color={AppColors.textMuted}
									>
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

					{/* Assigned User Section */}
					<Card
						bordered
						padding="$4"
						backgroundColor={AppColors.surface}
						borderColor={AppColors.border}
						borderRadius="$4"
						shadowColor={AppColors.shadowLight}
						shadowRadius={4}
						shadowOffset={{ width: 0, height: 2 }}
						elevation={2}
					>
						<YStack gap="$3">
							{/* Header with Action Button */}
							<XStack
								alignItems="center"
								justifyContent="space-between"
							>
								<XStack alignItems="center" gap="$2">
									<User size={20} color={AppColors.primary} />
									<Text
										fontSize={16}
										fontWeight="700"
										color={AppColors.text}
									>
										Người dùng
									</Text>
								</XStack>
								{currentAssignment ? (
									<Button
										size="$2"
										backgroundColor={AppColors.danger}
										color="white"
										onPress={handleUnassign}
										disabled={unassignMutation.isPending}
										height={24}
									>
										{unassignMutation.isPending
											? 'Đang xử lý...'
											: 'Thu hồi'}
									</Button>
								) : (
									<Button
										size="$2"
										backgroundColor={AppColors.primary}
										color="white"
										onPress={() => setShowAssignModal(true)}
										height={24}
									>
										Giao thiết bị
									</Button>
								)}
							</XStack>

							<Separator borderColor={AppColors.border} />

							{currentAssignment ? (
								<XStack gap="$3" alignItems="center">
									<YStack
										width={50}
										height={50}
										borderRadius="$4"
										backgroundColor={
											AppColors.primary + '20'
										}
										alignItems="center"
										justifyContent="center"
										borderWidth={2}
										borderColor={AppColors.primary + '30'}
									>
										<Text
											fontSize={20}
											fontWeight="700"
											color={AppColors.primary}
										>
											{currentAssignment.assigned_to?.fullname?.charAt(
												0
											) || 'Không rõ'}
										</Text>
									</YStack>
									<YStack flex={1}>
										<Text
											fontSize={14}
											fontWeight="600"
											color={AppColors.text}
										>
											{currentAssignment.assigned_to
												?.fullname || 'Không rõ'}
										</Text>
										<Text
											fontSize={12}
											color={AppColors.textMuted}
										>
											Ngày giao:{' '}
											{new Date(
												currentAssignment.assigned_date
											).toLocaleDateString('vi-VN')}
										</Text>
										{currentAssignment.note && (
											<Text
												fontSize={11}
												color={AppColors.textSecondary}
												marginTop="$1"
											>
												📝 {currentAssignment.note}
											</Text>
										)}
									</YStack>
								</XStack>
							) : (
								<YStack
									padding="$3"
									alignItems="center"
									gap="$2"
								>
									<Ionicons
										name="person-outline"
										size={32}
										color={AppColors.textMuted}
									/>
									<Text
										fontSize={13}
										color={AppColors.textSecondary}
									>
										Chưa có người dùng
									</Text>
								</YStack>
							)}
						</YStack>
					</Card>

					{/* Software Section */}
					<Card
						bordered
						padding="$4"
						backgroundColor={AppColors.surface}
						borderColor={AppColors.border}
						borderRadius="$4"
						shadowColor={AppColors.shadowLight}
						shadowRadius={4}
						shadowOffset={{ width: 0, height: 2 }}
						elevation={2}
					>
						<YStack gap="$3">
							{/* Header */}
							<XStack
								alignItems="center"
								justifyContent="space-between"
							>
								<XStack alignItems="center" gap="$2">
									<Monitor size={20} color={AppColors.info} />
									<Text
										fontSize={16}
										fontWeight="700"
										color={AppColors.text}
									>
										Phần mềm
									</Text>
								</XStack>
								<XStack alignItems="center" gap="$2">
									<Text
										fontSize={12}
										color={AppColors.textMuted}
										backgroundColor={AppColors.info + '20'}
										paddingHorizontal="$2"
										paddingVertical="$1"
										borderRadius="$2"
									>
										{softwareList.length} phần mềm
									</Text>
									<Button
										size="$2"
										backgroundColor={AppColors.primary}
										color="white"
										borderRadius="$2"
										paddingHorizontal="$3"
										icon={
											<Ionicons
												name="add"
												size={16}
												color="white"
											/>
										}
										onPress={() =>
											setShowSoftwareModal(true)
										}
										height={24}
									>
										Thêm
									</Button>
								</XStack>
							</XStack>

							<Separator
								borderColor={AppColors.border}
								marginVertical="$2"
							/>

							{softwareList.length > 0 ? (
								<YStack gap="$2">
									{softwareList.map((deviceSoftware) => {
										const software =
											typeof deviceSoftware.software ===
											'object'
												? deviceSoftware.software
												: undefined;

										return (
											<SoftwareCard
												key={deviceSoftware.id}
												deviceSoftware={deviceSoftware}
												software={software}
												setEditingSoftware={
													setEditingSoftware
												}
												handleUnlinkSoftware={
													handleUnlinkSoftware
												}
												deviceId={deviceData.id}
											/>
										);
									})}
								</YStack>
							) : (
								<YStack
									padding="$3"
									alignItems="center"
									gap="$2"
								>
									<Ionicons
										name="laptop-outline"
										size={32}
										color={AppColors.textMuted}
									/>
									<Text
										fontSize={13}
										color={AppColors.textSecondary}
									>
										Chưa cài phần mềm
									</Text>
								</YStack>
							)}
						</YStack>
					</Card>

					{/* Credentials Section */}
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
							{/* Header */}
							<XStack alignItems="center" gap="$2">
								<Key size={20} color={AppColors.warning} />
								<Text
									fontSize={16}
									fontWeight="700"
									color={AppColors.text}
								>
									Thông tin đăng nhập
								</Text>
							</XStack>

							<Separator borderColor={AppColors.border} />

							{/* Placeholder - Will be implemented later */}
							<YStack padding="$3" alignItems="center" gap="$2">
								<Ionicons
									size={32}
									color={AppColors.textMuted}
								/>
								<Text
									fontSize={13}
									color={AppColors.textSecondary}
								>
									Chưa có thông tin đăng nhập
								</Text>
							</YStack>
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
							borderRadius="$4"
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
							borderRadius="$4"
							pressStyle={{
								backgroundColor: AppColors.successDark,
								scale: 0.97,
							}}
							onPress={shareInfo}
							height={'40'}
						>
							Chia sẻ
						</Button>
						<Button
							flex={1}
							minWidth={150}
							size="$4"
							backgroundColor={AppColors.primary}
							color="white"
							icon={
								<Ionicons
									name="qr-code-outline"
									size={20}
									color="white"
								/>
							}
							fontWeight="700"
							borderRadius="$4"
							pressStyle={{
								backgroundColor: AppColors.primaryDark,
								scale: 0.97,
							}}
							onPress={() => setShowPrintQRModal(true)}
							height={'40'}
						>
							In QR
						</Button>
					</XStack>
				</YStack>
			</ScrollView>

			<AssignDeviceModal
				visible={showAssignModal}
				onClose={() => setShowAssignModal(false)}
				preselectedDeviceId={deviceData?.id}
			/>

			{/* Software Edit Modal */}
			{editingSoftware && (
				<SoftwareEditModal
					visible={!!editingSoftware}
					onClose={() => setEditingSoftware(null)}
					softwareId={editingSoftware.id}
					softwareData={editingSoftware.data}
					onSuccess={refetchSoftware}
				/>
			)}

			{/* Software Selection Modal */}
			<SoftwareModal
				visible={showSoftwareModal}
				onClose={() => setShowSoftwareModal(false)}
				deviceId={deviceData?.id || ''}
				softwareList={softwareList}
				onSuccess={refetchSoftware}
			/>

			{/* Print QR Code Modal */}
			<PrintQRModal
				visible={showPrintQRModal}
				onClose={() => setShowPrintQRModal(false)}
				deviceName={deviceData?.name || ''}
				serialNumber={deviceData?.serialNumber || ''}
				deviceType={deviceData?.type}
				brand={deviceData?.brand}
			/>
		</>
	);
}
