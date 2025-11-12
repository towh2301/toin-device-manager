import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_KEYS } from '../keys';
import useDeviceApi from './api';
import {
	DeviceAssignmentPayload,
	DeviceCreatePayload,
	DeviceStatus,
	DeviceUpdatePayload,
} from './types';

/**
 * Custom hooks for Device mutations (Create, Update, Delete)
 */

/**
 * Hook to create a new device
 */
export function useCreateDevice() {
	const api = useDeviceApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: DeviceCreatePayload) => api.createDevice(payload),
		onSuccess: () => {
			// Invalidate and refetch devices list
			queryClient.invalidateQueries({ queryKey: [API_KEYS.ALL_DEVICES] });
			console.log('✅ Device created successfully');
		},
		onError: (error: Error) => {
			console.error('❌ Failed to create device:', error.message);
		},
	});
}

/**
 * Hook to update an existing device
 */
export function useUpdateDevice() {
	const api = useDeviceApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: DeviceUpdatePayload;
		}) => api.updateDevice(id, payload),
		onSuccess: (data, variables) => {
			// Invalidate specific device and list
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.DEVICE_BY_ID, variables.id],
			});
			queryClient.invalidateQueries({ queryKey: [API_KEYS.ALL_DEVICES] });
			console.log('✅ Device updated successfully');
		},
		onError: (error: Error) => {
			console.error('❌ Failed to update device:', error.message);
		},
	});
}

/**
 * Hook to delete a device
 */
export function useDeleteDevice() {
	const api = useDeviceApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => api.deleteDevice(id),
		onSuccess: () => {
			// Invalidate devices list
			queryClient.invalidateQueries({ queryKey: [API_KEYS.ALL_DEVICES] });
			console.log('✅ Device deleted successfully');
		},
		onError: (error: Error) => {
			console.error('❌ Failed to delete device:', error.message);
		},
	});
}

/**
 * Hook to assign a device to a user
 */
export function useAssignDevice() {
	const api = useDeviceApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: DeviceAssignmentPayload) => {
			// First assign the device
			const result = await api.assignDevice(payload);

			// Then update device status to IN_USE
			try {
				await api.updateDevice(payload.device, {
					status: DeviceStatus.IN_USE,
				});
			} catch (error) {
				console.error(
					'⚠️ Failed to update device status after assignment:',
					error
				);
			}

			return result;
		},
		onSuccess: (data, variables) => {
			// Invalidate device assignments
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.DEVICE_ASSIGNMENTS, variables.device],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_ASSIGNMENTS],
			});
			// Invalidate device list and specific device to reflect status change
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_DEVICES],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.DEVICE_BY_ID, variables.device],
			});
			console.log(
				'✅ Device assigned successfully and status updated to IN_USE'
			);
		},
		onError: (error: Error) => {
			console.error('❌ Failed to assign device:', error.message);
		},
	});
}

/**
 * Hook to unassign a device
 */
export function useUnassignDevice() {
	const api = useDeviceApi();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			assignmentId,
			deviceId,
		}: {
			assignmentId: string;
			deviceId: string;
		}) => {
			// First unassign the device
			const result = await api.unassignDevice(assignmentId);

			// Then update device status back to AVAILABLE
			try {
				await api.updateDevice(deviceId, {
					status: DeviceStatus.AVAILABLE,
				});
			} catch (error) {
				console.error(
					'⚠️ Failed to update device status after unassignment:',
					error
				);
			}

			return result;
		},
		onSuccess: (data, variables) => {
			// Invalidate all assignments
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_ASSIGNMENTS],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.DEVICE_ASSIGNMENTS, variables.deviceId],
			});
			// Invalidate device list and specific device to reflect status change
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_DEVICES],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.DEVICE_BY_ID, variables.deviceId],
			});
			console.log(
				'✅ Device unassigned successfully and status updated to AVAILABLE'
			);
		},
		onError: (error: Error) => {
			console.error('❌ Failed to unassign device:', error.message);
		},
	});
}

/**
 * Hook to link software to a device
 */
export function useLinkSoftware() {
	const api = useDeviceApi();
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
			// Invalidate device software list
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.DEVICE_SOFTWARE, variables.deviceId],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_DEVICE_SOFTWARE_LINKS],
			});
			console.log('✅ Software linked to device successfully');
		},
		onError: (error: Error) => {
			console.error('❌ Failed to link software:', error.message);
		},
	});
}

/**
 * Hook to unlink software from a device
 */
export function useUnlinkSoftware() {
	const api = useDeviceApi();
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
			// Invalidate device software list
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.DEVICE_SOFTWARE, variables.deviceId],
			});
			queryClient.invalidateQueries({
				queryKey: [API_KEYS.ALL_DEVICE_SOFTWARE_LINKS],
			});
			console.log('✅ Software unlinked from device successfully');
		},
		onError: (error: Error) => {
			console.error('❌ Failed to unlink software:', error.message);
		},
	});
}
