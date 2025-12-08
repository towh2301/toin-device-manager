import { AppColors } from '@/src/common/app-color';
import { CredentialResponse } from '@/src/services/credential';
import {
	useLinkDeviceCredential,
	useUnlinkDeviceCredential,
} from '@/src/services/device/useDeviceMutations';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { Button, Card, Separator, Text, XStack, YStack } from 'tamagui';
import CredentialModal from './CredentialModal';

type CredentialCardProps = {
	deviceCredentialId: string;
	deviceId: string;
	credential: CredentialResponse;
	onDelete?: (credentialId: string | number) => void;
	onSuccess?: () => void; // Add this for refresh callback
	isSelectExisting: boolean;
	refetchDeviceCredentials: () => void;
};

export default function CredentialCard({
	deviceCredentialId,
	deviceId,
	credential,
	onDelete,
	onSuccess,
	isSelectExisting,
	refetchDeviceCredentials,
}: CredentialCardProps) {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [isShowModal, setIsShowModal] = useState(false);
	const [editingCredential, setEditingCredential] = useState<{
		id: string | number;
		data?: CredentialResponse;
	} | null>(null);

	const { mutate: linkDeviceCredential, isSuccess: isLinkSuccess } =
		useLinkDeviceCredential();

	const { mutate: unlinkDeviceCredential, isSuccess: isUnlinkSuccess } =
		useUnlinkDeviceCredential();

	const toggleExpand = () => {
		setIsExpanded((prev) => !prev);
		if (isExpanded) {
			setShowPassword(false);
		}
	};

	const handleCopyUsername = async () => {
		await Clipboard.setStringAsync(credential.username);
		Alert.alert('Copied', 'Username copied to clipboard');
	};

	const handleCopyPassword = async () => {
		await Clipboard.setStringAsync(credential.password);
		Alert.alert('Copied', 'Password copied to clipboard');
	};

	const handleShowPassword = () => {
		setShowPassword((prev) => !prev);
	};

	const handleUnlinkCredential = (credentialId: string) => {
		unlinkDeviceCredential(
			{ credentialId },
			{
				onSuccess: () => {
					refetchDeviceCredentials();

					// Gọi callback parent nếu cần refresh thêm
					onSuccess?.();

					setIsShowModal(false);
					setIsExpanded(false);
				},
				onError: () => {
					Alert.alert('Error', 'Fail to unlink credential');
				},
			}
		);
	};

	const handleEditSuccess = () => {
		setIsShowModal(false);
		setEditingCredential(null);
		Alert.alert('✓ Thành công', 'Cập nhật thông tin đăng nhập thành công');
		onSuccess?.(); // Trigger parent refresh
	};

	const handleLinkCredentials = ({
		deviceId,
		credentialId,
	}: {
		deviceId: string;
		credentialId: string;
	}) => {
		linkDeviceCredential(
			{ deviceId, credentialId },
			{
				onSuccess: () => {
					console.log('Refetched ngay lập tức!');
					refetchDeviceCredentials();

					// Gọi callback parent nếu cần refresh thêm
					onSuccess?.();

					setIsShowModal(false);
					setIsExpanded(false);
				},
				onError: () => {
					Alert.alert('Error', 'Fail to link credential');
				},
			}
		);
	};
	return (
		<>
			<Card
				backgroundColor={AppColors.background}
				borderWidth={1}
				borderColor={AppColors.border}
				borderRadius="$3"
				padding="$3"
			>
				<YStack gap="$2">
					{/* Header */}
					<Pressable onPress={toggleExpand}>
						<XStack
							alignItems="center"
							justifyContent="space-between"
						>
							<XStack alignItems="center" gap="$2" flex={1}>
								<YStack
									width={40}
									height={40}
									borderRadius="$2"
									backgroundColor={AppColors.info + '20'}
									alignItems="center"
									justifyContent="center"
								>
									<Ionicons
										name="key"
										size={20}
										color={AppColors.info}
									/>
								</YStack>

								<YStack flex={1}>
									<Text
										fontSize={14}
										fontWeight="700"
										color={AppColors.text}
										numberOfLines={1}
									>
										{credential.username}
									</Text>
									{credential.departments &&
										credential.departments.length > 0 && (
											<Text
												fontSize={11}
												color={AppColors.textMuted}
												numberOfLines={1}
											>
												{credential.departments.length}{' '}
												department(s)
											</Text>
										)}
								</YStack>
							</XStack>

							<Ionicons
								name={
									isExpanded ? 'chevron-up' : 'chevron-down'
								}
								size={20}
								color={AppColors.textMuted}
							/>
						</XStack>
					</Pressable>

					{/* Expanded Content */}
					{isExpanded && (
						<>
							{/* Action Buttons */}
							<XStack gap="$2" marginBottom="$2">
								{!isSelectExisting && (
									<>
										{/* <Separator
											borderColor={AppColors.border}
											marginVertical="$2"
										/>
										<Button
											flex={1}
											backgroundColor={AppColors.warning}
											icon={
												<Ionicons
													name="create-outline"
													size={16}
													color="white"
												/>
											}
											onPress={() => {
												setEditingCredential({
													id: credential.id,
													data: credential,
												});
												setIsShowModal(true);
											}}
											height={32}
										>
											<Text color="white">Sửa</Text>
										</Button> */}
									</>
								)}

								{/* {onDelete && (
									<Button
										flex={1}
										icon={
											<Ionicons
												name="trash-outline"
												size={16}
												color="white"
											/>
										}
										onPress={handleDelete}
										backgroundColor={AppColors.danger}
										height={32}
									>
										<Text color="white">Xóa</Text>
									</Button>
								)} */}
							</XStack>

							<Separator borderColor={AppColors.border} />

							{/* Credential Details */}
							<YStack gap="$2" marginTop="$2">
								<Text
									fontSize={12}
									fontWeight="700"
									color={AppColors.text}
								>
									Thông tin đăng nhập
								</Text>

								{/* Username */}
								<XStack alignItems="center" gap="$2">
									<Text
										fontSize={11}
										color={AppColors.textMuted}
										width={90}
									>
										Username:
									</Text>
									<XStack
										alignItems="center"
										gap="$2"
										flex={1}
									>
										<Text
											fontSize={11}
											fontWeight="600"
											color={AppColors.text}
											flex={1}
											numberOfLines={1}
										>
											{credential.username}
										</Text>
										<Button
											size="$1"
											circular
											chromeless
											icon={
												<Ionicons
													name="copy-outline"
													size={14}
													color={AppColors.info}
												/>
											}
											onPress={handleCopyUsername}
										/>
									</XStack>
								</XStack>

								{/* Password */}
								<XStack alignItems="center" gap="$2">
									<Text
										fontSize={11}
										color={AppColors.textMuted}
										width={90}
									>
										Password:
									</Text>
									<XStack
										alignItems="center"
										gap="$2"
										flex={1}
									>
										<Text
											fontSize={11}
											fontWeight="600"
											color={AppColors.text}
											flex={1}
											numberOfLines={1}
										>
											{showPassword
												? credential.password
												: '••••••••'}
										</Text>
										<Button
											size="$5"
											circular
											chromeless
											icon={
												<Ionicons
													name={
														showPassword
															? 'eye-off-outline'
															: 'eye-outline'
													}
													size={16}
													color={AppColors.dangerDark}
												/>
											}
											onPress={handleShowPassword}
										/>

										<Button
											size="$1"
											circular
											chromeless
											icon={
												<Ionicons
													name="copy-outline"
													size={14}
													color={AppColors.info}
												/>
											}
											onPress={handleCopyPassword}
										/>
									</XStack>
								</XStack>
							</YStack>

							{/* Departments */}
							{credential.departments &&
								credential.departments.length > 0 && (
									<>
										<Separator
											borderColor={AppColors.border}
											marginVertical="$2"
										/>
										<YStack gap="$2">
											<Text
												fontSize={12}
												fontWeight="700"
												color={AppColors.text}
											>
												Phòng ban
											</Text>
											<XStack flexWrap="wrap" gap="$2">
												{credential.departments.map(
													(dept, index) => (
														<YStack
															key={index}
															backgroundColor={
																AppColors.info +
																'15'
															}
															borderRadius="$2"
															paddingHorizontal="$2"
															paddingVertical="$1"
														>
															<Text
																fontSize={11}
																color={
																	AppColors.info
																}
																fontWeight="600"
															>
																{typeof dept ===
																'string'
																	? dept
																	: (
																			dept as any
																		).name}
															</Text>
														</YStack>
													)
												)}
											</XStack>
										</YStack>
									</>
								)}

							{/* Allowed Folders */}
							{credential.allowedFolders &&
								credential.allowedFolders.length > 0 && (
									<>
										<Separator
											borderColor={AppColors.border}
											marginVertical="$2"
										/>
										<YStack gap="$2">
											<Text
												fontSize={12}
												fontWeight="700"
												color={AppColors.text}
											>
												Thư mục được phép truy cập
											</Text>
											<YStack gap="$1">
												{credential.allowedFolders.map(
													(folder, index) => (
														<XStack
															key={index}
															alignItems="center"
															gap="$2"
														>
															<Ionicons
																name="folder-outline"
																size={14}
																color={
																	AppColors.textMuted
																}
															/>
															<Text
																fontSize={11}
																color={
																	AppColors.text
																}
																flex={1}
															>
																{folder}
															</Text>
														</XStack>
													)
												)}
											</YStack>
										</YStack>
									</>
								)}
							<YStack height={'auto'}>
								<XStack
									flex={1}
									justifyContent="flex-end"
									height={'auto'}
									gap={30}
								>
									{!isSelectExisting && (
										<Button
											flex={1}
											backgroundColor={AppColors.danger}
											height={32}
											onPress={
												() =>
													handleUnlinkCredential(
														deviceCredentialId
													)
												// deviceCre.id
											}
										>
											<Text color="white">Xóa</Text>
										</Button>
									)}

									{isSelectExisting && (
										<Button
											flex={1}
											backgroundColor={
												AppColors.successDark
											}
											height={32}
											onPress={() =>
												handleLinkCredentials({
													deviceId: deviceId,
													credentialId: credential.id,
												})
											}
										>
											<Text color="white">Thêm</Text>
										</Button>
									)}
								</XStack>
							</YStack>
						</>
					)}
				</YStack>
			</Card>

			{/* Modal hiển thị khi edit */}
			{isShowModal && editingCredential && (
				<CredentialModal
					deviceId={deviceId}
					visible={isShowModal}
					credentialId={String(credential.id)}
					editingCredential={editingCredential}
					onClose={() => {
						setIsShowModal(false);
						setEditingCredential(null);
					}}
					onSuccess={handleEditSuccess}
					refetchDeviceCredentials={refetchDeviceCredentials}
				/>
			)}
		</>
	);
}
