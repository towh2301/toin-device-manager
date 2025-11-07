import { AppColors } from '@/src/common/app-color';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import { NavigationRoutes } from '@/src/navigation/types';
import { DeviceType } from '@/src/services/device/types';
import { useGetAllDevices } from '@/src/services/device/useGetAllDevices';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
	Animated,
	Modal,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { Button, Input, SizeTokens, Text, XStack, YStack } from 'tamagui';
import CustomList from '../../../components/ListItemCustom';
import { DeviceScreenNavigationProp } from './helpers';

export function InputCombo(props: {
	size: SizeTokens;
	search?: string;
	setSearch?: (value: string) => void;
	onSearchPress?: () => void;
}) {
	const navigation = useNavigation<DeviceScreenNavigationProp>();

	return (
		<XStack
			alignItems="center"
			width="100%"
			backgroundColor={AppColors.surface}
			borderWidth={1}
			borderColor={AppColors.secondary}
			borderRadius="$4"
			marginTop="$8"
		>
			<Input
				minHeight={props.size === '$4' ? 48 : 32}
				flex={1}
				size={props.size}
				placeholder={`Size ${props.size}...`}
				backgroundColor={AppColors.surface}
				borderWidth={0}
				value={props.search}
				onChangeText={props.setSearch}
			/>
			<Button
				size={props.size}
				minHeight={props.size === '$4' ? 48 : 32}
				chromeless
				pressStyle={{
					scale: 0.9, // Thu nhỏ component lại còn 90%
				}}
				shadowRadius={5}
				shadowOpacity={0.2}
				shadowOffset={{ width: 0, height: 2 }}
				onPress={() => navigation.navigate(NavigationRoutes.QR_SCAN)}
			>
				<Ionicons name="qr-code" size={20} color={AppColors.primary} />
			</Button>
			<Button
				size={props.size}
				minHeight={props.size === '$4' ? 48 : 32}
				chromeless
				pressStyle={{
					scale: 0.9, // Thu nhỏ component lại còn 90%
				}}
				shadowRadius={5}
				shadowOpacity={0.2}
				shadowOffset={{ width: 0, height: 2 }}
				onPress={props.onSearchPress}
			>
				<Ionicons
					name="search-outline"
					size={20}
					color={AppColors.primary}
				/>
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
				<Text fontSize="$3" color="$color">
					{sortOption || 'Select Type'}
				</Text>
				<Ionicons name="chevron-down" size={16} color="#555" />
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
						<ScrollView style={styles.scrollView}>
							<YStack gap="$2">
								{Object.values(DeviceType).map((opt) => {
									const isActive = sortOption === opt;
									const iconName = deviceTypeIcons[opt];

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
												size={20}
												color={
													isActive ? 'white' : '#333'
												}
											/>
											<Text
												fontSize="$4"
												color={
													isActive ? 'white' : '#333'
												}
												style={{
													marginLeft: 12,
													flex: 1,
												}}
											>
												{opt}
											</Text>
											{isActive && (
												<Ionicons
													name="checkmark"
													size={20}
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
							<Ionicons name="close" size={18} color="#fff" />
							<Text color="white" fontWeight="600">
								Close
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

	// Thêm state
	const [refreshing, setRefreshing] = useState(false);

	// Hàm reload
	const onRefresh = useCallback(() => {
		setRefreshing(true);
		onGetAllDevices().finally(() => {
			setRefreshing(false);
		});
	}, [onGetAllDevices]);

	const handleRetry = () => {
		console.log('Retrying fetch...');
		onGetAllDevices();
	};

	if (isError) {
		return (
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				padding="$4"
				gap="$4"
			>
				<Text color="$red10">
					Error: {error?.message || 'Unknown error'}
				</Text>
				<Button onPress={handleRetry} backgroundColor="$blue10">
					Tap to retry
				</Button>
			</YStack>
		);
	}

	const onViewDeviceDetail = useCallback(
		(qrText: string) => {
			const found = deviceData.find(
				(device) => device.serialNumber === qrText
			);
			if (found) {
				navigation.navigate(NavigationRoutes.DEVICE_DETAIL, {
					deviceId: found.id,
				});
			}
		},
		[deviceData, navigation]
	);

	return (
		<YStack flex={1} padding="$4" gap="$4" backgroundColor="$background">
			{/* Search */}
			<InputCombo size="$4" search={search} setSearch={setSearch} />

			{/* Loading */}
			{isLoading ? (
				<LoadingIndicator data={''} />
			) : (
				<>
					{/* Sort Dropdown */}
					<XStack
						justifyContent="flex-end"
						width="100%"
						maxWidth={200}
						alignSelf="flex-end"
					>
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
					/>
				</>
			)}
		</YStack>
	);
};

const styles = StyleSheet.create({
	dropdownTrigger: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 20,
		paddingHorizontal: 16,
		paddingVertical: 10,
		backgroundColor: '#fff',
		minWidth: 140,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.4)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: 'white',
		borderRadius: 16,
		width: '85%',
		maxHeight: '70%',
		paddingHorizontal: 16,
		paddingTop: 20,
		paddingBottom: 16,
		elevation: 10,
		shadowColor: '#000',
		shadowOpacity: 0.25,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 4 },
	},
	scrollView: {
		maxHeight: 400,
	},
	optionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 12,
		paddingHorizontal: 12,
		borderRadius: 12,
	},
	optionItemActive: {
		backgroundColor: '#007AFF',
	},
	closeButton: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#666',
		borderRadius: 12,
		paddingVertical: 12,
		marginTop: 16,
		gap: 8,
	},
});

export default DeviceScreen;
