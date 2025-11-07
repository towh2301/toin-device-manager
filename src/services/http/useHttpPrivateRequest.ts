import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {
	AxiosError,
	AxiosInstance,
	InternalAxiosRequestConfig,
} from 'axios';

interface HttpPrivateRequestOptions {
	baseURL: string;
	onAuthFailure?: () => void;
}

let privateApiInstance: AxiosInstance | null = null;
let isRefreshing = false;
let refreshQueue: Array<{
	resolve: (token: string) => void;
	reject: (err: any) => void;
}> = [];

function queueRefresh(): Promise<string> {
	return new Promise((resolve, reject) => {
		refreshQueue.push({ resolve, reject });
	});
}

function processRefreshQueue(error: any, token: string | null) {
	refreshQueue.forEach(({ resolve, reject }) => {
		if (error) reject(error);
		else if (token) resolve(token);
		else reject(new Error('No token provided after refresh'));
	});
	refreshQueue = [];
}

function extract(obj: any, keys: string[]): string | null {
	if (!obj || typeof obj !== 'object') return null;
	for (const k of keys) {
		if (k in obj && typeof obj[k] === 'string') return obj[k];
	}
	return null;
}

async function performRefresh(
	baseURL: string
): Promise<{ access: string; refresh: string }> {
	const storedRefresh = await AsyncStorage.getItem('refresh_token');
	if (!storedRefresh) throw new Error('Missing refresh_token');

	// Call refresh endpoint – try both payload key variants
	const response = await axios.post(`${baseURL}/auth/refresh`, {
		token: storedRefresh,
		refresh_token: storedRefresh,
	});

	// Try multiple shapes: response.data.result.*, response.data.data.*, or direct top-level
	const container =
		response.data?.result || response.data?.data || response.data;
	const access =
		extract(container, ['access_token', 'accessToken']) ||
		extract(response.data, ['access_token', 'accessToken']);
	const refresh =
		extract(container, ['refresh_token', 'refreshToken']) ||
		extract(response.data, ['refresh_token', 'refreshToken']);

	if (!access || !refresh) {
		throw new Error('Refresh response did not contain new tokens');
	}

	await AsyncStorage.multiSet([
		['access_token', access],
		['refresh_token', refresh],
	]);
	return { access, refresh };
}

export const useHttpPrivateRequest = ({
	baseURL,
	onAuthFailure,
}: HttpPrivateRequestOptions): AxiosInstance => {
	if (privateApiInstance) return privateApiInstance;

	privateApiInstance = axios.create({
		baseURL,
		headers: {
			Accept: 'application/json',
		},
		timeout: 20000,
	});

	privateApiInstance.interceptors.request.use(
		async (config: InternalAxiosRequestConfig) => {
			const access_token = await AsyncStorage.getItem('access_token');
			if (access_token) {
				config.headers = config.headers || {};
				(config.headers as any)['Authorization'] =
					`Bearer ${access_token}`;
			}
			console.log(
				'🔑 [Auth Header]:',
				(config.headers as any)['Authorization']
			);
			console.log('🌐 [Request URL]:', baseURL + (config.url || ''));
			return config;
		}
	);

	privateApiInstance.interceptors.response.use(
		(res) => res,
		async (error: AxiosError) => {
			const originalRequest: any = error.config;
			if (!error.response) {
				console.error('❌ No response (Network Error)', error.message);
				return Promise.reject(error);
			}

			if (error.response.status === 401) {
				// Avoid infinite loop
				if (originalRequest._retry) {
					return Promise.reject(error);
				}
				originalRequest._retry = true;

				try {
					if (isRefreshing) {
						const newToken = await queueRefresh();
						originalRequest.headers = originalRequest.headers || {};
						originalRequest.headers['Authorization'] =
							`Bearer ${newToken}`;
						return privateApiInstance!(originalRequest);
					}

					isRefreshing = true;
					const { access } = await performRefresh(baseURL);
					processRefreshQueue(null, access);
					originalRequest.headers = originalRequest.headers || {};
					originalRequest.headers['Authorization'] =
						`Bearer ${access}`;
					return privateApiInstance!(originalRequest);
				} catch (refreshError) {
					processRefreshQueue(refreshError, null);
					await AsyncStorage.multiRemove([
						'access_token',
						'refresh_token',
					]);
					onAuthFailure?.();
					return Promise.reject(refreshError);
				} finally {
					isRefreshing = false;
				}
			}

			console.error(
				'📡 Axios Error:',
				error.response?.status,
				error.message
			);
			return Promise.reject(error);
		}
	);

	return privateApiInstance;
};
