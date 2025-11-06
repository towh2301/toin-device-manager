import axios, { AxiosInstance } from 'axios';

export const useHttpPublicRequest = (baseURL: string): AxiosInstance => {
	const apiInstance = axios.create({
		baseURL,
		headers: {
			'Cache-Control': 'no-cache',
			Pragma: 'no-cache',
			Expires: 0,
			Accept: 'application/json',
		},
		timeout: 30000,
	});

	apiInstance.interceptors.request.use((config) => {
		console.log('🌐 [Public Request URL]:', baseURL + (config.url || ''));
		return config;
	});

	apiInstance.interceptors.response.use(
		(response) => {
			console.log(
				'✅ [Public Response]:',
				response.status,
				response.statusText
			);
			return response;
		},
		(error) => {
			console.error('❌ [Public Request Error]:', error.message);
			if (error.response) {
				console.error('📡 Error Status:', error.response.status);
				console.error('📡 Error Data:', error.response.data);
			}
			return Promise.reject(error);
		}
	);

	return apiInstance;
};

export default useHttpPublicRequest;
