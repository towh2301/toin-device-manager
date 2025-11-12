import { AppColors } from '@/src/common/app-color';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import { StatusBadge } from '@/src/components/StatusBadge';
import {
	DeviceScreenNavigationProp,
	NavigationRoutes,
} from '@/src/navigation/types';
import { useDeleteDevice, useGetAllDevices } from '@/src/services/device';
import { DeviceResponse, DeviceType } from '@/src/services/device/types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { QrCode, Search, X } from '@tamagui/lucide-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
	Alert,
	Animated,
	FlatList,
	Modal,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, Card, SizeTokens, Text, XStack, YStack } from 'tamagui';
import DeviceFormModal from './DeviceFormModal';

export function InputCombo(props: {
	size: SizeTokens;
	search?: string;
	setSearch?: (value: string) => void;
	onSearchPress?: () => void;
}) {
	const navigation = useNavigation<any>();

	return (
		<XStack gap="$2" width="100%">
			{/* Search Input */}
			<XStack
				flex={1}
				alignItems="center"
				backgroundColor={AppColors.surface}
				borderWidth={1}
				borderColor={AppColors.border}
				borderRadius="$10"
				paddingHorizontal="$3"
				height={48}
			>
				<Search size={20} color={AppColors.textMuted} />
				<TextInput
					placeholder="Tìm thiết bị..."
					value={props.search}
					onChangeText={props.setSearch}
					placeholderTextColor={AppColors.textMuted}
					style={{
						flex: 1,
						height: 48,
						color: AppColors.text,
						fontSize: 15,
						paddingHorizontal: 12,
					}}
				/>
				{props.search && (
					<Button
						chromeless
						circular
						size="$2"
						padding={0}
						onPress={() => props.setSearch?.('')}
					>
						<X size={18} color={AppColors.textMuted} />
					</Button>
				)}
			</XStack>

			{/* QR Scan Button */}
			<Button
				size="$4"
				width={48}
				height={48}
				padding={0}
				backgroundColor={AppColors.primary}
				borderRadius="$10"
				pressStyle={{
					backgroundColor: AppColors.primaryDark,
					scale: 0.95,
				}}
				onPress={() =>
					navigation.navigate(NavigationRoutes.DEVICE, {
						screen: NavigationRoutes.QR_SCAN,
					})
				}
			>
				<QrCode size={22} color="white" />
			</Button>
		</XStack>
	);
}

