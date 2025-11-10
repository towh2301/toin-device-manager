// src/screens/main/device/ScanQRDevice.tsx
import { AppColors } from '@/src/common/app-color';
import { NavigationRoutes } from '@/src/navigation/types';
import { useGetAllDevices } from '@/src/services/device';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { DeviceResponse } from '@services/device/types';
import {
	ArrowLeft,
	CheckCircle2,
	Copy,
	QrCode,
	ScanLine,
} from '@tamagui/lucide-icons';
import type { BarcodeType } from 'expo-camera';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Clipboard from 'expo-clipboard';
import React, { useCallback, useEffect, useState } from 'react';
import {
	Alert,
	Linking,
	StyleSheet,
	TouchableOpacity,
	View,
} from 'react-native';
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withRepeat,
	withSequence,
	withTiming,
} from 'react-native-reanimated';
import { Button, Text, XStack, YStack } from 'tamagui';

export default function QrScanScreen() {
	const [permission, requestPermission] = useCameraPermissions();
	const [scanned, setScanned] = useState(false);
	const [scannedData, setScannedData] = useState('');
	const navigation = useNavigation<any>();
	const { deviceData } = useGetAllDevices();

	// Animation for scanning line
	const scanLineY = useSharedValue(0);

	useEffect(() => {
		scanLineY.value = withRepeat(
			withSequence(
				withTiming(220, { duration: 2000 }),
				withTiming(0, { duration: 2000 })
			),
			-1,
			false
		);
	}, []);

	const scanLineStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: scanLineY.value }],
	}));

	const barcodeScannerSettings = {
		barcodeTypes: ['qr'] as BarcodeType[],
	};

	useEffect(() => {
		if (!permission?.granted && permission?.canAskAgain) {
			requestPermission();
		}
	}, [permission, requestPermission]);

	const safeDeviceData = deviceData ?? [];

	const handleBarCodeScanned = useCallback(
		({ data }: { data: string }) => {
			if (scanned) return;

			const qrText = data.trim();
			if (!qrText) return;

			setScanned(true);
			setScannedData(qrText);

			const lower = qrText.toLowerCase();
			const found = safeDeviceData.find(
				(d: DeviceResponse) =>
					d.serialNumber?.toLowerCase() === lower ||
					d.name?.toLowerCase() === lower
			);

			if (found) {
				setTimeout(() => {
					navigation.navigate(NavigationRoutes.DEVICE_DETAIL, {
						serialNumber: found.serialNumber,
					});
					setScanned(false);
					setScannedData('');
				}, 800);
			} else {
				setTimeout(() => {
					Alert.alert(
						'❌ Không tìm thấy',
						`Không có thiết bị nào khớp với:\n"${qrText}"`,
						[
							{
								text: 'Quét lại',
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
		[scanned, safeDeviceData, navigation]
	);

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
				onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
				barcodeScannerSettings={barcodeScannerSettings}
			/>

			{/* TOP BAR với Back Button */}
			<YStack
				position="absolute"
				top={0}
				left={0}
				right={0}
				paddingTop={50}
				paddingHorizontal={20}
				paddingBottom={20}
				backgroundColor="rgba(0,0,0,0.4)"
				zIndex={10}
			>
				<XStack alignItems="center" justifyContent="space-between">
					<Button
						size="$3"
						circular
						chromeless
						icon={ArrowLeft}
						backgroundColor="rgba(255,255,255,0.95)"
						pressStyle={{
							backgroundColor: 'rgba(255,255,255,0.8)',
							scale: 0.95,
						}}
						onPress={() => navigation.goBack()}
					/>
					<YStack alignItems="center">
						<Text color="white" fontSize={20} fontWeight="800">
							Quét mã QR
						</Text>
						<Text color="rgba(255,255,255,0.7)" fontSize={13}>
							Đưa mã vào khung quét
						</Text>
					</YStack>
					<YStack width={40} />
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

					{/* Animated scanning line */}
					{!scanned && (
						<Animated.View style={[styles.scanLine, scanLineStyle]}>
							<ScanLine
								size={280}
								color={AppColors.primary}
								strokeWidth={3}
							/>
						</Animated.View>
					)}
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
						borderRadius="$10"
					>
						<CheckCircle2 size={28} color="white" />
						<YStack flex={1}>
							<Text color="white" fontSize={13} fontWeight="600">
								Đã quét thành công
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
								Alert.alert(
									'✓ Đã sao chép',
									'Serial đã vào clipboard'
								);
							}}
							style={{
								backgroundColor: 'rgba(255,255,255,0.2)',
								padding: 10,
								borderRadius: 8,
							}}
						>
							<Copy size={20} color="white" />
						</TouchableOpacity>
					</XStack>
				</View>
			)}

			{/* BOTTOM INFO */}
			<View style={styles.bottomInfo}>
				<XStack
					alignItems="center"
					justifyContent="center"
					gap="$2"
					backgroundColor="rgba(0,0,0,0.6)"
					paddingVertical="$3"
					paddingHorizontal="$5"
					borderRadius="$10"
				>
					<QrCode size={20} color="white" />
					<Text color="white" fontSize={14} fontWeight="600">
						Tổng số thiết bị: {deviceData?.length || 0}
					</Text>
				</XStack>
			</View>
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
		borderColor: AppColors.primary,
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
	scanLine: {
		width: 280,
		position: 'absolute',
		top: 0,
		left: 0,
	},
	resultBox: {
		position: 'absolute',
		bottom: 140,
		left: 20,
		right: 20,
		elevation: 20,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.4,
		shadowRadius: 20,
	},
	bottomInfo: {
		position: 'absolute',
		bottom: 40,
		left: 0,
		right: 0,
		alignItems: 'center',
	},
});
