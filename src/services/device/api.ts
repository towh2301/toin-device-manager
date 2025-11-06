import { AxiosError } from 'axios';
import { ApiResponseType } from '../helpers';
import { useHttpPrivateRequest } from '../http';
import { API_URL } from '../keys';
import {
	DeviceCreatePayload,
	DeviceResponse,
	DeviceUpdatePayload,
} from './types';

const useDeviceApi = (baseURL = API_URL) => {
	const privateApi = useHttpPrivateRequest(baseURL);

	const createDevice = async (payload: DeviceCreatePayload) => {
		try {
			const { data } = await privateApi.post<
				ApiResponseType<DeviceResponse>
			>('/devices/create', payload);
			return data;
		} catch (error) {
			handleAxiosError(error, '/devices/create', baseURL);
		}
	};

	const getDeviceList = async (params?: Record<string, any>) => {
		const endpoint = '/devices/all';
		try {
			const { data } = await privateApi.get<
				ApiResponseType<DeviceResponse[]>
			>(endpoint, { params });
			console.log('✅ [DeviceApi] getDeviceList:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, endpoint, baseURL);
		}
	};

	const getDeviceById = async (id: string) => {
		const endpoint = `/devices/${id}`;
		try {
			const { data } =
				await privateApi.get<ApiResponseType<DeviceResponse>>(endpoint);
			return data;
		} catch (error) {
			handleAxiosError(error, endpoint, baseURL);
		}
	};

	const updateDevice = async (id: string, payload: DeviceUpdatePayload) => {
		const endpoint = `/devices/${id}`;
		try {
			const { data } = await privateApi.put<
				ApiResponseType<DeviceResponse>
			>(endpoint, payload);
			return data;
		} catch (error) {
			handleAxiosError(error, endpoint, baseURL);
		}
	};

	const deleteDevice = async (id: string) => {
		const endpoint = `/devices/${id}`;
		try {
			const { data } =
				await privateApi.delete<ApiResponseType<void>>(endpoint);
			return data;
		} catch (error) {
			handleAxiosError(error, endpoint, baseURL);
		}
	};

	const generateQrCode = async (id: string) => {
		const endpoint = `/devices/${id}/qrcode`;
		try {
			const response = await privateApi.get(endpoint, {
				responseType: 'blob',
			});
			return response.data;
		} catch (error) {
			handleAxiosError(error, endpoint, baseURL);
		}
	};

	return {
		createDevice,
		getDeviceList,
		getDeviceById,
		updateDevice,
		deleteDevice,
		generateQrCode,
	};
};

/** 🔴 Centralized error handler */
function handleAxiosError(error: unknown, endpoint: string, baseURL: string) {
	console.error('❌ [DeviceApi] Error in:', endpoint);

	if (error instanceof AxiosError) {
		const fullUrl = (baseURL || '') + (error.config?.url || endpoint);
		console.error('🌐 Full URL:', fullUrl);
		console.error('📡 Axios Error Details:', error.message);
	} else {
		console.error('⚠️ Non-Axios error:', error);
	}

	throw error; // Re-throw to let React Query or caller handle it
}

export default useDeviceApi;
