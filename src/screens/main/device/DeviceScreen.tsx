import { AppColors } from '@/src/common/app-color';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import { NavigationRoutes } from '@/src/navigation/types';
import { DeviceType } from '@/src/services/device/types';
import { useGetAllDevices } from '@/src/services/device/useGetAllDevices';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Filter, QrCode, Search, X } from '@tamagui/lucide-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
	Animated,
	Modal,
	ScrollView,
	StyleSheet,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import { Button, SizeTokens, Text, XStack, YStack } from 'tamagui';
import CustomList from '../../../components/ListItemCustom';
import { DeviceScreenNavigationProp } from './helpers';

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
				<Filter size={18} color={AppColors.primary} />
				<Text fontSize={14} fontWeight="600" color={AppColors.text}>
					{sortOption === DeviceType.ALL ? 'Tất cả' : sortOption}
				</Text>
				<Ionicons
					name="chevron-down"
					size={16}
					color={AppColors.textMuted}
				/>
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
						<YStack gap="$2" marginBottom="$3">
							<Text
								fontSize={18}
								fontWeight="800"
								color={AppColors.text}
							>
								Lọc theo loại
							</Text>
							<Text fontSize={13} color={AppColors.textMuted}>
								Chọn loại thiết bị để lọc
							</Text>
						</YStack>

						<ScrollView style={styles.scrollView}>
							<YStack gap="$2">
								{Object.values(DeviceType).map((opt) => {
									const isActive = sortOption === opt;
									const iconName = deviceTypeIcons[opt];
									const displayName =
										opt === DeviceType.ALL ? 'Tất cả' : opt;

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
											<Ionicons
												name={iconName as any}
												size={22}
												color={
													isActive
														? 'white'
														: AppColors.text
												}
											/>
											<Text
												fontSize={15}
												fontWeight={
													isActive ? '700' : '500'
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
													size={22}
													color="white"
												/>
											)}
										</TouchableOpacity>
									);
								})}
							</YStack>
						</ScrollView>

						<TouchableOpacity
							style={styles.closeButton}
							onPress={closeModal}
						>
							<X size={18} color="white" />
							<Text color="white" fontWeight="700" fontSize={15}>
								Đóng
							</Text>
						</TouchableOpacity>
					</Animated.View>
				</Animated.View>
			</Modal>
		</>
	);
};

const DeviceScreen = () => {
	const { deviceData, isLoading, isError, error, onGetAllDevices } =
		useGetAllDevices();

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
		<YStack
			flex={1}
			backgroundColor={AppColors.background}
			paddingTop={60}
			paddingHorizontal={16}
		>
			<YStack gap="$4" flex={1}>
				{/* Header */}
				<YStack gap="$2">
					{/* <Text fontSize={13} color={AppColors.textMuted}>
						Quản lý thiết bị
					</Text> */}
					<Text fontSize={24} fontWeight="800" color={AppColors.text}>
						Danh sách thiết bị
					</Text>
				</YStack>

				{/* Search */}
				<InputCombo size="$9" search={search} setSearch={setSearch} />

				{/* Stats Card */}
				<XStack gap="$3" flexWrap="wrap">
					<YStack
						flex={1}
						minWidth={160}
						backgroundColor={AppColors.primaryLight + '20'}
						borderRadius="$4"
						borderWidth={1}
						borderColor={AppColors.primary + '30'}
						justifyContent="center"
						alignItems="center"
						height={40}
					>
						<Text
							fontSize={18}
							color={AppColors.primary}
							fontWeight="800"
						>
							Tổng số: {deviceData?.length || 0}
						</Text>
					</YStack>
					<YStack
						flex={1}
						minWidth={160}
						backgroundColor={AppColors.primaryLight + '20'}
						borderRadius="$4"
						borderWidth={1}
						borderColor={AppColors.primary + '30'}
						justifyContent="center"
						alignItems="center"
						height={40}
					>
						<Text
							fontSize={18}
							color={AppColors.info}
							fontWeight="800"
						>
							Đã lọc: {filteredAndSortedData.length}
						</Text>
					</YStack>
				</XStack>

				{/* Loading */}
				{isLoading ? (
					<LoadingIndicator data={''} />
				) : (
					<>
						{/* Sort Dropdown */}
						<XStack justifyContent="flex-end" width="100%">
							<SortDropdown
								sortOption={sortOption}
								setSortOption={setSortOption}
								deviceTypeIcons={deviceTypeIcons}
								onChange={setSortOption}
							/>
						</XStack>

						{/* Device List */}
						<CustomList
							data={filteredAndSortedData}
							refreshing={refreshing}
							onRefresh={onRefresh}
							viewDetail={onViewDeviceDetail}
						/>
					</>
				)}
			</YStack>
		</YStack>
	);
};

const styles = StyleSheet.create({
	dropdownTrigger: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderColor: AppColors.border,
		borderRadius: 10,
		paddingHorizontal: 16,
		paddingVertical: 10,
		backgroundColor: AppColors.surface,
		minWidth: 150,
		gap: 8,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: AppColors.surface,
		borderRadius: 16,
		width: '85%',
		maxHeight: '70%',
		paddingHorizontal: 20,
		paddingTop: 24,
		paddingBottom: 20,
		elevation: 10,
		shadowColor: AppColors.shadowDark,
		shadowOpacity: 0.3,
		shadowRadius: 16,
		shadowOffset: { width: 0, height: 8 },
	},
	scrollView: {
		maxHeight: 400,
	},
	optionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 14,
		paddingHorizontal: 14,
		borderRadius: 10,
		backgroundColor: AppColors.background,
		marginBottom: 2,
	},
	optionItemActive: {
		backgroundColor: AppColors.primary,
	},
	closeButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: AppColors.textSecondary,
		borderRadius: 10,
		paddingVertical: 14,
		marginTop: 16,
		gap: 8,
	},
});

export default DeviceScreen;
