import Clipboard from '@react-native-clipboard/clipboard';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { DeviceResponse, DeviceStatus } from '@services/device/types';
import React from 'react';
import { Alert, Share } from 'react-native';
import { Button, Card, Separator, Text, XStack, YStack } from 'tamagui';

type DeviceDetailRouteParams = {
	DeviceDetail: { device: DeviceResponse };
};

const statusColor: Record<DeviceStatus, string> = {
	AVAILABLE: '#22c55e',
	IN_USE: '#3b82f6',
	MAINTENANCE: '#f59e0b',
	RETIREMENT: '#6b7280',
};

export default function DeviceDetailScreen() {
	const route =
		useRoute<RouteProp<DeviceDetailRouteParams, 'DeviceDetail'>>();
	const navigation = useNavigation<any>();
	const device = route.params?.device;

	if (!device) {
		return (
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				padding="$4"
			>
				<Text fontSize={16}>Không có dữ liệu thiết bị</Text>
				<Button marginTop="$3" onPress={() => navigation.goBack()}>
					Quay lại
				</Button>
			</YStack>
		);
	}

	const copySN = () => {
		Clipboard.setString(device.serialNumber);
		Alert.alert('Đã sao chép', 'Serial Number đã được sao chép.');
	};

	const shareInfo = async () => {
		try {
			await Share.share({
				message: `${device.name} (SN: ${device.serialNumber}) - ${device.brand}`,
			});
		} catch {}
	};

	return (
		<YStack flex={1} padding="$4" gap="$4">
			<XStack alignItems="center" justifyContent="space-between">
				<YStack>
					<Text fontSize={22} fontWeight="700">
						{device.name}
					</Text>
					<Text color="$color8">ID: {device.id}</Text>
				</YStack>
				<YStack
					paddingVertical={4}
					paddingHorizontal={8}
					borderRadius={8}
					backgroundColor={statusColor[device.status]}
				>
					<Text color="white" fontSize={12} fontWeight="600">
						{device.status}
					</Text>
				</YStack>
			</XStack>

			<Card bordered padding="$4">
				<YStack gap="$2">
					<XStack justifyContent="space-between">
						<Text color="$color8">Thương hiệu</Text>
						<Text fontWeight="600">{device.brand}</Text>
					</XStack>
					<Separator />
					<XStack justifyContent="space-between">
						<Text color="$color8">Serial Number</Text>
						<Text fontWeight="600">{device.serialNumber}</Text>
					</XStack>
					<Separator />
					<XStack justifyContent="space-between">
						<Text color="$color8">Loại</Text>
						<Text fontWeight="600">{device.type}</Text>
					</XStack>
					<Separator />
					<XStack justifyContent="space-between">
						<Text color="$color8">Ngày mua</Text>
						<Text fontWeight="600">
							{new Date(
								device.purchasedDate
							).toLocaleDateString()}
						</Text>
					</XStack>
				</YStack>
			</Card>

			<XStack gap="$3">
				<Button theme="active" onPress={copySN}>
					Sao chép SN
				</Button>
				<Button theme="blue" onPress={shareInfo}>
					Chia sẻ
				</Button>
				<Button theme="alt1" onPress={() => navigation.goBack()}>
					Quay lại
				</Button>
			</XStack>
		</YStack>
	);
}
