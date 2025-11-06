import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError, AxiosInstance } from 'axios';

interface HttpPrivateRequestOptions {
	baseURL: string;
	onAuthFailure?: () => void;
}

let privateApiInstance: AxiosInstance | null = null;

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

	privateApiInstance.interceptors.request.use(async (config) => {
		const access_token = await AsyncStorage.getItem('access_token');
		if (access_token) {
			config.headers = config.headers || {};
			config.headers['Authorization'] = `Bearer ${access_token}`;
		}
		console.log('🔑 [Auth Header]:', config.headers['Authorization']);
		console.log('🌐 [Request URL]:', baseURL + (config.url || ''));
		return config;
	});

	privateApiInstance.interceptors.response.use(
		(res) => res,
		async (error: AxiosError) => {
			const originalRequest = error.config as any;
			if (!error.response) {
				console.error('❌ No response (Network Error)', error.message);
				return Promise.reject(error);
			}

			// Nếu là 401, thử refresh
			if (error.response.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true;
				try {
					const refresh_token =
						await AsyncStorage.getItem('refresh_token');
					if (!refresh_token)
						throw new Error('Missing refresh_token');

					const { data } = await axios.post(
						`${baseURL}/auth/refresh`,
						{
							refresh_token,
						}
					);

					const newAccess = data.result.access_token;
					const newRefresh = data.result.refresh_token;

					await AsyncStorage.multiSet([
						['access_token', newAccess],
						['refresh_token', newRefresh],
					]);

					originalRequest.headers['Authorization'] =
						`Bearer ${newAccess}`;
					return privateApiInstance!(originalRequest);
				} catch (refreshError) {
					await AsyncStorage.multiRemove([
						'access_token',
						'refresh_token',
					]);
					onAuthFailure?.();
					return Promise.reject(refreshError);
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
