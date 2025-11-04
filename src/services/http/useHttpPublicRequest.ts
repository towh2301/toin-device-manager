import axios, { AxiosInstance } from 'axios';

const useHttpPublicRequest = (baseURL: string): AxiosInstance => {
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

	return apiInstance;
};

export default useHttpPublicRequest;
