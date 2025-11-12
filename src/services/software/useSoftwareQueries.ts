import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ApiResponseType, responseWrapper } from '../helpers';
import { API_KEYS } from '../keys';
import useSoftwareApi from './api';
import {
	SoftwareFilter,
	SoftwarePaginatedResponse,
	SoftwareResponse,
} from './types';

/**
 * Custom hooks for Software queries (Read operations)
 */

/**
 * Hook to get all software without pagination
 */
export function useGetAllSoftware(
	options?: UseQueryOptions<ApiResponseType<SoftwareResponse[]>, Error>
) {
	const api = useSoftwareApi();

	const query = useQuery<ApiResponseType<SoftwareResponse[]>, Error>({
		queryKey: [API_KEYS.ALL_SOFTWARE],
		queryFn: async () => {
			console.log('🔄 [useGetAllSoftware] Fetching all software...');
			const response = await responseWrapper<
				ApiResponseType<SoftwareResponse[]>
			>(api.getAllSoftware, []);
			console.log('✅ [useGetAllSoftware] Success:', response);
			return response;
		},
		...options,
	});

	return {
		softwareData: query.data?.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		onGetAllSoftware: query.refetch,
	};
}

/**
 * Hook to get paginated software with filters
 */
export function useGetPaginatedSoftware(
	page: number = 1,
	limit: number = 10,
	filters?: SoftwareFilter,
	options?: UseQueryOptions<ApiResponseType<SoftwarePaginatedResponse>, Error>
) {
	const api = useSoftwareApi();

	const query = useQuery<ApiResponseType<SoftwarePaginatedResponse>, Error>({
		queryKey: [API_KEYS.SOFTWARE_PAGINATED, page, limit, filters],
		queryFn: async () => {
			console.log(
				'🔄 [useGetPaginatedSoftware] Fetching paginated software...'
			);
			const response = await responseWrapper<
				ApiResponseType<SoftwarePaginatedResponse>
			>(api.getPaginatedSoftware, [page, limit, filters]);
			console.log('✅ [useGetPaginatedSoftware] Success:', response);
			return response;
		},
		...options,
	});

	return {
		softwareData: query.data?.data?.software,
		pagination: {
			total: query.data?.data?.total || 0,
			page: query.data?.data?.page || 1,
			limit: query.data?.data?.limit || 10,
			totalPages: query.data?.data?.totalPages || 1,
		},
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		onRefetch: query.refetch,
	};
}

/**
 * Hook to get single software by ID
 */
export function useGetSoftwareById(
	id: string,
	options?: UseQueryOptions<ApiResponseType<SoftwareResponse>, Error>
) {
	const api = useSoftwareApi();

	const query = useQuery<ApiResponseType<SoftwareResponse>, Error>({
		queryKey: [API_KEYS.SOFTWARE_BY_ID, id],
		queryFn: async () => {
			console.log('🔄 [useGetSoftwareById] Fetching software:', id);
			const response = await responseWrapper<
				ApiResponseType<SoftwareResponse>
			>(api.getSoftwareById, [id]);
			console.log('✅ [useGetSoftwareById] Success:', response);
			return response;
		},
		enabled: !!id,
		...options,
	});

	return {
		software: query.data?.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		onRefetch: query.refetch,
	};
}

/**
 * Hook to get all software for a specific device
 */
export function useGetSoftwareForDevice(
	deviceId: string,
	options?: UseQueryOptions<ApiResponseType<SoftwareResponse[]>, Error>
) {
	const api = useSoftwareApi();

	const query = useQuery<ApiResponseType<SoftwareResponse[]>, Error>({
		queryKey: [API_KEYS.DEVICE_SOFTWARE, deviceId],
		queryFn: async () => {
			console.log(
				'🔄 [useGetSoftwareForDevice] Fetching software for device:',
				deviceId
			);
			const response = await responseWrapper<
				ApiResponseType<SoftwareResponse[]>
			>(api.getSoftwareForDevice, [deviceId]);
			console.log('✅ [useGetSoftwareForDevice] Success:', response);
			return response;
		},
		enabled: !!deviceId,
		...options,
	});

	return {
		deviceSoftware: query.data?.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		onRefetch: query.refetch,
	};
}
