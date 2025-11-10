import {
	useQuery,
	useQueryClient,
	UseQueryOptions,
} from '@tanstack/react-query';
import { useState } from 'react';
import { deviceApi } from '.';
import {
	ApiResponseType,
	GetPropertiesParams,
	responseWrapper,
} from '../helpers';
import { API_KEYS } from '../keys';
import useDeviceApi from './api';
import {
	DeviceAssignmentResponse,
	DeviceResponse,
	DeviceSoftwareResponse,
	QrCodeResponse,
} from './types';

/**
 * Hook to get all assignments for a specific device
 */

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

export function useGetDeviceAssignments(
	deviceId: string,
	options?: UseQueryOptions<
		ApiResponseType<DeviceAssignmentResponse[]>,
		Error
	>
) {
	const api = useDeviceApi();

	return useQuery<ApiResponseType<DeviceAssignmentResponse[]>, Error>({
		queryKey: [API_KEYS.DEVICE_ASSIGNMENTS, deviceId],
		queryFn: async () => {
			console.log(
				'🔄 [useGetDeviceAssignments] Fetching assignments for device:',
				deviceId
			);
			const response = await responseWrapper<
				ApiResponseType<DeviceAssignmentResponse[]>
			>(api.getDeviceAssignments, [deviceId]);
			console.log('✅ [useGetDeviceAssignments] Success:', response.data);
			return response;
		},
		enabled: !!deviceId,
		staleTime: 3 * 60 * 1000, // 3 minutes
		...options,
	});
}

/**
 * Hook to get all device assignments in the system
 */
export function useGetAllAssignments(
	options?: UseQueryOptions<
		ApiResponseType<DeviceAssignmentResponse[]>,
		Error
	>
) {
	const api = useDeviceApi();

	return useQuery<ApiResponseType<DeviceAssignmentResponse[]>, Error>({
		queryKey: [API_KEYS.ALL_ASSIGNMENTS],
		queryFn: async () => {
			console.log('🔄 [useGetAllAssignments] Fetching all assignments');
			const response = await responseWrapper<
				ApiResponseType<DeviceAssignmentResponse[]>
			>(api.getAllAssignments, []);
			console.log('✅ [useGetAllAssignments] Success:', response.data);
			return response;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		...options,
	});
}

/**
 * Hook to get all software linked to a device
 */
export function useGetDeviceSoftware(
	deviceId: string,
	options?: UseQueryOptions<ApiResponseType<DeviceSoftwareResponse[]>, Error>
) {
	const api = useDeviceApi();

	return useQuery<ApiResponseType<DeviceSoftwareResponse[]>, Error>({
		queryKey: [API_KEYS.DEVICE_SOFTWARE, deviceId],
		queryFn: async () => {
			console.log(
				'🔄 [useGetDeviceSoftware] Fetching software for device:',
				deviceId
			);
			const response = await responseWrapper<
				ApiResponseType<DeviceSoftwareResponse[]>
			>(api.getSoftwareForDevice, [deviceId]);
			console.log('✅ [useGetDeviceSoftware] Success:', response.data);
			return response;
		},
		enabled: !!deviceId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		...options,
	});
}

/**
 * Hook to get specific device-software link by ID
 */
export function useGetDeviceSoftwareLink(
	deviceSoftwareId: string,
	options?: UseQueryOptions<ApiResponseType<DeviceSoftwareResponse>, Error>
) {
	const api = useDeviceApi();

	return useQuery<ApiResponseType<DeviceSoftwareResponse>, Error>({
		queryKey: [API_KEYS.DEVICE_SOFTWARE_LINK, deviceSoftwareId],
		queryFn: async () => {
			console.log(
				'🔄 [useGetDeviceSoftwareLink] Fetching link:',
				deviceSoftwareId
			);
			const response = await responseWrapper<
				ApiResponseType<DeviceSoftwareResponse>
			>(api.getDeviceSoftwareLink, [deviceSoftwareId]);
			console.log(
				'✅ [useGetDeviceSoftwareLink] Success:',
				response.data
			);
			return response;
		},
		enabled: !!deviceSoftwareId,
		staleTime: 5 * 60 * 1000, // 5 minutes
		...options,
	});
}

/**
 * Hook to get all device-software links in the system
 */
export function useGetAllDeviceSoftwareLinks(
	options?: UseQueryOptions<ApiResponseType<DeviceSoftwareResponse[]>, Error>
) {
	const api = useDeviceApi();

	return useQuery<ApiResponseType<DeviceSoftwareResponse[]>, Error>({
		queryKey: [API_KEYS.ALL_DEVICE_SOFTWARE_LINKS],
		queryFn: async () => {
			console.log('🔄 [useGetAllDeviceSoftwareLinks] Fetching all links');
			const response = await responseWrapper<
				ApiResponseType<DeviceSoftwareResponse[]>
			>(api.getAllDeviceSoftwareLinks, []);
			console.log(
				'✅ [useGetAllDeviceSoftwareLinks] Success:',
				response.data
			);
			return response;
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		...options,
	});
}

/**
 * Hook to generate QR code for a device
 */
export function useGenerateQrCode(
	deviceId: string,
	options?: UseQueryOptions<ApiResponseType<QrCodeResponse>, Error>
) {
	const api = useDeviceApi();

	return useQuery<ApiResponseType<QrCodeResponse>, Error>({
		queryKey: [API_KEYS.DEVICE_QR_CODE, deviceId],
		queryFn: async () => {
			console.log(
				'🔄 [useGenerateQrCode] Generating QR code for device:',
				deviceId
			);
			const response = await responseWrapper<
				ApiResponseType<QrCodeResponse>
			>(api.generateQrCode, [deviceId]);
			console.log('✅ [useGenerateQrCode] Success:', response.data);
			return response;
		},
		enabled: !!deviceId,
		staleTime: 10 * 60 * 1000, // 10 minutes (QR codes don't change often)
		gcTime: 30 * 60 * 1000, // 30 minutes
		...options,
	});
}
