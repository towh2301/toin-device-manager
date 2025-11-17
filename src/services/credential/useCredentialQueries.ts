import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ApiResponseType, responseWrapper } from '../helpers';
import { API_KEYS } from '../keys';
import useCredentialApi from './api';
import { CredentialResponse } from './types';

/**
 * Custom hooks for Credential queries (Read operations)
 */

/**
 * Hook to get all credentials
 */
export function useGetAllCredentials(
	options?: UseQueryOptions<ApiResponseType<CredentialResponse[]>, Error>
) {
	const api = useCredentialApi();

	const query = useQuery<ApiResponseType<CredentialResponse[]>, Error>({
		queryKey: [API_KEYS.ALL_CREDENTIALS],
		queryFn: async () => {
			console.log(
				'🔄 [useGetAllCredentials] Fetching all credentials...'
			);
			const response = await responseWrapper<
				ApiResponseType<CredentialResponse[]>
			>(api.getAllCredentials, []);
			console.log('✅ [useGetAllCredentials] Success:', response);
			return response;
		},
		...options,
	});

	return {
		data: query.data?.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch,
	};
}

/**
 * Hook to get single credential by ID
 */
export function useGetCredentialById(
	id: string,
	options?: UseQueryOptions<ApiResponseType<CredentialResponse>, Error>
) {
	const api = useCredentialApi();

	const query = useQuery<ApiResponseType<CredentialResponse>, Error>({
		queryKey: [API_KEYS.CREDENTIAL_BY_ID, id],
		queryFn: async () => {
			console.log('🔄 [useGetCredentialById] Fetching credential:', id);
			const response = await responseWrapper<
				ApiResponseType<CredentialResponse>
			>(api.getCredentialById, [id]);
			console.log('✅ [useGetCredentialById] Success:', response);
			return response;
		},
		enabled: !!id,
		...options,
	});

	return {
		credential: query.data?.data,
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		onRefetch: query.refetch,
	};
}
