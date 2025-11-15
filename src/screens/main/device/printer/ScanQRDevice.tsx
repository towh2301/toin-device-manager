// src/screens/main/device/ScanQRDevice.tsx
import { AppColors } from '@/src/common/app-color';
import { NavigationRoutes } from '@/src/navigation/types';
import { useGetAllDevices } from '@/src/services/device';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { DeviceResponse } from '@services/device/types';
import {
	ArrowLeft,
	CheckCircle2,
	Copy,
	Flashlight,
	FlashlightOff,
	Image as ImageIcon,
	QrCode,
} from '@tamagui/lucide-icons';
import type { BarcodeType } from 'expo-camera';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
	Alert,
	Linking,
	Modal,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { Button, Text, XStack, YStack } from 'tamagui';

export default function QrScanScreen() {
	const [permission, requestPermission] = useCameraPermissions();
	const [scanned, setScanned] = useState(false);
	const [scannedData, setScannedData] = useState('');
	const [torchEnabled, setTorchEnabled] = useState(false);
	const [showManualInput, setShowManualInput] = useState(false);
	const [manualInput, setManualInput] = useState('');
	const navigation = useNavigation<any>();
	const { deviceData } = useGetAllDevices();

	const barcodeScannerSettings = {
		barcodeTypes: ['qr'] as BarcodeType[],
	};

	useEffect(() => {
		if (!permission?.granted && permission?.canAskAgain) {
			requestPermission();
		}
	}, [permission, requestPermission]);

	const safeDeviceData = deviceData ?? [];

	const findDevice = useCallback(
		(qrText: string) => {
			const lower = qrText.toLowerCase();
			return safeDeviceData.find(
				(d: DeviceResponse) =>
					d.serialNumber?.toLowerCase() === lower ||
					d.name?.toLowerCase() === lower
			);
		},
		[safeDeviceData]
	);

	const handleBarCodeScanned = useCallback(
		({ data }: { data: string }) => {
			if (scanned) return;

			const qrText = data.trim();
			if (!qrText) return;

			setScanned(true);
			setScannedData(qrText);

			// Haptic feedback
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

			const found = findDevice(qrText);

			if (found) {
				setTimeout(() => {
					navigation.navigate(NavigationRoutes.DEVICE_DETAIL, {
						serialNumber: found.serialNumber,
					});
					setScanned(false);
					setScannedData('');
				}, 800);
			} else {
				Haptics.notificationAsync(
					Haptics.NotificationFeedbackType.Error
				);
				setTimeout(() => {
					Alert.alert(
						'❌ Không tìm thấy',
						`Không có thiết bị nào khớp với:\n"${qrText}"`,
						[
							{
								text: 'Quét lại',
								style: 'cancel',
								onPress: () => {
									setScanned(false);
									setScannedData('');
								},
							},
							{
								text: 'Về danh sách',
								onPress: () => navigation.goBack(),
							},
						]
					);
				}, 500);
			}
		},
		[scanned, findDevice, navigation]
	);

	const handleManualSubmit = useCallback(() => {
		const qrText = manualInput.trim();
		if (!qrText) {
			Alert.alert('⚠️ Lỗi', 'Vui lòng nhập serial number');
			return;
		}

		const found = findDevice(qrText);

		if (found) {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			setShowManualInput(false);
			setManualInput('');
			navigation.navigate(NavigationRoutes.DEVICE_DETAIL, {
				serialNumber: found.serialNumber,
			});
		} else {
			Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
			Alert.alert(
				'❌ Không tìm thấy',
				`Không có thiết bị nào khớp với:\n"${qrText}"`
			);
		}
	}, [manualInput, findDevice, navigation]);

	const handlePickImage = useCallback(async () => {
		try {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

			// Request permission
			const { status } =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (status !== 'granted') {
				Alert.alert(
					'⚠️ Cần quyền truy cập',
					'Vui lòng cấp quyền truy cập thư viện ảnh để chọn ảnh QR code'
				);
				return;
			}

			// Pick image
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ['images'],
				allowsEditing: false,
				quality: 1,
			});

			if (result.canceled) return;

			const imageUri = result.assets[0].uri;

			// Show alert to manually enter data from QR code
			Alert.prompt(
				'📷 QR code từ ảnh',
				'Vui lòng nhập nội dung QR code từ ảnh đã chọn:',
				[
					{
						text: 'Hủy',
						style: 'cancel',
					},
					{
						text: 'Tìm kiếm',
						onPress: (qrText?: string) => {
							if (qrText && qrText.trim()) {
								handleBarCodeScanned({ data: qrText.trim() });
							}
						},
					},
				],
				'plain-text'
			);
		} catch (error) {
			console.error('Error picking image:', error);
			Alert.alert(
				'❌ Lỗi',
				'Không thể mở thư viện ảnh. Vui lòng thử lại.'
			);
		}
	}, [handleBarCodeScanned]);

	// Permission denied
	if (!permission) {
		return (
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				backgroundColor={AppColors.background}
			>
				<Text color={AppColors.text} fontSize={16}>
					Đang xin quyền camera...
				</Text>
			</YStack>
		);
	}

	if (!permission.granted) {
		return (
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				backgroundColor={AppColors.background}
				padding="$6"
				gap="$4"
			>
				<YStack
					width={120}
					height={120}
					borderRadius={60}
					backgroundColor={AppColors.dangerLight + '30'}
					alignItems="center"
					justifyContent="center"
					marginBottom="$4"
				>
					<MaterialCommunityIcons
						name="camera-off"
						size={60}
						color={AppColors.danger}
					/>
				</YStack>
				<Text
					color={AppColors.text}
					fontSize={24}
					fontWeight="800"
					textAlign="center"
				>
					Cần quyền Camera
				</Text>
				<Text
					color={AppColors.textSecondary}
					textAlign="center"
					fontSize={15}
				>
					Vui lòng cấp quyền camera để quét mã QR thiết bị
				</Text>
				<Button
					size="$4"
					backgroundColor={AppColors.primary}
					color="white"
					fontWeight="700"
					borderRadius="$10"
					marginTop="$4"
					paddingHorizontal="$6"
					onPress={() => Linking.openSettings()}
				>
					Mở Cài đặt
				</Button>
			</YStack>
		);
	}

	return (
		<YStack flex={1} backgroundColor="#000">
			{/* CAMERA */}
			<CameraView
				style={StyleSheet.absoluteFillObject}
				facing="back"
				enableTorch={torchEnabled}
				onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
				barcodeScannerSettings={barcodeScannerSettings}
			/>

			{/* TOP BAR */}
			<YStack
				position="absolute"
				top={0}
				left={0}
				right={0}
				paddingTop={50}
				paddingHorizontal={20}
				paddingBottom={20}
				style={{
					backgroundColor: 'rgba(0,0,0,0.5)',
					backdropFilter: 'blur(10px)',
				}}
				zIndex={10}
			>
				<XStack alignItems="center" justifyContent="space-between">
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						style={{
							width: 44,
							height: 44,
							borderRadius: 22,
							backgroundColor: 'rgba(255,255,255,0.95)',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<ArrowLeft size={24} color={AppColors.text} />
					</TouchableOpacity>

					<YStack alignItems="center" flex={1}>
						<Text color="white" fontSize={20} fontWeight="800">
							Quét mã QR
						</Text>
						<Text color="rgba(255,255,255,0.8)" fontSize={13}>
							Đưa mã vào khung quét
						</Text>
					</YStack>

					<TouchableOpacity
						onPress={() => {
							setTorchEnabled(!torchEnabled);
							Haptics.impactAsync(
								Haptics.ImpactFeedbackStyle.Light
							);
						}}
						style={{
							width: 44,
							height: 44,
							borderRadius: 22,
							backgroundColor: torchEnabled
								? AppColors.primary
								: 'rgba(255,255,255,0.95)',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						{torchEnabled ? (
							<Flashlight size={22} color="white" />
						) : (
							<FlashlightOff
								size={22}
								color={AppColors.textSecondary}
							/>
						)}
					</TouchableOpacity>
				</XStack>
			</YStack>

			{/* SCANNING FRAME */}
			<View style={styles.overlay}>
				<View style={styles.frame}>
					{/* Corner borders */}
					<View style={[styles.corner, styles.topLeft]} />
					<View style={[styles.corner, styles.topRight]} />
					<View style={[styles.corner, styles.bottomLeft]} />
					<View style={[styles.corner, styles.bottomRight]} />
				</View>
			</View>

			{/* RESULT BOX */}
			{scannedData && (
				<View style={styles.resultBox}>
					<XStack
						alignItems="center"
						gap="$3"
						backgroundColor={AppColors.success}
						padding="$4"
						borderRadius="$4"
						style={{
							shadowColor: AppColors.success,
							shadowOffset: { width: 0, height: 10 },
							shadowOpacity: 0.5,
							shadowRadius: 20,
							elevation: 20,
						}}
					>
						<CheckCircle2 size={32} color="white" />
						<YStack flex={1}>
							<Text color="white" fontSize={13} fontWeight="600">
								✓ Đã quét thành công
							</Text>
							<Text
								color="white"
								fontSize={16}
								fontWeight="800"
								numberOfLines={1}
							>
								{scannedData}
							</Text>
						</YStack>
						<TouchableOpacity
							onPress={async () => {
								await Clipboard.setStringAsync(scannedData);
								Haptics.notificationAsync(
									Haptics.NotificationFeedbackType.Success
								);
								Alert.alert(
									'✓ Đã sao chép',
									'Serial đã vào clipboard'
								);
							}}
							style={{
								backgroundColor: 'rgba(255,255,255,0.25)',
								padding: 10,
								borderRadius: 10,
							}}
						>
							<Copy size={20} color="white" />
						</TouchableOpacity>
					</XStack>
				</View>
			)}

			{/* BOTTOM ACTIONS */}
			<View style={styles.bottomActions}>
				<YStack alignItems="center" gap="$3">
					{/* Device count */}
					<XStack
						alignItems="center"
						justifyContent="center"
						gap="$2"
						backgroundColor="rgba(0,0,0,0.7)"
						paddingVertical="$3"
						paddingHorizontal="$5"
						borderRadius="$10"
						style={{
							backdropFilter: 'blur(10px)',
						}}
					>
						<QrCode size={20} color="white" />
						<Text color="white" fontSize={14} fontWeight="600">
							{deviceData?.length || 0} thiết bị
						</Text>
					</XStack>

					{/* Manual input button */}
					<XStack gap="$2">
						<TouchableOpacity
							onPress={() => {
								setShowManualInput(true);
								Haptics.impactAsync(
									Haptics.ImpactFeedbackStyle.Medium
								);
							}}
							style={{
								backgroundColor: AppColors.primary,
								paddingVertical: 14,
								paddingHorizontal: 28,
								borderRadius: 25,
								flexDirection: 'row',
								alignItems: 'center',
								gap: 8,
								shadowColor: AppColors.primary,
								shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 0.4,
								shadowRadius: 10,
								elevation: 8,
							}}
						>
							<Ionicons name="text" size={20} color="white" />
							<Text color="white" fontSize={15} fontWeight="700">
								Nhập thủ công
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={handlePickImage}
							style={{
								backgroundColor: AppColors.secondary,
								paddingVertical: 14,
								paddingHorizontal: 24,
								borderRadius: 25,
								flexDirection: 'row',
								alignItems: 'center',
								gap: 8,
								shadowColor: AppColors.secondary,
								shadowOffset: { width: 0, height: 4 },
								shadowOpacity: 0.4,
								shadowRadius: 10,
								elevation: 8,
							}}
						>
							<ImageIcon size={20} color="white" />
							<Text color="white" fontSize={15} fontWeight="700">
								Chọn ảnh
							</Text>
						</TouchableOpacity>
					</XStack>
				</YStack>
			</View>

			{/* MANUAL INPUT MODAL */}
			<Modal
				visible={showManualInput}
				transparent
				animationType="slide"
				onRequestClose={() => setShowManualInput(false)}
			>
				<View style={styles.modalOverlay}>
					<TouchableOpacity
						style={StyleSheet.absoluteFillObject}
						activeOpacity={1}
						onPress={() => setShowManualInput(false)}
					/>
					<Animated.View
						style={{
							backgroundColor: AppColors.surface,
							marginHorizontal: 20,
							borderRadius: 20,
							padding: 24,
							shadowColor: '#000',
							shadowOffset: { width: 0, height: 10 },
							shadowOpacity: 0.3,
							shadowRadius: 20,
							elevation: 20,
						}}
					>
						<XStack
							justifyContent="space-between"
							alignItems="center"
							marginBottom="$4"
						>
							<Text
								fontSize={20}
								fontWeight="800"
								color={AppColors.text}
							>
								Nhập Serial Number
							</Text>
							<TouchableOpacity
								onPress={() => setShowManualInput(false)}
							>
								<Ionicons
									name="close-circle"
									size={28}
									color={AppColors.textSecondary}
								/>
							</TouchableOpacity>
						</XStack>

						<YStack gap="$3">
							<Text fontSize={13} color={AppColors.textSecondary}>
								Nhập số serial hoặc tên thiết bị để tìm kiếm
							</Text>

							<View
								style={{
									backgroundColor: AppColors.background,
									borderRadius: 12,
									borderWidth: 2,
									borderColor: AppColors.border,
									paddingHorizontal: 16,
									paddingVertical: 4,
								}}
							>
								<TextInput
									value={manualInput}
									onChangeText={setManualInput}
									placeholder="Ví dụ: SN12345 hoặc Laptop Dell"
									placeholderTextColor={AppColors.textMuted}
									style={{
										fontSize: 16,
										color: AppColors.text,
										paddingVertical: 12,
									}}
									autoFocus
									autoCapitalize="none"
									autoCorrect={false}
								/>
							</View>

							<XStack gap="$2">
								<Button
									flex={1}
									size="$4"
									backgroundColor={AppColors.background}
									borderWidth={2}
									borderColor={AppColors.border}
									color={AppColors.text}
									fontWeight="700"
									onPress={() => {
										setShowManualInput(false);
										setManualInput('');
									}}
									height={30}
								>
									Hủy
								</Button>
								<Button
									flex={1}
									size="$4"
									backgroundColor={AppColors.primary}
									color="white"
									fontWeight="700"
									onPress={handleManualSubmit}
									disabled={!manualInput.trim()}
									opacity={manualInput.trim() ? 1 : 0.5}
									height={30}
								>
									Tìm kiếm
								</Button>
							</XStack>
						</YStack>
					</Animated.View>
				</View>
			</Modal>
		</YStack>
	);
}

const styles = StyleSheet.create({
	overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: 'center',
		alignItems: 'center',
	},
	frame: {
		width: 280,
		height: 280,
		position: 'relative',
		overflow: 'hidden',
	},
	corner: {
		position: 'absolute',
		width: 50,
		height: 50,
		borderColor: '#FFFFFF',
		borderWidth: 5,
	},
	topLeft: {
		top: 0,
		left: 0,
		borderRightWidth: 0,
		borderBottomWidth: 0,
		borderTopLeftRadius: 20,
	},
	topRight: {
		top: 0,
		right: 0,
		borderLeftWidth: 0,
		borderBottomWidth: 0,
		borderTopRightRadius: 20,
	},
	bottomLeft: {
		bottom: 0,
		left: 0,
		borderRightWidth: 0,
		borderTopWidth: 0,
		borderBottomLeftRadius: 20,
	},
	bottomRight: {
		bottom: 0,
		right: 0,
		borderLeftWidth: 0,
		borderTopWidth: 0,
		borderBottomRightRadius: 20,
	},
	resultBox: {
		position: 'absolute',
		bottom: 180,
		left: 20,
		right: 20,
	},
	bottomActions: {
		position: 'absolute',
		bottom: 40,
		left: 0,
		right: 0,
		alignItems: 'center',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0,0,0,0.7)',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
