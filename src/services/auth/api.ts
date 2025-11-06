import { useHttpPrivateRequest } from '../http/useHttpPrivateRequest';
import useHttpPublicRequest from '../http/useHttpPublicRequest';
import { API_URL } from '../keys';
import { LoginPayload } from './types';

const useApi = (baseURL = API_URL) => {
	const publicApi = useHttpPublicRequest(baseURL);
	const privateApi = useHttpPrivateRequest(baseURL);

	const login = (payload: LoginPayload) => {
		return publicApi.post('/auth/login', payload);
	};

	const getUserInfo = () => {
		return privateApi.get('/users/myInfo');
	};

	const getRefreshToken = () => {
		return publicApi.post('/auth/refresh');
	};

	return {
		login,
		getUserInfo,
		getRefreshToken,
	};
};

export default useApi;
