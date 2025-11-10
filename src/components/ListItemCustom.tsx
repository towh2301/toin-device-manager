import { DeviceResponse } from '@/src/services/device/types';
import { Calendar, IdCard, MoreVertical } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Button, Card, Text, XStack, YStack } from 'tamagui';
import { AppColors } from '../common/app-color';
import { InfoChip } from './InfoChip';
import { StatusBadge } from './StatusBadge';
import { TypeBadge } from './TypeBadge';

type CustomCardProps = {
	imageSrc?: string;
	details: DeviceResponse;
	onMenuPress?: () => void;
	viewDetail?: (deviceSerialNumber: string) => void;
};

// --- MAIN LIST ITEM ---
export const CustomListItem = ({
	imageSrc,
	details: { name, brand, type, status, serialNumber, purchasedDate },
	onMenuPress,
	viewDetail,
}: CustomCardProps) => {
	const [pressed, setPressed] = useState(false);

	return (
		<YStack>
			<Card
				shadowColor={AppColors.shadowMedium}
				shadowOpacity={1}
				shadowRadius={8}
				elevation={3}
				borderRadius="$8"
				borderWidth={1}
				borderColor={AppColors.border}
				backgroundColor={AppColors.surface}
				overflow="hidden"
				width="100%"
				pressStyle={{ scale: 0.98, borderColor: AppColors.primary }}
				animation="quick"
				onPress={() => {
					if (viewDetail && serialNumber) {
						viewDetail(serialNumber);
					}
				}}
			>
				<YStack padding="$4" gap="$3">
					{/* Header Row */}
					<XStack
						justifyContent="space-between"
						alignItems="flex-start"
					>
						<XStack gap="$3" flex={1}>
							{/* Avatar */}
							<YStack
								width={56}
								height={56}
								borderRadius="$10"
								backgroundColor={AppColors.primaryLight + '15'}
								borderWidth={2}
								borderColor={AppColors.primary + '30'}
								alignItems="center"
								justifyContent="center"
							>
								<Text
									fontSize={24}
									fontWeight="900"
									color={AppColors.primary}
								>
									{name.charAt(0).toUpperCase()}
								</Text>
							</YStack>

							{/* Info */}
							<YStack flex={1} gap="$1">
								<Text
									fontSize={16}
									fontWeight="800"
									color={AppColors.text}
									numberOfLines={1}
								>
									{name}
								</Text>
								<Text
									fontSize={13}
									color={AppColors.textSecondary}
									fontWeight="600"
									numberOfLines={1}
								>
									{brand}
								</Text>
							</YStack>
						</XStack>

						<Button
							size="$2"
							chromeless
							circular
							icon={MoreVertical}
							onPress={onMenuPress}
							backgroundColor={AppColors.border}
							color={AppColors.textSecondary}
							pressStyle={{
								backgroundColor: AppColors.borderDark,
								scale: 0.95,
							}}
						/>
					</XStack>

					<XStack
						justifyContent="space-between"
						alignItems="center"
						width="100%"
					>
						<TypeBadge type={type} />
						<StatusBadge status={status} />
					</XStack>

					<YStack height={1} backgroundColor={AppColors.border} />

					<XStack
						gap="$2"
						flexWrap="wrap"
						justifyContent="space-between"
					>
						{serialNumber && (
							<InfoChip
								icon={IdCard}
								value={`SN ${serialNumber}`}
							/>
						)}

						<InfoChip
							icon={Calendar}
							value={`${new Date(
								purchasedDate
							).toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
							})}`}
						/>
					</XStack>
				</YStack>
			</Card>
		</YStack>
	);
};

type CustomListItemProps = {
	data: DeviceResponse[];
	refreshing: boolean;
	viewDetail?: (deviceSerialNumber: string) => void;
	onRefresh: () => void;
};
/// --- LIST COMPONENT ---
export default function CustomList({
	data,
	refreshing,
	onRefresh,
	viewDetail,
}: CustomListItemProps) {
	return (
		<FlatList
			data={data}
			renderItem={({ item }) => (
				<CustomListItem details={item} viewDetail={viewDetail} />
			)}
			keyExtractor={(item) => item.id}
			contentContainerStyle={{
				alignItems: 'center',
				paddingBottom: 110, // tránh đè bởi bottom bar
			}}
			ItemSeparatorComponent={() => <YStack height={12} />}
			showsVerticalScrollIndicator={false}
			style={{
				width: '100%',
				flex: 1,
			}}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					colors={[AppColors.primary]} // Android
					tintColor={AppColors.primary} // iOS
					title="Đang tải lại..." // iOS only
					titleColor={AppColors.textSecondary}
				/>
			}
		/>
	);
}
