import { AppColors } from '@/src/common/app-color';
import {
	CredentialResponse,
	useCreateCredential,
	useUpdateCredential,
} from '@/src/services/credential';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Modal } from 'react-native';
import { Button, Card, Input, ScrollView, Text, XStack, YStack } from 'tamagui';

interface CredentialModalProps {
	visible: boolean;
	onClose: () => void;
	onSuccess: () => void;
	editingCredential?: {
		id: string | number;
		data?: CredentialResponse;
	} | null;
}

export default function CredentialModal({
	visible,
	onClose,
	onSuccess,
	editingCredential,
}: CredentialModalProps) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [departments, setDepartments] = useState('');
	const [allowedFolders, setAllowedFolders] = useState('');

	const createCredentialMutation = useCreateCredential();
	const updateCredentialMutation = useUpdateCredential();

	const isEditMode = !!editingCredential?.id;

	useEffect(() => {
		if (editingCredential?.data) {
			const { data } = editingCredential;
			setUsername(data.username || '');
			setPassword(data.password || '');
			setDepartments(
				data.departments
					?.map((d) => (typeof d === 'string' ? d : d))
					.join(', ') || ''
			);
			setAllowedFolders(data.allowedFolders?.join(', ') || '');
		} else {
			resetForm();
		}
	}, [editingCredential]);

	const resetForm = () => {
		setUsername('');
		setPassword('');
		setShowPassword(false);
		setDepartments('');
		setAllowedFolders('');
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const handleSubmit = async () => {
		if (!username.trim())
			return Alert.alert('Lỗi', 'Vui lòng nhập username');
		if (!password.trim())
			return Alert.alert('Lỗi', 'Vui lòng nhập password');

		try {
			const data: any = {
				username: username.trim(),
				password: password.trim(),
			};

			if (departments.trim()) {
				data.departments = departments
					.split(',')
					.map((d) => d.trim())
					.filter(Boolean);
			}

			if (allowedFolders.trim()) {
				data.allowedFolders = allowedFolders
					.split(',')
					.map((d) => d.trim())
					.filter(Boolean);
			}

			// if (isEditMode) {
			//   await updateCredentialMutation.mutateAsync({
			//     id: editingCredential.id as any,
			//     data,
			//   });
			// } else {
			//   await createCredentialMutation.mutateAsync(data);
			// }

			onSuccess();
			handleClose();
		} catch (err) {
			Alert.alert('Lỗi', 'Cập nhật thông tin thất bại!');
		}
	};

	const Section = ({ title, children }: any) => (
		<YStack
			gap="$3"
			backgroundColor={AppColors.background}
			borderRadius="$4"
			padding="$3"
			borderWidth={1}
			borderColor={AppColors.border}
		>
			<Text fontSize={13} fontWeight="700" color={AppColors.text}>
				{title}
			</Text>
			{children}
		</YStack>
	);

	const Label = ({ children }: any) => (
		<Text fontSize={12} fontWeight="600" color={AppColors.textSecondary}>
			{children}
		</Text>
	);

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={handleClose}
		>
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				backgroundColor={'rgba(0,0,0,0.3)'}
				padding="$4"
			>
				<Card
					width="92%"
					maxWidth={520}
					maxHeight="85%"+
					padding="$4"
					borderRadius="$6"
					backgroundColor={AppColors.background}
					shadowColor={'black'}
					shadowRadius={20}
					shadowOffset={{ height: 10, width: 0 }}
				>
					{/* Header */}
					<XStack
						justifyContent="space-between"
						alignItems="center"
						marginBottom="$3"
					>
						<Text
							fontSize={18}
							fontWeight="700"
							color={AppColors.text}
						>
							{isEditMode
								? '✏️ Chỉnh sửa thông tin'
								: '🔑 Thêm thông tin đăng nhập'}
						</Text>
					</XStack>

					{/* FORM */}
					<ScrollView>
						<YStack gap="$4" backgroundColor={AppColors.background}>
							{/* MAIN CREDENTIAL SECTION */}
							<Section title="🔐 Thông tin đăng nhập bắt buộc">
								{/* Username */}
								<YStack gap="$1">
									<Label>
										Username{' '}
										<Text color={AppColors.danger}>*</Text>
									</Label>
									<Input
										value={username}
										onChangeText={setUsername}
										placeholder="VD: admin@company.com"
										placeholderTextColor={
											AppColors.textMuted
										}
										autoCapitalize="none"
										height={40}
									/>
								</YStack>

								{/* Password */}
								<YStack gap="$1">
									<Label>
										Password{' '}
										<Text color={AppColors.danger}>*</Text>
									</Label>
									<XStack alignItems="center">
										<Input
											flex={1}
											value={password}
											onChangeText={setPassword}
											placeholder="Nhập password"
											placeholderTextColor={
												AppColors.textMuted
											}
											secureTextEntry={!showPassword}
											autoCapitalize="none"
											height={40}
										/>
										<Button
											chromeless
											onPress={() =>
												setShowPassword(!showPassword)
											}
											height="$5"
										>
											<Ionicons
												name={
													showPassword
														? 'eye-off-outline'
														: 'eye-outline'
												}
												size={20}
												color={AppColors.textMuted}
											/>
										</Button>
									</XStack>
								</YStack>
							</Section>

							{/* EXTRA INFO SECTION */}
							<Section title="📋 Thông tin bổ sung (Optional)">
								{/* Departments */}
								<YStack gap="$1">
									<Label>Phòng ban</Label>
									<Input
										value={departments}
										onChangeText={setDepartments}
										placeholder="VD: IT, HR, Finance"
										placeholderTextColor={
											AppColors.textMuted
										}
										height={40}
									/>

									<Text
										fontSize={10}
										color={AppColors.textMuted}
										fontStyle="italic"
									>
										Ngăn cách bằng dấu phẩy
									</Text>
								</YStack>

								{/* Allowed Folders */}
								<YStack gap="$1">
									<Label>Thư mục được phép truy cập</Label>
									<Input
										value={allowedFolders}
										onChangeText={setAllowedFolders}
										placeholder="VD: /shared/docs, /reports"
										placeholderTextColor={
											AppColors.textMuted
										}
										multiline
										numberOfLines={3}
										textAlignVertical="top"
									/>
									<Text
										fontSize={10}
										color={AppColors.textMuted}
										fontStyle="italic"
									>
										Ngăn cách bằng dấu phẩy
									</Text>
								</YStack>
							</Section>
						</YStack>
					</ScrollView>

					{/* ACTIONS */}
					<XStack gap="$2" marginTop="$4">
						<Button
							flex={1}
							backgroundColor={AppColors.border}
							borderRadius="$3"
							onPress={handleClose}
							height={40}
						>
							<Text fontWeight="600" color={AppColors.text}>
								Hủy
							</Text>
						</Button>

						<Button
							flex={1}
							backgroundColor={
								username.trim() && password.trim()
									? AppColors.primary
									: AppColors.border
							}
							borderRadius="$3"
							disabled={!username.trim() || !password.trim()}
							onPress={handleSubmit}
							height={40}
						>
							<Text fontWeight="600" color="white">
								{isEditMode ? '✓ Cập nhật' : '✓ Tạo mới'}
							</Text>
						</Button>
					</XStack>
				</Card>
			</YStack>
		</Modal>
	);
}
