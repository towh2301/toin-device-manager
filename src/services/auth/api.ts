import { useHttpPrivateRequest } from '../http/useHttpPrivateRequest';
import { useHttpPublicRequest } from '../http/useHttpPublicRequest';
import { API_URL } from '../keys';
import { LoginPayload } from './types';

const useApi = (baseURL = API_URL) => {
	if (!baseURL) {
		console.error(
			'❌ API_URL is not defined! Check your app.json configuration.'
		);
		throw new Error('API_URL is not configured');
	}

	const publicApi = useHttpPublicRequest(baseURL);

	// Add onAuthFailure callback to handle authentication errors
	const privateApi = useHttpPrivateRequest({
		baseURL,
		onAuthFailure: () => {
			console.log('🔒 Authentication failed, user needs to login again');
			// You can add navigation logic or store reset here
		},
	});

	const login = (payload: LoginPayload) => {
		console.log('🔐 [Auth API] Attempting login for:', payload.username);
		return publicApi.post('/auth/login', payload);
	};

	const getUserInfo = () => {
		console.log('👤 [Auth API] Fetching user info');
		return privateApi.get('/users/myInfo');
	};

	const getRefreshToken = () => {
		console.log('🔄 [Auth API] Refreshing token');
		return publicApi.post('/auth/refresh');
	};

	return {
		login,
		getUserInfo,
		getRefreshToken,
	};
};

export default useApi;
