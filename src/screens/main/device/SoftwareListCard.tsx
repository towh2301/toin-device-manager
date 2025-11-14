import { AppColors } from '@/src/common/app-color';
import { DeviceSoftwareResponse } from '@/src/services';
import { SoftwareResponse } from '@/src/services/software';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Alert, Pressable } from 'react-native';
import { Button, Card, Separator, Text, XStack, YStack } from 'tamagui';

type SoftwareCardProps = {
	handleDeleteSoftware: (softwareId: string, softwareName: string) => void;
	handleUnlinkSoftware: (softwareId: string, softwareName: string) => void;
	setEditingSoftware: React.Dispatch<
		React.SetStateAction<{ id: string; data: any } | null>
	>;
	deviceSoftware: DeviceSoftwareResponse;
	software?: SoftwareResponse | undefined;
};

export default function SoftwareCard({
	handleDeleteSoftware,
	handleUnlinkSoftware,
	deviceSoftware,
	software,
	setEditingSoftware,
}: SoftwareCardProps) {
	const [expandedSoftware, setExpandedSoftware] = React.useState<string[]>(
		[]
	);

	const toggleSoftwareExpand = (softwareId: string) => {
		setExpandedSoftware((prev) =>
			prev.includes(softwareId)
				? prev.filter((id) => id !== softwareId)
				: [...prev, softwareId]
		);
	};

	const isExpanded = expandedSoftware.includes(deviceSoftware.softwareId);

	return (
		<Card
			key={deviceSoftware.softwareId}
			backgroundColor={AppColors.background}
			borderWidth={1}
			borderColor={AppColors.border}
			borderRadius="$3"
			padding="$3"
		>
			<YStack gap="$2" key={deviceSoftware.softwareId}>
				{/* Software Header - Clickable to expand/collapse */}
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
								<Text fontSize={18}>💿</Text>
							</YStack>
							<YStack flex={1}>
								<Text
									fontSize={14}
									fontWeight="700"
									color={AppColors.text}
								>
									{software?.name ||
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
						<XStack alignItems="center" gap="$1">
							<Ionicons
								name={
									isExpanded ? 'chevron-up' : 'chevron-down'
								}
								size={20}
								color={AppColors.textMuted}
							/>
						</XStack>
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
								size="$2"
								backgroundColor={AppColors.warning}
								color="white"
								icon={
									<Ionicons
										name="create-outline"
										size={16}
										color="white"
									/>
								}
								onPress={() =>
									setEditingSoftware({
										id: software?.id || '',
										data: software,
									})
								}
								height={32}
							>
								Sửa
							</Button>
							<Button
								flex={1}
								size="$2"
								backgroundColor={AppColors.danger}
								color="white"
								icon={
									<Ionicons
										name="trash-outline"
										size={16}
										color="white"
									/>
								}
								onPress={() =>
									handleDeleteSoftware(
										software?.id || '',
										software?.name ||
											`Software #${deviceSoftware.softwareId}`
									)
								}
								height={32}
							>
								Xóa
							</Button>
							<Button
								flex={1}
								size="$2"
								backgroundColor={AppColors.info}
								color="white"
								icon={
									<Ionicons
										name="unlink-outline"
										size={16}
										color="white"
									/>
								}
								onPress={() =>
									handleUnlinkSoftware(
										deviceSoftware.softwareId,
										software?.name ||
											`Software #${deviceSoftware.softwareId}`
									)
								}
								height={32}
							>
								Gỡ
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
													software.licenseKey || ''
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
											software.expiredDate
										).toLocaleDateString('vi-VN')}
										{new Date(software.expiredDate) <
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

						{/* Account Info (if exists) */}
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
										🔐 Account Login
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
														software.account
															?.username || ''
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
											>
												••••••••
											</Text>
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
															?.password || 'N/A'
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
															?.password || ''
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
								📅 Installed:{' '}
								{new Date(
									deviceSoftware.installedDate
								).toLocaleDateString('vi-VN')}
							</Text>
						</XStack>
					</>
				)}
			</YStack>
		</Card>
	);
}
