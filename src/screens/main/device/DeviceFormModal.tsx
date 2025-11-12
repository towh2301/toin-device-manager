import { AppColors } from '@/src/common/app-color';
import {
	Brand,
	DeviceCreatePayload,
	DeviceResponse,
	DeviceStatus,
	DeviceType,
	useCreateDevice,
	useUpdateDevice,
} from '@/src/services/device';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	KeyboardAvoidingView,
	Modal,
	Platform,
	ScrollView,
	TextInput,
	TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, Card, Text, XStack, YStack } from 'tamagui';

interface DeviceFormModalProps {
	visible: boolean;
	onClose: () => void;
	mode: 'create' | 'edit';
	device?: DeviceResponse | null;
}

const DeviceFormModal: React.FC<DeviceFormModalProps> = ({
	visible,
	onClose,
	mode,
	device,
}) => {
	// Form state
	const [name, setName] = useState('');
	const [brand, setBrand] = useState<Brand>(Brand.DELL);
	const [type, setType] = useState<DeviceType>(DeviceType.LAPTOP);
	const [serialNumber, setSerialNumber] = useState('');
	const [status, setStatus] = useState<DeviceStatus>(DeviceStatus.AVAILABLE);
	const [purchasedDate, setPurchasedDate] = useState(new Date());

	// Picker states
	const [showBrandPicker, setShowBrandPicker] = useState(false);
	const [showTypePicker, setShowTypePicker] = useState(false);
	const [showStatusPicker, setShowStatusPicker] = useState(false);

	// Mutations
	const createMutation = useCreateDevice();
	const updateMutation = useUpdateDevice();

	// Reset form when modal opens
	useEffect(() => {
		if (visible) {
			if (mode === 'edit' && device) {
				setName(device.name);
				setBrand(device.brand as Brand);
				setType(device.type as DeviceType);
				setSerialNumber(device.serialNumber);
				setStatus(device.status);
				setPurchasedDate(new Date(device.purchasedDate));
			} else {
				// Reset for create mode
				setName('');
				setBrand(Brand.DELL);
				setType(DeviceType.LAPTOP);
				setSerialNumber('');
				setStatus(DeviceStatus.AVAILABLE);
				setPurchasedDate(new Date());
			}
		}
	}, [visible, mode, device]);

	const handleSubmit = async () => {
		// Validation
		if (!name.trim()) {
			Alert.alert('Lỗi', 'Vui lòng nhập tên thiết bị');
			return;
		}
		if (!serialNumber.trim()) {
			Alert.alert('Lỗi', 'Vui lòng nhập số serial');
			return;
		}

		try {
			const payload: DeviceCreatePayload = {
				name: name.trim(),
				brand,
				type,
				serialNumber: serialNumber.trim(),
				status,
				purchasedDate: purchasedDate.toISOString().split('T')[0],
			};

			if (mode === 'create') {
				await createMutation.mutateAsync(payload);
				Toast.show({
					type: 'success',
					text1: 'Thành công',
					text2: 'Đã thêm thiết bị mới',
				});
			} else if (device) {
				await updateMutation.mutateAsync({
					id: device.id,
					payload: payload,
				});
				Toast.show({
					type: 'success',
					text1: 'Thành công',
					text2: 'Đã cập nhật thiết bị',
				});
			}
			onClose();
		} catch (error: any) {
			Toast.show({
				type: 'error',
				text1: 'Lỗi',
				text2: error?.message || 'Có lỗi xảy ra',
			});
		}
	};

	const brandLabels: Record<Brand, string> = {
		[Brand.DELL]: 'Dell',
		[Brand.HP]: 'HP',
		[Brand.LENOVO]: 'Lenovo',
		[Brand.APPLE]: 'Apple',
		[Brand.ASUS]: 'Asus',
		[Brand.ACER]: 'Acer',
		[Brand.SAMSUNG]: 'Samsung',
		[Brand.LG]: 'LG',
		[Brand.SONY]: 'Sony',
		[Brand.MICROSOFT]: 'Microsoft',
		[Brand.XIAOMI]: 'Xiaomi',
		[Brand.CANON]: 'Canon',
		[Brand.NIKON]: 'Nikon',
		[Brand.FUJIFILM]: 'Fujifilm',
		[Brand.CISCO]: 'Cisco',
		[Brand.JUNIPER]: 'Juniper',
		[Brand.FORTINET]: 'Fortinet',
		[Brand.TP_LINK]: 'TP-Link',
		[Brand.NETGEAR]: 'Netgear',
		[Brand.SIEMENS]: 'Siemens',
		[Brand.OTHER]: 'Khác',
	};

	const typeLabels: Record<DeviceType, string> = {
		[DeviceType.ALL]: 'Tất cả',
		[DeviceType.LAPTOP]: 'Laptop',
		[DeviceType.DESKTOP]: 'Desktop',
		[DeviceType.SMARTPHONE]: 'Smartphone',
		[DeviceType.TABLET]: 'Tablet',
		[DeviceType.MONITOR]: 'Monitor',
		[DeviceType.PRINTER]: 'Máy in',
		[DeviceType.CAMERA]: 'Camera',
		[DeviceType.ROUTER]: 'Router',
		[DeviceType.SWITCH]: 'Switch',
		[DeviceType.OTHER]: 'Khác',
	};

	const statusLabels: Record<DeviceStatus, string> = {
		[DeviceStatus.AVAILABLE]: 'Sẵn sàng',
		[DeviceStatus.IN_USE]: 'Đang dùng',
		[DeviceStatus.MAINTENANCE]: 'Bảo trì',
		[DeviceStatus.RETIREMENT]: 'Ngưng dùng',
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent={true}
			onRequestClose={onClose}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={{ flex: 1 }}
			>
				<YStack
					flex={1}
					backgroundColor="rgba(0,0,0,0.5)"
					justifyContent="flex-end"
				>
					<YStack
						backgroundColor={AppColors.background}
						borderTopLeftRadius="$6"
						borderTopRightRadius="$6"
						maxHeight="90%"
					>
						{/* Header */}
						<XStack
							padding="$4"
							justifyContent="space-between"
							alignItems="center"
							borderBottomWidth={1}
							borderBottomColor={AppColors.border}
						>
							<Text
								fontSize={18}
								fontWeight="700"
								color={AppColors.text}
							>
								{mode === 'create'
									? 'Thêm thiết bị'
									: 'Sửa thiết bị'}
							</Text>
							<TouchableOpacity onPress={onClose}>
								<Ionicons
									name="close-circle"
									size={28}
									color={AppColors.textMuted}
								/>
							</TouchableOpacity>
						</XStack>

						{/* Form */}
						<ScrollView
							showsVerticalScrollIndicator={false}
							contentContainerStyle={{ padding: 16 }}
						>
							<YStack gap="$3">
								{/* Name */}
								<YStack gap="$2">
									<Text
										fontSize={14}
										fontWeight="600"
										color={AppColors.text}
									>
										Tên thiết bị{' '}
										<Text color={AppColors.danger}>*</Text>
									</Text>
									<TextInput
										value={name}
										onChangeText={setName}
										placeholder="VD: Laptop Dell XPS 15"
										placeholderTextColor={
											AppColors.textMuted
										}
										style={{
											backgroundColor: AppColors.surface,
											borderWidth: 1,
											borderColor: AppColors.border,
											borderRadius: 8,
											padding: 12,
											fontSize: 15,
											color: AppColors.text,
										}}
									/>
								</YStack>

								{/* Serial Number */}
								<YStack gap="$2">
									<Text
										fontSize={14}
										fontWeight="600"
										color={AppColors.text}
									>
										Số Serial{' '}
										<Text color={AppColors.danger}>*</Text>
									</Text>
									<TextInput
										value={serialNumber}
										onChangeText={setSerialNumber}
										placeholder="VD: SN123456789"
										placeholderTextColor={
											AppColors.textMuted
										}
										style={{
											backgroundColor: AppColors.surface,
											borderWidth: 1,
											borderColor: AppColors.border,
											borderRadius: 8,
											padding: 12,
											fontSize: 15,
											color: AppColors.text,
										}}
									/>
								</YStack>

								{/* Brand */}
								<YStack gap="$2">
									<Text
										fontSize={14}
										fontWeight="600"
										color={AppColors.text}
									>
										Thương hiệu
									</Text>
									<TouchableOpacity
										onPress={() => setShowBrandPicker(true)}
									>
										<Card
											padding="$3"
											backgroundColor={AppColors.surface}
											borderWidth={1}
											borderColor={AppColors.border}
										>
											<XStack
												alignItems="center"
												justifyContent="space-between"
											>
												<Text
													fontSize={15}
													color={AppColors.text}
												>
													{brandLabels[brand]}
												</Text>
												<Ionicons
													name="chevron-down"
													size={20}
													color={AppColors.textMuted}
												/>
											</XStack>
										</Card>
									</TouchableOpacity>
								</YStack>

								{/* Type */}
								<YStack gap="$2">
									<Text
										fontSize={14}
										fontWeight="600"
										color={AppColors.text}
									>
										Loại thiết bị
									</Text>
									<TouchableOpacity
										onPress={() => setShowTypePicker(true)}
									>
										<Card
											padding="$3"
											backgroundColor={AppColors.surface}
											borderWidth={1}
											borderColor={AppColors.border}
										>
											<XStack
												alignItems="center"
												justifyContent="space-between"
											>
												<Text
													fontSize={15}
													color={AppColors.text}
												>
													{typeLabels[type]}
												</Text>
												<Ionicons
													name="chevron-down"
													size={20}
													color={AppColors.textMuted}
												/>
											</XStack>
										</Card>
									</TouchableOpacity>
								</YStack>

								{/* Status */}
								<YStack gap="$2">
									<Text
										fontSize={14}
										fontWeight="600"
										color={AppColors.text}
									>
										Trạng thái
									</Text>
									<TouchableOpacity
										onPress={() =>
											setShowStatusPicker(true)
										}
									>
										<Card
											padding="$3"
											backgroundColor={AppColors.surface}
											borderWidth={1}
											borderColor={AppColors.border}
										>
											<XStack
												alignItems="center"
												justifyContent="space-between"
											>
												<Text
													fontSize={15}
													color={AppColors.text}
												>
													{statusLabels[status]}
												</Text>
												<Ionicons
													name="chevron-down"
													size={20}
													color={AppColors.textMuted}
												/>
											</XStack>
										</Card>
									</TouchableOpacity>
								</YStack>

								{/* Purchased Date */}
								<YStack gap="$2">
									<Text
										fontSize={14}
										fontWeight="600"
										color={AppColors.text}
									>
										Ngày mua
									</Text>
									<Card
										padding="$3"
										backgroundColor={AppColors.surface}
										borderWidth={1}
										borderColor={AppColors.border}
									>
										<XStack
											alignItems="center"
											justifyContent="space-between"
										>
											<Text
												fontSize={15}
												color={AppColors.text}
											>
												{purchasedDate.toLocaleDateString(
													'vi-VN',
													{
														day: '2-digit',
														month: '2-digit',
														year: 'numeric',
													}
												)}
											</Text>
											<Ionicons
												name="calendar"
												size={20}
												color={AppColors.primary}
											/>
										</XStack>
									</Card>
									<XStack gap="$2" justifyContent="flex-end">
										<Button
											size="$2"
											backgroundColor={AppColors.surface}
											borderWidth={1}
											borderColor={AppColors.border}
											onPress={() =>
												setPurchasedDate(
													new Date(
														purchasedDate.getTime() -
															24 * 60 * 60 * 1000
													)
												)
											}
										>
											◀ Ngày trước
										</Button>
										<Button
											size="$2"
											backgroundColor={AppColors.surface}
											borderWidth={1}
											borderColor={AppColors.border}
											onPress={() =>
												setPurchasedDate(
													new Date(
														purchasedDate.getTime() +
															24 * 60 * 60 * 1000
													)
												)
											}
										>
											Ngày sau ▶
										</Button>
									</XStack>
								</YStack>
							</YStack>
						</ScrollView>

						{/* Footer */}
						<XStack
							padding="$4"
							gap="$3"
							borderTopWidth={1}
							borderTopColor={AppColors.border}
						>
							<Button
								flex={1}
								size="$4"
								backgroundColor={AppColors.surface}
								borderWidth={1}
								borderColor={AppColors.border}
								color={AppColors.text}
								onPress={onClose}
							>
								Hủy
							</Button>
							<Button
								flex={1}
								size="$4"
								backgroundColor={AppColors.primary}
								color="white"
								onPress={handleSubmit}
								disabled={
									createMutation.isPending ||
									updateMutation.isPending
								}
							>
								{createMutation.isPending ||
								updateMutation.isPending
									? 'Đang xử lý...'
									: mode === 'create'
										? 'Thêm'
										: 'Cập nhật'}
							</Button>
						</XStack>
					</YStack>

					{/* Brand Picker Modal */}
					{showBrandPicker && (
						<Modal transparent animationType="fade">
							<TouchableOpacity
								style={{
									flex: 1,
									backgroundColor: 'rgba(0,0,0,0.5)',
									justifyContent: 'center',
									alignItems: 'center',
								}}
								activeOpacity={1}
								onPress={() => setShowBrandPicker(false)}
							>
								<YStack
									backgroundColor={AppColors.surface}
									borderRadius="$4"
									maxHeight="70%"
									width="80%"
									overflow="hidden"
								>
									<XStack
										padding="$3"
										borderBottomWidth={1}
										borderBottomColor={AppColors.border}
										justifyContent="space-between"
										alignItems="center"
									>
										<Text fontSize={16} fontWeight="700">
											Chọn thương hiệu
										</Text>
										<TouchableOpacity
											onPress={() =>
												setShowBrandPicker(false)
											}
										>
											<Ionicons
												name="close"
												size={24}
												color={AppColors.text}
											/>
										</TouchableOpacity>
									</XStack>
									<ScrollView>
										<YStack padding="$2">
											{Object.values(Brand).map((b) => (
												<TouchableOpacity
													key={b}
													onPress={() => {
														setBrand(b);
														setShowBrandPicker(
															false
														);
													}}
												>
													<XStack
														padding="$3"
														backgroundColor={
															brand === b
																? AppColors.primary +
																	'20'
																: 'transparent'
														}
														borderRadius="$2"
														alignItems="center"
														gap="$2"
													>
														{brand === b && (
															<Ionicons
																name="checkmark-circle"
																size={20}
																color={
																	AppColors.primary
																}
															/>
														)}
														<Text
															fontSize={15}
															fontWeight={
																brand === b
																	? '600'
																	: '400'
															}
															color={
																brand === b
																	? AppColors.primary
																	: AppColors.text
															}
														>
															{brandLabels[b]}
														</Text>
													</XStack>
												</TouchableOpacity>
											))}
										</YStack>
									</ScrollView>
								</YStack>
							</TouchableOpacity>
						</Modal>
					)}

					{/* Type Picker Modal */}
					{showTypePicker && (
						<Modal transparent animationType="fade">
							<TouchableOpacity
								style={{
									flex: 1,
									backgroundColor: 'rgba(0,0,0,0.5)',
									justifyContent: 'center',
									alignItems: 'center',
								}}
								activeOpacity={1}
								onPress={() => setShowTypePicker(false)}
							>
								<YStack
									backgroundColor={AppColors.surface}
									borderRadius="$4"
									maxHeight="70%"
									width="80%"
									overflow="hidden"
								>
									<XStack
										padding="$3"
										borderBottomWidth={1}
										borderBottomColor={AppColors.border}
										justifyContent="space-between"
										alignItems="center"
									>
										<Text fontSize={16} fontWeight="700">
											Chọn loại thiết bị
										</Text>
										<TouchableOpacity
											onPress={() =>
												setShowTypePicker(false)
											}
										>
											<Ionicons
												name="close"
												size={24}
												color={AppColors.text}
											/>
										</TouchableOpacity>
									</XStack>
									<ScrollView>
										<YStack padding="$2">
											{Object.values(DeviceType).map(
												(t) => (
													<TouchableOpacity
														key={t}
														onPress={() => {
															setType(t);
															setShowTypePicker(
																false
															);
														}}
													>
														<XStack
															padding="$3"
															backgroundColor={
																type === t
																	? AppColors.primary +
																		'20'
																	: 'transparent'
															}
															borderRadius="$2"
															alignItems="center"
															gap="$2"
														>
															{type === t && (
																<Ionicons
																	name="checkmark-circle"
																	size={20}
																	color={
																		AppColors.primary
																	}
																/>
															)}
															<Text
																fontSize={15}
																fontWeight={
																	type === t
																		? '600'
																		: '400'
																}
																color={
																	type === t
																		? AppColors.primary
																		: AppColors.text
																}
															>
																{typeLabels[t]}
															</Text>
														</XStack>
													</TouchableOpacity>
												)
											)}
										</YStack>
									</ScrollView>
								</YStack>
							</TouchableOpacity>
						</Modal>
					)}

					{/* Status Picker Modal */}
					{showStatusPicker && (
						<Modal transparent animationType="fade">
							<TouchableOpacity
								style={{
									flex: 1,
									backgroundColor: 'rgba(0,0,0,0.5)',
									justifyContent: 'center',
									alignItems: 'center',
								}}
								activeOpacity={1}
								onPress={() => setShowStatusPicker(false)}
							>
								<YStack
									backgroundColor={AppColors.surface}
									borderRadius="$4"
									maxHeight="70%"
									width="80%"
									overflow="hidden"
								>
									<XStack
										padding="$3"
										borderBottomWidth={1}
										borderBottomColor={AppColors.border}
										justifyContent="space-between"
										alignItems="center"
									>
										<Text fontSize={16} fontWeight="700">
											Chọn trạng thái
										</Text>
										<TouchableOpacity
											onPress={() =>
												setShowStatusPicker(false)
											}
										>
											<Ionicons
												name="close"
												size={24}
												color={AppColors.text}
											/>
										</TouchableOpacity>
									</XStack>
									<ScrollView>
										<YStack padding="$2">
											{Object.values(DeviceStatus).map(
												(s) => (
													<TouchableOpacity
														key={s}
														onPress={() => {
															setStatus(s);
															setShowStatusPicker(
																false
															);
														}}
													>
														<XStack
															padding="$3"
															backgroundColor={
																status === s
																	? AppColors.primary +
																		'20'
																	: 'transparent'
															}
															borderRadius="$2"
															alignItems="center"
															gap="$2"
														>
															{status === s && (
																<Ionicons
																	name="checkmark-circle"
																	size={20}
																	color={
																		AppColors.primary
																	}
																/>
															)}
															<Text
																fontSize={15}
																fontWeight={
																	status === s
																		? '600'
																		: '400'
																}
																color={
																	status === s
																		? AppColors.primary
																		: AppColors.text
																}
															>
																{
																	statusLabels[
																		s
																	]
																}
															</Text>
														</XStack>
													</TouchableOpacity>
												)
											)}
										</YStack>
									</ScrollView>
								</YStack>
							</TouchableOpacity>
						</Modal>
					)}
				</YStack>
			</KeyboardAvoidingView>
		</Modal>
	);
};

export default DeviceFormModal;
