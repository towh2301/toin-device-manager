import { useNavigation } from '@react-navigation/native';
import { DeviceStatus } from '@services/device/types';
import { useGetAllDevices } from '@services/device/useGetAllDevices';
import React, { useMemo } from 'react';
import {
	Button,
	Card,
	ScrollView,
	Separator,
	Text,
	XStack,
	YStack,
} from 'tamagui';

const statusLabels: Record<DeviceStatus, string> = {
	[DeviceStatus.AVAILABLE]: 'Sẵn sàng',
	[DeviceStatus.IN_USE]: 'Đang dùng',
	[DeviceStatus.MAINTENANCE]: 'Bảo trì',
	[DeviceStatus.RETIREMENT]: 'Ngưng dùng',
};

const HomeScreen = () => {
	const {
		deviceData,
		isLoading,
		isError,
		error,
		onGetAllDevices,
		isFetching,
	} = useGetAllDevices();
	const navigation = useNavigation<any>();

	const stats = useMemo(() => {
		const total = deviceData.length;
		const byStatus: Record<DeviceStatus, number> = {
			[DeviceStatus.AVAILABLE]: 0,
			[DeviceStatus.IN_USE]: 0,
			[DeviceStatus.MAINTENANCE]: 0,
			[DeviceStatus.RETIREMENT]: 0,
		};
		for (const d of deviceData)
			byStatus[d.status] = (byStatus[d.status] || 0) + 1;
		return { total, byStatus };
	}, [deviceData]);

	return (
		<ScrollView contentContainerStyle={{ padding: 16 }}>
			<YStack gap="$4">
				<Text fontSize={26} fontWeight="700">
					Dashboard thiết bị
				</Text>
				<XStack gap="$3" flexWrap="wrap">
					<Card padding="$4" bordered width="48%" theme="blue">
						<Text fontSize={14} color="$color8">
							Tổng thiết bị
						</Text>
						<Text fontSize={24} fontWeight="700">
							{stats.total}
						</Text>
						<Text fontSize={12} color="$color8">
							{isFetching ? 'Đang đồng bộ...' : 'Cập nhật'}
						</Text>
					</Card>
					{Object.entries(stats.byStatus).map(([key, val]) => (
						<Card
							key={key}
							padding="$4"
							bordered
							width="48%"
							theme="green"
						>
							<Text fontSize={14}>
								{statusLabels[key as DeviceStatus]}
							</Text>
							<Text fontSize={20} fontWeight="700">
								{val}
							</Text>
						</Card>
					))}
				</XStack>

				<Separator />

				<XStack justifyContent="space-between" alignItems="center">
					<Text fontSize={20} fontWeight="600">
						Thiết bị mới nhất
					</Text>
					<Button size="$3" onPress={() => onGetAllDevices()}>
						Làm mới
					</Button>
				</XStack>
				{isLoading && <Text>Đang tải...</Text>}
				{isError && <Text color="red">{error?.message}</Text>}
				<YStack gap="$3">
					{deviceData.slice(0, 6).map((d) => (
						<Card
							key={d.id}
							padding="$3"
							bordered
							onPress={() =>
								navigation.navigate('DeviceDetail', {
									device: d,
								})
							}
						>
							<XStack
								justifyContent="space-between"
								alignItems="center"
							>
								<YStack>
									<Text fontWeight="600">{d.name}</Text>
									<Text fontSize={12} color="$color8">
										SN: {d.serialNumber}
									</Text>
								</YStack>
								<Text fontSize={11} color="$color9">
									{statusLabels[d.status]}
								</Text>
							</XStack>
						</Card>
					))}
				</YStack>

				<Separator />
				<Text fontSize={20} fontWeight="600">
					Tác vụ nhanh
				</Text>
				<XStack gap="$3" flexWrap="wrap">
					<Button
						theme="active"
						onPress={() => navigation.navigate('Device')}
					>
						Quản lý thiết bị
					</Button>
					<Button
						theme="blue"
						onPress={() => navigation.navigate('ScanQR')}
					>
						Quét QR
					</Button>
					<Button
						theme="green"
						onPress={() => navigation.navigate('DeviceCreate')}
					>
						Thêm thiết bị
					</Button>
				</XStack>
			</YStack>
		</ScrollView>
	);
};

export default HomeScreen;
