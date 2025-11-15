import { AppColors } from '@/src/common/app-color';
import {
	DeviceSoftwareResponse,
	useLinkSoftware,
	useUnlinkSoftware,
} from '@/src/services';
import { useCreateSoftware, useGetAllSoftware } from '@/src/services/software';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Alert, Modal, Platform, Pressable, TextInput } from 'react-native';
import { Button, Card, ScrollView, Text, XStack, YStack } from 'tamagui';

interface SoftwareModalProps {
	visible: boolean;
	onClose: () => void;
	deviceId: string;
	softwareList: DeviceSoftwareResponse[];
	onSuccess: () => void;
}

export default function SoftwareModal({
	visible,
	onClose,
	deviceId,
	softwareList,
	onSuccess,
}: SoftwareModalProps) {
	const [isCreatingNewSoftware, setIsCreatingNewSoftware] = useState(false);
	const [newSoftwareName, setNewSoftwareName] = useState('');
	const [newSoftwareVersion, setNewSoftwareVersion] = useState('');
	const [newSoftwareLicenseKey, setNewSoftwareLicenseKey] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [accountUsername, setAccountUsername] = useState('');
	const [accountPassword, setAccountPassword] = useState('');
	const [accountEmail, setAccountEmail] = useState('');
	const [accountNote, setAccountNote] = useState('');
	const [softwarePlan, setSoftwarePlan] = useState('');
	const [softwarePurchaseDate, setSoftwarePurchaseDate] = useState<
		Date | undefined
	>(undefined);
	const [softwareExpiryDate, setSoftwareExpiryDate] = useState<
		Date | undefined
	>(undefined);
	const [showPurchaseDatePicker, setShowPurchaseDatePicker] = useState(false);
	const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(false);

	const { softwareData: allSoftware = [] } = useGetAllSoftware();
	const linkSoftwareMutation = useLinkSoftware();
	const createSoftwareMutation = useCreateSoftware();
	const unlinkSoftwareMutation = useUnlinkSoftware();

	const resetForm = () => {
		setIsCreatingNewSoftware(false);
		setNewSoftwareName('');
		setNewSoftwareVersion('');
		setNewSoftwareLicenseKey('');
		setAccountUsername('');
		setAccountPassword('');
		setAccountEmail('');
		setAccountNote('');
		setShowPassword(false);
		setSoftwarePlan('');
		setSoftwarePurchaseDate(undefined);
		setSoftwareExpiryDate(undefined);
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleLinkSoftware = async (softwareId: string) => {
		try {
			await linkSoftwareMutation.mutateAsync({
				deviceId,
				softwareId,
			});
			Alert.alert('✓ Thành công', 'Đã gán phần mềm cho thiết bị');
			onSuccess();
			handleClose();
		} catch (error: any) {
			Alert.alert('Lỗi', error?.message || 'Không thể gán phần mềm');
		}
	};

	const handleCreateAndLinkSoftware = async () => {
		if (!newSoftwareName.trim()) {
			Alert.alert('Lỗi', 'Vui lòng nhập tên phần mềm');
			return;
		}

		try {
			const softwareData: any = {
				name: newSoftwareName.trim(),
			};

			if (newSoftwareVersion.trim()) {
				softwareData.version = newSoftwareVersion.trim();
			}

			if (newSoftwareLicenseKey.trim()) {
				softwareData.licenseKey = newSoftwareLicenseKey.trim();
			}

			if (softwarePurchaseDate) {
				softwareData.purchaseDate = softwarePurchaseDate.toISOString();
			}

			if (softwareExpiryDate) {
				softwareData.expiredDate = softwareExpiryDate.toISOString();
			}

			if (accountUsername.trim()) {
				softwareData.account = {
					username: accountUsername.trim(),
					password: accountPassword.trim() || '',
				};

				if (accountEmail.trim()) {
					softwareData.account.relatedEmail = accountEmail.trim();
				}
				if (accountNote.trim()) {
					softwareData.account.note = accountNote.trim();
				}
			}

			const newSoftware =
				await createSoftwareMutation.mutateAsync(softwareData);

			if (!newSoftware?.data?.id) {
				throw new Error('Không thể tạo phần mềm');
			}

			await linkSoftwareMutation.mutateAsync({
				deviceId,
				softwareId: newSoftware.data.id,
			});

			Alert.alert(
				'✓ Thành công',
				'Đã tạo và gán phần mềm mới cho thiết bị'
			);

			onSuccess();
			handleClose();
		} catch (error: any) {
			console.error('Error creating software:', error);
			Alert.alert('Lỗi', error?.message || 'Không thể tạo phần mềm');
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
				padding="$4"
			>
				<YStack
					width="90%"
					maxWidth={500}
					height="80%"
					backgroundColor={AppColors.surface}
					borderRadius="$4"
					padding="$4"
					shadowColor={AppColors.shadowDark}
					shadowRadius={20}
					shadowOffset={{ width: 0, height: 10 }}
					elevation={8}
				>
					<YStack gap="$3" flex={1}>
						{/* Header */}
						<XStack
							justifyContent="space-between"
							alignItems="center"
						>
							<Text
								fontSize={18}
								fontWeight="700"
								color={AppColors.text}
							>
								📝 Tạo phần mềm mới
							</Text>
						</XStack>

						{/* Create Form */}
						<ScrollView
							style={{ flex: 1 }}
							showsVerticalScrollIndicator={false}
						>
							<YStack gap="$3" paddingRight="$1">
								{/* Software Info Section */}
								<YStack
									gap="$3"
									backgroundColor={AppColors.background}
									padding="$3"
									borderRadius="$3"
								>
									<Text
										fontSize={13}
										fontWeight="700"
										color={AppColors.text}
									>
										📋 Thông tin phần mềm
									</Text>

									<YStack gap="$2">
										<Text
											fontSize={12}
											fontWeight="600"
											color={AppColors.textSecondary}
										>
											Tên phần mềm{' '}
											<Text color={AppColors.danger}>
												*
											</Text>
										</Text>
										<Card
											backgroundColor="white"
											borderWidth={1}
											borderColor={AppColors.border}
											borderRadius="$2"
											padding="$2.5"
										>
											<TextInput
												placeholder="VD: Microsoft Office 365"
												placeholderTextColor={
													AppColors.textMuted
												}
												value={newSoftwareName}
												onChangeText={
													setNewSoftwareName
												}
												style={{
													fontSize: 13,
													color: AppColors.text,
													padding: 0,
												}}
											/>
										</Card>
									</YStack>

									{/* Version */}
									<YStack gap="$2">
										<Text
											fontSize={12}
											fontWeight="600"
											color={AppColors.textSecondary}
										>
											Phiên bản
										</Text>
										<Card
											backgroundColor="white"
											borderWidth={1}
											borderColor={AppColors.border}
											borderRadius="$2"
											padding="$2.5"
										>
											<TextInput
												placeholder="VD: 2024"
												placeholderTextColor={
													AppColors.textMuted
												}
												value={newSoftwareVersion}
												onChangeText={
													setNewSoftwareVersion
												}
												style={{
													fontSize: 13,
													color: AppColors.text,
													padding: 0,
												}}
											/>
										</Card>
									</YStack>

									{/* Plan */}
									<YStack gap="$2">
										<Text
											fontSize={12}
											fontWeight="600"
											color={AppColors.textSecondary}
										>
											Gói mua
										</Text>
										<Card
											backgroundColor="white"
											borderWidth={1}
											borderColor={AppColors.border}
											borderRadius="$2"
											padding="$2.5"
										>
											<TextInput
												placeholder="VD: 2024"
												placeholderTextColor={
													AppColors.textMuted
												}
												value={softwarePlan}
												onChangeText={setSoftwarePlan}
												style={{
													fontSize: 13,
													color: AppColors.text,
													padding: 0,
												}}
											/>
										</Card>
									</YStack>

									{/* License Key */}
									<YStack gap="$2">
										<Text
											fontSize={12}
											fontWeight="600"
											color={AppColors.textSecondary}
										>
											🔑 License Key / Serial
										</Text>
										<Card
											backgroundColor="white"
											borderWidth={1}
											borderColor={AppColors.border}
											borderRadius="$2"
											padding="$2.5"
										>
											<TextInput
												placeholder="VD: XXXXX-XXXXX-XXXXX-XXXXX"
												placeholderTextColor={
													AppColors.textMuted
												}
												value={newSoftwareLicenseKey}
												onChangeText={
													setNewSoftwareLicenseKey
												}
												style={{
													fontSize: 13,
													color: AppColors.text,
													padding: 0,
												}}
											/>
										</Card>
									</YStack>

									{/* Purchase Date */}
									<YStack gap="$2">
										<Text
											fontSize={12}
											fontWeight="600"
											color={AppColors.textSecondary}
										>
											📅 Ngày mua
										</Text>
										<Pressable
											onPress={() =>
												setShowPurchaseDatePicker(true)
											}
										>
											<Card
												backgroundColor="white"
												borderWidth={1}
												borderColor={AppColors.border}
												borderRadius="$2"
												padding="$2.5"
											>
												<Text
													fontSize={13}
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
												onChange={(
													event,
													selectedDate
												) => {
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

									{/* Expiry Date */}
									<YStack gap="$2">
										<Text
											fontSize={12}
											fontWeight="600"
											color={AppColors.textSecondary}
										>
											📅 Ngày hết hạn
										</Text>
										<Pressable
											onPress={() =>
												setShowExpiryDatePicker(true)
											}
										>
											<Card
												backgroundColor="white"
												borderWidth={1}
												borderColor={AppColors.border}
												borderRadius="$2"
												padding="$2.5"
											>
												<Text
													fontSize={13}
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
													softwareExpiryDate ||
													new Date()
												}
												mode="date"
												display={
													Platform.OS === 'ios'
														? 'spinner'
														: 'default'
												}
												locale="vi-VN"
												onChange={(
													event,
													selectedDate
												) => {
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
								</YStack>

								{/* Account Section */}
								<YStack
									gap="$3"
									backgroundColor={AppColors.info + '10'}
									padding="$3"
									borderRadius="$3"
									borderWidth={1}
									borderColor={AppColors.info + '30'}
								>
									<Text
										fontSize={13}
										fontWeight="700"
										color={AppColors.text}
									>
										🔐 Tài khoản đăng nhập (Optional)
									</Text>

									<YStack gap="$2">
										<Text
											fontSize={12}
											fontWeight="600"
											color={AppColors.textSecondary}
										>
											Username
										</Text>
										<Card
											backgroundColor="white"
											borderWidth={1}
											borderColor={AppColors.border}
											borderRadius="$2"
											padding="$2.5"
										>
											<TextInput
												placeholder="VD: admin@company.com"
												placeholderTextColor={
													AppColors.textMuted
												}
												value={accountUsername}
												onChangeText={
													setAccountUsername
												}
												autoCapitalize="none"
												style={{
													fontSize: 13,
													color: AppColors.text,
													padding: 0,
												}}
											/>
										</Card>
									</YStack>

									<YStack gap="$2">
										<Text
											fontSize={12}
											fontWeight="600"
											color={AppColors.textSecondary}
										>
											Password
										</Text>
										<Card
											backgroundColor="white"
											borderWidth={1}
											borderColor={AppColors.border}
											borderRadius="$2"
										>
											<XStack
												alignItems="center"
												paddingLeft="$2.5"
											>
												<TextInput
													placeholder="Nhập password"
													placeholderTextColor={
														AppColors.textMuted
													}
													value={accountPassword}
													onChangeText={
														setAccountPassword
													}
													secureTextEntry={
														!showPassword
													}
													autoCapitalize="none"
													style={{
														fontSize: 13,
														color: AppColors.text,
														padding: 0,
														flex: 1,
														paddingVertical: 10,
													}}
												/>
												<Button
													size="$2"
													circular
													chromeless
													icon={
														<Ionicons
															name={
																showPassword
																	? 'eye-off-outline'
																	: 'eye-outline'
															}
															size={18}
															color={
																AppColors.textMuted
															}
														/>
													}
													onPress={() =>
														setShowPassword(
															!showPassword
														)
													}
												/>
											</XStack>
										</Card>
									</YStack>

									<YStack gap="$2">
										<Text
											fontSize={12}
											fontWeight="600"
											color={AppColors.textSecondary}
										>
											Email liên quan
										</Text>
										<Card
											backgroundColor="white"
											borderWidth={1}
											borderColor={AppColors.border}
											borderRadius="$2"
											padding="$2.5"
										>
											<TextInput
												placeholder="VD: backup@company.com"
												placeholderTextColor={
													AppColors.textMuted
												}
												value={accountEmail}
												onChangeText={setAccountEmail}
												keyboardType="email-address"
												autoCapitalize="none"
												style={{
													fontSize: 13,
													color: AppColors.text,
													padding: 0,
												}}
											/>
										</Card>
									</YStack>

									<YStack gap="$2">
										<Text
											fontSize={12}
											fontWeight="600"
											color={AppColors.textSecondary}
										>
											Ghi chú
										</Text>
										<Card
											backgroundColor="white"
											borderWidth={1}
											borderColor={AppColors.border}
											borderRadius="$2"
											padding="$2.5"
										>
											<TextInput
												placeholder="Ghi chú về tài khoản..."
												placeholderTextColor={
													AppColors.textMuted
												}
												value={accountNote}
												onChangeText={setAccountNote}
												multiline
												numberOfLines={3}
												textAlignVertical="top"
												style={{
													fontSize: 13,
													color: AppColors.text,
													padding: 0,
													minHeight: 60,
												}}
											/>
										</Card>
									</YStack>
								</YStack>
							</YStack>
						</ScrollView>

						{/* Action Buttons */}
						<XStack gap="$2" marginTop="$2">
							<Button
								flex={1}
								backgroundColor={AppColors.dangerDark + 30}
								borderWidth={1}
								borderColor={AppColors.border}
								borderRadius="$3"
								onPress={handleClose}
								height={30}
							>
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									Hủy
								</Text>
							</Button>
							<Button
								flex={1}
								backgroundColor={
									newSoftwareName.trim()
										? AppColors.primary
										: AppColors.border
								}
								borderRadius="$3"
								disabled={!newSoftwareName.trim()}
								onPress={handleCreateAndLinkSoftware}
								pressStyle={{
									scale: 0.98,
								}}
								height={30}
							>
								<Text
									fontSize={14}
									fontWeight="600"
									color="white"
								>
									✓ Tạo & Gán
								</Text>
							</Button>
						</XStack>
					</YStack>
				</YStack>
			</YStack>
		</Modal>
	);
}
