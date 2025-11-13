import { AppColors } from '@/src/common/app-color';
import { Ionicons } from '@expo/vector-icons';
import * as FS from 'expo-file-system/legacy';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useRef } from 'react';
import { Alert, Modal, Platform, Pressable, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { Button, Card, Separator, Text, XStack, YStack } from 'tamagui';

interface PrintQRModalProps {
	visible: boolean;
	onClose: () => void;
	deviceName: string;
	serialNumber: string;
	deviceType?: string;
	brand?: string;
}

export default function PrintQRModal({
	visible,
	onClose,
	deviceName,
	serialNumber,
	deviceType,
	brand,
}: PrintQRModalProps) {
	const qrRef = useRef<View>(null);

	// Capture QR code as image and generate HTML for printing
	const captureAndGenerateHTML = async () => {
		try {
			if (!qrRef.current) {
				throw new Error('QR reference not found');
			}

			// Wait a bit for render to complete
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Capture the QR code as file URI
			const uri = await captureRef(qrRef, {
				format: 'png',
				quality: 1,
			});

			// Read file as base64
			const base64 = await FS.readAsStringAsync(uri, {
				encoding: 'base64',
			});

			// Generate simple HTML with just the QR image
			const html = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<style>
		html, body {
			margin: 0;
			padding: 0;
			width: fit-content;
			height: fit-content;
			background: white;
			display: flex;
			justify-content: center;
			align-items: center;
		}

		img {
			display: block;
			margin: 0;
			padding: 0;
			image-rendering: pixelated;
			image-rendering: crisp-edges;
			object-fit: contain;
		}

		/* Khi in ra, đảm bảo không có viền nào */
		@media print {
			@page {
				margin: 0;
				size: auto;
			}
			html, body {
				margin: 0 !important;
				padding: 0 !important;
				background: white !important;
			}
			img {
				margin: 0 !important;
				padding: 0 !important;
				width: 100vw !important;
				height: 100vh !important;
				object-fit: contain;
				print-color-adjust: exact;
				-webkit-print-color-adjust: exact;
			}
		}
	</style>
</head>
<body>
	<img src="data:image/png;base64,${base64}" alt="QR Code" />
</body>
</html>
			`;

			return html;
		} catch (error) {
			console.error('Error capturing QR:', error);
			throw error;
		}
	};

	const handlePrint = async () => {
		try {
			const html = await captureAndGenerateHTML();

			if (Platform.OS === 'web') {
				// For web, open print dialog
				const printWindow = window.open('', '_blank');
				if (printWindow) {
					printWindow.document.open(html);
					printWindow.document.close();
					printWindow.focus();
					setTimeout(() => {
						printWindow.print();
					}, 300);
				}
			} else {
				// For mobile, use expo-print
				await Print.printAsync({
					html,
				});
			}
		} catch (error: any) {
			Alert.alert('Lỗi', error?.message || 'Không thể in QR code');
		}
	};

	const handleShare = async () => {
		try {
			const html = await captureAndGenerateHTML();

			// Generate PDF
			const { uri } = await Print.printToFileAsync({ html });

			// Check if sharing is available
			if (await Sharing.isAvailableAsync()) {
				await Sharing.shareAsync(uri, {
					mimeType: 'application/pdf',
					dialogTitle: `QR Code - ${serialNumber}`,
					UTI: 'com.adobe.pdf',
				});
			} else {
				Alert.alert(
					'Thông báo',
					'Chia sẻ không khả dụng trên thiết bị này'
				);
			}
		} catch (error: any) {
			Alert.alert('Lỗi', error?.message || 'Không thể chia sẻ QR code');
		}
	};

	const handleSavePDF = async () => {
		try {
			const html = await captureAndGenerateHTML();

			const { uri } = await Print.printToFileAsync({ html });

			Alert.alert(
				'✓ Thành công',
				`QR code đã được lưu thành PDF\nĐường dẫn: ${uri}`,
				[
					{
						text: 'Chia sẻ',
						onPress: async () => {
							if (await Sharing.isAvailableAsync()) {
								await Sharing.shareAsync(uri);
							}
						},
					},
					{ text: 'Đóng', style: 'cancel' },
				]
			);
		} catch (error: any) {
			Alert.alert('Lỗi', error?.message || 'Không thể lưu PDF');
		}
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<YStack
				flex={1}
				backgroundColor="rgba(0,0,0,0.5)"
				justifyContent="center"
				alignItems="center"
			>
				<YStack
					width="90%"
					maxWidth={450}
					backgroundColor={AppColors.surface}
					borderRadius="$4"
					shadowColor={AppColors.shadowMedium}
					shadowRadius={20}
					shadowOffset={{ width: 0, height: 10 }}
					elevation={5}
				>
					{/* Header */}
					<XStack
						padding="$4"
						alignItems="center"
						justifyContent="space-between"
						borderBottomWidth={1}
						borderBottomColor={AppColors.border}
					>
						<Text
							fontSize={18}
							fontWeight="700"
							color={AppColors.text}
						>
							QR Code Thiết Bị
						</Text>
						<Pressable onPress={onClose}>
							<Ionicons
								name="close"
								size={28}
								color={AppColors.text}
							/>
						</Pressable>
					</XStack>

					{/* Content */}
					<YStack padding="$4" gap="$4" alignItems="center">
						{/* Device Info */}
						<YStack width="100%" gap="$2">
							<Text
								fontSize={16}
								fontWeight="700"
								color={AppColors.text}
								textAlign="center"
							>
								{deviceName}
							</Text>
							{deviceType && (
								<Text
									fontSize={12}
									color={AppColors.textMuted}
									textAlign="center"
								>
									{deviceType} {brand ? `- ${brand}` : ''}
								</Text>
							)}
						</YStack>

						<Separator borderColor={AppColors.border} />

						{/* QR Code Display - Hidden ViewShot for capture */}
						<View style={{ position: 'absolute', left: -9999 }}>
							<ViewShot
								ref={qrRef}
								options={{ format: 'png', quality: 1 }}
							>
								<View
									style={{
										backgroundColor: 'white',
										padding: 20,
									}}
								>
									<QRCode
										value={serialNumber}
										size={300}
										backgroundColor="white"
										color="black"
									/>
								</View>
							</ViewShot>
						</View>

						{/* QR Code Display - Visible preview */}
						<Card
							backgroundColor={AppColors.background}
							padding="$4"
							borderWidth={2}
							borderColor={AppColors.border}
							borderRadius="$4"
							alignItems="center"
						>
							<View
								style={{
									backgroundColor: 'white',
									padding: 20,
									borderRadius: 8,
								}}
							>
								<QRCode
									value={serialNumber}
									size={200}
									backgroundColor="white"
									color="black"
									logoSize={30}
									logoBackgroundColor="white"
								/>
							</View>
						</Card>

						{/* Serial Number */}
						<Card
							backgroundColor={AppColors.primaryLight + '20'}
							padding="$3"
							borderRadius="$3"
							width="100%"
						>
							<YStack alignItems="center" gap="$1">
								<Text
									fontSize={11}
									color={AppColors.textMuted}
									fontWeight="600"
								>
									SERIAL NUMBER
								</Text>
								<Text
									fontSize={16}
									fontWeight="700"
									color={AppColors.text}
								>
									{serialNumber}
								</Text>
							</YStack>
						</Card>

						{/* Info */}
						<Text
							fontSize={11}
							color={AppColors.textSecondary}
							textAlign="center"
						>
							Quét mã QR để xem thông tin chi tiết thiết bị
						</Text>
					</YStack>

					{/* Actions */}
					<XStack
						padding="$4"
						gap="$3"
						borderTopWidth={1}
						borderTopColor={AppColors.border}
					>
						<Button
							flex={1}
							backgroundColor={AppColors.info}
							color="white"
							icon={
								<Ionicons
									name="share-outline"
									size={18}
									color="white"
								/>
							}
							onPress={handleShare}
							height={44}
						>
							Chia sẻ
						</Button>
						<Button
							flex={1}
							backgroundColor={AppColors.success}
							color="white"
							icon={
								<Ionicons
									name="download-outline"
									size={18}
									color="white"
								/>
							}
							onPress={handleSavePDF}
							height={44}
						>
							Lưu PDF
						</Button>
						<Button
							flex={1}
							backgroundColor={AppColors.primary}
							color="white"
							icon={
								<Ionicons
									name="print-outline"
									size={18}
									color="white"
								/>
							}
							onPress={handlePrint}
							height={44}
						>
							In
						</Button>
					</XStack>
				</YStack>
			</YStack>
		</Modal>
	);
}
