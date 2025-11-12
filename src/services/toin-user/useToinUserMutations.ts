import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_KEYS } from '../keys';
import useToinUserApi from './api';
import { ToinUserCreatePayload, ToinUserUpdatePayload } from './types';

/**
 * Hook to create a new Toin User
 */
export function useCreateToinUser() {
	const api = useToinUserApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: ToinUserCreatePayload) => {
			console.log('🔄 [useCreateToinUser] Creating toin user:', payload);
			const response = await api.createToinUser(payload);
			console.log('✅ [useCreateToinUser] Success:', response);
			return response;
		},
		onSuccess: (data) => {
			console.log('✅ [useCreateToinUser] Invalidating toin users cache');
			// Invalidate and refetch toin users list
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_TOIN_USERS],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.TOIN_USERS],
			});
		},
		onError: (error: Error) => {
			console.error('❌ [useCreateToinUser] Error:', error.message);
		},
	});
}

/**
 * Hook to update an existing Toin User
 */
export function useUpdateToinUser() {
	const api = useToinUserApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			payload,
		}: {
			id: string;
			payload: ToinUserUpdatePayload;
		}) => {
			console.log(
				'🔄 [useUpdateToinUser] Updating toin user:',
				id,
				payload
			);
			const response = await api.updateToinUser(id, payload);
			console.log('✅ [useUpdateToinUser] Success:', response);
			return response;
		},
		onSuccess: (data, variables) => {
			console.log(
				'✅ [useUpdateToinUser] Invalidating toin user cache for:',
				variables.id
			);
			// Invalidate specific user and list
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.TOIN_USER_BY_ID, variables.id],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_TOIN_USERS],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.TOIN_USERS],
			});
		},
		onError: (error: Error) => {
			console.error('❌ [useUpdateToinUser] Error:', error.message);
		},
	});
}

/**
 * Hook to delete a Toin User
 */
export function useDeleteToinUser() {
	const api = useToinUserApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			console.log('🔄 [useDeleteToinUser] Deleting toin user:', id);
			const response = await api.deleteToinUser(id);
			console.log('✅ [useDeleteToinUser] Success:', response);
			return response;
		},
		onSuccess: (data, id) => {
			console.log(
				'✅ [useDeleteToinUser] Invalidating toin user cache for:',
				id
			);
			// Remove from cache and invalidate list
			queryClient.removeQueries({
				queryKey: [API_KEYS.TOIN_USER_BY_ID, id],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_TOIN_USERS],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.TOIN_USERS],
			});
		},
		onError: (error: Error) => {
			console.error('❌ [useDeleteToinUser] Error:', error.message);
		},
	});
}

/**
 * Hook to soft delete a Toin User (set isDeleted = true)
 */
export function useSoftDeleteToinUser() {
	const api = useToinUserApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			console.log(
				'🔄 [useSoftDeleteToinUser] Soft deleting toin user:',
				id
			);
			const response = await api.updateToinUser(id, { isDeleted: true });
			console.log('✅ [useSoftDeleteToinUser] Success:', response);
			return response;
		},
		onSuccess: (data, id) => {
			console.log(
				'✅ [useSoftDeleteToinUser] Invalidating toin user cache for:',
				id
			);
			// Invalidate specific user and list
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.TOIN_USER_BY_ID, id],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_TOIN_USERS],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.TOIN_USERS],
			});
		},
		onError: (error: Error) => {
			console.error('❌ [useSoftDeleteToinUser] Error:', error.message);
		},
	});
}
