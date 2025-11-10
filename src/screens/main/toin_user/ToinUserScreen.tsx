import { AppColors } from '@/src/common/app-color';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { FlatList, TextInput, TouchableOpacity } from 'react-native';
import { Button, Card, Separator, Text, XStack, YStack } from 'tamagui';

// Mock user type
interface ToinUser {
	id: number;
	fullName: string;
	email: string;
	username: string;
	role: 'ADMIN' | 'MANAGER' | 'STAFF';
	department: string;
	isActive: boolean;
	joinedDate: string;
}

// Mock data
const MOCK_USERS: ToinUser[] = [
	{
		id: 1,
		fullName: 'Nguyễn Văn A',
		email: 'nguyenvana@toin.com',
		username: 'nguyenvana',
		role: 'ADMIN',
		department: 'IT',
		isActive: true,
		joinedDate: '2024-01-15',
	},
	{
		id: 2,
		fullName: 'Trần Thị B',
		email: 'tranthib@toin.com',
		username: 'tranthib',
		role: 'MANAGER',
		department: 'HR',
		isActive: true,
		joinedDate: '2024-02-20',
	},
	{
		id: 3,
		fullName: 'Lê Văn C',
		email: 'levanc@toin.com',
		username: 'levanc',
		role: 'STAFF',
		department: 'Sales',
		isActive: true,
		joinedDate: '2024-03-10',
	},
	{
		id: 4,
		fullName: 'Phạm Thị D',
		email: 'phamthid@toin.com',
		username: 'phamthid',
		role: 'STAFF',
		department: 'IT',
		isActive: false,
		joinedDate: '2024-04-05',
	},
	{
		id: 5,
		fullName: 'Hoàng Văn E',
		email: 'hoangvane@toin.com',
		username: 'hoangvane',
		role: 'MANAGER',
		department: 'Finance',
		isActive: true,
		joinedDate: '2024-05-12',
	},
];

const roleLabels: Record<string, string> = {
	ADMIN: 'Quản trị viên',
	MANAGER: 'Quản lý',
	STAFF: 'Nhân viên',
};

const roleColors: Record<
	string,
	{ bg: string; text: string; icon: keyof typeof Ionicons.glyphMap }
> = {
	ADMIN: {
		bg: AppColors.danger + '15',
		text: AppColors.danger,
		icon: 'shield-checkmark-outline',
	},
	MANAGER: {
		bg: AppColors.warning + '15',
		text: AppColors.warningDark,
		icon: 'briefcase-outline',
	},
	STAFF: {
		bg: AppColors.info + '15',
		text: AppColors.infoDark,
		icon: 'person-outline',
	},
};

const ToinUserScreen = () => {
	const [search, setSearch] = useState('');
	const [roleFilter, setRoleFilter] = useState<string>('ALL');
	const [statusFilter, setStatusFilter] = useState<
		'ALL' | 'ACTIVE' | 'INACTIVE'
	>('ALL');

	// Filter logic
	const filteredUsers = useMemo(() => {
		let result = MOCK_USERS;

		// Filter by role
		if (roleFilter !== 'ALL') {
			result = result.filter((user) => user.role === roleFilter);
		}

		// Filter by status
		if (statusFilter === 'ACTIVE') {
			result = result.filter((user) => user.isActive);
		} else if (statusFilter === 'INACTIVE') {
			result = result.filter((user) => !user.isActive);
		}

		// Filter by search
		if (search.trim()) {
			const query = search.toLowerCase();
			result = result.filter(
				(user) =>
					user.fullName.toLowerCase().includes(query) ||
					user.email.toLowerCase().includes(query) ||
					user.username.toLowerCase().includes(query) ||
					user.department.toLowerCase().includes(query)
			);
		}

		return result;
	}, [search, roleFilter, statusFilter]);

	// Stats
	const stats = useMemo(() => {
		return {
			total: MOCK_USERS.length,
			active: MOCK_USERS.filter((u) => u.isActive).length,
			inactive: MOCK_USERS.filter((u) => !u.isActive).length,
			filtered: filteredUsers.length,
		};
	}, [filteredUsers]);

	const renderUserItem = ({ item }: { item: ToinUser }) => {
		const roleConfig = roleColors[item.role];
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
							{item.fullName.charAt(0)}
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
									{item.fullName}
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
										{roleLabels[item.role]}
									</Text>
								</XStack>
							</YStack>

							{/* Status Badge */}
							<XStack
								paddingHorizontal="$2"
								paddingVertical={4}
								backgroundColor={
									item.isActive
										? AppColors.successLight
										: AppColors.textMuted + '20'
								}
								borderRadius="$2"
							>
								<Text
									fontSize={10}
									fontWeight="700"
									color={
										item.isActive
											? AppColors.successDark
											: AppColors.textMuted
									}
								>
									{item.isActive ? 'Hoạt động' : 'Ngưng'}
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
									name="person-circle-outline"
									size={14}
									color={AppColors.textMuted}
								/>
								<Text fontSize={12} color={AppColors.textMuted}>
									@{item.username}
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
					</YStack>
				</XStack>
			</Card>
		);
	};

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
						{['ALL', 'ADMIN', 'MANAGER', 'STAFF'].map((role) => (
							<Button
								key={role}
								size="$3"
								backgroundColor={
									roleFilter === role
										? AppColors.primary
										: AppColors.surface
								}
								color={
									roleFilter === role
										? 'white'
										: AppColors.textSecondary
								}
								borderWidth={1}
								borderColor={
									roleFilter === role
										? AppColors.primary
										: AppColors.border
								}
								pressStyle={{
									scale: 0.95,
								}}
								onPress={() => setRoleFilter(role)}
								fontWeight="600"
								fontSize={13}
								borderRadius="$8"
								paddingHorizontal="$4"
							>
								{role === 'ALL' ? 'Tất cả' : roleLabels[role]}
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
					>
						Thêm mới
					</Button>
				</XStack>
			</YStack>

			{/* User List */}
			<FlatList
				data={filteredUsers}
				keyExtractor={(item) => item.id.toString()}
				renderItem={renderUserItem}
				contentContainerStyle={{ paddingBottom: 140, gap: 12 }}
				showsVerticalScrollIndicator={false}
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
		</YStack>
	);
};

export default ToinUserScreen;
