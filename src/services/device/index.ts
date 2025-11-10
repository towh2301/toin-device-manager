import useDeviceApi from './api';

export const deviceApi = useDeviceApi();
// Device Query Hooks
export {
	useGetAllDevices,
	useGetDeviceById,
	useGetDeviceBySerialNumber,
} from './useDeviceQueries';

// Device Assignment Queries
export {
	useGetAllAssignments,
	useGetDeviceAssignments,
} from './useDeviceQueries';

// Device Software Queries
export {
	useGetAllDeviceSoftwareLinks,
	useGetDeviceSoftware,
	useGetDeviceSoftwareLink,
} from './useDeviceQueries';

// QR Code Query
export { useGenerateQrCode } from './useDeviceQueries';

// ==================== Mutation Hooks ====================
// Device CRUD Mutations
export {
	useCreateDevice,
	useDeleteDevice,
	useUpdateDevice,
} from './useDeviceMutations';

// Device Assignment Mutations
export { useAssignDevice, useUnassignDevice } from './useDeviceMutations';

// Device Software Mutations
export { useLinkSoftware, useUnlinkSoftware } from './useDeviceMutations';

// ==================== Types ====================
export type {
	DeviceAssignmentPayload,
	DeviceAssignmentResponse,
	DeviceCreatePayload,
	DeviceResponse,
	DeviceSoftwareResponse,
	DeviceUpdatePayload,
	QrCodeResponse,
} from './types';

export { Brand, DeviceStatus, DeviceType } from './types';
