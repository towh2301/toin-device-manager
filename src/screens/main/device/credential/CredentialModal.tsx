import { AppColors } from '@/src/common/app-color';
import { Department } from '@/src/services';
import {
	CredentialResponse,
	CredentialUpdatePayload,
	useCreateCredential,
	useUpdateCredential,
} from '@/src/services/credential';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, TextInput } from 'react-native';
import { Button, Card, ScrollView, Text, XStack, YStack } from 'tamagui';
import CredentialCard from './CredentialCard';

interface CredentialModalProps {
	deviceId: string;
	credentialId?: string;
	visible: boolean;
	onClose: () => void;
	onSuccess: () => void;
	editingCredential?: {
		id: string | number;
		data?: CredentialResponse;
	} | null;
	credentials?: CredentialResponse[];
}

export default function CredentialModal({
	deviceId,
	credentialId,
	visible,
	onClose,
	onSuccess,
	editingCredential,
	credentials,
}: CredentialModalProps) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [departments, setDepartments] = useState('');
	const [isNewCredential, setIsNewCredential] = useState(false);
	const [allowedFolders, setAllowedFolders] = useState('');
	const [showDepartmentSuggestions, setShowDepartmentSuggestions] =
		useState(false);
	const [selectedDepartments, setSelectedDepartments] = useState<
		Department[]
	>([]);

	const createCredentialMutation = useCreateCredential();
	const updateCredentialMutation = useUpdateCredential();

	const isEditMode = !!editingCredential?.id;

	// Danh sách các phòng ban có sẵn
	const availableDepartments = Object.values(Department);

	useEffect(() => {
		if (editingCredential?.data) {
			const { data } = editingCredential;
			setUsername(data.username || '');
			setPassword(data.password || '');

			if (data.departments && Array.isArray(data.departments)) {
				const deptStrings = data.departments
					.map((d: any) => {
						if (typeof d === 'string') return d;
						if (d && typeof d === 'object' && d.name) return d.name;
						return null;
					})
					.filter(Boolean);

				setDepartments(deptStrings.join(', '));
				setSelectedDepartments(deptStrings as Department[]);
			}

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
		setSelectedDepartments([]);
		setShowDepartmentSuggestions(false);
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	const toggleDepartment = (dept: Department) => {
		setSelectedDepartments((prev) => {
			const updated = prev.includes(dept)
				? prev.filter((d) => d !== dept)
				: [...prev, dept];

			setDepartments(updated.join(', '));
			return updated;
		});
	};

	const handleSubmit = async () => {
		if (!username.trim())
			return Alert.alert('Lỗi', 'Vui lòng nhập username');
		if (!password.trim())
			return Alert.alert('Lỗi', 'Vui lòng nhập password');

		try {
			const data: CredentialUpdatePayload = {
				username: username.trim(),
				password: password.trim(),
			};

			// Sử dụng selectedDepartments thay vì parse từ string
			if (selectedDepartments.length > 0) {
				data.departments = selectedDepartments;
			}

			if (allowedFolders.trim()) {
				data.allowedFolders = allowedFolders
					.split(',')
					.map((d) => d.trim())
					.filter(Boolean);
			}

			if (isEditMode) {
				await updateCredentialMutation.mutateAsync({
					credentialId: credentialId || '',
					payload: data,
				});
			} else {
				await createCredentialMutation.mutateAsync(data);
			}

			onSuccess();
			handleClose();
		} catch (err: any) {
			Alert.alert('Lỗi', err?.message || 'Cập nhật thông tin thất bại!');
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
								{isEditMode
									? '✏️ Chỉnh sửa thông tin'
									: '🔑 Thêm thông tin đăng nhập'}
							</Text>
						</XStack>

						{/* Toggle Buttons */}
						<XStack
							gap="$2"
							backgroundColor={AppColors.background}
							padding="$1"
							borderRadius="$3"
						>
							<Button
								flex={1}
								size="$3"
								backgroundColor={
									!isNewCredential
										? AppColors.primary
										: 'transparent'
								}
								borderRadius="$2"
								onPress={() => setIsNewCredential(false)}
								pressStyle={{
									scale: 0.98,
								}}
								height={30}
							>
								<Text
									fontSize={13}
									fontWeight="600"
									color={
										!isNewCredential
											? 'white'
											: AppColors.textSecondary
									}
								>
									Chọn có sẵn
								</Text>
							</Button>
							<Button
								flex={1}
								size="$3"
								backgroundColor={
									isNewCredential
										? AppColors.primary
										: 'transparent'
								}
								borderRadius="$2"
								onPress={() => setIsNewCredential(true)}
								pressStyle={{
									scale: 0.98,
								}}
								height={30}
							>
								<Text
									fontSize={13}
									fontWeight="600"
									color={
										isNewCredential
											? 'white'
											: AppColors.textSecondary
									}
								>
									Tạo mới
								</Text>
							</Button>
						</XStack>

						{/*
						 *
						 * Form and Existing data
						 *
						 */}

						{isNewCredential && (
							<>
								<ScrollView
									style={{ flex: 1 }}
									showsVerticalScrollIndicator={false}
								>
									<YStack gap="$3" paddingRight="$1">
										{/* MAIN CREDENTIAL SECTION */}
										<YStack
											gap="$3"
											backgroundColor={
												AppColors.background
											}
											padding="$3"
											borderRadius="$3"
										>
											<Text
												fontSize={13}
												fontWeight="700"
												color={AppColors.text}
											>
												🔐 Thông tin đăng nhập bắt buộc
											</Text>

											{/* Username */}
											<YStack gap="$2">
												<Text
													fontSize={12}
													fontWeight="600"
													color={
														AppColors.textSecondary
													}
												>
													Username{' '}
													<Text
														color={AppColors.danger}
													>
														*
													</Text>
												</Text>
												<Card
													backgroundColor="white"
													borderWidth={1}
													borderColor={
														AppColors.border
													}
													borderRadius="$2"
													padding="$2.5"
												>
													<TextInput
														placeholder="VD: admin@company.com"
														placeholderTextColor={
															AppColors.textMuted
														}
														value={username}
														onChangeText={
															setUsername
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

											{/* Password */}
											<YStack gap="$2">
												<Text
													fontSize={12}
													fontWeight="600"
													color={
														AppColors.textSecondary
													}
												>
													Password{' '}
													<Text
														color={AppColors.danger}
													>
														*
													</Text>
												</Text>
												<Card
													backgroundColor="white"
													borderWidth={1}
													borderColor={
														AppColors.border
													}
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
															value={password}
															onChangeText={
																setPassword
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
										</YStack>

										{/* EXTRA INFO SECTION */}
										<YStack
											gap="$3"
											backgroundColor={
												AppColors.info + '10'
											}
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
												📋 Thông tin bổ sung (Optional)
											</Text>

											{/* Departments */}
											<YStack gap="$2">
												<Text
													fontSize={12}
													fontWeight="600"
													color={
														AppColors.textSecondary
													}
												>
													Phòng ban
												</Text>

												{/* Selected Departments Display */}
												{selectedDepartments.length >
													0 && (
													<XStack
														flexWrap="wrap"
														gap="$2"
														marginBottom="$2"
													>
														{selectedDepartments.map(
															(dept) => (
																<XStack
																	key={dept}
																	backgroundColor={
																		AppColors.primary +
																		'20'
																	}
																	borderRadius="$2"
																	paddingHorizontal="$2"
																	paddingVertical="$1"
																	alignItems="center"
																	gap="$1"
																>
																	<Text
																		fontSize={
																			11
																		}
																		color={
																			AppColors.primary
																		}
																		fontWeight="600"
																	>
																		{dept}
																	</Text>
																	<Button
																		size="$1"
																		circular
																		chromeless
																		padding={
																			0
																		}
																		onPress={() =>
																			toggleDepartment(
																				dept
																			)
																		}
																	>
																		<Ionicons
																			name="close-circle"
																			size={
																				14
																			}
																			color={
																				AppColors.primary
																			}
																		/>
																	</Button>
																</XStack>
															)
														)}
													</XStack>
												)}

												<Card
													backgroundColor="white"
													borderWidth={1}
													borderColor={
														AppColors.border
													}
													borderRadius="$2"
													padding="$2.5"
													onPress={() =>
														setShowDepartmentSuggestions(
															!showDepartmentSuggestions
														)
													}
												>
													<XStack
														alignItems="center"
														justifyContent="space-between"
													>
														<Text
															fontSize={13}
															color={
																selectedDepartments.length >
																0
																	? AppColors.text
																	: AppColors.textMuted
															}
														>
															{selectedDepartments.length >
															0
																? `Đã chọn ${selectedDepartments.length} phòng ban`
																: 'Chọn phòng ban'}
														</Text>
														<Ionicons
															name={
																showDepartmentSuggestions
																	? 'chevron-up'
																	: 'chevron-down'
															}
															size={16}
															color={
																AppColors.textMuted
															}
														/>
													</XStack>
												</Card>

												{/* Department Suggestions Dropdown */}
												{showDepartmentSuggestions && (
													<Card
														backgroundColor="white"
														borderWidth={1}
														borderColor={
															AppColors.border
														}
														borderRadius="$2"
														padding="$2"
														marginTop="$1"
													>
														<YStack gap="$1">
															{availableDepartments.map(
																(dept) => (
																	<Button
																		key={
																			dept
																		}
																		size="$3"
																		backgroundColor={
																			selectedDepartments.includes(
																				dept
																			)
																				? AppColors.primary +
																					'15'
																				: 'transparent'
																		}
																		borderRadius="$2"
																		justifyContent="flex-start"
																		onPress={() =>
																			toggleDepartment(
																				dept
																			)
																		}
																		pressStyle={{
																			backgroundColor:
																				AppColors.primary +
																				'10',
																		}}
																		height={
																			30
																		}
																	>
																		<XStack
																			alignItems="center"
																			gap="$2"
																			flex={
																				1
																			}
																		>
																			<Ionicons
																				name={
																					selectedDepartments.includes(
																						dept
																					)
																						? 'checkbox'
																						: 'square-outline'
																				}
																				size={
																					18
																				}
																				color={
																					selectedDepartments.includes(
																						dept
																					)
																						? AppColors.primary
																						: AppColors.textMuted
																				}
																			/>
																			<Text
																				fontSize={
																					13
																				}
																				color={
																					selectedDepartments.includes(
																						dept
																					)
																						? AppColors.primary
																						: AppColors.text
																				}
																				fontWeight={
																					selectedDepartments.includes(
																						dept
																					)
																						? '600'
																						: '400'
																				}
																			>
																				{
																					dept
																				}
																			</Text>
																		</XStack>
																	</Button>
																)
															)}
														</YStack>
													</Card>
												)}

												<Text
													fontSize={10}
													color={AppColors.textMuted}
													fontStyle="italic"
												>
													Chọn các phòng ban được phép
													truy cập
												</Text>
											</YStack>

											{/* Allowed Folders */}
											<YStack gap="$2">
												<Text
													fontSize={12}
													fontWeight="600"
													color={
														AppColors.textSecondary
													}
												>
													Thư mục được phép truy cập
												</Text>
												<Card
													backgroundColor="white"
													borderWidth={1}
													borderColor={
														AppColors.border
													}
													borderRadius="$2"
													padding="$2.5"
												>
													<TextInput
														placeholder="VD: /shared/docs, /reports"
														placeholderTextColor={
															AppColors.textMuted
														}
														value={allowedFolders}
														onChangeText={
															setAllowedFolders
														}
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
												<Text
													fontSize={10}
													color={AppColors.textMuted}
													fontStyle="italic"
												>
													Ngăn cách bằng dấu phẩy
												</Text>
											</YStack>
										</YStack>
									</YStack>
								</ScrollView>
								<XStack gap="$2" marginTop="$2">
									<Button
										flex={1}
										backgroundColor={
											AppColors.dangerDark + 30
										}
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
											username.trim() && password.trim()
												? AppColors.primary
												: AppColors.border
										}
										borderRadius="$3"
										disabled={
											!username.trim() || !password.trim()
										}
										onPress={handleSubmit}
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
											{isEditMode
												? '✓ Cập nhật'
												: '✓ Tạo mới'}
										</Text>
									</Button>
								</XStack>
							</>
						)}

						{!isNewCredential && (
							<YStack flex={1} marginTop="$2" gap="$5">
								{/* Scroll content */}
								<YStack flex={1}>
									<ScrollView
										showsVerticalScrollIndicator={false}
										contentContainerStyle={{
											gap: 10,
											paddingBottom: 20,
										}} // tránh overlap
									>
										{credentials?.map(
											(credential, index) => (
												<CredentialCard
													key={index}
													deviceId={''}
													credential={credential}
													isSelectExisting={true}
												/>
											)
										)}
									</ScrollView>
								</YStack>

								{/* Button bottom */}
								<YStack>
									<Button
										backgroundColor={
											AppColors.dangerDark + 30
										}
										borderWidth={1}
										borderColor={AppColors.border}
										borderRadius="$2"
										onPress={handleClose}
										height={40}
									>
										<Text
											fontSize={14}
											fontWeight="600"
											color={AppColors.text}
										>
											Hủy
										</Text>
									</Button>
								</YStack>
							</YStack>
						)}
					</YStack>
				</YStack>
			</YStack>
		</Modal>
	);
}
