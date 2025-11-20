import { AxiosError } from 'axios';
import { ApiResponseType } from '../helpers';
import { useHttpPrivateRequest } from '../http';
import { API_URL } from '../keys';
import {
	DeviceAssignmentPayload,
	DeviceAssignmentResponse,
	DeviceCreatePayload,
	DeviceCredentialResponse,
	DeviceResponse,
	DeviceSoftwareResponse,
	DeviceUpdatePayload,
	QrCodeResponse,
} from './types';

const useDeviceApi = (baseURL = API_URL) => {
	if (!baseURL) {
		console.error(
			'❌ API_URL is not defined! Check your app.json configuration.'
		);
		throw new Error('API_URL is not configured');
	}

	const privateApi = useHttpPrivateRequest({
		baseURL,
		onAuthFailure: () => {
			console.log('🔒 Device API: Authentication failed');
			// Handle auth failure (e.g., navigate to login)
		},
	});

	// -----------------------------
	// Device CRUD Operations
	// -----------------------------

	/**
	 * Create a new device
	 * POST /devices/create
	 */
	const createDevice = async (payload: DeviceCreatePayload) => {
		try {
			const { data } = await privateApi.post<
				ApiResponseType<DeviceResponse>
			>('/devices/create', payload);
			return data;
		} catch (error) {
			handleAxiosError(error, 'POST /devices/create', baseURL);
		}
	};

	/**
	 * Get all devices
	 * GET /devices/all
	 */
	const getDeviceList = async (params?: Record<string, any>) => {
		const endpoint = '/devices/all';
		try {
			const { data } = await privateApi.get<
				ApiResponseType<DeviceResponse[]>
			>(endpoint, { params });
			console.log('✅ [DeviceApi] getDeviceList:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	/**
	 * Get device by ID
	 * GET /devices/:id
	 */
	const getDeviceById = async (id: string) => {
		const endpoint = `/devices/${id}`;
		try {
			const { data } =
				await privateApi.get<ApiResponseType<DeviceResponse>>(endpoint);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	/**
	 * Get device by Serial Number
	 * GET /devices/serial/:serialNumber
	 */
	const getDeviceBySerialNumber = async (serialNumber: string) => {
		const endpoint = `/devices/serial/${serialNumber}`;
		try {
			const { data } =
				await privateApi.get<ApiResponseType<DeviceResponse>>(endpoint);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	/**
	 * Update an existing device
	 * PATCH /devices/:id
	 */
	const updateDevice = async (id: string, payload: DeviceUpdatePayload) => {
		const endpoint = `/devices/${id}`;
		try {
			const { data } = await privateApi.patch<
				ApiResponseType<DeviceResponse>
			>(endpoint, payload);
			return data;
		} catch (error) {
			handleAxiosError(error, `PATCH ${endpoint}`, baseURL);
		}
	};

	/**
	 * Delete a device by ID
	 * DELETE /devices/:id
	 */
	const deleteDevice = async (id: string) => {
		const endpoint = `/devices/${id}`;
		try {
			const { data } =
				await privateApi.delete<ApiResponseType<DeviceResponse>>(
					endpoint
				);
			return data;
		} catch (error) {
			handleAxiosError(error, `DELETE ${endpoint}`, baseURL);
		}
	};

	// -----------------------------
	// Device Assignment Operations
	// -----------------------------

	/**
	 * Assign a device to a user or entity
	 * POST /devices/assign
	 */
	const assignDevice = async (payload: DeviceAssignmentPayload) => {
		const endpoint = '/devices/assignments/assign';
		try {
			const { data } = await privateApi.post<
				ApiResponseType<DeviceAssignmentResponse>
			>(endpoint, payload);
			return data;
		} catch (error) {
			handleAxiosError(error, `POST ${endpoint}`, baseURL);
		}
	};

	/**
	 * Unassign a device by assignment ID
	 * DELETE /devices/unassign/:assignmentId
	 */
	const unassignDevice = async (assignmentId: string) => {
		const endpoint = `/devices/assignments/unassign/${assignmentId}`;
		try {
			const { data } =
				await privateApi.delete<
					ApiResponseType<DeviceAssignmentResponse>
				>(endpoint);
			return data;
		} catch (error) {
			handleAxiosError(error, `DELETE ${endpoint}`, baseURL);
		}
	};

	/**
	 * Get all assignments for a specific device
	 * GET /devices/:id/assignments
	 */
	const getDeviceAssignments = async (deviceId: string) => {
		const endpoint = `/devices/${deviceId}/assignments`;
		try {
			const { data } =
				await privateApi.get<
					ApiResponseType<DeviceAssignmentResponse[]>
				>(endpoint);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	/**
	 * Get all device assignments
	 * GET /devices/assignments/all
	 */
	const getAllAssignments = async () => {
		const endpoint = '/devices/assignments/all';
		try {
			const { data } =
				await privateApi.get<
					ApiResponseType<DeviceAssignmentResponse[]>
				>(endpoint);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	// -----------------------------
	// Device Software Management
	// -----------------------------

	/**
	 * Link a software to a device
	 * POST /devices/:id/link-software/:softwareId
	 */
	const linkSoftwareToDevice = async (
		deviceId: string,
		softwareId: string
	) => {
		const endpoint = `/devices/software/${deviceId}/link/${softwareId}`;
		try {
			const { data } =
				await privateApi.post<ApiResponseType<DeviceSoftwareResponse>>(
					endpoint
				);
			return data;
		} catch (error) {
			handleAxiosError(error, `POST ${endpoint}`, baseURL);
		}
	};

	/**
	 * Unlink a software from a device
	 * POST /devices/:id/unlink-software/:softwareId
	 */
	const unlinkSoftwareFromDevice = async (
		deviceId: string,
		softwareId: string
	) => {
		const endpoint = `/devices/software/${deviceId}/unlink/${softwareId}`;
		try {
			const { data } =
				await privateApi.delete<
					ApiResponseType<DeviceSoftwareResponse>
				>(endpoint);
			return data;
		} catch (error) {
			handleAxiosError(error, `POST ${endpoint}`, baseURL);
		}
	};

	/**
	 * Get all software linked to a device
	 * GET /devices/:id/software
	 */
	const getSoftwareForDevice = async (deviceId: string) => {
		const endpoint = `/devices/${deviceId}/software`;
		try {
			const { data } =
				await privateApi.get<ApiResponseType<DeviceSoftwareResponse[]>>(
					endpoint
				);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	/**
	 * Get specific device-software link by ID
	 * GET /devices/links/software/:deviceSoftwareId
	 */
	const getDeviceSoftwareLink = async (deviceSoftwareId: string) => {
		const endpoint = `/devices/software/links/${deviceSoftwareId}`;
		try {
			const { data } =
				await privateApi.get<ApiResponseType<DeviceSoftwareResponse>>(
					endpoint
				);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	/**
	 * Get all device-software links
	 * GET /devices/software/links/all
	 */
	const getAllDeviceSoftwareLinks = async () => {
		const endpoint = '/devices/software/links/all';
		try {
			const { data } =
				await privateApi.get<ApiResponseType<DeviceSoftwareResponse[]>>(
					endpoint
				);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	// -----------------------------
	// QR Code Operations
	// -----------------------------

	/**
	 * Generate QR code for a device
	 * GET /devices/:id/qrcode
	 */
	const generateQrCode = async (deviceId: string) => {
		const endpoint = `/devices/${deviceId}/qrcode`;
		try {
			const { data } =
				await privateApi.get<ApiResponseType<QrCodeResponse>>(endpoint);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	// Get credential by device
	const getCredentialByDevice = async (deviceId: string) => {
		const endpoint = `/devices/${deviceId}/credentials`;
		try {
			const { data } =
				await privateApi.get<ApiResponseType<DeviceCredentialResponse>>(
					endpoint
				);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	return {
		// Device CRUD
		createDevice,
		getDeviceList,
		getDeviceById,
		getDeviceBySerialNumber,
		updateDevice,
		deleteDevice,

		// Device Assignment
		assignDevice,
		unassignDevice,
		getDeviceAssignments,
		getAllAssignments,

		// Device Software Management
		linkSoftwareToDevice,
		unlinkSoftwareFromDevice,
		getSoftwareForDevice,
		getDeviceSoftwareLink,
		getAllDeviceSoftwareLinks,

		// QR Code
		generateQrCode,

		// Credential Device
		getCredentialByDevice,
	};
};

/** 🔴 Centralized error handler */
function handleAxiosError(error: unknown, operation: string, baseURL: string) {
	console.error(`❌ [DeviceApi] Error in: ${operation}`);

	if (error instanceof AxiosError) {
		const fullUrl = (baseURL || '') + (error.config?.url || '');
		console.error('🌐 Full URL:', fullUrl);
		console.error('📡 Status:', error.response?.status);
		console.error('📡 Error Details:', error.message);
		console.error('📡 Response:', error.response?.data);
	} else {
		console.error('⚠️ Non-Axios error:', error);
	}

	throw error; // Re-throw to let React Query or caller handle it
}

export default useDeviceApi;
