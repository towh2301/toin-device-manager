import { AppColors } from '@/src/common/app-color';
import { useUpdateSoftware } from '@/src/services/software/useSoftwareMutations';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Platform, Pressable, ScrollView } from 'react-native';
import {
	Button,
	Card,
	Input,
	Separator,
	Text,
	TextArea,
	XStack,
	YStack,
} from 'tamagui';

interface SoftwareEditModalProps {
	visible: boolean;
	onClose: () => void;
	softwareId: string;
	softwareData: any;
	onSuccess: () => void;
}

export default function SoftwareEditModal({
	visible,
	onClose,
	softwareId,
	softwareData,
	onSuccess,
}: SoftwareEditModalProps) {
	const updateSoftwareMutation = useUpdateSoftware();

	// Software fields
	const [softwareName, setSoftwareName] = useState('');
	const [softwareVersion, setSoftwareVersion] = useState('');
	const [softwarePlan, setSoftwarePlan] = useState('');
	const [softwareLicenseKey, setSoftwareLicenseKey] = useState('');
	const [softwarePurchaseDate, setSoftwarePurchaseDate] = useState<
		Date | undefined
	>(undefined);
	const [softwareExpiryDate, setSoftwareExpiryDate] = useState<
		Date | undefined
	>(undefined);
	const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);
	const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

	// Account fields
	const [accountUsername, setAccountUsername] = useState('');
	const [accountPassword, setAccountPassword] = useState('');
	const [accountEmail, setAccountEmail] = useState('');
	const [accountNote, setAccountNote] = useState('');

	// Populate fields when modal opens
	useEffect(() => {
		if (visible && softwareData) {
			setSoftwareName(softwareData.name || '');
			setSoftwareVersion(softwareData.version || '');
			setSoftwarePlan(softwareData.plan || '');
			setSoftwareLicenseKey(softwareData.licenseKey || '');

			if (softwareData.purchaseDate) {
				setSoftwarePurchaseDate(new Date(softwareData.purchaseDate));
			}
			if (softwareData.expiredDate) {
				setSoftwareExpiryDate(new Date(softwareData.expiredDate));
			}

			if (softwareData.account) {
				setAccountUsername(softwareData.account.username || '');
				setAccountPassword(softwareData.account.password || '');
				setAccountEmail(softwareData.account.relatedEmail || '');
				setAccountNote(softwareData.account.note || '');
			}
		}
	}, [visible, softwareData]);

	const resetForm = () => {
		setSoftwareName('');
		setSoftwareVersion('');
		setSoftwarePlan('');
		setSoftwareLicenseKey('');
		setSoftwarePurchaseDate(undefined);
		setSoftwareExpiryDate(undefined);
		setAccountUsername('');
		setAccountPassword('');
		setAccountEmail('');
		setAccountNote('');
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleUpdateSoftware = async () => {
		if (!softwareName.trim()) {
			Alert.alert('Lỗi', 'Vui lòng nhập tên phần mềm');
			return;
		}

		try {
			const payload: any = {
				name: softwareName.trim(),
			};

			if (softwareVersion.trim())
				payload.version = softwareVersion.trim();
			if (softwarePlan.trim()) payload.plan = softwarePlan.trim();
			if (softwareLicenseKey.trim())
				payload.licenseKey = softwareLicenseKey.trim();

			if (softwarePurchaseDate) {
				payload.purchaseDate = softwarePurchaseDate.toISOString();
			}
			if (softwareExpiryDate) {
				payload.expiredDate = softwareExpiryDate.toISOString();
			}

			// Include account if any account field is filled
			if (accountUsername.trim() || accountPassword.trim()) {
				payload.account = {
					username: accountUsername.trim(),
					password: accountPassword.trim(),
				};
				if (accountEmail.trim())
					payload.account.relatedEmail = accountEmail.trim();
				if (accountNote.trim())
					payload.account.note = accountNote.trim();
			}

			await updateSoftwareMutation.mutateAsync({
				id: softwareId,
				payload,
			});

			Alert.alert('✓ Thành công', 'Đã cập nhật phần mềm');
			onSuccess();
			handleClose();
		} catch (error: any) {
			Alert.alert('Lỗi', error?.message || 'Không thể cập nhật phần mềm');
		}
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={handleClose}
		>
			<YStack
				flex={1}
				backgroundColor="rgba(0,0,0,0.5)"
				justifyContent="center"
				alignItems="center"
			>
				<YStack
					width="90%"
					maxWidth={500}
					height="80%"
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
							Sửa phần mềm
						</Text>
						<Pressable onPress={handleClose}>
							<Ionicons
								name="close"
								size={28}
								color={AppColors.text}
							/>
						</Pressable>
					</XStack>

					{/* Content */}
					<YStack flex={1}>
						<ScrollView
							style={{ flex: 1 }}
							contentContainerStyle={{ padding: 16 }}
							showsVerticalScrollIndicator={false}
						>
							<YStack gap="$3">
								{/* Software Info Section */}
								<Text
									fontSize={16}
									fontWeight="700"
									color={AppColors.text}
								>
									Thông tin phần mềm
								</Text>

								<YStack gap="$2">
									<Text
										fontSize={12}
										fontWeight="600"
										color={AppColors.textSecondary}
									>
										Tên phần mềm *
									</Text>
									<Input
										placeholder="Nhập tên phần mềm"
										value={softwareName}
										onChangeText={setSoftwareName}
										backgroundColor={AppColors.background}
										borderColor={AppColors.border}
										color={AppColors.text}
										placeholderTextColor={
											AppColors.textMuted
										}
										height={10}
									/>
								</YStack>

								<YStack gap="$2">
									<Text
										fontSize={12}
										fontWeight="600"
										color={AppColors.textSecondary}
									>
										Phiên bản
									</Text>
									<Input
										placeholder="Nhập phiên bản"
										value={softwareVersion}
										onChangeText={setSoftwareVersion}
										backgroundColor={AppColors.background}
										borderColor={AppColors.border}
										color={AppColors.text}
										placeholderTextColor={
											AppColors.textMuted
										}
									/>
								</YStack>

								<YStack gap="$2">
									<Text
										fontSize={12}
										fontWeight="600"
										color={AppColors.textSecondary}
									>
										Gói dịch vụ
									</Text>
									<Input
										placeholder="Nhập gói dịch vụ"
										value={softwarePlan}
										onChangeText={setSoftwarePlan}
										backgroundColor={AppColors.background}
										borderColor={AppColors.border}
										color={AppColors.text}
										placeholderTextColor={
											AppColors.textMuted
										}
									/>
								</YStack>

								<YStack gap="$2">
									<Text
										fontSize={12}
										fontWeight="600"
										color={AppColors.textSecondary}
									>
										License Key
									</Text>
									<Input
										placeholder="Nhập license key"
										value={softwareLicenseKey}
										onChangeText={setSoftwareLicenseKey}
										backgroundColor={AppColors.background}
										borderColor={AppColors.border}
										color={AppColors.text}
										placeholderTextColor={
											AppColors.textMuted
										}
									/>
								</YStack>

								<YStack gap="$2">
									<Text
										fontSize={12}
										fontWeight="600"
										color={AppColors.textSecondary}
									>
										Ngày mua
									</Text>
									<Pressable
										onPress={() =>
											setShowPurchaseDatePicker(true)
										}
									>
										<Card
											backgroundColor={
												AppColors.background
											}
											borderWidth={1}
											borderColor={AppColors.border}
											padding="$3"
										>
											<Text
												color={
													softwarePurchaseDate
														? AppColors.text
														: AppColors.textMuted
												}
											>
												{softwarePurchaseDate
													? softwarePurchaseDate.toLocaleDateString(
															'vi-VN'
														)
													: 'Chọn ngày mua'}
											</Text>
										</Card>
									</Pressable>
									{showPurchaseDatePicker && (
										<DateTimePicker
											value={
												softwarePurchaseDate ||
												new Date()
											}
											mode="date"
											display={
												Platform.OS === 'ios'
													? 'spinner'
													: 'default'
											}
											locale="vi-VN"
											onChange={(event, selectedDate) => {
												setShowPurchaseDatePicker(
													Platform.OS === 'ios'
												);
												if (selectedDate) {
													setSoftwarePurchaseDate(
														selectedDate
													);
												}
											}}
										/>
									)}
								</YStack>

								<YStack gap="$2">
									<Text
										fontSize={12}
										fontWeight="600"
										color={AppColors.textSecondary}
									>
										Ngày hết hạn
									</Text>
									<Pressable
										onPress={() =>
											setShowExpiryDatePicker(true)
										}
									>
										<Card
											backgroundColor={
												AppColors.background
											}
											borderWidth={1}
											borderColor={AppColors.border}
											padding="$3"
										>
											<Text
												color={
													softwareExpiryDate
														? AppColors.text
														: AppColors.textMuted
												}
											>
												{softwareExpiryDate
													? softwareExpiryDate.toLocaleDateString(
															'vi-VN'
														)
													: 'Chọn ngày hết hạn'}
											</Text>
										</Card>
									</Pressable>
									{showExpiryDatePicker && (
										<DateTimePicker
											value={
												softwareExpiryDate || new Date()
											}
											mode="date"
											display={
												Platform.OS === 'ios'
													? 'spinner'
													: 'default'
											}
											locale="vi-VN"
											onChange={(event, selectedDate) => {
												setShowExpiryDatePicker(
													Platform.OS === 'ios'
												);
												if (selectedDate) {
													setSoftwareExpiryDate(
														selectedDate
													);
												}
											}}
										/>
									)}
								</YStack>

								<Separator
									borderColor={AppColors.border}
									marginVertical="$3"
								/>

								{/* Account Section */}
								<Text
									fontSize={16}
									fontWeight="700"
									color={AppColors.text}
								>
									Thông tin tài khoản (tùy chọn)
								</Text>

								<YStack gap="$2">
									<Text
										fontSize={12}
										fontWeight="600"
										color={AppColors.textSecondary}
									>
										Username
									</Text>
									<Input
										placeholder="Nhập username"
										value={accountUsername}
										onChangeText={setAccountUsername}
										backgroundColor={AppColors.background}
										borderColor={AppColors.border}
										color={AppColors.text}
										placeholderTextColor={
											AppColors.textMuted
										}
									/>
								</YStack>

								<YStack gap="$2">
									<Text
										fontSize={12}
										fontWeight="600"
										color={AppColors.textSecondary}
									>
										Password
									</Text>
									<Input
										placeholder="Nhập password"
										value={accountPassword}
										onChangeText={setAccountPassword}
										backgroundColor={AppColors.background}
										borderColor={AppColors.border}
										color={AppColors.text}
										placeholderTextColor={
											AppColors.textMuted
										}
										secureTextEntry
									/>
								</YStack>

								<YStack gap="$2">
									<Text
										fontSize={12}
										fontWeight="600"
										color={AppColors.textSecondary}
									>
										Email liên quan
									</Text>
									<Input
										placeholder="Nhập email"
										value={accountEmail}
										onChangeText={setAccountEmail}
										backgroundColor={AppColors.background}
										borderColor={AppColors.border}
										color={AppColors.text}
										placeholderTextColor={
											AppColors.textMuted
										}
										keyboardType="email-address"
										autoCapitalize="none"
									/>
								</YStack>

								<YStack gap="$2">
									<Text
										fontSize={12}
										fontWeight="600"
										color={AppColors.textSecondary}
									>
										Ghi chú tài khoản
									</Text>
									<TextArea
										placeholder="Nhập ghi chú"
										value={accountNote}
										onChangeText={setAccountNote}
										backgroundColor={AppColors.background}
										borderColor={AppColors.border}
										color={AppColors.text}
										placeholderTextColor={
											AppColors.textMuted
										}
										numberOfLines={3}
									/>
								</YStack>
							</YStack>
						</ScrollView>
					</YStack>

					{/* Footer Actions */}
					<XStack
						padding="$4"
						gap="$3"
						borderTopWidth={1}
						borderTopColor={AppColors.border}
					>
						<Button
							flex={1}
							backgroundColor={AppColors.border}
							color={AppColors.text}
							onPress={handleClose}
							disabled={updateSoftwareMutation.isPending}
						>
							Hủy
						</Button>
						<Button
							flex={1}
							backgroundColor={AppColors.primary}
							color="white"
							onPress={handleUpdateSoftware}
							disabled={updateSoftwareMutation.isPending}
						>
							{updateSoftwareMutation.isPending
								? 'Đang lưu...'
								: 'Lưu'}
						</Button>
					</XStack>
				</YStack>
			</YStack>
		</Modal>
	);
}
