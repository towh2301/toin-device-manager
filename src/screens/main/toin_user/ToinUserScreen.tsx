import { AppColors } from '@/src/common/app-color';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import { NavigationRoutes } from '@/src/navigation/types';
import {
	Position,
	ToinUserResponse,
	useDeleteToinUser,
	useGetAllToinUsers,
} from '@/src/services/toin-user';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, Card, Separator, Text, XStack, YStack } from 'tamagui';
import ToinUserFormModal from './ToinUserFormModal';

const roleLabels: Record<string, string> = {
	[Position.INTERN]: 'Thực tập sinh',
	[Position.STAFF]: 'Nhân viên',
	[Position.MANAGER]: 'Quản lý',
	[Position.DIRECTOR]: 'Giám đốc',
	[Position.SENIOR_MANAGER]: 'Quản lý cấp cao',
	[Position.LEADER]: 'Trưởng nhóm',
	[Position.ASM]: 'ASM',
	[Position.CHIEF_ACCOUNTANT]: 'Kế toán trưởng',
	[Position.SUPERVISOR]: 'Giám sát viên',
	[Position.TONG_GIAM_DOC]: 'Tổng Giám Đốc',
	[Position.PHO_TONG_GIAM_DOC]: 'Phó Tổng Giám Đốc',
	[Position.DEVELOPER]: 'Lập trình viên',
};

const roleColors: Record<
	string,
	{ bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }
> = {
	[Position.TONG_GIAM_DOC]: {
		bg: AppColors.danger + '15',
		text: AppColors.danger,
		icon: 'shield-checkmark-outline',
	},
	[Position.PHO_TONG_GIAM_DOC]: {
		bg: AppColors.danger + '15',
		text: AppColors.danger,
		icon: 'shield-checkmark-outline',
	},
	[Position.DIRECTOR]: {
		bg: AppColors.danger + '15',
		text: AppColors.danger,
		icon: 'shield-checkmark-outline',
	},
	[Position.MANAGER]: {
		bg: AppColors.warning + '15',
		text: AppColors.warningDark,
		icon: 'briefcase-outline',
	},
	[Position.SENIOR_MANAGER]: {
		bg: AppColors.warning + '15',
		text: AppColors.warningDark,
		icon: 'briefcase-outline',
	},
	[Position.LEADER]: {
		bg: AppColors.info + '15',
		text: AppColors.infoDark,
		icon: 'people-outline',
	},
	[Position.STAFF]: {
		bg: AppColors.info + '15',
		text: AppColors.infoDark,
		icon: 'person-outline',
	},
	[Position.DEVELOPER]: {
		bg: AppColors.primary + '15',
		text: AppColors.primary,
		icon: 'code-slash-outline',
	},
	[Position.INTERN]: {
		bg: AppColors.textMuted + '15',
		text: AppColors.textMuted,
		icon: 'school-outline',
	},
};

