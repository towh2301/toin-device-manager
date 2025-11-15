import { AxiosError } from 'axios';
import { ApiResponseType } from '../helpers';
import { useHttpPrivateRequest } from '../http';
import { API_URL } from '../keys';
import {
	DeviceSoftwareLinkResponse,
	SoftwareCreatePayload,
	SoftwareFilter,
	SoftwarePaginatedResponse,
	SoftwareResponse,
	SoftwareUpdatePayload,
} from './types';

const handleAxiosError = (
	error: unknown,
	endpoint: string,
	baseURL: string
): never => {
	if (error instanceof AxiosError) {
		const status = error.response?.status;
		const message = error.response?.data?.message || error.message;
		console.error(`❌ [SoftwareApi] ${endpoint} failed:`, {
			status,
			message,
			endpoint,
			baseURL,
		});
		throw new Error(message);
	}
	console.error(`❌ [SoftwareApi] ${endpoint} unexpected error:`, error);
	throw error;
};

const useSoftwareApi = (baseURL = API_URL) => {
	if (!baseURL) {
		console.error(
			'❌ API_URL is not defined! Check your app.json configuration.'
		);
		throw new Error('API_URL is not configured');
	}

	const privateApi = useHttpPrivateRequest({
		baseURL,
		onAuthFailure: () => {
			console.log('🔒 Software API: Authentication failed');
		},
	});

	/**
	 * Get all software without pagination
	 * GET /software
	 */
	const getAllSoftware = async () => {
		const endpoint = '/software';
		try {
			const { data } =
				await privateApi.get<ApiResponseType<SoftwareResponse[]>>(
					endpoint
				);
			console.log('✅ [SoftwareApi] getAllSoftware:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	/**
	 * Get software with pagination and filters
	 * GET /software/paginated
	 */
	const getPaginatedSoftware = async (
		page: number = 1,
		limit: number = 10,
		filters?: SoftwareFilter
	) => {
		const endpoint = '/software/paginated';
		try {
			const params: any = { page, limit, ...filters };
			const { data } = await privateApi.get<
				ApiResponseType<SoftwarePaginatedResponse>
			>(endpoint, { params });
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	/**
	 * Get single software by ID
	 * GET /software/:id
	 */
	const getSoftwareById = async (id: string) => {
		const endpoint = `/software/${id}`;
		try {
			const { data } =
				await privateApi.get<ApiResponseType<SoftwareResponse>>(
					endpoint
				);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	/**
	 * Create new software
	 * POST /software
	 */
	const createSoftware = async (payload: SoftwareCreatePayload) => {
		const endpoint = '/software';
		try {
			const { data } = await privateApi.post<
				ApiResponseType<SoftwareResponse>
			>(endpoint, payload);
			console.log('✅ [SoftwareApi] createSoftware:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `POST ${endpoint}`, baseURL);
		}
	};

	/**
	 * Update software
	 * PATCH /software/:id
	 */
	const updateSoftware = async (
		id: string,
		payload: SoftwareUpdatePayload
	) => {
		const endpoint = `/software/${id}`;
		try {
			const { data } = await privateApi.patch<
				ApiResponseType<SoftwareResponse>
			>(endpoint, payload);
			console.log('✅ [SoftwareApi] updateSoftware:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `PATCH ${endpoint}`, baseURL);
		}
	};

	/**
	 * Delete software
	 * DELETE /software/:id
	 */
	const deleteSoftware = async (id: string) => {
		const endpoint = `/software/${id}`;
		try {
			const { data } =
				await privateApi.delete<
					ApiResponseType<{ id: string; name: string }>
				>(endpoint);
			console.log('✅ [SoftwareApi] deleteSoftware:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `DELETE ${endpoint}`, baseURL);
		}
	};

	/**
	 * Link software to device
	 * POST /device/:deviceId/link-software/:softwareId
	 */
	const linkSoftwareToDevice = async (
		deviceId: string,
		softwareId: string
	) => {
		const endpoint = `/devices/${deviceId}/link-software/${softwareId}`;
		try {
			const { data } =
				await privateApi.post<
					ApiResponseType<DeviceSoftwareLinkResponse>
				>(endpoint);
			console.log('✅ [SoftwareApi] linkSoftwareToDevice:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `POST ${endpoint}`, baseURL);
		}
	};

	/**
	 * Unlink software from device
	 * POST /device/:deviceId/unlink-software/:softwareId
	 */
	const unlinkSoftwareFromDevice = async (
		deviceId: string,
		softwareId: string
	) => {
		const endpoint = `/devices/${deviceId}/unlink-software/${softwareId}`;
		try {
			const { data } =
				await privateApi.post<
					ApiResponseType<DeviceSoftwareLinkResponse>
				>(endpoint);
			console.log('✅ [SoftwareApi] unlinkSoftwareFromDevice:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `POST ${endpoint}`, baseURL);
		}
	};

	/**
	 * Get all software for a specific device
	 * GET /devices/:deviceId/software
	 */
	const getSoftwareForDevice = async (deviceId: string) => {
		const endpoint = `/devices/${deviceId}/software`;
		try {
			const { data } =
				await privateApi.get<ApiResponseType<SoftwareResponse[]>>(
					endpoint
				);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	return {
		getAllSoftware,
		getPaginatedSoftware,
		getSoftwareById,
		createSoftware,
		updateSoftware,
		deleteSoftware,
		linkSoftwareToDevice,
		unlinkSoftwareFromDevice,
		getSoftwareForDevice,
	};
};

export default useSoftwareApi;
