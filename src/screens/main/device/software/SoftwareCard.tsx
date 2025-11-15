import { AppColors } from '@/src/common/app-color';
import { DeviceSoftwareResponse } from '@/src/services';
import { SoftwareResponse } from '@/src/services/software';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Alert, Pressable } from 'react-native';
import { Button, Card, Separator, Text, XStack, YStack } from 'tamagui';

type SoftwareCardProps = {
	setEditingSoftware: React.Dispatch<
		React.SetStateAction<{ id: string; data?: SoftwareResponse } | null>
	>;
	deviceSoftware: DeviceSoftwareResponse;
	software?: SoftwareResponse | undefined;
	deviceId: string;
	handleUnlinkSoftware?: any;
};

export default function SoftwareCard({
	software,
	setEditingSoftware,
	deviceSoftware,
	deviceId,
	handleUnlinkSoftware,
}: SoftwareCardProps) {
	const [expandedSoftware, setExpandedSoftware] = React.useState<string[]>(
		[]
	);

	// Get the software ID - handle both populated object and string ID
	const softwareId =
		typeof deviceSoftware.software === 'object'
			? (deviceSoftware.software as any)?._id
			: deviceSoftware.software;

	console.log('🔍 [SoftwareCard] Initialized:', {
		'deviceSoftware.id': deviceSoftware.id,
		'deviceSoftware.software': deviceSoftware.software,
		'typeof deviceSoftware.software': typeof deviceSoftware.software,
		softwareId,
		'software prop': software,
		deviceId,
	});

	const isExpanded = expandedSoftware.includes(deviceSoftware.id);

	const toggleSoftwareExpand = (softwareId: string) => {
		setExpandedSoftware((prev) =>
			prev.includes(softwareId)
				? prev.filter((id) => id !== softwareId)
				: [...prev, softwareId]
		);
	};

	return (
		<Card
			// Only key on Card if it's in a list (in parent .map())
			backgroundColor={AppColors.background}
			borderWidth={1}
			borderColor={AppColors.border}
			borderRadius="$3"
			padding="$3"
		>
			<YStack gap="$2">
				{/* Header */}
				<Pressable
					onPress={() => toggleSoftwareExpand(deviceSoftware.id)}
				>
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
								<Text fontSize={18}>CD</Text>
							</YStack>

							<YStack flex={1}>
								<Text
									fontSize={14}
									fontWeight="700"
									color={AppColors.text}
								>
									{software?.name ??
										`Software #${deviceSoftware.softwareId}`}
								</Text>
								{software?.version && (
									<Text
										fontSize={11}
										color={AppColors.textMuted}
									>
										Version: {software.version}
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
									setEditingSoftware({
										id:
											(software as any)?._id ||
											software?.id ||
											'',
										data: software,
									})
								}
								height={32}
							>
								<Text color="white">Sửa</Text>
							</Button>

							<Button
								flex={1}
								icon={
									<Ionicons
										name="unlink-outline"
										size={16}
										color="white"
									/>
								}
								onPress={() => {
									// Lấy software ID từ _id (MongoDB format)
									const actualSoftwareId =
										(typeof deviceSoftware.software ===
										'object'
											? (deviceSoftware.software as any)
													?._id ||
												deviceSoftware.software?.id
											: deviceSoftware.software) || '';

									console.log('🔘 [Unlink Button] Click:', {
										'deviceSoftware.software':
											deviceSoftware.software,
										actualSoftwareId,
										deviceId,
									});

									if (!actualSoftwareId) {
										Alert.alert(
											'Lỗi',
											'Không tìm thấy Software ID'
										);
										return;
									}

									handleUnlinkSoftware(
										actualSoftwareId,
										software?.name ??
											`Software #${deviceSoftware.id}`
									);
								}}
								backgroundColor={AppColors.retired}
								height={32}
								width="auto"
							>
								<Text color="white">Gỡ</Text>
							</Button>
						</XStack>
						<Separator borderColor={AppColors.border} />

						{/* Software Details */}
						<YStack gap="$2" marginTop="$2">
							{software?.licenseKey && (
								<XStack alignItems="center" gap="$2">
									<Text
										fontSize={11}
										color={AppColors.textMuted}
										width={90}
									>
										License Key:
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
											{software.licenseKey}
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
											onPress={() =>
												Clipboard.setStringAsync(
													software?.licenseKey ?? ''
												)
											}
										/>
									</XStack>
								</XStack>
							)}

							{software?.purchaseDate && (
								<XStack alignItems="center" gap="$2">
									<Text
										fontSize={11}
										color={AppColors.textMuted}
										width={90}
									>
										Purchase Date:
									</Text>
									<Text
										fontSize={11}
										color={AppColors.text}
										fontWeight="600"
									>
										{new Date(
											software.purchaseDate
										).toLocaleDateString('vi-VN')}
									</Text>
								</XStack>
							)}

							{software?.expiredDate && (
								<XStack alignItems="center" gap="$2">
									<Text
										fontSize={11}
										color={AppColors.textMuted}
										width={90}
									>
										Expiry Date:
									</Text>
									<Text
										fontSize={11}
										color={
											new Date(software.expiredDate) <
											new Date()
												? AppColors.danger
												: AppColors.success
										}
										fontWeight="600"
									>
										{new Date(
											software?.expiredDate
										).toLocaleDateString('vi-VN')}
										{new Date(software?.expiredDate) <
											new Date() && ' (Hết hạn)'}
									</Text>
								</XStack>
							)}

							{software?.plan && (
								<XStack alignItems="center" gap="$2">
									<Text
										fontSize={11}
										color={AppColors.textMuted}
										width={90}
									>
										Plan:
									</Text>
									<Text
										fontSize={11}
										color={AppColors.text}
										fontWeight="600"
									>
										{software.plan}
									</Text>
								</XStack>
							)}
						</YStack>
						{/* Account Info */}
						{software?.account && (
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
										Account Login
									</Text>

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
											>
												{software.account.username}
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
												onPress={() =>
													Clipboard.setStringAsync(
														software?.account
															?.username ?? ''
													)
												}
											/>
										</XStack>
									</XStack>

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
											></Text>
											<Button
												size="$1"
												circular
												chromeless
												icon={
													<Ionicons
														name="eye-outline"
														size={14}
														color={
															AppColors.warning
														}
													/>
												}
												onPress={() =>
													Alert.alert(
														'Password',
														software.account
															?.password ?? 'N/A'
													)
												}
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
												onPress={() =>
													Clipboard.setStringAsync(
														software.account
															?.password ?? ''
													)
												}
											/>
										</XStack>
									</XStack>

									{software.account.relatedEmail && (
										<XStack alignItems="center" gap="$2">
											<Text
												fontSize={11}
												color={AppColors.textMuted}
												width={90}
											>
												Email:
											</Text>
											<Text
												fontSize={11}
												color={AppColors.text}
												flex={1}
											>
												{software.account.relatedEmail}
											</Text>
										</XStack>
									)}

									{software.account.note && (
										<XStack
											alignItems="flex-start"
											gap="$2"
										>
											<Text
												fontSize={11}
												color={AppColors.textMuted}
												width={90}
											>
												Note:
											</Text>
											<Text
												fontSize={11}
												color={AppColors.textSecondary}
												flex={1}
											>
												{software.account.note}
											</Text>
										</XStack>
									)}
								</YStack>
							</>
						)}
						{/* Install Date */}
						<XStack alignItems="center" gap="$2" marginTop="$2">
							<Text fontSize={11} color={AppColors.textMuted}>
								Installed:{' '}
								{deviceSoftware.installedDate
									? new Date(
											deviceSoftware.installedDate
										).toLocaleDateString('vi-VN')
									: 'N/A'}
							</Text>
						</XStack>
					</>
				)}
			</YStack>
		</Card>
	);
}
