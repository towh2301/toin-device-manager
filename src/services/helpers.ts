type ApiCall = (..._args: any[]) => Promise<any>;

export async function responseWrapper<T>(
	func: ApiCall,
	args: any[] = []
): Promise<T> {
	try {
		const response = await func(...args);

		// If response is not an object (e.g. null, undefined), default to {}
		const safeResponse = response ?? {};

		// Success: 2xx
		if (
			(safeResponse.status >= 200 && safeResponse.status < 300) ||
			safeResponse.success === true
		) {
			return safeResponse.data; // Return data directly
		}

		// Handle specific known errors
		if (safeResponse?.originalError?.message === 'CONNECTION_TIMEOUT') {
			alert(
				'Connection timeout. Please check your network and try again.'
			);
		}

		// All non-2xx → throw error
		throw new Error(
			safeResponse.message ||
				JSON.stringify(safeResponse.data) ||
				'API Error'
		);
	} catch (err: any) {
		// Re-throw as Error
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