export const SortDropdown = ({
	sortOption,
	setSortOption,
	deviceTypeIcons,
	onChange,
}: {
	sortOption: DeviceType;
	setSortOption: (option: DeviceType) => void;
	deviceTypeIcons: Record<DeviceType, string>;
	onChange: (option: DeviceType) => void;
}) => {
	const [open, setOpen] = useState(false);
	const fadeAnim = useState(new Animated.Value(0))[0];

	const openModal = () => {
		setOpen(true);
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 200,
			useNativeDriver: true,
		}).start();
	};

	const closeModal = () => {
		Animated.timing(fadeAnim, {
			toValue: 0,
			duration: 150,
			useNativeDriver: true,
		}).start(() => setOpen(false));
	};

	return (
		<>
			<TouchableOpacity
				style={styles.dropdownTrigger}
				onPress={openModal}
			>
				<Ionicons name="options" size={20} color={AppColors.primary} />
				<Text fontSize={14} fontWeight="700" color={AppColors.primary}>
					Lọc
				</Text>
			</TouchableOpacity>

			<Modal
				visible={open}
				transparent
				animationType="none"
				onRequestClose={closeModal}
			>
				<Animated.View
					style={[styles.modalOverlay, { opacity: fadeAnim }]}
				>
					<TouchableOpacity
						style={StyleSheet.absoluteFillObject}
						activeOpacity={1}
						onPress={closeModal}
					/>
					<Animated.View
						style={[
							styles.modalContent,
							{
								opacity: fadeAnim,
								transform: [
									{
										scale: fadeAnim.interpolate({
											inputRange: [0, 1],
											outputRange: [0.9, 1],
										}),
									},
								],
							},
						]}
					>
						{/* Modal Header - Modern Design */}
						<YStack
							backgroundColor={AppColors.primary}
							padding="$4"
							gap="$1"
						>
							<XStack
								justifyContent="space-between"
								alignItems="center"
							>
								<Text
									fontSize={20}
									fontWeight="900"
									color="white"
								>
									Lọc thiết bị
								</Text>
								<TouchableOpacity onPress={closeModal}>
									<Ionicons
										name="close-circle"
										size={30}
										color="white"
									/>
								</TouchableOpacity>
							</XStack>
							<Text fontSize={13} color="white" opacity={0.9}>
								Chọn loại thiết bị để hiển thị
							</Text>
						</YStack>

						<ScrollView
							style={styles.scrollView}
							showsVerticalScrollIndicator={false}
						>
							<YStack gap="$2" padding="$4">
								{Object.values(DeviceType).map((opt) => {
									const isActive = sortOption === opt;
									const iconName = deviceTypeIcons[opt];
									const displayName =
										opt === DeviceType.ALL
											? 'Tất cả thiết bị'
											: opt;

									return (
										<TouchableOpacity
											key={opt}
											style={[
												styles.optionItem,
												isActive &&
													styles.optionItemActive,
											]}
											onPress={() => {
												setSortOption(opt);
												onChange(opt);
												closeModal();
											}}
										>
											{/* Icon Background */}
											<YStack
												width={42}
												height={42}
												backgroundColor={
													isActive
														? 'white'
														: AppColors.primaryLight +
															'20'
												}
												borderRadius="$3"
												justifyContent="center"
												alignItems="center"
											>
												<Ionicons
													name={iconName as any}
													size={22}
													color={
														isActive
															? AppColors.primary
															: AppColors.text
													}
												/>
											</YStack>

											<Text
												fontSize={15}
												fontWeight={
													isActive ? '800' : '600'
												}
												color={
													isActive
														? 'white'
														: AppColors.text
												}
												style={{
													marginLeft: 12,
													flex: 1,
												}}
											>
												{displayName}
											</Text>
											{isActive && (
												<Ionicons
													name="checkmark-circle"
													size={24}
													color="white"
												/>
											)}
										</TouchableOpacity>
									);
								})}
							</YStack>
						</ScrollView>
					</Animated.View>
				</Animated.View>
			</Modal>
		</>
	);
};

