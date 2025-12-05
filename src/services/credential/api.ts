import { AxiosError } from 'axios';
import { ApiResponseType } from '../helpers';
import { useHttpPrivateRequest } from '../http';
import { API_URL } from '../keys';
import {
	CredentialCreatePayload,
	CredentialResponse,
	CredentialUpdatePayload,
} from './types';

const handleAxiosError = (
	error: unknown,
	endpoint: string,
	baseURL: string
): never => {
	if (error instanceof AxiosError) {
		const status = error.response?.status;
		const message = error.response?.data?.message || error.message;
		console.error(`❌ [CredentialApi] ${endpoint} failed:`, {
			status,
			message,
			endpoint,
			baseURL,
		});
		throw new Error(message);
	}
	console.error(`❌ [CredentialApi] ${endpoint} unexpected error:`, error);
	throw error;
};

const useCredentialApi = (baseURL = API_URL) => {
	if (!baseURL) {
		console.error(
			'❌ API_URL is not defined! Check your app.json configuration.'
		);
		throw new Error('API_URL is not configured');
	}

	const privateApi = useHttpPrivateRequest({
		baseURL,
		onAuthFailure: () => {
			console.log('🔒 Credential API: Authentication failed');
		},
	});

	/**
	 * Get all credentials
	 * GET /credential
	 */
	const getAllCredentials = async () => {
		const endpoint = '/credentials';
		try {
			const { data } =
				await privateApi.get<ApiResponseType<CredentialResponse[]>>(
					endpoint
				);
			console.log('✅ [CredentialApi] getAllCredentials:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	/**
	 * Get single credential by ID
	 * GET /credential/:id
	 */
	const getCredentialById = async (id: string) => {
		const endpoint = `/credentials/${id}`;
		try {
			const { data } =
				await privateApi.get<ApiResponseType<CredentialResponse>>(
					endpoint
				);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	/**
	 * Create new credential
	 * POST /credential
	 */
	const createCredential = async (payload: CredentialCreatePayload) => {
		const endpoint = '/credentials';
		try {
			const { data } = await privateApi.post<
				ApiResponseType<CredentialResponse>
			>(endpoint, payload);
			console.log('✅ [CredentialApi] createCredential:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `POST ${endpoint}`, baseURL);
		}
	};

	/**
	 * Update credential
	 * PATCH /credential/:id
	 */
	const updateCredential = async (
		id: string,
		payload: CredentialUpdatePayload
	) => {
		const endpoint = `/credentials/${id}`;
		try {
			const { data } = await privateApi.patch<
				ApiResponseType<CredentialResponse>
			>(endpoint, payload);
			console.log('✅ [CredentialApi] updateCredential:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `PATCH ${endpoint}`, baseURL);
		}
	};

	/**
	 * Delete credential
	 * DELETE /credential/:id
	 */
	const deleteCredential = async (id: string) => {
		const endpoint = `/credentials/${id}`;
		try {
			const { data } = await privateApi.delete<
				ApiResponseType<{
					id: string | number;
					service_name: string;
				}>
			>(endpoint);
			console.log('✅ [CredentialApi] deleteCredential:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `DELETE ${endpoint}`, baseURL);
		}
	};

	// Link credential with device
	const linkCredential = async (deviceId: string, credentialId: string) => {
		const endpoint = `/credentials/${deviceId}/link/${credentialId}`;
		try {
			const { data } = await privateApi.post<
				ApiResponseType<{
					deviceId: {
						id: string;
						name: string;
					};
					credential: {
						id: string;
					};
				}>
			>(endpoint);
			return data;
		} catch (error) {
			handleAxiosError(error, `POST ${endpoint}`, baseURL);
		}
	};

	return {
		getAllCredentials,
		getCredentialById,
		createCredential,
		updateCredential,
		deleteCredential,
	};
};

export default useCredentialApi;
