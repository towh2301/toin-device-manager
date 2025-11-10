import {
	UseQueryOptions,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { deviceApi } from '.';
import { ApiResponseType, responseWrapper } from '../helpers';
import { API_KEYS } from '../keys';
import { DeviceResponse } from './types';

export function useGetDeviceBySerialNumber(
	deviceSerialNumber: string,
	options?: UseQueryOptions<ApiResponseType<DeviceResponse>, Error> & {
		enabled?: boolean;
	}
) {
	const queryClient = useQueryClient();

	const {
		data,
		isLoading,
		isError,
		error,
		isFetching,
		refetch: onGetDeviceBySerialNumber,
	} = useQuery<ApiResponseType<DeviceResponse>, Error>({
		queryKey: [API_KEYS.DEVICE_BY_SERIAL_NUMBER, deviceSerialNumber],
		queryFn: async () => {
			console.log(
				'🔄 [useGetDeviceBySerialNumber] Starting fetch for device:',
				deviceSerialNumber
			);

			try {
				const response = await responseWrapper<
					ApiResponseType<DeviceResponse>
				>(deviceApi.getDeviceBySerialNumber, [deviceSerialNumber]);
				console.log(
					'✅ [useGetDeviceBySerialNumber] Success response:',
					response
				);
				return response;
			} catch (err: any) {
				console.error(
					'❌ [useGetDeviceBySerialNumber] API error:',
					err
				);
				console.error(
					'❌ [useGetDeviceBySerialNumber] Error message:',
					err.message
				);

				// Provide more context in the error
				const enhancedError = new Error(
					`Failed to fetch device: ${err.message || 'Unknown error'}`
				);
				throw enhancedError;
			}
		},
		enabled: !!deviceSerialNumber && options?.enabled !== false, // Only run if deviceSerialNumber is provided
		retry: (failureCount, error) => {
			console.log(
				`🔄 [useGetDeviceBySerialNumber] Retry attempt ${failureCount} for error:`,
				error.message
			);
			return failureCount < 2; // Retry up to 2 times
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		...options,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	const invalidateDevice = () => {
		queryClient.invalidateQueries({
			queryKey: [API_KEYS.DEVICE_BY_SERIAL_NUMBER, deviceSerialNumber],
		});
	};

	const deviceData = data?.data;

	return {
		deviceData,
		isLoading,
		isError,
		error,
		isFetching,
		onGetDeviceBySerialNumber,
		invalidateDevice,
	};
}