// Device Card Component with animation
const DeviceCard = React.memo(
	({
		item,
		onPress,
		onEdit,
		onDelete,
	}: {
		item: DeviceResponse;
		onPress: () => void;
		onEdit?: (device: DeviceResponse) => void;
		onDelete?: (device: DeviceResponse) => void;
	}) => {
		const scaleAnim = React.useRef(new Animated.Value(1)).current;

		const handlePressIn = () => {
			Animated.spring(scaleAnim, {
				toValue: 0.96,
				useNativeDriver: true,
				speed: 50,
				bounciness: 4,
			}).start();
		};

		const handlePressOut = () => {
			Animated.spring(scaleAnim, {
				toValue: 1,
				useNativeDriver: true,
				speed: 50,
				bounciness: 4,
			}).start();
		};

		const getDeviceIcon = (
			type: DeviceType
		): keyof typeof Ionicons.glyphMap => {
			const iconMap: Record<DeviceType, keyof typeof Ionicons.glyphMap> =
				{
					[DeviceType.ALL]: 'cube',
					[DeviceType.LAPTOP]: 'laptop',
					[DeviceType.DESKTOP]: 'desktop',
					[DeviceType.MONITOR]: 'tv',
					[DeviceType.TABLET]: 'tablet-portrait',
					[DeviceType.SMARTPHONE]: 'phone-portrait',
					[DeviceType.PRINTER]: 'print',
					[DeviceType.CAMERA]: 'camera',
					[DeviceType.ROUTER]: 'wifi',
					[DeviceType.SWITCH]: 'git-branch',
					[DeviceType.OTHER]: 'ellipsis-horizontal',
				};
			return iconMap[type] || 'cube';
		};

		const deviceIcon = getDeviceIcon(item.type);

		return (
			<TouchableOpacity
				onPress={onPress}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				activeOpacity={1}
				style={{ marginBottom: 12 }}
			>
				<Animated.View
					style={{
						transform: [{ scale: scaleAnim }],
					}}
				>
					<Card
						elevate
						bordered
						borderColor={AppColors.border}
						borderRadius="$4"
						overflow="hidden"
						padding="$0"
						backgroundColor={AppColors.surface}
						shadowColor={AppColors.shadowLight}
						shadowRadius={8}
						shadowOffset={{ width: 0, height: 2 }}
					>
						{/* Header with gradient effect */}
						<XStack
							backgroundColor={AppColors.primary + '08'}
							padding="$3"
							justifyContent="space-between"
							alignItems="center"
							borderBottomWidth={1}
							borderBottomColor={AppColors.border}
						>
							<XStack gap="$3" alignItems="center" flex={1}>
								<YStack
									width={48}
									height={48}
									backgroundColor={AppColors.primary + '15'}
									borderRadius="$3"
									justifyContent="center"
									alignItems="center"
								>
									<Ionicons
										name={deviceIcon}
										size={24}
										color={AppColors.primary}
									/>
								</YStack>
								<YStack flex={1}>
									<Text
										fontSize={16}
										fontWeight="700"
										color={AppColors.text}
										numberOfLines={1}
									>
										{item.name}
									</Text>
									<Text
										fontSize={12}
										color={AppColors.textSecondary}
									>
										{item.type}
									</Text>
								</YStack>
							</XStack>
							<StatusBadge status={item.status} />
						</XStack>

						{/* Body */}
						<YStack padding="$3" gap="$2.5">
							{/* Serial Number */}
							<XStack
								gap="$2"
								alignItems="center"
								backgroundColor={AppColors.primaryLight + '15'}
								padding="$2"
								borderRadius="$3"
							>
								<Ionicons
									name="pricetag"
									size={16}
									color={AppColors.primary}
								/>
								<Text
									fontSize={13}
									color={AppColors.primary}
									fontWeight="700"
									flex={1}
								>
									{item.serialNumber}
								</Text>
							</XStack>

							{/* Brand & Type */}
							<XStack gap="$2" alignItems="center">
								<YStack
									flex={1}
									backgroundColor={AppColors.background}
									padding="$2"
									borderRadius="$2"
								>
									<Text
										fontSize={10}
										color={AppColors.textMuted}
									>
										Thương hiệu
									</Text>
									<Text
										fontSize={13}
										fontWeight="600"
										color={AppColors.text}
									>
										{item.brand}
									</Text>
								</YStack>
								<YStack
									flex={1}
									backgroundColor={AppColors.background}
									padding="$2"
									borderRadius="$2"
								>
									<Text
										fontSize={10}
										color={AppColors.textMuted}
									>
										Loại
									</Text>
									<Text
										fontSize={13}
										fontWeight="600"
										color={AppColors.text}
									>
										{item.type}
									</Text>
								</YStack>
							</XStack>

							{/* Purchase Date */}
							<XStack gap="$2" alignItems="center">
								<Ionicons
									name="calendar"
									size={14}
									color={AppColors.textSecondary}
								/>
								<Text
									fontSize={12}
									color={AppColors.textSecondary}
								>
									Mua ngày:{' '}
									<Text fontWeight="600">
										{item.purchasedDate
											? new Date(
													item.purchasedDate
												).toLocaleDateString('vi-VN')
											: 'N/A'}
									</Text>
								</Text>
							</XStack>

							{/* Action Buttons */}
							{(onEdit || onDelete) && (
								<XStack gap="$2" marginTop="$2">
									{onEdit && (
										<Button
											flex={1}
											size="$2"
											backgroundColor={
												AppColors.info + '20'
											}
											color={AppColors.info}
											borderWidth={1}
											borderColor={AppColors.info}
											icon={
												<Ionicons
													name="create-outline"
													size={16}
												/>
											}
											onPress={(e) => {
												e.stopPropagation();
												onEdit(item);
											}}
											pressStyle={{ opacity: 0.7 }}
											height={28}
										>
											<Text fontSize={12}>Sửa</Text>
										</Button>
									)}
									{onDelete && (
										<Button
											flex={1}
											size="$2"
											backgroundColor={
												AppColors.danger + '20'
											}
											color={AppColors.danger}
											borderWidth={1}
											borderColor={AppColors.danger}
											icon={
												<Ionicons
													name="trash-outline"
													size={16}
												/>
											}
											onPress={(e) => {
												e.stopPropagation();
												onDelete(item);
											}}
											pressStyle={{ opacity: 0.7 }}
											height={28}
										>
											<Text fontSize={12}>Xóa</Text>
										</Button>
									)}
								</XStack>
							)}
						</YStack>

						{/* Footer with action hint */}
						<XStack
							backgroundColor={AppColors.background}
							padding="$2"
							justifyContent="center"
							alignItems="center"
							borderTopWidth={1}
							borderTopColor={AppColors.border}
						>
							<Text fontSize={11} color={AppColors.textMuted}>
								Nhấn để xem chi tiết
							</Text>
							<Ionicons
								name="chevron-forward"
								size={12}
								color={AppColors.textMuted}
								style={{ marginLeft: 4 }}
							/>
						</XStack>
					</Card>
				</Animated.View>
			</TouchableOpacity>
		);
	}
);
DeviceCard.displayName = 'DeviceCard';