const ToinUserScreen = () => {
	const navigation = useNavigation();
	const {
		toinUserData,
		isLoading,
		isError,
		error,
		onGetAllToinUsers,
		isFetching,
	} = useGetAllToinUsers();

	const [search, setSearch] = useState('');
	const [positionFilter, setPositionFilter] = useState<string>('ALL');
	const [statusFilter, setStatusFilter] = useState<
		'ALL' | 'ACTIVE' | 'INACTIVE'
	>('ALL');
	const [refreshing, setRefreshing] = useState(false);
	const [showFormModal, setShowFormModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<ToinUserResponse | null>(
		null
	);
	const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

	const deleteMutation = useDeleteToinUser();

	// Filter logic
	const filteredUsers = useMemo(() => {
		let result = toinUserData;

		// Filter by position
		if (positionFilter !== 'ALL') {
			result = result.filter((user) => user.position === positionFilter);
		}

		// Filter by status
		if (statusFilter === 'ACTIVE') {
			result = result.filter((user) => !user.isDeleted);
		} else if (statusFilter === 'INACTIVE') {
			result = result.filter((user) => user.isDeleted);
		}

		// Filter by search
		if (search.trim()) {
			const query = search.toLowerCase();
			result = result.filter(
				(user) =>
					user.firstname.toLowerCase().includes(query) ||
					user.lastname.toLowerCase().includes(query) ||
					user.email.toLowerCase().includes(query) ||
					user.department.toLowerCase().includes(query) ||
					user.phone_number.toLowerCase().includes(query)
			);
		}

		return result;
	}, [toinUserData, search, positionFilter, statusFilter]);

	// Stats
	const stats = useMemo(() => {
		return {
			total: toinUserData.length,
			active: toinUserData.filter((u) => !u.isDeleted).length,
			inactive: toinUserData.filter((u) => u.isDeleted).length,
			filtered: filteredUsers.length,
		};
	}, [toinUserData, filteredUsers]);

	// Reload function
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		onGetAllToinUsers().finally(() => {
			setRefreshing(false);
		});
	}, [onGetAllToinUsers]);

	const handleCreateUser = () => {
		setFormMode('create');
		setSelectedUser(null);
		setShowFormModal(true);
	};

	const handleEditUser = (user: ToinUserResponse) => {
		setFormMode('edit');
		setSelectedUser(user);
		setShowFormModal(true);
	};

	const handleDeleteUser = (user: ToinUserResponse) => {
		Alert.alert(
			'Xác nhận xóa',
			`Bạn có chắc chắn muốn xóa người dùng "${user.firstname} ${user.lastname}"?`,
			[
				{
					text: 'Hủy',
					style: 'cancel',
				},
				{
					text: 'Xóa',
					style: 'destructive',
					onPress: async () => {
						try {
							await deleteMutation.mutateAsync(user.id);
							Toast.show({
								type: 'success',
								text1: 'Thành công',
								text2: 'Đã xóa người dùng',
							});
						} catch (error: any) {
							Toast.show({
								type: 'error',
								text1: 'Lỗi',
								text2:
									error.message || 'Không thể xóa người dùng',
							});
						}
					},
				},
			]
		);
	};

	const renderUserItem = ({ item }: { item: ToinUserResponse }) => {
		const roleConfig =
			roleColors[item.position] || roleColors[Position.STAFF];
		const fullName = `${item.firstname} ${item.lastname}`;
		const isActive = !item.isDeleted;
		return (
			<Card
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
				onPress={() => {
					(navigation as any).navigate(
						NavigationRoutes.TOIN_USER_DETAIL,
						{ userId: item.id }
					);
				}}
			>
				<XStack gap="$3" alignItems="flex-start">
					{/* Avatar */}
					<YStack
						width={56}
						height={56}
						backgroundColor={AppColors.primary + '20'}
						borderRadius="$10"
						justifyContent="center"
						alignItems="center"
						borderWidth={2}
						borderColor={AppColors.primary + '30'}
					>
						<Text
							fontSize={20}
							fontWeight="700"
							color={AppColors.primary}
						>
							{fullName.charAt(0)}
						</Text>
					</YStack>

					{/* User Info */}
					<YStack flex={1} gap="$2">
						<XStack
							justifyContent="space-between"
							alignItems="flex-start"
						>
							<YStack gap="$1" flex={1}>
								<Text
									fontSize={16}
									fontWeight="700"
									color={AppColors.text}
									numberOfLines={1}
								>
									{fullName}
								</Text>
								<XStack
									gap="$2"
									paddingHorizontal="$2"
									paddingVertical={3}
									backgroundColor={roleConfig.bg}
									borderRadius="$2"
									alignSelf="flex-start"
								>
									<Ionicons
										name={roleConfig.icon}
										size={12}
										color={roleConfig.text}
									/>
									<Text
										fontSize={11}
										fontWeight="700"
										color={roleConfig.text}
									>
										{roleLabels[item.position] ||
											item.position}
									</Text>
								</XStack>
							</YStack>

							{/* Status Badge */}
							<XStack
								paddingHorizontal="$2"
								paddingVertical={4}
								backgroundColor={
									isActive
										? AppColors.successLight
										: AppColors.textMuted + '20'
								}
								borderRadius="$2"
							>
								<Text
									fontSize={10}
									fontWeight="700"
									color={
										isActive
											? AppColors.successDark
											: AppColors.textMuted
									}
								>
									{isActive ? 'Hoạt động' : 'Ngưng'}
								</Text>
							</XStack>
						</XStack>

						<XStack gap="$2" alignItems="center">
							<Ionicons
								name="mail-outline"
								size={14}
								color={AppColors.textSecondary}
							/>
							<Text
								fontSize={13}
								color={AppColors.textSecondary}
								numberOfLines={1}
								flex={1}
							>
								{item.email}
							</Text>
						</XStack>

						<XStack gap="$3" flexWrap="wrap">
							<XStack gap="$1" alignItems="center">
								<Ionicons
									name="call-outline"
									size={14}
									color={AppColors.textMuted}
								/>
								<Text fontSize={12} color={AppColors.textMuted}>
									{item.phone_number}
								</Text>
							</XStack>
							<Text fontSize={12} color={AppColors.textMuted}>
								•
							</Text>
							<XStack gap="$1" alignItems="center">
								<Ionicons
									name="business-outline"
									size={14}
									color={AppColors.textMuted}
								/>
								<Text fontSize={12} color={AppColors.textMuted}>
									{item.department}
								</Text>
							</XStack>
						</XStack>

						<XStack gap="$2" alignItems="center">
							<Ionicons
								name="calendar-outline"
								size={12}
								color={AppColors.textMuted}
							/>
							<Text fontSize={11} color={AppColors.textMuted}>
								Tham gia:{' '}
								{new Date(item.joinedDate).toLocaleDateString(
									'vi-VN',
									{
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
									}
								)}
							</Text>
						</XStack>

						{/* Action Buttons */}
						<XStack gap="$2" marginTop="$2">
							<Button
								flex={1}
								size="$2"
								backgroundColor={AppColors.info + '20'}
								color={AppColors.info}
								borderWidth={1}
								borderColor={AppColors.info}
								icon={
									<Ionicons name="create-outline" size={16} />
								}
								onPress={() => handleEditUser(item)}
								pressStyle={{ opacity: 0.7 }}
							>
								Sửa
							</Button>
							<Button
								flex={1}
								size="$2"
								backgroundColor={AppColors.danger + '20'}
								color={AppColors.danger}
								borderWidth={1}
								borderColor={AppColors.danger}
								icon={
									<Ionicons name="trash-outline" size={16} />
								}
								onPress={() => handleDeleteUser(item)}
								pressStyle={{ opacity: 0.7 }}
								disabled={deleteMutation.isPending}
							>
								Xóa
							</Button>
						</XStack>
					</YStack>
				</XStack>
			</Card>
		);
	};

	// Handle retry for errors
	const handleRetry = useCallback(() => {
		console.log('Retrying fetch...');
		onGetAllToinUsers();
	}, [onGetAllToinUsers]);

	// Early returns for loading and error states
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
					{error?.message || 'Không thể tải dữ liệu người dùng'}
				</Text>
				<Button
					backgroundColor={AppColors.primary}
					color="white"
					fontWeight="700"
					onPress={handleRetry}
				>
					Thử lại
				</Button>
			</YStack>
		);
	}

	return (
		<YStack
			flex={1}
			backgroundColor={AppColors.background}
			paddingTop={60}
			paddingHorizontal={16}
		>
			<YStack gap="$4" paddingBottom="$3">
				{/* Header */}
				<YStack gap="$2">
					<Text fontSize={24} fontWeight="800" color={AppColors.text}>
						Quản lý người dùng
					</Text>
					<Text fontSize={13} color={AppColors.textSecondary}>
						Danh sách nhân viên TOIN
					</Text>
				</YStack>

				{/* Search Bar */}
				<XStack
					gap="$2"
					backgroundColor={AppColors.surface}
					borderRadius="$3"
					paddingHorizontal="$3"
					paddingVertical="$2"
					borderWidth={1}
					borderColor={AppColors.border}
					alignItems="center"
					shadowColor={AppColors.shadowLight}
					shadowRadius={4}
					shadowOffset={{ width: 0, height: 1 }}
					elevation={2}
				>
					<Ionicons
						name="search-outline"
						size={20}
						color={AppColors.textSecondary}
					/>
					<TextInput
						placeholder="Tìm theo tên, email, username..."
						placeholderTextColor={AppColors.textMuted}
						value={search}
						onChangeText={setSearch}
						style={{
							flex: 1,
							fontSize: 15,
							color: AppColors.text,
							paddingVertical: 8,
						}}
					/>
					{search.length > 0 && (
						<TouchableOpacity onPress={() => setSearch('')}>
							<Ionicons
								name="close-circle"
								size={20}
								color={AppColors.textMuted}
							/>
						</TouchableOpacity>
					)}
				</XStack>

				{/* Stats Cards */}
				<XStack gap="$3" flexWrap="wrap">
					<Card
						flex={1}
						minWidth="30%"
						padding="$3"
						backgroundColor={AppColors.primary + '15'}
						borderRadius="$3"
						borderWidth={1}
						borderColor={AppColors.primary + '30'}
					>
						<YStack alignItems="center" gap="$1">
							<Text
								fontSize={20}
								fontWeight="800"
								color={AppColors.primary}
							>
								{stats.total}
							</Text>
							<Text fontSize={11} color={AppColors.textSecondary}>
								Tổng số
							</Text>
						</YStack>
					</Card>
					<Card
						flex={1}
						minWidth="30%"
						padding="$3"
						backgroundColor={AppColors.successLight + '40'}
						borderRadius="$3"
						borderWidth={1}
						borderColor={AppColors.success + '30'}
					>
						<YStack alignItems="center" gap="$1">
							<Text
								fontSize={20}
								fontWeight="800"
								color={AppColors.success}
							>
								{stats.active}
							</Text>
							<Text fontSize={11} color={AppColors.textSecondary}>
								Hoạt động
							</Text>
						</YStack>
					</Card>
					<Card
						flex={1}
						minWidth="30%"
						padding="$3"
						backgroundColor={AppColors.textMuted + '15'}
						borderRadius="$3"
						borderWidth={1}
						borderColor={AppColors.textMuted + '30'}
					>
						<YStack alignItems="center" gap="$1">
							<Text
								fontSize={20}
								fontWeight="800"
								color={AppColors.textMuted}
							>
								{stats.inactive}
							</Text>
							<Text fontSize={11} color={AppColors.textSecondary}>
								Ngưng
							</Text>
						</YStack>
					</Card>
				</XStack>

				{/* Filters */}
				<YStack gap="$2">
					<Text fontSize={13} fontWeight="700" color={AppColors.text}>
						Lọc theo chức vụ
					</Text>
					<XStack gap="$2" flexWrap="wrap">
						{[
							'ALL',
							Position.MANAGER,
							Position.STAFF,
							Position.DEVELOPER,
							Position.INTERN,
						].map((position) => (
							<Button
								key={position}
								size="$3"
								backgroundColor={
									positionFilter === position
										? AppColors.primary
										: AppColors.surface
								}
								color={
									positionFilter === position
										? 'white'
										: AppColors.textSecondary
								}
								borderWidth={1}
								borderColor={
									positionFilter === position
										? AppColors.primary
										: AppColors.border
								}
								pressStyle={{
									scale: 0.95,
								}}
								onPress={() => setPositionFilter(position)}
								fontWeight="600"
								fontSize={13}
								borderRadius="$8"
								paddingHorizontal="$4"
							>
								{position === 'ALL'
									? 'Tất cả'
									: roleLabels[position] || position}
							</Button>
						))}
					</XStack>
				</YStack>

				<Separator borderColor={AppColors.border} />

				{/* Result Header */}
				<XStack justifyContent="space-between" alignItems="center">
					<Text fontSize={14} color={AppColors.textSecondary}>
						Tìm thấy{' '}
						<Text fontWeight="700" color={AppColors.primary}>
							{stats.filtered}
						</Text>{' '}
						người dùng
					</Text>
					<Button
						size="$2"
						backgroundColor={AppColors.primary}
						color="white"
						pressStyle={{
							backgroundColor: AppColors.primaryDark,
							scale: 0.95,
						}}
						borderRadius="$8"
						fontWeight="600"
						fontSize={12}
						icon={
							<Ionicons
								name="add-circle-outline"
								size={16}
								color="white"
							/>
						}
						onPress={handleCreateUser}
					>
						Thêm mới
					</Button>
				</XStack>
			</YStack>

			{/* User List */}
			{isLoading ? (
				<LoadingIndicator data={''} />
			) : (
				<FlatList
					data={filteredUsers}
					keyExtractor={(item) => item.id.toString()}
					renderItem={renderUserItem}
					contentContainerStyle={{ paddingBottom: 140, gap: 12 }}
					showsVerticalScrollIndicator={false}
					refreshing={refreshing}
					onRefresh={onRefresh}
					ListEmptyComponent={
						<YStack
							padding="$6"
							justifyContent="center"
							alignItems="center"
							gap="$3"
						>
							<Ionicons
								name="people-outline"
								size={64}
								color={AppColors.textMuted}
							/>
							<Text fontSize={16} color={AppColors.textSecondary}>
								Không tìm thấy người dùng
							</Text>
						</YStack>
					}
				/>
			)}

			{/* Form Modal */}
			<ToinUserFormModal
				visible={showFormModal}
				onClose={() => setShowFormModal(false)}
				user={selectedUser}
				mode={formMode}
			/>
		</YStack>
	);
};

export default ToinUserScreen;
