type ApiCall = (..._args: any[]) => Promise<any>;

export async function responseWrapper<T>(
	func: ApiCall,
	args: any[] = []
): Promise<T> {
	try {
		console.log('🔄 [Response Wrapper] Making API call with args:', args);
		const response = await func(...args);

		console.log('📡 [Response Wrapper] Raw response:', response);

		// The response should already be extracted from Axios by the API functions
		// Check if it's our API response format (has success field)
		if (response && typeof response === 'object' && 'success' in response) {
			if (response.success === true) {
				console.log(
					'✅ [Response Wrapper] Success API response:',
					response
				);
				return response as T;
			} else {
				console.error(
					'❌ [Response Wrapper] API returned success: false:',
					response
				);
				throw new Error(
					response.message || 'API returned success: false'
				);
			}
		}

		// If it still looks like an Axios response (has status), handle it
		if (
			response &&
			typeof response === 'object' &&
			'status' in response &&
			'data' in response
		) {
			const axiosResponse = response as any;

			// Check if it's a successful HTTP status
			if (axiosResponse.status >= 200 && axiosResponse.status < 300) {
				console.log(
					'✅ [Response Wrapper] Axios success response:',
					axiosResponse.data
				);

				// Check if the data has success field
				if (
					axiosResponse.data &&
					typeof axiosResponse.data === 'object' &&
					'success' in axiosResponse.data
				) {
					if (axiosResponse.data.success === true) {
						return axiosResponse.data as T;
					} else {
						throw new Error(
							axiosResponse.data.message ||
								'API returned success: false'
						);
					}
				}

				return axiosResponse.data as T;
			} else {
				throw new Error(`HTTP ${axiosResponse.status} Error`);
			}
		}

		// If it's a plain object without success field, assume it's valid data
		if (response && typeof response === 'object') {
			console.log(
				'✅ [Response Wrapper] Plain object response:',
				response
			);
			return response as T;
		}

		// Handle null/undefined/primitive responses
		console.log('✅ [Response Wrapper] Primitive/null response:', response);
		return response as T;
	} catch (err: any) {
		console.error('❌ [Response Wrapper] Error:', err);

		// Handle Axios errors specifically
		if (err.response) {
			console.error(
				'📡 [Response Wrapper] Axios Error Response:',
				err.response.data
			);
			console.error(
				'📡 [Response Wrapper] Axios Error Status:',
				err.response.status
			);

			// Try to extract error message from response
			const errorMessage =
				err.response.data?.message ||
				err.response.data?.error ||
				err.message ||
				`HTTP ${err.response.status} Error`;

			throw new Error(errorMessage);
		}

		// Re-throw as Error for other cases
		throw err instanceof Error ? err : new Error(String(err));
	}
}

export interface ApiResponseType<T> {
	success: boolean;
	code: number;
	data: T;
	message?: string;
	timestamp: string;
	[key: string]: any;
}

export interface PaginationResponseType<T> {
	current: number;
	totalPages: number;
	pageSize: number;
	totalElements: number;
	data: T;
}
export type TableParams = {
	skip?: number;
	take?: number;
	order?: string;
	search?: string;
	sort?: string;
	[key: string]: number | boolean | string | string[] | undefined;
};

export type GetPropertiesParams = {
	[key: string]: string | number | string[] | boolean;
};