const DeviceScreen = () => {
	const { deviceData, isLoading, isError, error, onGetAllDevices } =
		useGetAllDevices();
	const deleteMutation = useDeleteDevice();

	// Valid Ionicons 7.2+ names (2025)
	const deviceTypeIcons: Record<DeviceType, string> = {
		[DeviceType.ALL]: 'apps-outline',
		[DeviceType.SMARTPHONE]: 'phone-portrait-outline',
		[DeviceType.TABLET]: 'tablet-portrait-outline',
		[DeviceType.LAPTOP]: 'laptop-outline',
		[DeviceType.DESKTOP]: 'desktop-outline',
		[DeviceType.MONITOR]: 'tv-outline',
		[DeviceType.PRINTER]: 'print-outline',
		[DeviceType.CAMERA]: 'camera-outline',
		[DeviceType.ROUTER]: 'wifi-outline', // Fixed: this is the correct name
		[DeviceType.SWITCH]: 'git-branch-outline',
		[DeviceType.OTHER]: 'ellipsis-horizontal-outline', // Better than help/info
	};

	const navigation = useNavigation<DeviceScreenNavigationProp>();

	const [search, setSearch] = useState('');
	const [sortOption, setSortOption] = useState<DeviceType>(DeviceType.ALL);
	const [refreshing, setRefreshing] = useState(false);
	const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
	const [showFormModal, setShowFormModal] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<DeviceResponse | null>(
		null
	);
	const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

	// Filter + Sort logic (correct & performant)
	const filteredAndSortedData = useMemo(() => {
		if (!deviceData) return [];

		let result = deviceData;

		// Apply sort (filter by type)
		if (sortOption !== DeviceType.ALL) {
			result = result.filter((device) => device.type === sortOption);
		}

		// Apply search
		if (search.trim()) {
			const query = search.toLowerCase();
			result = result.filter(
				(device) =>
					device.name.toLowerCase().includes(query) ||
					device.brand.toLowerCase().includes(query) ||
					device.serialNumber.toLowerCase().includes(query)
			);
		}

		return result;
	}, [deviceData, sortOption, search]);

	// Hàm reload
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		onGetAllDevices().finally(() => {
			setRefreshing(false);
		});
	}, [onGetAllDevices]);

	const onViewDeviceDetail = useCallback(
		(qrText: string) => {
			const found = deviceData?.find(
				(device) => device.serialNumber === qrText
			);
			if (found) {
				navigation.navigate(NavigationRoutes.DEVICE_DETAIL, {
					serialNumber: found.serialNumber,
				});
			}
		},
		[deviceData, navigation]
	);

	const handleRetry = useCallback(() => {
		console.log('Retrying fetch...');
		onGetAllDevices();
	}, [onGetAllDevices]);

	const handleCreateDevice = () => {
		setFormMode('create');
		setSelectedDevice(null);
		setShowFormModal(true);
	};

	const handleEditDevice = (device: DeviceResponse) => {
		setFormMode('edit');
		setSelectedDevice(device);
		setShowFormModal(true);
	};

	const handleDeleteDevice = (device: DeviceResponse) => {
		Alert.alert('Xác nhận xóa', `Xóa thiết bị "${device.name}"?`, [
			{ text: 'Hủy', style: 'cancel' },
			{
				text: 'Xóa',
				style: 'destructive',
				onPress: async () => {
					try {
						await deleteMutation.mutateAsync(device.id);
						Toast.show({
							type: 'success',
							text1: 'Đã xóa thiết bị',
						});
					} catch (err: any) {
						Toast.show({
							type: 'error',
							text1: 'Lỗi',
							text2: err.message || 'Không thể xóa',
						});
					}
				},
			},
		]);
	};

	// Render device card item using DeviceCard component
	const renderDeviceItem = useCallback(
		({ item }: { item: DeviceResponse }) => {
			return (
				<DeviceCard
					item={item}
					onPress={() =>
						navigation.navigate(NavigationRoutes.DEVICE_DETAIL, {
							serialNumber: item.serialNumber,
						})
					}
					onEdit={handleEditDevice}
					onDelete={handleDeleteDevice}
				/>
			);
		},
		[navigation]
	);

	// Early returns AFTER all hooks
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
					fontWeight="700"
					onPress={handleRetry}
				>
					Thử lại
				</Button>
			</YStack>
		);
	}

	return (
		<YStack flex={1} backgroundColor={AppColors.background}>
			{/* Fixed Header Section with Expandable/Collapsible */}
			<YStack
				paddingTop={60}
				paddingHorizontal={16}
				backgroundColor={AppColors.background}
				paddingBottom="$3"
			>
				{/* Modern Header with Toggle Button */}
				<TouchableOpacity
					onPress={() => setIsHeaderExpanded(!isHeaderExpanded)}
					activeOpacity={0.7}
				>
					<XStack
						justifyContent="space-between"
						alignItems="center"
						paddingBottom="$3"
					>
						<YStack gap="$1" flex={1}>
							<Text
								fontSize={26}
								fontWeight="900"
								color={AppColors.text}
							>
								Thiết bị
							</Text>
							<Text fontSize={13} color={AppColors.textSecondary}>
								{isHeaderExpanded
									? 'Quản lý và theo dõi'
									: `${filteredAndSortedData.length} thiết bị`}
							</Text>
						</YStack>

						<XStack gap="$2" alignItems="center">
							{/* Add Device Button */}
							<Button
								circular
								size="$8"
								backgroundColor={AppColors.success + '15'}
								borderWidth={0}
								pressStyle={{
									backgroundColor: AppColors.success + '25',
									scale: 0.95,
								}}
								onPress={(e) => {
									e.stopPropagation();
									handleCreateDevice();
								}}
								justifyContent="center"
								alignItems="center"
							>
								<Ionicons
									name="add-circle"
									size={24}
									color={AppColors.success}
								/>
							</Button>

							{/* Refresh Button */}
							<Button
								circular
								size="$8"
								backgroundColor={AppColors.primary + '15'}
								borderWidth={0}
								pressStyle={{
									backgroundColor: AppColors.primary + '25',
									scale: 0.95,
								}}
								onPress={(e) => {
									e.stopPropagation();
									onRefresh();
								}}
								disabled={refreshing}
								justifyContent="center"
								alignItems="center"
							>
								<Ionicons
									name="refresh"
									size={24}
									color={AppColors.primary}
									style={{
										transform: [
											{
												rotate: refreshing
													? '360deg'
													: '0deg',
											},
										],
									}}
								/>
							</Button>

							{/* Expand/Collapse Button */}
							<YStack
								width={44}
								height={44}
								backgroundColor={AppColors.primary + '15'}
								borderRadius="$10"
								justifyContent="center"
								alignItems="center"
							>
								<Ionicons
									name={
										isHeaderExpanded
											? 'chevron-up'
											: 'chevron-down'
									}
									size={24}
									color={AppColors.primary}
								/>
							</YStack>
						</XStack>
					</XStack>
				</TouchableOpacity>

				{/* Expandable Content */}
				{isHeaderExpanded && (
					<YStack gap="$3">
						{/* Search */}
						<InputCombo
							size="$9"
							search={search}
							setSearch={setSearch}
						/>

						{/* Modern Stats Cards with Icons */}
						<XStack gap="$3">
							<YStack
								flex={1}
								backgroundColor={AppColors.primary}
								borderRadius="$4"
								padding="$3"
								shadowColor={AppColors.primary}
								shadowRadius={8}
								shadowOffset={{ width: 0, height: 2 }}
								elevation={3}
							>
								<XStack
									justifyContent="space-between"
									alignItems="center"
								>
									<YStack gap="$1">
										<Text
											fontSize={11}
											color="white"
											opacity={0.9}
										>
											Tổng số
										</Text>
										<Text
											fontSize={26}
											fontWeight="900"
											color="white"
										>
											{deviceData?.length || 0}
										</Text>
									</YStack>
									<YStack
										width={40}
										height={40}
										backgroundColor="white"
										opacity={0.2}
										borderRadius="$8"
										justifyContent="center"
										alignItems="center"
									>
										<Ionicons
											name="cube"
											size={22}
											color="white"
										/>
									</YStack>
								</XStack>
							</YStack>

							<YStack
								flex={1}
								backgroundColor={AppColors.info}
								borderRadius="$4"
								padding="$3"
								shadowColor={AppColors.info}
								shadowRadius={8}
								shadowOffset={{ width: 0, height: 2 }}
								elevation={3}
							>
								<XStack
									justifyContent="space-between"
									alignItems="center"
								>
									<YStack gap="$1">
										<Text
											fontSize={11}
											color="white"
											opacity={0.9}
										>
											Đã lọc
										</Text>
										<Text
											fontSize={26}
											fontWeight="900"
											color="white"
										>
											{filteredAndSortedData.length}
										</Text>
									</YStack>
									<YStack
										width={40}
										height={40}
										backgroundColor="white"
										opacity={0.2}
										borderRadius="$8"
										justifyContent="center"
										alignItems="center"
									>
										<Ionicons
											name="funnel"
											size={22}
											color="white"
										/>
									</YStack>
								</XStack>
							</YStack>
						</XStack>

						{/* Filter Section */}
						{!isLoading && (
							<XStack
								justifyContent="space-between"
								alignItems="center"
								paddingVertical="$2"
							>
								<Text
									fontSize={15}
									fontWeight="700"
									color={AppColors.text}
								>
									{sortOption === DeviceType.ALL
										? 'Tất cả thiết bị'
										: `Loại: ${sortOption}`}
								</Text>
								<SortDropdown
									sortOption={sortOption}
									setSortOption={setSortOption}
									deviceTypeIcons={deviceTypeIcons}
									onChange={setSortOption}
								/>
							</XStack>
						)}
					</YStack>
				)}
			</YStack>

			{/* Device List with Beautiful Cards */}
			{isLoading ? (
				<LoadingIndicator data={''} />
			) : (
				<FlatList
					data={filteredAndSortedData}
					keyExtractor={(item) => item.id.toString()}
					renderItem={renderDeviceItem}
					contentContainerStyle={{
						paddingHorizontal: 16,
						paddingBottom: 140,
					}}
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
								name="cube-outline"
								size={64}
								color={AppColors.textMuted}
							/>
							<Text
								fontSize={16}
								color={AppColors.textSecondary}
								textAlign="center"
							>
								Không tìm thấy thiết bị
							</Text>
						</YStack>
					}
				/>
			)}

			{/* Device Form Modal */}
			<DeviceFormModal
				visible={showFormModal}
				onClose={() => setShowFormModal(false)}
				mode={formMode}
				device={selectedDevice}
			/>
		</YStack>
	);
};

const styles = StyleSheet.create({
	dropdownTrigger: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1.5,
		borderColor: AppColors.primary,
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 10,
		backgroundColor: AppColors.primary + '10',
		gap: 6,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.6)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: AppColors.surface,
		borderRadius: 20,
		width: '90%',
		maxHeight: '75%',
		overflow: 'hidden',
		elevation: 12,
		shadowColor: AppColors.shadowDark,
		shadowOpacity: 0.4,
		shadowRadius: 20,
		shadowOffset: { width: 0, height: 10 },
	},
	scrollView: {
		maxHeight: 450,
	},
	optionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 16,
		paddingHorizontal: 16,
		borderRadius: 14,
		backgroundColor: AppColors.background,
		marginBottom: 8,
		borderWidth: 1.5,
		borderColor: AppColors.border,
	},
	optionItemActive: {
		backgroundColor: AppColors.primary,
		borderColor: AppColors.primary,
		shadowColor: AppColors.primary,
		shadowRadius: 8,
		shadowOffset: { width: 0, height: 2 },
		elevation: 4,
	},
});

export default DeviceScreen;
