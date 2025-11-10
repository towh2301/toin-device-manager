// src/screens/main/device/ScanQRDevice.tsx
import { NavigationRoutes } from '@/src/navigation/types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { DeviceResponse } from '@services/device/types';
import { useGetAllDevices } from '@services/device/useGetAllDevices';
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
import {
	GestureHandlerRootView,
	PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';
import { Text, XStack, YStack } from 'tamagui';

export default function QrScanScreen() {
	const [permission, requestPermission] = useCameraPermissions();
	const [scanned, setScanned] = useState(false);
	const [scannedData, setScannedData] = useState('');
	const navigation = useNavigation<any>();
	const { deviceData } = useGetAllDevices();

	// Thêm vào đầu component
	const translateY = useSharedValue(0);

	const gestureHandler = (event: PanGestureHandlerGestureEvent) => {
		const { translationY } = event.nativeEvent;
		if (translationY > 0) {
			translateY.value = translationY;
		}

		if (event.nativeEvent.state === 5) {
			// Bỏ tay
			if (translationY > 100) {
				translateY.value = withSpring(500, { damping: 20 }, () => {
					runOnJS(setScanned)(false);
					runOnJS(setScannedData)('');
				});
			} else {
				translateY.value = withSpring(0);
			}
		}
	};

	const animatedStyle = useAnimatedStyle(() => ({
		transform: [{ translateY: translateY.value }],
		opacity: 1 - translateY.value / 500,
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
				Alert.alert(
					'Thiết bị được tìm thấy!',
					`${found.name}\nThương hiệu: ${found.brand || 'Không rõ'} \nLoại: ${found.type || 'Không rõ'} \nSerial: ${found.serialNumber || 'Không rõ'} \nNgày mua: ${
						found.purchasedDate
							? new Date(found.purchasedDate).toLocaleDateString(
									'vi-VN',
									{
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
									}
								)
							: 'Không rõ'
					}`,
					[
						{
							text: 'Hủy',
							style: 'cancel',
							onPress: () => setScanned(false),
						},
						{
							text: 'Xem chi tiết',
							style: 'default',
							onPress: () => {
								setScanned(false);
								navigation.navigate(
									NavigationRoutes.DEVICE_DETAIL,
									{
										serialNumber: found.serialNumber,
									}
								);
							},
						},
					],
					{ cancelable: false }
				);
			} else {
				Alert.alert(
					'Không tìm thấy thiết bị',
					`Không có thiết bị nào khớp với:\n"${qrText}"\n\nBạn có thể thử tìm thủ công trong danh sách.`,
					[
						{ text: 'Quét lại', onPress: () => setScanned(false) },
						{
							text: 'Về danh sách',
							onPress: () => navigation.goBack(),
						},
					]
				);
			}
		},
		[scanned, safeDeviceData, navigation]
	);

	// NÚT BACK HOẠT ĐỘNG THẬT
	const handleGoBack = () => {
		navigation.goBack();
	};

	// Permission denied
	if (!permission) {
		return (
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				backgroundColor="#000"
			>
				<Text color="white" fontSize={18}>
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
				backgroundColor="#000"
				padding="$6"
				gap="$4"
				position="absolute"
				zIndex={1000}
			>
				<MaterialCommunityIcons
					name="camera-off"
					size={80}
					color="#ff4444"
				/>
				<Text
					color="white"
					fontSize={22}
					fontWeight="700"
					textAlign="center"
				>
					Cần quyền truy cập Camera
				</Text>
				<Text color="#ccc" textAlign="center" fontSize={16}>
					Vui lòng bật camera để quét mã QR thiết bị
				</Text>
				<TouchableOpacity
					style={styles.settingsBtn}
					onPress={() => Linking.openSettings()}
				>
					<Text color="white" fontWeight="700" fontSize={18}>
						Mở Cài đặt
					</Text>
				</TouchableOpacity>
			</YStack>
		);
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<YStack flex={1} backgroundColor="#000">
				{/* NÚT BACK SIÊU ĐẸP + HOẠT ĐỘNG */}
				<XStack
					position="absolute"
					top={50}
					left={16}
					zIndex={999}
					backgroundColor="rgba(0,0,0,0.6)"
					paddingHorizontal="$3"
					paddingVertical="$2"
					borderRadius={30}
					borderWidth={1}
					borderColor="rgba(255,255,255,0.2)"
				>
					<TouchableOpacity onPress={handleGoBack} hitSlop={20}>
						<Ionicons name="arrow-back" size={32} color="white" />
					</TouchableOpacity>
				</XStack>

				{/* CAMERA */}
				<CameraView
					style={StyleSheet.absoluteFillObject}
					facing="back"
					onBarcodeScanned={
						scanned ? undefined : handleBarCodeScanned
					}
					barcodeScannerSettings={barcodeScannerSettings}
				/>

				{/* OVERLAY */}
				<View style={styles.overlay}>
					<View style={styles.frame}>
						{[0, 1, 2, 3].map((i) => (
							<View
								key={i}
								style={[
									styles.corner,
									styles[
										`c${i}` as 'c0' | 'c1' | 'c2' | 'c3'
									],
								]}
							/>
						))}
					</View>

					<Text style={styles.guide}>Đưa mã QR vào khung</Text>

					{/* NÚT QUÉT LẠI
				{scanned && (
					<TouchableOpacity
						style={styles.rescanBtn}
						onPress={() => {
							setScanned(false);
							setScannedData('');
						}}
					>
						<Ionicons
							name="qr-code-outline"
							size={32}
							color="white"
						/>
						<Text style={styles.rescanText}>Quét lại</Text>
					</TouchableOpacity>
				)} */}
				</View>

				{/* KẾT QUẢ HIỂN THỊ DƯỚI ĐÁY */}
				{scannedData && (
					<Animated.View style={[styles.resultBox, animatedStyle]}>
						{/* ICON CHECK */}
						<Ionicons
							name="checkmark-circle"
							size={28}
							color="#4CAF50"
						/>

						{/* SERIAL NUMBER */}
						<Text style={styles.resultText} numberOfLines={2}>
							{scannedData}
						</Text>

						{/* NÚT COPY */}
						<TouchableOpacity
							onPress={async () => {
								Clipboard.setString(scannedData);
								Alert.alert(
									'Đã sao chép!',
									'Serial đã vào clipboard'
								);
							}}
							hitSlop={10}
						>
							<Ionicons
								name="copy-outline"
								size={26}
								color="#007AFF"
							/>
						</TouchableOpacity>

						{/* VUỐT XUỐNG ĐỂ ĐÓNG */}
						<View style={styles.swipeHandle}>
							<View style={styles.swipeBar} />
						</View>
					</Animated.View>
				)}
			</YStack>
		</GestureHandlerRootView>
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
	},
	corner: {
		position: 'absolute',
		width: 70,
		height: 70,
		borderColor: '#00E676',
		borderWidth: 9,
	},
	c0: { top: -4, left: -4, borderRightWidth: 0, borderBottomWidth: 0 },
	c1: { top: -4, right: -4, borderLeftWidth: 0, borderBottomWidth: 0 },
	c2: { bottom: -4, left: -4, borderRightWidth: 0, borderTopWidth: 0 },
	c3: { bottom: -4, right: -4, borderLeftWidth: 0, borderTopWidth: 0 },
	guide: {
		marginTop: 60,
		color: 'white',
		fontSize: 22,
		fontWeight: '800',
		textShadowColor: 'rgba(0,0,0,0.9)',
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 6,
	},
	rescanBtn: {
		marginTop: 70,
		backgroundColor: '#007AFF',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 36,
		paddingVertical: 20,
		borderRadius: 40,
		gap: 16,
		elevation: 20,
		shadowColor: '#007AFF',
		shadowOpacity: 0.5,
		shadowRadius: 10,
	},
	rescanText: {
		color: 'white',
		fontSize: 20,
		fontWeight: '700',
	},
	resultText: {
		fontSize: 18,
		fontWeight: '600',
		color: '#111',
		flex: 1,
	},
	settingsBtn: {
		backgroundColor: '#007AFF',
		paddingHorizontal: 50,
		paddingVertical: 18,
		borderRadius: 20,
		elevation: 10,
	},
	resultBox: {
		position: 'absolute',
		bottom: 140,
		left: 24,
		right: 24,
		backgroundColor: 'rgba(255,255,255,0.97)',
		padding: 20,
		borderRadius: 24,
		flexDirection: 'row',
		alignItems: 'center',
		gap: 14,
		elevation: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 12 },
		shadowOpacity: 0.35,
		shadowRadius: 25,
	},
	swipeHandle: {
		position: 'absolute',
		top: 8,
		left: 0,
		right: 0,
		alignItems: 'center',
	},
	swipeBar: {
		width: 44,
		height: 5,
		backgroundColor: '#ccc',
		borderRadius: 3,
	},
});
