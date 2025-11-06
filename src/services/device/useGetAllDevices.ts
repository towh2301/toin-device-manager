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
		queryKey: [API_KEYS.ALL_DEVICES, params], // ✅ thêm params để query thay đổi khi filter thay đổi
		queryFn: async ({ queryKey }) => {
			try {
				const response = await responseWrapper<
					ApiResponseType<DeviceResponse[]>
				>(
					api.getDeviceList,
					[params] // ✅ truyền params trong array
				);
				console.log('✅ API response:', response);
				return response;
			} catch (err) {
				console.error('❌ API error:', err);
				throw err;
			}
		},
		...options,
		staleTime: 0,
		gcTime: 0,
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
