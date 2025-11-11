/**
 * ToinUserDetailScreen
 * Displays detailed information about a Toin User
 * Shows assigned devices and assignment history
 */

import { AppColors } from '@/src/common/app-color';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import { useGetAllAssignments } from '@/src/services/device';
import { useGetToinUserById } from '@/src/services/toin-user';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
	ArrowLeft,
	Briefcase,
	Building2,
	Calendar,
	Mail,
	Phone,
} from '@tamagui/lucide-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Card, Separator, Text, XStack, YStack } from 'tamagui';

// Type for route params
type ToinUserDetailRouteProp = RouteProp<
	{ ToinUserDetail: { userId: string } },
	'ToinUserDetail'
>;

export default function ToinUserDetailScreen() {
	const route = useRoute<ToinUserDetailRouteProp>();
	const navigation = useNavigation();
	const userId = route.params?.userId || '';
	const [showAssignModal, setShowAssignModal] = useState(false);

	// Fetch user data
	const {
		toinUserData,
		isLoading: userLoading,
		isError: userError,
		error,
	} = useGetToinUserById(userId);

	// Fetch all assignments to filter by this user
	const { data: assignmentsResponse, isLoading: assignmentsLoading } =
		useGetAllAssignments();

	// Use toinUser directly
	const toinUser = toinUserData;

	// Filter assignments for this user
	const userAssignments = useMemo(() => {
		if (!assignmentsResponse?.data || !toinUser?.id) return [];
		return assignmentsResponse.data.filter(
			(assignment) =>
				assignment.assignedTo === toinUser.id ||
				assignment.userId === toinUser.id
		);
	}, [assignmentsResponse, toinUser?.id]);

	// Get current assignments (no return date)
	const currentAssignments = useMemo(() => {
		return userAssignments.filter((assignment) => !assignment.returnDate);
	}, [userAssignments]);

	// Get past assignments (has return date)
	const pastAssignments = useMemo(() => {
		return userAssignments.filter((assignment) => assignment.returnDate);
	}, [userAssignments]);

	if (userLoading) {
		return <LoadingIndicator data={''} />;
	}

	if (userError || !toinUser) {
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
					{error?.message || 'Không thể tải thông tin người dùng'}
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

	const fullName = `${toinUser.firstname} ${toinUser.lastname}`;

	// Department and Position labels
	const departmentLabels: Record<string, string> = {
		DTP: 'DTP',
		'Sản xuất': 'Sản xuất',
		CTP: 'CTP',
		'Tổng vụ': 'Tổng vụ',
		'Kinh doanh': 'Kinh doanh',
		QC: 'QC',
		QA: 'QA',
		IT: 'IT',
		'Thiết kế': 'Thiết kế',
		'Kế toán': 'Kế toán',
		'Bảo trì': 'Bảo trì',
		'Mua hàng': 'Mua hàng',
		'Phòng in': 'Phòng in',
		'Kế hoạch': 'Kế hoạch',
		'Xuất nhập khẩu': 'XNK',
		Kho: 'Kho',
		'Xưởng 1': 'Xưởng 1',
		'Xưởng 2': 'Xưởng 2',
		'Xưởng 3': 'Xưởng 3',
	};

	const positionLabels: Record<string, string> = {
		INTERN: 'Thực tập',
		STAFF: 'Nhân viên',
		MANAGER: 'Quản lý',
		DIRECTOR: 'Giám đốc',
		SENIOR_MANAGER: 'Quản lý cấp cao',
		LEADER: 'Trưởng nhóm',
		ASM: 'ASM',
		CHIEF_ACCOUNTANT: 'Kế toán trưởng',
		SUPERVISOR: 'Giám sát',
		TONG_GIAM_DOC: 'Tổng Giám Đốc',
		PHO_TONG_GIAM_DOC: 'Phó Tổng Giám Đốc',
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
							Chi tiết người dùng
						</Text>
						<Text
							fontSize={24}
							fontWeight="800"
							color={AppColors.text}
						>
							{fullName}
						</Text>
					</YStack>
				</XStack>

				{/* User Avatar Card */}
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
							<Text
								fontSize={40}
								fontWeight="700"
								color={AppColors.primary}
							>
								{fullName.charAt(0)}
							</Text>
						</YStack>
						<Text fontSize={18} fontWeight="700" color="white">
							{fullName}
						</Text>
						<XStack gap="$2">
							<YStack
								paddingHorizontal="$2"
								paddingVertical="$1"
								backgroundColor="white"
								borderRadius="$2"
							>
								<Text
									fontSize={11}
									fontWeight="700"
									color={AppColors.primary}
								>
									{departmentLabels[toinUser.department] ||
										toinUser.department}
								</Text>
							</YStack>
							<YStack
								paddingHorizontal="$2"
								paddingVertical="$1"
								backgroundColor={AppColors.primaryDark}
								borderRadius="$2"
							>
								<Text
									fontSize={11}
									fontWeight="700"
									color="white"
								>
									{positionLabels[toinUser.position] ||
										toinUser.position}
								</Text>
							</YStack>
						</XStack>
					</YStack>
				</Card>

				{/* User Info Card */}
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
									{toinUser.email}
								</Text>
							</YStack>
						</XStack>

						<Separator borderColor={AppColors.border} />

						{/* Phone */}
						<XStack gap="$3" alignItems="center">
							<YStack
								width={40}
								height={40}
								borderRadius="$8"
								backgroundColor={AppColors.success + '20'}
								alignItems="center"
								justifyContent="center"
							>
								<Phone size={20} color={AppColors.success} />
							</YStack>
							<YStack flex={1}>
								<Text fontSize={12} color={AppColors.textMuted}>
									Số điện thoại
								</Text>
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									{toinUser.phone_number}
								</Text>
							</YStack>
						</XStack>

						<Separator borderColor={AppColors.border} />

						{/* Department */}
						<XStack gap="$3" alignItems="center">
							<YStack
								width={40}
								height={40}
								borderRadius="$8"
								backgroundColor={AppColors.accent3 + '20'}
								alignItems="center"
								justifyContent="center"
							>
								<Building2
									size={20}
									color={AppColors.accent3}
								/>
							</YStack>
							<YStack flex={1}>
								<Text fontSize={12} color={AppColors.textMuted}>
									Phòng ban
								</Text>
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									{departmentLabels[toinUser.department] ||
										toinUser.department}
								</Text>
							</YStack>
						</XStack>

						<Separator borderColor={AppColors.border} />

						{/* Position */}
						<XStack gap="$3" alignItems="center">
							<YStack
								width={40}
								height={40}
								borderRadius="$8"
								backgroundColor={AppColors.primary + '20'}
								alignItems="center"
								justifyContent="center"
							>
								<Briefcase
									size={20}
									color={AppColors.primary}
								/>
							</YStack>
							<YStack flex={1}>
								<Text fontSize={12} color={AppColors.textMuted}>
									Chức vụ
								</Text>
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									{positionLabels[toinUser.position] ||
										toinUser.position}
								</Text>
							</YStack>
						</XStack>

						<Separator borderColor={AppColors.border} />

						{/* Joined Date */}
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
									Ngày vào làm
								</Text>
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									{new Date(
										toinUser.joinedDate
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

				{/* Current Devices Section */}
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
						<XStack
							alignItems="center"
							justifyContent="space-between"
						>
							<XStack alignItems="center" gap="$2">
								<Ionicons
									name="laptop"
									size={20}
									color={AppColors.primary}
								/>
								<Text
									fontSize={16}
									fontWeight="700"
									color={AppColors.text}
								>
									Thiết bị hiện tại
								</Text>
							</XStack>
							<Text
								fontSize={12}
								color={AppColors.textMuted}
								backgroundColor={AppColors.primary + '20'}
								paddingHorizontal="$2"
								paddingVertical="$1"
								borderRadius="$2"
							>
								{currentAssignments.length} thiết bị
							</Text>
						</XStack>

						<Separator borderColor={AppColors.border} />

						{assignmentsLoading ? (
							<YStack padding="$3" alignItems="center">
								<LoadingIndicator data={''} />
							</YStack>
						) : currentAssignments.length > 0 ? (
							<YStack gap="$2">
								{currentAssignments.map((assignment) => (
									<XStack
										key={assignment.id}
										gap="$3"
										alignItems="center"
										padding="$3"
										backgroundColor={AppColors.background}
										borderRadius="$2"
										borderWidth={1}
										borderColor={AppColors.border}
									>
										<YStack
											width={40}
											height={40}
											borderRadius="$2"
											backgroundColor={
												AppColors.info + '20'
											}
											alignItems="center"
											justifyContent="center"
										>
											<Ionicons
												name="laptop-outline"
												size={20}
												color={AppColors.info}
											/>
										</YStack>
										<YStack flex={1}>
											<Text
												fontSize={14}
												fontWeight="600"
												color={AppColors.text}
											>
												Device #{assignment.deviceId}
											</Text>
											<Text
												fontSize={11}
												color={AppColors.textMuted}
											>
												Giao:{' '}
												{new Date(
													assignment.assignmentDate
												).toLocaleDateString('vi-VN')}
											</Text>
											{assignment.notes && (
												<Text
													fontSize={11}
													color={
														AppColors.textSecondary
													}
													marginTop="$1"
												>
													📝 {assignment.notes}
												</Text>
											)}
										</YStack>
									</XStack>
								))}
							</YStack>
						) : (
							<YStack padding="$3" alignItems="center" gap="$2">
								<Ionicons
									name="laptop-outline"
									size={32}
									color={AppColors.textMuted}
								/>
								<Text
									fontSize={13}
									color={AppColors.textSecondary}
								>
									Chưa có thiết bị nào
								</Text>
							</YStack>
						)}
					</YStack>
				</Card>

				{/* Assignment History Section */}
				{pastAssignments.length > 0 && (
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
							<XStack
								alignItems="center"
								justifyContent="space-between"
							>
								<XStack alignItems="center" gap="$2">
									<Ionicons
										name="time"
										size={20}
										color={AppColors.textMuted}
									/>
									<Text
										fontSize={16}
										fontWeight="700"
										color={AppColors.text}
									>
										Lịch sử thiết bị
									</Text>
								</XStack>
								<Text
									fontSize={12}
									color={AppColors.textMuted}
									backgroundColor={AppColors.textMuted + '20'}
									paddingHorizontal="$2"
									paddingVertical="$1"
									borderRadius="$2"
								>
									{pastAssignments.length} thiết bị
								</Text>
							</XStack>

							<Separator borderColor={AppColors.border} />

							<YStack gap="$2">
								{pastAssignments.map((assignment) => (
									<XStack
										key={assignment.id}
										gap="$3"
										alignItems="center"
										padding="$3"
										backgroundColor={AppColors.background}
										borderRadius="$2"
										opacity={0.7}
									>
										<YStack
											width={40}
											height={40}
											borderRadius="$2"
											backgroundColor={
												AppColors.textMuted + '20'
											}
											alignItems="center"
											justifyContent="center"
										>
											<Ionicons
												name="laptop-outline"
												size={20}
												color={AppColors.textMuted}
											/>
										</YStack>
										<YStack flex={1}>
											<Text
												fontSize={14}
												fontWeight="600"
												color={AppColors.text}
											>
												Device #{assignment.deviceId}
											</Text>
											<Text
												fontSize={11}
												color={AppColors.textMuted}
											>
												{new Date(
													assignment.assignmentDate
												).toLocaleDateString(
													'vi-VN'
												)}{' '}
												-{' '}
												{new Date(
													assignment.returnDate!
												).toLocaleDateString('vi-VN')}
											</Text>
										</YStack>
									</XStack>
								))}
							</YStack>
						</YStack>
					</Card>
				)}

				{/* Statistics Card */}
				<Card
					bordered
					padding="$4"
					backgroundColor={AppColors.accent1}
					borderColor={AppColors.border}
					borderRadius="$10"
				>
					<XStack justifyContent="space-around" alignItems="center">
						<YStack alignItems="center" gap="$1">
							<Text fontSize={24} fontWeight="800" color="white">
								{currentAssignments.length}
							</Text>
							<Text fontSize={12} color="white" opacity={0.9}>
								Đang dùng
							</Text>
						</YStack>
						<Separator
							vertical
							height={40}
							borderColor="white"
							opacity={0.3}
						/>
						<YStack alignItems="center" gap="$1">
							<Text fontSize={24} fontWeight="800" color="white">
								{pastAssignments.length}
							</Text>
							<Text fontSize={12} color="white" opacity={0.9}>
								Đã trả
							</Text>
						</YStack>
						<Separator
							vertical
							height={40}
							borderColor="white"
							opacity={0.3}
						/>
						<YStack alignItems="center" gap="$1">
							<Text fontSize={24} fontWeight="800" color="white">
								{userAssignments.length}
							</Text>
							<Text fontSize={12} color="white" opacity={0.9}>
								Tổng cộng
							</Text>
						</YStack>
					</XStack>
				</Card>
			</YStack>
		</ScrollView>
	);
}
