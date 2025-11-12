/**
 * AssignDeviceModal
 * Modal for assigning a device to a Toin User
 */

import { AppColors } from '@/src/common/app-color';
import { useAssignDevice, useGetAllDevices } from '@/src/services/device';
import { useGetAllToinUsers } from '@/src/services/toin-user';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, ScrollView, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, Card, Text, TextArea, XStack, YStack } from 'tamagui';
import { useAuthStore } from '../store';

interface AssignDeviceModalProps {
	visible: boolean;
	onClose: () => void;
	preselectedDeviceId?: string;
	preselectedUserId?: string;
}

export default function AssignDeviceModal({
	visible,
	onClose,
	preselectedDeviceId,
	preselectedUserId,
}: AssignDeviceModalProps) {
	// States
	const [selectedDeviceId, setSelectedDeviceId] = useState<string>(
		preselectedDeviceId || ''
	);
	const [selectedUserId, setSelectedUserId] = useState<string>(
		preselectedUserId || ''
	);
	const [assignDate, setAssignDate] = useState<Date>(new Date());
	const [notes, setNotes] = useState<string>('');
	const [showDevicePicker, setShowDevicePicker] = useState(false);
	const [showUserPicker, setShowUserPicker] = useState(false);

	// Fetch data
	const { deviceData: devices, isLoading: devicesLoading } =
		useGetAllDevices();
	const { toinUserData: users, isLoading: usersLoading } =
		useGetAllToinUsers();

	// Get current user
	const { user } = useAuthStore();

	// Mutations
	const assignMutation = useAssignDevice();

	// Handlers
	const handleAssign = async () => {
		if (!selectedDeviceId) {
			Alert.alert('Lỗi', 'Vui lòng chọn thiết bị');
			return;
		}
		if (!selectedUserId) {
			Alert.alert('Lỗi', 'Vui lòng chọn người dùng');
			return;
		}

		try {
			await assignMutation.mutateAsync({
				device: selectedDeviceId,
				assigned_to: selectedUserId,
				assigned_date: assignDate.toISOString(),
				issued_by: user?.id,
				note: notes || undefined,
			});

			Toast.show({
				type: 'success',
				text1: 'Thành công',
				text2: 'Đã gán thiết bị cho người dùng',
			});

			// Reset form
			setSelectedDeviceId(preselectedDeviceId || '');
			setSelectedUserId(preselectedUserId || '');
			setAssignDate(new Date());
			setNotes('');
			onClose();
		} catch (error: any) {
			Toast.show({
				type: 'error',
				text1: 'Lỗi',
				text2: error.message || 'Không thể gán thiết bị',
			});
		}
	};

	const handleClose = () => {
		setSelectedDeviceId(preselectedDeviceId || '');
		setSelectedUserId(preselectedUserId || '');
		setAssignDate(new Date());
		setNotes('');
		onClose();
	};

	// Get selected device and user info
	const selectedDevice = devices?.find((d) => d.id === selectedDeviceId);
	const selectedUser = users?.find((u) => u.id === selectedUserId);

	// Filter available devices (status === AVAILABLE)
	const availableDevices =
		devices?.filter(
			(device) =>
				device.status === 'AVAILABLE' ||
				device.id === preselectedDeviceId
		) || [];

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={handleClose}
		>
			<XStack gap="$2" marginTop="$2" justifyContent="flex-end">
				<Button
					backgroundColor={AppColors.surface}
					borderWidth={1}
					borderColor={AppColors.border}
					size="$2"
					onPress={() =>
						setAssignDate(
							new Date(assignDate.getTime() - 24 * 60 * 60 * 1000)
						)
					}
				>
					◀ Ngày trước
				</Button>
				<Button
					backgroundColor={AppColors.surface}
					borderWidth={1}
					borderColor={AppColors.border}
					size="$2"
					onPress={() =>
						setAssignDate(
							new Date(assignDate.getTime() + 24 * 60 * 60 * 1000)
						)
					}
				>
					Ngày sau ▶
				</Button>
			</XStack>
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
						alignItems="center"
						justifyContent="space-between"
						borderBottomWidth={1}
						borderBottomColor={AppColors.border}
					>
						<XStack alignItems="center" gap="$2">
							<Ionicons
								name="link"
								size={24}
								color={AppColors.primary}
							/>
							<Text
								fontSize={20}
								fontWeight="800"
								color={AppColors.text}
							>
								Gán thiết bị
							</Text>
						</XStack>
						<TouchableOpacity onPress={handleClose}>
							<Ionicons
								name="close-circle"
								size={28}
								color={AppColors.textMuted}
							/>
						</TouchableOpacity>
					</XStack>

					{/* Form Content */}
					<ScrollView
						style={{ maxHeight: '75%' }}
						contentContainerStyle={{ padding: 16 }}
					>
						<YStack gap="$4">
							{/* Device Selector */}
							<YStack gap="$2">
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									Thiết bị{' '}
									<Text color={AppColors.danger}>*</Text>
								</Text>
								<TouchableOpacity
									onPress={() => setShowDevicePicker(true)}
									disabled={!!preselectedDeviceId}
								>
									<Card
										padding="$3"
										backgroundColor={
											preselectedDeviceId
												? AppColors.surfaceElevated
												: AppColors.surface
										}
										borderWidth={1}
										borderColor={
											selectedDeviceId
												? AppColors.primary
												: AppColors.border
										}
									>
										<XStack
											alignItems="center"
											justifyContent="space-between"
										>
											<Text
												fontSize={14}
												color={
													selectedDevice
														? AppColors.text
														: AppColors.textMuted
												}
											>
												{selectedDevice
													? `${selectedDevice.name} (${selectedDevice.serialNumber})`
													: 'Chọn thiết bị'}
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

							{/* User Selector */}
							<YStack gap="$2">
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									Người dùng{' '}
									<Text color={AppColors.danger}>*</Text>
								</Text>
								<TouchableOpacity
									onPress={() => setShowUserPicker(true)}
									disabled={!!preselectedUserId}
								>
									<Card
										padding="$3"
										backgroundColor={
											preselectedUserId
												? AppColors.surfaceElevated
												: AppColors.surface
										}
										borderWidth={1}
										borderColor={
											selectedUserId
												? AppColors.primary
												: AppColors.border
										}
									>
										<XStack
											alignItems="center"
											justifyContent="space-between"
										>
											<Text
												fontSize={14}
												color={
													selectedUser
														? AppColors.text
														: AppColors.textMuted
												}
											>
												{selectedUser
													? `${selectedUser.firstname} ${selectedUser.lastname}`
													: 'Chọn người dùng'}
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

							{/* Assignment Date */}
							<YStack gap="$2">
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									Ngày giao{' '}
									<Text color={AppColors.danger}>*</Text>
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
											fontSize={14}
											color={AppColors.text}
										>
											{assignDate.toLocaleDateString(
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
							</YStack>

							{/* Notes */}
							<YStack gap="$2">
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									Ghi chú
								</Text>
								<TextArea
									placeholder="Nhập ghi chú (tùy chọn)"
									value={notes}
									onChangeText={setNotes}
									backgroundColor={AppColors.surface}
									borderColor={AppColors.border}
									color={AppColors.text}
									placeholderTextColor={AppColors.textMuted}
									numberOfLines={3}
									height={80}
								/>
							</YStack>
						</YStack>
					</ScrollView>

					{/* Action Buttons */}
					<XStack
						padding="$4"
						gap="$3"
						borderTopWidth={1}
						borderTopColor={AppColors.border}
					>
						<Button
							flex={1}
							backgroundColor={AppColors.surface}
							color={AppColors.text}
							borderWidth={1}
							borderColor={AppColors.border}
							onPress={handleClose}
							disabled={assignMutation.isPending}
							height={30}
						>
							Hủy
						</Button>
						<Button
							flex={1}
							backgroundColor={AppColors.primary}
							color="white"
							onPress={handleAssign}
							disabled={
								assignMutation.isPending ||
								!selectedDeviceId ||
								!selectedUserId
							}
							height={30}
						>
							{assignMutation.isPending
								? 'Đang gán...'
								: 'Gán thiết bị'}
						</Button>
					</XStack>

					{/* Device Picker Modal */}
					{showDevicePicker && (
						<Modal
							visible={showDevicePicker}
							transparent
							animationType="fade"
							onRequestClose={() => setShowDevicePicker(false)}
						>
							<YStack
								flex={1}
								backgroundColor="rgba(0,0,0,0.5)"
								justifyContent="center"
								padding="$4"
							>
								<YStack
									backgroundColor={AppColors.background}
									borderRadius="$4"
									maxHeight="70%"
								>
									<XStack
										padding="$3"
										alignItems="center"
										justifyContent="space-between"
										borderBottomWidth={1}
										borderBottomColor={AppColors.border}
									>
										<Text
											fontSize={16}
											fontWeight="700"
											color={AppColors.text}
										>
											Chọn thiết bị
										</Text>
										<TouchableOpacity
											onPress={() =>
												setShowDevicePicker(false)
											}
										>
											<Ionicons
												name="close"
												size={24}
												color={AppColors.textMuted}
											/>
										</TouchableOpacity>
									</XStack>
									<ScrollView
										style={{ maxHeight: '100%' }}
										contentContainerStyle={{ padding: 12 }}
									>
										<YStack gap="$2">
											{devicesLoading ? (
												<Text
													textAlign="center"
													color={AppColors.textMuted}
												>
													Đang tải...
												</Text>
											) : availableDevices.length ===
											  0 ? (
												<Text
													textAlign="center"
													color={AppColors.textMuted}
												>
													Không có thiết bị khả dụng
												</Text>
											) : (
												availableDevices.map(
													(device) => (
														<TouchableOpacity
															key={device.id}
															onPress={() => {
																setSelectedDeviceId(
																	device.id
																);
																setShowDevicePicker(
																	false
																);
															}}
														>
															<Card
																padding="$3"
																backgroundColor={
																	selectedDeviceId ===
																	device.id
																		? AppColors.primary +
																			'20'
																		: AppColors.surface
																}
																borderWidth={1}
																borderColor={
																	selectedDeviceId ===
																	device.id
																		? AppColors.primary
																		: AppColors.border
																}
															>
																<YStack gap="$1">
																	<Text
																		fontSize={
																			14
																		}
																		fontWeight="600"
																		color={
																			AppColors.text
																		}
																	>
																		{
																			device.name
																		}
																	</Text>
																	<Text
																		fontSize={
																			12
																		}
																		color={
																			AppColors.textMuted
																		}
																	>
																		SN:{' '}
																		{
																			device.serialNumber
																		}{' '}
																		•{' '}
																		{
																			device.type
																		}
																	</Text>
																</YStack>
															</Card>
														</TouchableOpacity>
													)
												)
											)}
										</YStack>
									</ScrollView>
								</YStack>
							</YStack>
						</Modal>
					)}

					{/* User Picker Modal */}
					{showUserPicker && (
						<Modal
							visible={showUserPicker}
							transparent
							animationType="fade"
							onRequestClose={() => setShowUserPicker(false)}
						>
							<YStack
								flex={1}
								backgroundColor="rgba(0,0,0,0.5)"
								justifyContent="center"
								padding="$4"
							>
								<YStack
									backgroundColor={AppColors.background}
									borderRadius="$4"
									maxHeight="70%"
								>
									<XStack
										padding="$3"
										alignItems="center"
										justifyContent="space-between"
										borderBottomWidth={1}
										borderBottomColor={AppColors.border}
									>
										<Text
											fontSize={16}
											fontWeight="700"
											color={AppColors.text}
										>
											Chọn người dùng
										</Text>
										<TouchableOpacity
											onPress={() =>
												setShowUserPicker(false)
											}
										>
											<Ionicons
												name="close"
												size={24}
												color={AppColors.textMuted}
											/>
										</TouchableOpacity>
									</XStack>
									<ScrollView
										style={{ maxHeight: '100%' }}
										contentContainerStyle={{ padding: 12 }}
									>
										<YStack gap="$2">
											{usersLoading ? (
												<Text
													textAlign="center"
													color={AppColors.textMuted}
												>
													Đang tải...
												</Text>
											) : users.length === 0 ? (
												<Text
													textAlign="center"
													color={AppColors.textMuted}
												>
													Không có người dùng
												</Text>
											) : (
												users.map((user) => (
													<TouchableOpacity
														key={user.id}
														onPress={() => {
															setSelectedUserId(
																user.id
															);
															setShowUserPicker(
																false
															);
														}}
													>
														<Card
															padding="$3"
															backgroundColor={
																selectedUserId ===
																user.id
																	? AppColors.primary +
																		'20'
																	: AppColors.surface
															}
															borderWidth={1}
															borderColor={
																selectedUserId ===
																user.id
																	? AppColors.primary
																	: AppColors.border
															}
														>
															<XStack
																gap="$2"
																alignItems="center"
															>
																<YStack
																	width={36}
																	height={36}
																	backgroundColor={
																		AppColors.primary +
																		'20'
																	}
																	borderRadius="$10"
																	justifyContent="center"
																	alignItems="center"
																>
																	<Text
																		fontSize={
																			16
																		}
																		fontWeight="700"
																		color={
																			AppColors.primary
																		}
																	>
																		{user.firstname.charAt(
																			0
																		)}
																	</Text>
																</YStack>
																<YStack
																	flex={1}
																>
																	<Text
																		fontSize={
																			14
																		}
																		fontWeight="600"
																		color={
																			AppColors.text
																		}
																	>
																		{
																			user.firstname
																		}{' '}
																		{
																			user.lastname
																		}
																	</Text>
																	<Text
																		fontSize={
																			12
																		}
																		color={
																			AppColors.textMuted
																		}
																	>
																		{
																			user.department
																		}{' '}
																		•{' '}
																		{
																			user.position
																		}
																	</Text>
																</YStack>
															</XStack>
														</Card>
													</TouchableOpacity>
												))
											)}
										</YStack>
									</ScrollView>
								</YStack>
							</YStack>
						</Modal>
					)}
				</YStack>
			</YStack>
		</Modal>
	);
}
