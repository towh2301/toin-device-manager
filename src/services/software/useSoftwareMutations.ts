import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_KEYS } from '../keys';
import useSoftwareApi from './api';
import { SoftwareCreatePayload, SoftwareUpdatePayload } from './types';

/**
 * Custom hooks for Software mutations (Create, Update, Delete)
 */

/**
 * Hook to create a new software
 */
export function useCreateSoftware() {
	const api = useSoftwareApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: SoftwareCreatePayload) =>
			api.createSoftware(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_SOFTWARE],
			});
			console.log('✅ Software created successfully');
		},
		onError: (error: Error) => {
			console.error('❌ Failed to create software:', error.message);
		},
	});
}

/**
 * Hook to update an existing software
 */
export function useUpdateSoftware() {
	const api = useSoftwareApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: SoftwareUpdatePayload;
		}) => api.updateSoftware(id, payload),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.SOFTWARE_BY_ID, variables.id],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_SOFTWARE],
			});
			console.log('✅ Software updated successfully');
		},
		onError: (error: Error) => {
			console.error('❌ Failed to update software:', error.message);
		},
	});
}

/**
 * Hook to delete a software
 */
export function useDeleteSoftware() {
	const api = useSoftwareApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => api.deleteSoftware(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_SOFTWARE],
			});
			console.log('✅ Software deleted successfully');
		},
		onError: (error: Error) => {
			console.error('❌ Failed to delete software:', error.message);
		},
	});
}

/**
 * Hook to link software to a device
 */
export function useLinkSoftwareToDevice() {
	const api = useSoftwareApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			deviceId,
			softwareId,
		}: {
			deviceId: string;
			softwareId: string;
		}) => api.linkSoftwareToDevice(deviceId, softwareId),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.DEVICE_SOFTWARE, variables.deviceId],
			});
			console.log('✅ Software linked to device successfully');
		},
		onError: (error: Error) => {
			console.error(
				'❌ Failed to link software to device:',
				error.message
			);
		},
	});
}

/**
 * Hook to unlink software from a device
 */
export function useUnlinkSoftwareFromDevice() {
	const api = useSoftwareApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			deviceId,
			softwareId,
		}: {
			deviceId: string;
			softwareId: string;
		}) => api.unlinkSoftwareFromDevice(deviceId, softwareId),
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.DEVICE_SOFTWARE, variables.deviceId],
			});
			console.log('✅ Software unlinked from device successfully');
		},
		onError: (error: Error) => {
			console.error(
				'❌ Failed to unlink software from device:',
				error.message
			);
		},
	});
}
