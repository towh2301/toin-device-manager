// Network utility functions
import { API_URL } from '../services/keys';

export const checkNetworkConnection = async (): Promise<boolean> => {
	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

		const response = await fetch(`${API_URL}/health`, {
			method: 'GET',
			signal: controller.signal,
		});

		clearTimeout(timeoutId);
		return response.ok;
	} catch (error) {
		console.error('🌐 [Network] Connection check failed:', error);
		return false;
	}
};

export const isNetworkError = (error: any): boolean => {
	if (!error) return false;

	const errorMessage = error.message?.toLowerCase() || '';

	return (
		errorMessage.includes('network error') ||
		errorMessage.includes('network request failed') ||
		errorMessage.includes('timeout') ||
		errorMessage.includes('connection') ||
		error.code === 'NETWORK_ERROR' ||
		error.code === 'TIMEOUT'
	);
};

export const getNetworkErrorMessage = (error: any): string => {
	if (isNetworkError(error)) {
		return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối internet và thử lại.';
	}

	return error.message || 'Đã xảy ra lỗi không xác định';
};
