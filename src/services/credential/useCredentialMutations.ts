import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_KEYS } from '../keys';
import useCredentialApi from './api';
import { CredentialCreatePayload, CredentialUpdatePayload } from './types';

/**
 * Custom hooks for Credential mutations (Create, Update, Delete)
 */

/**
 * Hook to create a new credential
 */
export function useCreateCredential() {
	const api = useCredentialApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CredentialCreatePayload) =>
			api.createCredential(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_CREDENTIALS],
			});
			console.log('✅ Credential created successfully');
		},
		onError: (error: Error) => {
			console.error('❌ Failed to create credential:', error.message);
		},
	});
}

/**
 * Hook to update an existing credential
 */
export function useUpdateCredential() {
	const api = useCredentialApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			credentialId,
			payload,
		}: {
			credentialId: string;
			payload: CredentialUpdatePayload;
		}) => api.updateCredential(credentialId, payload),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.CREDENTIAL_BY_ID, variables.credentialId],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_CREDENTIALS],
			});
			console.log('✅ Credential updated successfully');
		},
		onError: (error: Error) => {
			console.error('❌ Failed to update credential:', error.message);
		},
	});
}

/**
 * Hook to delete a credential
 */
export function useDeleteCredential() {
	const api = useCredentialApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => api.deleteCredential(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_CREDENTIALS],
			});
			console.log('✅ Credential deleted successfully');
		},
		onError: (error: Error) => {
			console.error('❌ Failed to delete credential:', error.message);
		},
	});
}
