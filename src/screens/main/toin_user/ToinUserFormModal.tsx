import { AppColors } from '@/src/common/app-color';
import {
	Department,
	Position,
	ToinUserCreatePayload,
	ToinUserResponse,
	ToinUserUpdatePayload,
	useCreateToinUser,
	useUpdateToinUser,
} from '@/src/services/toin-user';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { Button, Text, XStack, YStack } from 'tamagui';

interface ToinUserFormModalProps {
	visible: boolean;
	onClose: () => void;
	user?: ToinUserResponse | null;
	mode: 'create' | 'edit';
}

const ToinUserFormModal: React.FC<ToinUserFormModalProps> = ({
	visible,
	onClose,
	user,
	mode,
}) => {
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [email, setEmail] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [department, setDepartment] = useState('');
	const [position, setPosition] = useState('');
	const [joinedDate, setJoinedDate] = useState('');
	const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);
	const [showPositionPicker, setShowPositionPicker] = useState(false);

	const createMutation = useCreateToinUser();
	const updateMutation = useUpdateToinUser();

	useEffect(() => {
		if (mode === 'edit' && user) {
			setFirstname(user.firstname);
			setLastname(user.lastname);
			setEmail(user.email);
			setPhoneNumber(user.phone_number);
			setDepartment(user.department);
			setPosition(user.position);
			setJoinedDate(user.joinedDate.split('T')[0]);
		} else {
			resetForm();
		}
	}, [mode, user, visible]);

	const resetForm = () => {
		setFirstname('');
		setLastname('');
		setEmail('');
		setPhoneNumber('');
		setDepartment('');
		setPosition('');
		setJoinedDate(new Date().toISOString().split('T')[0]);
	};

	const handleSubmit = async () => {
		if (
			!firstname ||
			!lastname ||
			!email ||
			!phoneNumber ||
			!department ||
			!position ||
			!joinedDate
		) {
			Toast.show({
				type: 'error',
				text1: 'Lỗi',
				text2: 'Vui lòng điền đầy đủ thông tin',
			});
			return;
		}

		try {
			if (mode === 'create') {
				const payload: ToinUserCreatePayload = {
					firstname,
					lastname,
					email,
					phone_number: phoneNumber,
					department,
					position,
					joinedDate,
				};
				await createMutation.mutateAsync(payload);
				Toast.show({
					type: 'success',
					text1: 'Thành công',
					text2: 'Tạo người dùng mới thành công',
				});
			} else if (user) {
				const payload: ToinUserUpdatePayload = {
					firstname,
					lastname,
					email,
					phone_number: phoneNumber,
					department,
					position,
					joinedDate,
				};
				await updateMutation.mutateAsync({ id: user.id, payload });
				Toast.show({
					type: 'success',
					text1: 'Thành công',
					text2: 'Cập nhật người dùng thành công',
				});
			}
			onClose();
			resetForm();
		} catch (error: any) {
			Toast.show({
				type: 'error',
				text1: 'Lỗi',
				text2: error.message || 'Có lỗi xảy ra',
			});
		}
	};

	const departments = Object.values(Department);
	const positions = Object.values(Position);

	return (
		<Modal visible={visible} transparent animationType="slide">
			<YStack
				flex={1}
				backgroundColor="rgba(0,0,0,0.5)"
				justifyContent="flex-end"
			>
				<YStack
					backgroundColor={AppColors.surface}
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
							fontSize={20}
							fontWeight="700"
							color={AppColors.text}
						>
							{mode === 'create'
								? 'Thêm người dùng'
								: 'Cập nhật người dùng'}
						</Text>
						<TouchableOpacity onPress={onClose}>
							<Ionicons
								name="close"
								size={28}
								color={AppColors.text}
							/>
						</TouchableOpacity>
					</XStack>

					{/* Form */}
					<ScrollView style={{ flex: 1 }}>
						<YStack padding="$4" gap="$4">
							{/* First Name */}
							<YStack gap="$2">
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									Tên <Text color={AppColors.danger}>*</Text>
								</Text>
								<TextInput
									value={firstname}
									onChangeText={setFirstname}
									placeholder="Nhập tên"
									placeholderTextColor={AppColors.textMuted}
									style={{
										backgroundColor: AppColors.background,
										borderWidth: 1,
										borderColor: AppColors.border,
										borderRadius: 8,
										padding: 12,
										fontSize: 15,
										color: AppColors.text,
									}}
								/>
							</YStack>

							{/* Last Name */}
							<YStack gap="$2">
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									Họ <Text color={AppColors.danger}>*</Text>
								</Text>
								<TextInput
									value={lastname}
									onChangeText={setLastname}
									placeholder="Nhập họ"
									placeholderTextColor={AppColors.textMuted}
									style={{
										backgroundColor: AppColors.background,
										borderWidth: 1,
										borderColor: AppColors.border,
										borderRadius: 8,
										padding: 12,
										fontSize: 15,
										color: AppColors.text,
									}}
								/>
							</YStack>

							{/* Email */}
							<YStack gap="$2">
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									Email{' '}
									<Text color={AppColors.danger}>*</Text>
								</Text>
								<TextInput
									value={email}
									onChangeText={setEmail}
									placeholder="example@toin.com"
									keyboardType="email-address"
									autoCapitalize="none"
									placeholderTextColor={AppColors.textMuted}
									style={{
										backgroundColor: AppColors.background,
										borderWidth: 1,
										borderColor: AppColors.border,
										borderRadius: 8,
										padding: 12,
										fontSize: 15,
										color: AppColors.text,
									}}
								/>
							</YStack>

							{/* Phone Number */}
							<YStack gap="$2">
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									Số điện thoại{' '}
									<Text color={AppColors.danger}>*</Text>
								</Text>
								<TextInput
									value={phoneNumber}
									onChangeText={setPhoneNumber}
									placeholder="+84123456789"
									keyboardType="phone-pad"
									placeholderTextColor={AppColors.textMuted}
									style={{
										backgroundColor: AppColors.background,
										borderWidth: 1,
										borderColor: AppColors.border,
										borderRadius: 8,
										padding: 12,
										fontSize: 15,
										color: AppColors.text,
									}}
								/>
							</YStack>

							{/* Department Picker */}
							<YStack gap="$2">
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									Phòng ban{' '}
									<Text color={AppColors.danger}>*</Text>
								</Text>
								<TouchableOpacity
									onPress={() =>
										setShowDepartmentPicker(
											!showDepartmentPicker
										)
									}
									style={{
										backgroundColor: AppColors.background,
										borderWidth: 1,
										borderColor: AppColors.border,
										borderRadius: 8,
										padding: 12,
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<Text
										color={
											department
												? AppColors.text
												: AppColors.textMuted
										}
									>
										{department || 'Chọn phòng ban'}
									</Text>
									<Ionicons
										name={
											showDepartmentPicker
												? 'chevron-up'
												: 'chevron-down'
										}
										size={20}
										color={AppColors.textMuted}
									/>
								</TouchableOpacity>
								{showDepartmentPicker && (
									<YStack
										backgroundColor={AppColors.background}
										borderWidth={1}
										borderColor={AppColors.border}
										borderRadius="$3"
										maxHeight={200}
									>
										<ScrollView>
											{departments.map((dept) => (
												<TouchableOpacity
													key={dept}
													onPress={() => {
														setDepartment(dept);
														setShowDepartmentPicker(
															false
														);
													}}
													style={{
														padding: 12,
														borderBottomWidth: 1,
														borderBottomColor:
															AppColors.border,
													}}
												>
													<Text
														color={
															department === dept
																? AppColors.primary
																: AppColors.text
														}
														fontWeight={
															department === dept
																? '700'
																: '400'
														}
													>
														{dept}
													</Text>
												</TouchableOpacity>
											))}
										</ScrollView>
									</YStack>
								)}
							</YStack>

							{/* Position Picker */}
							<YStack gap="$2">
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									Chức vụ{' '}
									<Text color={AppColors.danger}>*</Text>
								</Text>
								<TouchableOpacity
									onPress={() =>
										setShowPositionPicker(
											!showPositionPicker
										)
									}
									style={{
										backgroundColor: AppColors.background,
										borderWidth: 1,
										borderColor: AppColors.border,
										borderRadius: 8,
										padding: 12,
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<Text
										color={
											position
												? AppColors.text
												: AppColors.textMuted
										}
									>
										{position || 'Chọn chức vụ'}
									</Text>
									<Ionicons
										name={
											showPositionPicker
												? 'chevron-up'
												: 'chevron-down'
										}
										size={20}
										color={AppColors.textMuted}
									/>
								</TouchableOpacity>
								{showPositionPicker && (
									<YStack
										backgroundColor={AppColors.background}
										borderWidth={1}
										borderColor={AppColors.border}
										borderRadius="$3"
										maxHeight={200}
									>
										<ScrollView>
											{positions.map((pos) => (
												<TouchableOpacity
													key={pos}
													onPress={() => {
														setPosition(pos);
														setShowPositionPicker(
															false
														);
													}}
													style={{
														padding: 12,
														borderBottomWidth: 1,
														borderBottomColor:
															AppColors.border,
													}}
												>
													<Text
														color={
															position === pos
																? AppColors.primary
																: AppColors.text
														}
														fontWeight={
															position === pos
																? '700'
																: '400'
														}
													>
														{pos}
													</Text>
												</TouchableOpacity>
											))}
										</ScrollView>
									</YStack>
								)}
							</YStack>

							{/* Joined Date */}
							<YStack gap="$2">
								<Text
									fontSize={14}
									fontWeight="600"
									color={AppColors.text}
								>
									Ngày vào làm{' '}
									<Text color={AppColors.danger}>*</Text>
								</Text>
								<TextInput
									value={joinedDate}
									onChangeText={setJoinedDate}
									placeholder="YYYY-MM-DD"
									placeholderTextColor={AppColors.textMuted}
									style={{
										backgroundColor: AppColors.background,
										borderWidth: 1,
										borderColor: AppColors.border,
										borderRadius: 8,
										padding: 12,
										fontSize: 15,
										color: AppColors.text,
									}}
								/>
							</YStack>
						</YStack>
					</ScrollView>

					{/* Actions */}
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
							onPress={onClose}
							pressStyle={{ opacity: 0.8 }}
							borderRadius="$3"
						>
							Hủy
						</Button>
						<Button
							flex={1}
							backgroundColor={AppColors.primary}
							color="white"
							onPress={handleSubmit}
							disabled={
								createMutation.isPending ||
								updateMutation.isPending
							}
							pressStyle={{ opacity: 0.8 }}
							borderRadius="$3"
						>
							{createMutation.isPending ||
							updateMutation.isPending
								? 'Đang xử lý...'
								: mode === 'create'
									? 'Tạo mới'
									: 'Cập nhật'}
						</Button>
					</XStack>
				</YStack>
			</YStack>
		</Modal>
	);
};

export default ToinUserFormModal;
