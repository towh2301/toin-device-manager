import { DeviceStatus, DeviceType } from '@/src/services/device/types';
import { MoreVertical } from '@tamagui/lucide-icons';
import React from 'react';
import { FlatList } from 'react-native';
import { Avatar, Button, Card, Separator, Text, XStack, YStack } from 'tamagui';

// --- STATUS COLOR LOGIC ---
const getStatusColor = (status: string) => {
	switch (status.toLowerCase()) {
		case 'completed':
			return { bg: '$green4', text: '$green10' };
		case 'cancelled':
			return { bg: '$red4', text: '$red10' };
		case 'on going':
			return { bg: '$blue4', text: '$blue10' };
		case 'pending':
			return { bg: '$gray4', text: '$gray10' };
		default:
			return { bg: '$gray4', text: '$gray10' };
	}
};

// --- COMPONENT ---
export const CustomListItem = ({
	imageSrc,
	name,
	brand,
	type,
	status,
	date,
	serialNumber,
	onMenuPress,
}: {
	imageSrc?: string;
	name: string;
	brand: string;
	status: DeviceStatus;
	type: DeviceType;
	date: string;
	serialNumber?: string | number;
	left?: string | number;
	onMenuPress?: () => void;
}) => {
	const statusTheme = getStatusColor(status);

	return (
		<Card
			elevate
			bordered
			borderRadius="$6"
			padding="$4"
			backgroundColor="$background"
			overflow="hidden"
			pressStyle={{ scale: 0.98 }}
			width="100%"
		>
			{/* --- Top Section --- */}
			<XStack
				justifyContent="space-between"
				alignItems="center"
				marginBottom="$3"
				scrollbarWidth="auto"
			>
				<XStack gap="$3" alignItems="center">
					<Avatar
						circular
						size="$5"
						borderWidth={1}
						borderColor="$gray6"
					>
						<Avatar.Image src={imageSrc} />
						<Avatar.Fallback backgroundColor="$gray5" />
					</Avatar>

					<YStack>
						<Text fontSize="$5" fontWeight="700" color="$color">
							{name}
						</Text>
						<XStack gap="$2" alignItems="center" flexWrap="wrap">
							<Text fontSize="$3" color="$gray10">
								{brand}
							</Text>
							<Text fontSize="$3" color="$gray10">
								• {type}
							</Text>
						</XStack>
					</YStack>
				</XStack>

				<Button
					size="$3"
					chromeless
					circular
					icon={MoreVertical}
					onPress={onMenuPress}
				/>
			</XStack>

			<Separator borderColor="$gray6" />

			{/* --- Bottom Section --- */}
			<XStack
				justifyContent="space-between"
				alignItems="flex-end"
				marginTop="$3"
			>
				{/* Left: Status */}
				<YStack>
					<Text fontSize="$2" color="$gray10" theme="alt1">
						Status
					</Text>
					<XStack
						alignItems="center"
						backgroundColor={statusTheme.bg}
						borderRadius="$10"
						paddingHorizontal="$3"
						paddingVertical="$1"
						marginTop="$1"
					>
						<Text
							fontSize="$3"
							fontWeight="600"
							color={statusTheme.text}
						>
							{status}
						</Text>
					</XStack>
				</YStack>

				{/* Right: Info */}
				<YStack alignItems="flex-end" gap="$1">
					{serialNumber && (
						<Text fontSize="$3" color="$gray10">
							SN: {serialNumber}
						</Text>
					)}
					<Text fontSize="$3" color="$gray10">
						Purchased: {date}
					</Text>
				</YStack>
			</XStack>
		</Card>
	);
};

export default function CustomList({ data }: { data: any[] }) {
	return (
		<FlatList
			data={data}
			renderItem={({ item }) => <CustomListItem {...item} />}
			keyExtractor={(item) => item.id}
		/>
	);
}
