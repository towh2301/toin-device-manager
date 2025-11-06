import { AppColors } from '@/src/common/app-color';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import { TabFilter } from '@/src/components/TabFilter';
import { DeviceType } from '@/src/services/device/types';
import { useGetAllDevices } from '@/src/services/device/useGetAllDevices';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Button, Input, SizeTokens, XStack, YStack } from 'tamagui';
import CustomList from '../../components/ListItemCustom';

const DeviceScreen = () => {
	const { deviceData, isLoading, isError, invalidateDevices } =
		useGetAllDevices();

	const [search, setSearch] = React.useState('');

	console.log('useGetAllDevices - data:', deviceData);

	return (
		<YStack flex={1} alignItems="center" padding="$4" gap="$4">
			<InputCombo size="$4" search={search} setSearch={setSearch} />
			<TabFilter filters={Object.keys(DeviceType) as string[]} />
			{isLoading && <LoadingIndicator data={''} />}
			<CustomList data={deviceData || []} />
		</YStack>
	);
};

function InputCombo(props: {
	size: SizeTokens;
	search?: string;
	setSearch?: (value: string) => void;
}) {
	return (
		<XStack
			alignItems="center"
			width="100%"
			backgroundColor={AppColors.surface}
			borderWidth={1}
			borderColor={AppColors.secondary}
			borderRadius="$4"
			marginTop="$8"
		>
			<Input
				minHeight={props.size === '$4' ? 48 : 32}
				flex={1}
				size={props.size}
				placeholder={`Size ${props.size}...`}
				backgroundColor={AppColors.surface}
				borderWidth={0}
				value={props.search}
				onChangeText={props.setSearch}
			/>
			<Button
				size={props.size}
				minHeight={props.size === '$4' ? 48 : 32}
				chromeless
				pressStyle={{
					scale: 0.9, // Thu nhỏ component lại còn 90%
				}}
				shadowRadius={5}
				shadowOpacity={0.2}
				shadowOffset={{ width: 0, height: 2 }}
			>
				<Ionicons name="qr-code" size={20} color={AppColors.primary} />
			</Button>
			<Button
				size={props.size}
				minHeight={props.size === '$4' ? 48 : 32}
				chromeless
				pressStyle={{
					scale: 0.9, // Thu nhỏ component lại còn 90%
				}}
				shadowRadius={5}
				shadowOpacity={0.2}
				shadowOffset={{ width: 0, height: 2 }}
			>
				<Ionicons
					name="search-outline"
					size={20}
					color={AppColors.primary}
				/>
			</Button>
		</XStack>
	);
}

export default DeviceScreen;
