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
import {
	Alert,
	RefreshControl,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import {
	Button,
	Card,
	ScrollView,
	Separator,
	Text,
	XStack,
	YStack,
} from 'tamagui';
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
	const navigation = useNavigation<any>();
	const { toinUserData, isLoading, isError, error, onGetAllToinUsers } =
		useGetAllToinUsers();

	const [search, setSearch] = useState('');
	const [positionFilter, setPositionFilter] = useState<string>('ALL');
	const [refreshing, setRefreshing] = useState(false);
	const [showFormModal, setShowFormModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState<ToinUserResponse | null>(
		null
	);
	const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

	const deleteMutation = useDeleteToinUser();

	// === Filter & Stats ===
	const filteredUsers = useMemo(() => {
		let result = toinUserData || [];

		if (positionFilter !== 'ALL') {
			result = result.filter((u) => u.position === positionFilter);
		}

		if (search.trim()) {
			const q = search.toLowerCase();
			result = result.filter(
				(u) =>
					u.firstname.toLowerCase().includes(q) ||
					u.lastname.toLowerCase().includes(q) ||
					u.email.toLowerCase().includes(q) ||
					u.department.toLowerCase().includes(q) ||
					u.phone_number.toLowerCase().includes(q)
			);
		}

		return result;
	}, [toinUserData, search, positionFilter]);

	const stats = useMemo(
		() => ({
			total: toinUserData?.length || 0,
			active: toinUserData?.filter((u) => !u.isDeleted).length || 0,
			inactive: toinUserData?.filter((u) => u.isDeleted).length || 0,
			filtered: filteredUsers.length,
		}),
		[toinUserData, filteredUsers]
	);

	// === Refresh ===
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		onGetAllToinUsers().finally(() => setRefreshing(false));
	}, [onGetAllToinUsers]);

	// === Actions ===
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
			`Xóa "${user.firstname} ${user.lastname}"?`,
			[
				{ text: 'Hủy', style: 'cancel' },
				{
					text: 'Xóa',
					style: 'destructive',
					onPress: async () => {
						try {
							await deleteMutation.mutateAsync(user.id);
							Toast.show({ type: 'success', text1: 'Đã xóa' });
						} catch (err: any) {
							Toast.show({
								type: 'error',
								text1: 'Lỗi',
								text2: err.message || 'Không thể xóa',
							});
						}
					},
				},
			]
		);
	};

	// === Render Item ===
	const renderUserItem = ({ item }: { item: ToinUserResponse }) => {
		const config = roleColors[item.position] || roleColors[Position.STAFF];
		const fullName = `${item.firstname} ${item.lastname}`;
		const isActive = !item.isDeleted;

		return (
			<Card
				key={item.id}
				padding="$4"
				backgroundColor={AppColors.surface}
				borderWidth={1}
				borderColor={AppColors.border}
				borderRadius="$4"
				shadowColor={AppColors.shadowLight}
				shadowOffset={{ width: 0, height: 2 }}
				shadowRadius={6}
				elevation={3}
				pressStyle={{ scale: 0.97, borderColor: AppColors.primary }}
				animation="quick"
				onPress={() =>
					navigation.navigate(NavigationRoutes.TOIN_USER_DETAIL, {
						userId: item.id,
					})
				}
			>
				<XStack gap="$3" alignItems="flex-start">
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
							{fullName[0]}
						</Text>
					</YStack>

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
									gap="$1.5"
									paddingHorizontal="$2"
									paddingVertical="$1"
									backgroundColor={config.bg}
									borderRadius="$2"
									alignSelf="flex-start"
								>
									<Ionicons
										name={config.icon}
										size={12}
										color={config.text}
									/>
									<Text
										fontSize={11}
										fontWeight="700"
										color={config.text}
									>
										{roleLabels[item.position] ||
											item.position}
									</Text>
								</XStack>
							</YStack>

							<XStack
								paddingHorizontal="$2"
								paddingVertical="$1"
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
									'vi-VN'
								)}
							</Text>
						</XStack>

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
								height={24}
							>
								<Text>Sửa</Text>
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
								height={24}
							>
								<Text>Xóa</Text>
							</Button>
						</XStack>
					</YStack>
				</XStack>
			</Card>
		);
	};

	// === Filter Options ===
	const filterOptions = ['ALL', ...Object.values(Position)];

	// === Error State ===
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
					Lỗi
				</Text>
				<Text color={AppColors.textSecondary} textAlign="center">
					{error?.message || 'Không thể tải dữ liệu'}
				</Text>
				<Button
					backgroundColor={AppColors.primary}
					color="white"
					onPress={() => onGetAllToinUsers()}
				>
					<Text>Thử lại</Text>
				</Button>
			</YStack>
		);
	}

	return (
		<YStack
			flex={1}
			backgroundColor={AppColors.background}
			paddingTop="$10"
		>
			<ScrollView
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
					/>
				}
				showsVerticalScrollIndicator={false}
			>
				{/* Header + Filters */}
				<YStack gap="$4" paddingBottom="$3" paddingHorizontal="$4">
					<YStack gap="$2">
						<Text
							fontSize={24}
							fontWeight="800"
							color={AppColors.text}
						>
							Quản lý người dùng
						</Text>
						<Text fontSize={13} color={AppColors.textSecondary}>
							Danh sách nhân viên TOIN
						</Text>
					</YStack>

					{/* Search */}
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
							placeholder="Tìm theo tên, email..."
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
						{search ? (
							<TouchableOpacity onPress={() => setSearch('')}>
								<Ionicons
									name="close-circle"
									size={20}
									color={AppColors.textMuted}
								/>
							</TouchableOpacity>
						) : null}
					</XStack>

					{/* Stats */}
					<XStack gap="$3" flexWrap="wrap">
						{[
							{
								value: stats.total,
								label: 'Tổng số',
								color: AppColors.primary,
							},
							{
								value: stats.active,
								label: 'Hoạt động',
								color: AppColors.success,
							},
							{
								value: stats.inactive,
								label: 'Ngưng',
								color: AppColors.textMuted,
							},
						].map((stat, i) => (
							<Card
								key={i}
								flex={1}
								minWidth="30%"
								padding="$3"
								backgroundColor={stat.color + '15'}
								borderRadius="$3"
								borderWidth={1}
								borderColor={stat.color + '30'}
							>
								<YStack alignItems="center" gap="$1">
									<Text
										fontSize={20}
										fontWeight="800"
										color={stat.color}
									>
										{stat.value}
									</Text>
									<Text
										fontSize={11}
										color={AppColors.textSecondary}
									>
										{stat.label}
									</Text>
								</YStack>
							</Card>
						))}
					</XStack>

					{/* Position Filter - Button Group */}
					<YStack gap="$2">
						<Text
							fontSize={13}
							fontWeight="700"
							color={AppColors.text}
						>
							Lọc theo chức vụ
						</Text>
						<XStack gap="$2" flexWrap="wrap">
							{filterOptions.map((position) => (
								<Button
									key={position}
									size="$3"
									backgroundColor={
										positionFilter === position
											? AppColors.primary
											: AppColors.surface
									}
									borderWidth={1}
									borderColor={
										positionFilter === position
											? AppColors.primary
											: AppColors.border
									}
									pressStyle={{ scale: 0.95 }}
									onPress={() => setPositionFilter(position)}
									borderRadius="$8"
									paddingHorizontal="$4"
									height="auto"
								>
									<Text
										fontSize={13}
										fontWeight="600"
										color={
											positionFilter === position
												? 'white'
												: AppColors.text
										}
									>
										{position === 'ALL'
											? 'Tất cả'
											: roleLabels[position] || position}
									</Text>
								</Button>
							))}
						</XStack>
					</YStack>

					<Separator borderColor={AppColors.border} />

					{/* Result + Add Button */}
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
							height={24}
						>
							<Text color="white">Thêm mới</Text>
						</Button>
					</XStack>
				</YStack>

				{/* User List */}
				<ScrollView
					style={{ paddingBottom: 130, paddingHorizontal: 16 }}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
				>
					{isLoading ? (
						<LoadingIndicator data={''} />
					) : filteredUsers.length === 0 ? (
						<YStack padding="$6" alignItems="center" gap="$3">
							<Ionicons
								name="people-outline"
								size={64}
								color={AppColors.textMuted}
							/>
							<Text fontSize={16} color={AppColors.textSecondary}>
								Không tìm thấy người dùng
							</Text>
						</YStack>
					) : (
						<YStack gap="$4">
							{filteredUsers.map((user) =>
								renderUserItem({ item: user })
							)}
						</YStack>
					)}
				</ScrollView>

				{/* Form Modal */}
				<ToinUserFormModal
					visible={showFormModal}
					onClose={() => setShowFormModal(false)}
					user={selectedUser}
					mode={formMode}
				/>
			</ScrollView>
		</YStack>
	);
};

export default ToinUserScreen;
