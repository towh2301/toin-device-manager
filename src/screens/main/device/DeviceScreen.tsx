import { InputCombo } from '@/src/components/InputCombo';
import LoadingIndicator from '@/src/components/LoadingIndicator';
import { TabFilter } from '@/src/components/TabFilter';
import { DeviceType } from '@/src/services/device/types';
import { useGetAllDevices } from '@/src/services/device/useGetAllDevices';
import React from 'react';
import { Button, YStack } from 'tamagui';
import CustomList from '../../../components/ListItemCustom';

const DeviceScreen = () => {
	const { deviceData, isLoading, isError, error, onGetAllDevices } =
		useGetAllDevices();

	const [search, setSearch] = React.useState('');

	console.log('🔍 [DeviceScreen] Device data:', deviceData);
	console.log('⚠️ [DeviceScreen] Is error:', isError);
	console.log('❌ [DeviceScreen] Error:', error);

	// Handle retry
	const handleRetry = () => {
		console.log('🔄 [DeviceScreen] Retrying fetch...');
		onGetAllDevices();
	};

	if (isError) {
		return (
			<YStack
				flex={1}
				justifyContent="center"
				alignItems="center"
				padding="$4"
				gap="$4"
			>
				<Button onPress={handleRetry} backgroundColor="$red10">
					Error: {error?.message || 'Unknown error'}. Tap to retry.
				</Button>
			</YStack>
		);
	}

	return (
		<YStack flex={1} alignItems="center" padding="$4" gap="$4">
			<InputCombo size="$4" search={search} setSearch={setSearch} />
			<TabFilter filters={Object.keys(DeviceType) as string[]} />
			{isLoading && <LoadingIndicator data={''} />}
			<CustomList data={deviceData || []} />
		</YStack>
	);
};

export default DeviceScreen;
