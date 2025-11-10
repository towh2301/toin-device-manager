import {
	UseQueryOptions,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { ApiResponseType, responseWrapper } from '../helpers';
import { API_KEYS } from '../keys';
import useDeviceApi from './api';
import { DeviceResponse } from './types';

export function useGetDeviceById(
	deviceId: string,
	options?: UseQueryOptions<ApiResponseType<DeviceResponse>, Error> & {
		enabled?: boolean;
	}
) {
	const api = useDeviceApi();
	const queryClient = useQueryClient();

	const {
		data,
		isLoading,
		isError,
		error,
		isFetching,
		refetch: onGetDeviceById,
	} = useQuery<ApiResponseType<DeviceResponse>, Error>({
		queryKey: [API_KEYS.DEVICE_BY_ID, deviceId],
		queryFn: async () => {
			console.log(
				'🔄 [useGetDeviceById] Starting fetch for device:',
				deviceId
			);

			try {
				const response = await responseWrapper<
					ApiResponseType<DeviceResponse>
				>(api.getDeviceById, [deviceId]);
				console.log(
					'✅ [useGetDeviceById] Success response:',
					response
				);
				return response;
			} catch (err: any) {
				console.error('❌ [useGetDeviceById] API error:', err);
				console.error(
					'❌ [useGetDeviceById] Error message:',
					err.message
				);

				// Provide more context in the error
				const enhancedError = new Error(
					`Failed to fetch device: ${err.message || 'Unknown error'}`
				);
				throw enhancedError;
			}
		},
		enabled: !!deviceId && options?.enabled !== false, // Only run if deviceId is provided
		retry: (failureCount, error) => {
			console.log(
				`🔄 [useGetDeviceById] Retry attempt ${failureCount} for error:`,
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
			queryKey: [API_KEYS.DEVICE_BY_ID, deviceId],
		});
	};

	const deviceData = data?.data;

	return {
		deviceData,
		isLoading,
		isError,
		error,
		isFetching,
		onGetDeviceById,
		invalidateDevice,
	};
}
