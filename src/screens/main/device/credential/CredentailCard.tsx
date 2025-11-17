import { AppColors } from '@/src/common/app-color';
import { CredentialResponse } from '@/src/services/credential';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Alert, Pressable } from 'react-native';
import { Button, Card, Separator, Text, XStack, YStack } from 'tamagui';

type CredentialCardProps = {
	credential: CredentialResponse;
	setEditingCredential: React.Dispatch<
		React.SetStateAction<{
			id: string | number;
			data?: CredentialResponse;
		} | null>
	>;
	onDelete?: (credentialId: string | number) => void;
};

export default function CredentialCard({
	credential,
	setEditingCredential,
	onDelete,
}: CredentialCardProps) {
	const [isExpanded, setIsExpanded] = React.useState<boolean>(false);
	const [showPassword, setShowPassword] = React.useState<boolean>(false);

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

	const handleDelete = () => {
		Alert.alert(
			'Xác nhận xóa',
			`Bạn có chắc chắn muốn xóa thông tin đăng nhập "${credential.username}"?`,
			[
				{
					text: 'Hủy',
					style: 'cancel',
				},
				{
					text: 'Xóa',
					style: 'destructive',
					onPress: () => onDelete?.(credential.id),
				},
			]
		);
	};

	return (
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
					<XStack alignItems="center" justifyContent="space-between">
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
							name={isExpanded ? 'chevron-up' : 'chevron-down'}
							size={20}
							color={AppColors.textMuted}
						/>
					</XStack>
				</Pressable>

				{/* Expanded Content */}
				{isExpanded && (
					<>
						<Separator
							borderColor={AppColors.border}
							marginVertical="$2"
						/>

						{/* Action Buttons */}
						<XStack gap="$2" marginBottom="$2">
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
								onPress={() =>
									setEditingCredential({
										id: credential.id,
										data: credential,
									})
								}
								height={32}
							>
								<Text color="white">Sửa</Text>
							</Button>

							{onDelete && (
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
							)}
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
								<XStack alignItems="center" gap="$2" flex={1}>
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
								<XStack alignItems="center" gap="$2" flex={1}>
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
										size="$1"
										circular
										chromeless
										icon={
											<Ionicons
												name={
													showPassword
														? 'eye-off-outline'
														: 'eye-outline'
												}
												size={14}
												color={AppColors.warning}
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
																: dept}
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
					</>
				)}
			</YStack>
		</Card>
	);
}
