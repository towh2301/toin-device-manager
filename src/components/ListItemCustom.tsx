import {
	DeviceResponse,
	DeviceStatus,
	DeviceType,
} from '@/src/services/device/types';
import { Calendar, IdCard, MoreVertical } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Avatar, Button, Card, Text, XStack, YStack } from 'tamagui';
import { AppColors } from '../common/app-color';

// --- STATUS CONFIGURATION ---
const getStatusConfig = (status: string) => {
	switch (status.toLowerCase()) {
		case 'completed':
			return {
				bg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
				solid: '#86efac',
				border: '#4ade80',
				text: '#15803d',
				icon: '✓',
			};
		case 'cancelled':
			return {
				bg: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
				solid: '#fca5a5',
				border: '#f87171',
				text: '#991b1b',
				icon: '✕',
			};
		case 'on going':
			return {
				bg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
				solid: '#93c5fd',
				border: '#60a5fa',
				text: '#1e40af',
				icon: '⟳',
			};
		case 'pending':
			return {
				bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
				solid: '#fcd34d',
				border: '#facc15',
				text: '#854d0e',
				icon: '◷',
			};
		default:
			return {
				bg: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
				solid: '#d1d5db',
				border: '#9ca3af',
				text: '#374151',
				icon: '•',
			};
	}
};

// --- TYPE BADGE ---
const TypeBadge = ({ type }: { type: DeviceType }) => (
	<XStack
		backgroundColor="rgba(99, 102, 241, 0.1)"
		borderRadius="$10"
		paddingHorizontal="$3"
		paddingVertical="$1"
		borderWidth={1}
		borderColor="rgba(99, 102, 241, 0.3)"
		alignSelf="flex-start"
	>
		<Text
			fontSize={12}
			fontWeight="700"
			color="#4f46e5"
			letterSpacing={1}
			textTransform="uppercase"
		>
			{type}
		</Text>
	</XStack>
);

// --- STATUS BADGE ---
const StatusBadge = ({ status }: { status: DeviceStatus }) => {
	const config = getStatusConfig(status);
	return (
		<XStack
			alignItems="center"
			gap="$2"
			backgroundColor={config.solid}
			borderRadius="$10"
			paddingHorizontal="$2.5"
			paddingVertical="$1.5"
			borderWidth={1}
			borderColor={config.border}
			alignSelf="flex-start"
		>
			<YStack
				width={16}
				height={16}
				borderRadius="$10"
				backgroundColor="white"
				alignItems="center"
				justifyContent="center"
			>
				<Text fontSize={11} lineHeight={12} fontWeight="900">
					{config.icon}
				</Text>
			</YStack>
			<Text fontSize={12} fontWeight="800" color={config.text}>
				{status}
			</Text>
		</XStack>
	);
};

// --- INFO CHIP ---
const InfoChip = ({
	icon: Icon,
	value,
}: {
	icon: any;
	value: string | number;
}) => (
	<XStack
		alignItems="center"
		gap="$2"
		backgroundColor="rgba(0, 0, 0, 0.03)"
		borderRadius="$3"
		paddingHorizontal="$2"
		paddingVertical="$1"
		borderWidth={1}
		borderColor="rgba(0, 0, 0, 0.06)"
	>
		<Icon size={10} color="#6b7280" strokeWidth={2.5} />
		<Text fontSize={10} color="#374151" fontWeight="600">
			{value}
		</Text>
	</XStack>
);

type CustomCardProps = {
	imageSrc?: string;
	details: DeviceResponse;
	onMenuPress?: () => void;
};

// --- MAIN LIST ITEM ---
export const CustomListItem = ({
	imageSrc,
	details: { name, brand, type, status, serialNumber, purchasedDate },
	onMenuPress,
}: CustomCardProps) => {
	const [pressed, setPressed] = useState(false);

	return (
		<YStack>
			<Card
				shadowColor={AppColors.primary}
				shadowOpacity={0.8}
				shadowRadius={10}
				elevation={4}
				borderRadius="$6"
				borderWidth={1}
				borderColor="rgba(6, 6, 6, 0.61)"
				backgroundColor="white"
				overflow="hidden"
				width="100%"
				// Pressed effect
				pressStyle={{ scale: 0.96, opacity: 0.96 }}
				animation="bouncy"
			>
				<YStack padding="$3" gap="$3">
					{/* Header Row */}
					<XStack
						justifyContent="space-between"
						alignItems="flex-start"
					>
						<XStack gap="$3" flex={1}>
							{/* Avatar */}
							<YStack
								position="relative"
								padding="$0.5"
								borderRadius="$10"
								style={{
									background:
										'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								}}
							>
								<YStack
									padding="$0.5"
									borderRadius="$9"
									backgroundColor="white"
								>
									<Avatar circular size="$4" borderWidth={0}>
										<Avatar.Image src={imageSrc} />
										<Avatar.Fallback backgroundColor="#f3f4f6">
											<Text
												fontSize="$4"
												fontWeight="900"
												color="white"
											>
												{/* {name.charAt(0)} */}
											</Text>
										</Avatar.Fallback>
									</Avatar>
								</YStack>
							</YStack>

							{/* Info */}
							<YStack flex={1} gap="$0.5">
								<Text
									fontSize={16}
									fontWeight="900"
									color="#111827"
									numberOfLines={1}
								>
									{name}
								</Text>
								<Text
									fontSize={13}
									color="#6b7280"
									fontWeight="600"
									numberOfLines={1}
								>
									{brand}
								</Text>
							</YStack>
						</XStack>

						<Button
							size="$3"
							chromeless
							circular
							icon={MoreVertical}
							onPress={onMenuPress}
							backgroundColor="rgba(0,0,0,0.04)"
							pressStyle={{
								backgroundColor: 'rgba(0,0,0,0.08)',
								scale: 0.9,
							}}
						/>
					</XStack>

					<XStack justifyContent="space-between" width="100%">
						<TypeBadge type={type} />
						<StatusBadge status={status} />
					</XStack>

					<YStack height={1} backgroundColor="rgba(0,0,0,0.06)" />

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
							value={`Purchased Date: ${new Date(
								purchasedDate
							).toLocaleDateString('vi-VN', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
							})}`}
						/>
					</XStack>
				</YStack>

				<YStack
					height={4}
					style={{ background: getStatusConfig(status).bg }}
				/>
			</Card>
		</YStack>
	);
};

type CustomListItemProps = {
	data: DeviceResponse[];
	refreshing: boolean;
	onRefresh: () => void;
};
/// --- LIST COMPONENT ---
export default function CustomList({
	data,
	refreshing,
	onRefresh,
}: CustomListItemProps) {
	return (
		<FlatList
			data={data}
			renderItem={({ item }) => <CustomListItem details={item} />}
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
					colors={['#007AFF']} // iOS
					tintColor="#007AFF" // Android
					title="Đang tải lại..." // iOS only
					titleColor="#fff"
				/>
			}
		/>
	);
}
