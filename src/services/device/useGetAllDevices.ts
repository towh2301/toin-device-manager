import {
	UseQueryOptions,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';
import { useState } from 'react';
import {
	ApiResponseType,
	GetPropertiesParams,
	responseWrapper,
} from '../helpers';
import { API_KEYS } from '../keys';
import useDeviceApi from './api';
import { DeviceResponse } from './types';

export function useGetAllDevices(
	options?: UseQueryOptions<ApiResponseType<DeviceResponse[]>, Error> & {
		propertiesParams?: GetPropertiesParams;
		enabled?: boolean;
	}
) {
	const api = useDeviceApi();

	const [params, setParams] = useState<GetPropertiesParams>(
		options?.propertiesParams || {}
	);

	const queryClient = useQueryClient();

	const {
		data,
		isLoading,
		isError,
		error,
		isFetching,
		refetch: onGetAllDevices,
	} = useQuery<ApiResponseType<DeviceResponse[]>, Error>({
		queryKey: [API_KEYS.ALL_DEVICES, params],
		queryFn: async ({ queryKey }) => {
			console.log(
				'🔄 [useGetAllDevices] Starting fetch with params:',
				params
			);

			try {
				const response = await responseWrapper<
					ApiResponseType<DeviceResponse[]>
				>(api.getDeviceList, [params]);
				console.log(
					'✅ [useGetAllDevices] Success response:',
					response
				);
				return response;
			} catch (err: any) {
				console.error('❌ [useGetAllDevices] API error:', err);
				console.error(
					'❌ [useGetAllDevices] Error message:',
					err.message
				);

				// Provide more context in the error
				const enhancedError = new Error(
					`Failed to fetch devices: ${err.message || 'Unknown error'}`
				);
				throw enhancedError;
			}
		},
		enabled: options?.enabled !== false, // Allow disabling the query
		retry: (failureCount, error) => {
			console.log(
				`🔄 [useGetAllDevices] Retry attempt ${failureCount} for error:`,
				error.message
			);
			return failureCount < 2; // Retry up to 2 times
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		...options,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	const invalidateDevices = () => {
		queryClient.invalidateQueries({ queryKey: [API_KEYS.ALL_DEVICES] });
	};

	const deviceData = data?.data ?? [];

	return {
		deviceData,
		isLoading,
		isError,
		error,
		isFetching,
		onGetAllDevices,
		invalidateDevices,
		setParams, // ✅ expose để filter/pagination
	};
}
