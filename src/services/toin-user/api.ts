import { AxiosError } from 'axios';
import { ApiResponseType } from '../helpers';
import { useHttpPrivateRequest } from '../http';
import { API_URL } from '../keys';
import {
	ToinUserCreatePayload,
	ToinUserResponse,
	ToinUserUpdatePayload,
} from './types';

const useToinUserApi = (baseURL = API_URL) => {
	if (!baseURL) {
		console.error(
			'❌ API_URL is not defined! Check your app.json configuration.'
		);
		throw new Error('API_URL is not configured');
	}

	const privateApi = useHttpPrivateRequest({
		baseURL,
		onAuthFailure: () => {
			console.log('🔒 Toin User API: Authentication failed');
			// Handle auth failure (e.g., navigate to login)
		},
	});

	// -----------------------------
	// Toin User CRUD Operations
	// -----------------------------

	/**
	 * Get all Toin Users
	 * GET /toin-user/all
	 */
	const getToinUserList = async (params?: Record<string, any>) => {
		const endpoint = '/toin-user/all';
		try {
			const { data } = await privateApi.get<
				ApiResponseType<ToinUserResponse[]>
			>(endpoint, { params });
			console.log('✅ [ToinUserApi] getToinUserList:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	/**
	 * Get Toin User by ID
	 * GET /toin-user/:id
	 */
	const getToinUserById = async (id: string) => {
		const endpoint = `/toin-user/${id}`;
		try {
			const { data } =
				await privateApi.get<ApiResponseType<ToinUserResponse>>(
					endpoint
				);
			console.log('✅ [ToinUserApi] getToinUserById:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	/**
	 * Create a new Toin User
	 * POST /toin-user/create
	 */
	const createToinUser = async (payload: ToinUserCreatePayload) => {
		const endpoint = '/toin-user/create';
		try {
			const { data } = await privateApi.post<
				ApiResponseType<ToinUserResponse>
			>(endpoint, payload);
			console.log('✅ [ToinUserApi] createToinUser:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `POST ${endpoint}`, baseURL);
		}
	};

	/**
	 * Update an existing Toin User
	 * PATCH /toin-user/:id
	 */
	const updateToinUser = async (
		id: string,
		payload: ToinUserUpdatePayload
	) => {
		const endpoint = `/toin-user/${id}`;
		try {
			const { data } = await privateApi.patch<
				ApiResponseType<ToinUserResponse>
			>(endpoint, payload);
			console.log('✅ [ToinUserApi] updateToinUser:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `PATCH ${endpoint}`, baseURL);
		}
	};

	/**
	 * Delete a Toin User by ID
	 * DELETE /toin-user/:id
	 */
	const deleteToinUser = async (id: string) => {
		const endpoint = `/toin-user/${id}`;
		try {
			const { data } = await privateApi.delete<
				ApiResponseType<{
					id: string;
					firstname: string;
					lastname: string;
					email: string;
				}>
			>(endpoint);
			console.log('✅ [ToinUserApi] deleteToinUser:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `DELETE ${endpoint}`, baseURL);
		}
	};

	/**
	 * Get list of all departments
	 * GET /toin-user/departments/list
	 */
	const getDepartmentList = async () => {
		const endpoint = '/toin-user/departments/list';
		try {
			const { data } =
				await privateApi.get<ApiResponseType<string[]>>(endpoint);
			console.log('✅ [ToinUserApi] getDepartmentList:', data);
			return data;
		} catch (error) {
			handleAxiosError(error, `GET ${endpoint}`, baseURL);
		}
	};

	return {
		getToinUserList,
		getToinUserById,
		createToinUser,
		updateToinUser,
		deleteToinUser,
		getDepartmentList,
	};
};

/** 🔴 Centralized error handler */
function handleAxiosError(error: unknown, operation: string, baseURL: string) {
	console.error(`❌ [ToinUserApi] Error in: ${operation}`);

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

export default useToinUserApi;
