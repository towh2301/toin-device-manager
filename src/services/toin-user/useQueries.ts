import {
	useQuery,
	useQueryClient,
	UseQueryOptions,
} from '@tanstack/react-query';
import { useState } from 'react';
import {
	ApiResponseType,
	GetPropertiesParams,
	responseWrapper,
} from '../helpers';
import { API_KEYS } from '../keys';
import useToinUserApi from './api';
import { ToinUserResponse } from './types';

/**
 * Hook to get all Toin Users
 */
export function useGetAllToinUsers(
	options?: UseQueryOptions<ApiResponseType<ToinUserResponse[]>, Error> & {
		propertiesParams?: GetPropertiesParams;
		enabled?: boolean;
	}
) {
	const api = useToinUserApi();

	const [params, setParams] = useState<GetPropertiesParams>(
		options?.propertiesParams || {}
	);

	const queryClient = useQueryClient();

	const {
		data,
		isLoading,
		isError,
		error,
		isFetching,
		refetch: onGetAllToinUsers,
	} = useQuery<ApiResponseType<ToinUserResponse[]>, Error>({
		queryKey: [API_KEYS.ALL_TOIN_USERS, params],
		queryFn: async ({ queryKey }) => {
			console.log(
				'🔄 [useGetAllToinUsers] Starting fetch with params:',
				params
			);

			try {
				const response = await responseWrapper<
					ApiResponseType<ToinUserResponse[]>
				>(api.getToinUserList, [params]);
				console.log(
					'✅ [useGetAllToinUsers] Success response:',
					response
				);
				return response;
			} catch (err: any) {
				console.error('❌ [useGetAllToinUsers] API error:', err);
				console.error(
					'❌ [useGetAllToinUsers] Error message:',
					err.message
				);

				// Provide more context in the error
				const enhancedError = new Error(
					`Failed to fetch toin users: ${err.message || 'Unknown error'}`
				);
				throw enhancedError;
			}
		},
		enabled: options?.enabled !== false, // Allow disabling the query
		retry: (failureCount, error) => {
			console.log(
				`🔄 [useGetAllToinUsers] Retry attempt ${failureCount} for error:`,
				error.message
			);
			return failureCount < 2; // Retry up to 2 times
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		...options,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	const invalidateToinUsers = () => {
		queryClient.invalidateQueries({ queryKey: [API_KEYS.ALL_TOIN_USERS] });
	};

	const toinUserData = data?.data ?? [];

	return {
		toinUserData,
		isLoading,
		isError,
		error,
		isFetching,
		onGetAllToinUsers,
		invalidateToinUsers,
		setParams, // expose for filtering/pagination
	};
}

/**
 * Hook to get a Toin User by ID
 */
export function useGetToinUserById(
	userId: string,
	options?: UseQueryOptions<ApiResponseType<ToinUserResponse>, Error> & {
		enabled?: boolean;
	}
) {
	const api = useToinUserApi();
	const queryClient = useQueryClient();

	const {
		data,
		isLoading,
		isError,
		error,
		isFetching,
		refetch: onGetToinUserById,
	} = useQuery<ApiResponseType<ToinUserResponse>, Error>({
		queryKey: [API_KEYS.TOIN_USER_BY_ID, userId],
		queryFn: async () => {
			console.log(
				'🔄 [useGetToinUserById] Starting fetch for user:',
				userId
			);

			try {
				const response = await responseWrapper<
					ApiResponseType<ToinUserResponse>
				>(api.getToinUserById, [userId]);
				console.log(
					'✅ [useGetToinUserById] Success response:',
					response
				);
				return response;
			} catch (err: any) {
				console.error('❌ [useGetToinUserById] API error:', err);
				console.error(
					'❌ [useGetToinUserById] Error message:',
					err.message
				);

				// Provide more context in the error
				const enhancedError = new Error(
					`Failed to fetch toin user: ${err.message || 'Unknown error'}`
				);
				throw enhancedError;
			}
		},
		enabled: !!userId && options?.enabled !== false, // Only run if userId is provided
		retry: (failureCount, error) => {
			console.log(
				`🔄 [useGetToinUserById] Retry attempt ${failureCount} for error:`,
				error.message
			);
			return failureCount < 2; // Retry up to 2 times
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
		...options,
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
	});

	const invalidateToinUser = () => {
		queryClient.invalidateQueries({
			queryKey: [API_KEYS.TOIN_USER_BY_ID, userId],
		});
	};

	const toinUserData = data?.data;

	return {
		toinUserData,
		isLoading,
		isError,
		error,
		isFetching,
		onGetToinUserById,
		invalidateToinUser,
	};
}

/**
 * Hook to get the list of all departments
 */
export function useGetDepartmentList(
	options?: UseQueryOptions<ApiResponseType<string[]>, Error>
) {
	const api = useToinUserApi();

	return useQuery<ApiResponseType<string[]>, Error>({
		queryKey: [API_KEYS.DEPARTMENT_LIST],
		queryFn: async () => {
			console.log('🔄 [useGetDepartmentList] Fetching department list');
			const response = await responseWrapper<ApiResponseType<string[]>>(
				api.getDepartmentList,
				[]
			);
			console.log('✅ [useGetDepartmentList] Success:', response.data);
			return response;
		},
		staleTime: 60 * 60 * 1000, // 1 hour (departments rarely change)
		gcTime: 24 * 60 * 60 * 1000, // 24 hours
		...options,
	});
}
