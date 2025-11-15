import { SoftwareResponse } from '../software';
import { ToinUserResponse } from '../toin-user';

interface DeviceResponse {
	id: string;
	name: string;
	brand: Brand;
	type: DeviceType;
	purchasedDate: string; // ISO 8601 format
	serialNumber: string;
	status: DeviceStatus;
}

interface DeviceUpdatePayload {
	name?: string;
	brand?: Brand;
	type?: DeviceType;
	purchasedDate?: string; // ISO 8601 format
	serialNumber?: string;
	status?: DeviceStatus;
}

interface DeviceCreatePayload {
	name: string;
	brand: Brand;
	type: DeviceType;
	purchasedDate: string; // ISO 8601 format
	serialNumber: string;
	status: DeviceStatus;
}
interface DeviceFilter {
	brand?: Brand;
	type?: DeviceType;
	status?: DeviceStatus;
	purchasedDateFrom?: string; // ISO 8601 format
	purchasedDateTo?: string; // ISO 8601 format
}

// Device Assignment Types
interface DeviceAssignmentPayload {
	device: string;
	assigned_to?: string;
	issued_by?: string;
	assigned_date: string; // ISO 8601 format
	returned_date?: string; // ISO 8601 format
	note?: string;
}

interface DeviceAssignmentResponse {
	id: string;
	device: DeviceResponse;
	assigned_to?: ToinUserResponse;
	assigned_date: string;
	returned_date?: string;
	note?: string;
	createdAt: string;
	updatedAt: string;
}

// Device Software Types
interface DeviceSoftwareResponse {
	id: string;
	device: DeviceResponse | string; // Can be populated object or just ID
	software: SoftwareResponse | string; // Can be populated object or just ID
	installedDate?: string;
	licenseKey?: string;
	version?: string;
	createdAt?: string;
	updatedAt?: string;
	// For backward compatibility
	deviceId?: string;
	softwareId?: string;
}

// QR Code Response
interface QrCodeResponse {
	qrCode: string; // Base64 encoded QR code image
	deviceId: string;
	serialNumber: string;
}

enum DeviceStatus {
	AVAILABLE = 'AVAILABLE',
	IN_USE = 'IN_USE',
	MAINTENANCE = 'MAINTENANCE',
	RETIREMENT = 'RETIREMENT',
}

enum Brand {
	HP = 'HP',
	LENOVO = 'LENOVO',
	DELL = 'DELL',
	ASUS = 'ASUS',
	ACER = 'ACER',
	APPLE = 'APPLE',
	MICROSOFT = 'MICROSOFT',
	XIAOMI = 'XIAOMI',
	SAMSUNG = 'SAMSUNG',
	CANON = 'CANON',
	NIKON = 'NIKON',
	SONY = 'SONY',
	FUJIFILM = 'FUJIFILM',
	CISCO = 'CISCO',
	JUNIPER = 'JUNIPER',
	FORTINET = 'FORTINET',
	TP_LINK = 'TP_LINK',
	NETGEAR = 'NETGEAR',
	LG = 'LG',
	SIEMENS = 'SIEMENS',
	OTHER = 'OTHER',
}

enum DeviceType {
	ALL = 'ALL',
	LAPTOP = 'LAPTOP',
	DESKTOP = 'DESKTOP',
	TABLET = 'TABLET',
	SMARTPHONE = 'SMARTPHONE',
	PRINTER = 'PRINTER',
	CAMERA = 'CAMERA',
	ROUTER = 'ROUTER',
	SWITCH = 'SWITCH',
	MONITOR = 'monitor',
	OTHER = 'OTHER',
}

export {
	Brand,
	DeviceAssignmentPayload,
	DeviceAssignmentResponse,
	DeviceCreatePayload,
	DeviceFilter,
	DeviceResponse,
	DeviceSoftwareResponse,
	DeviceStatus,
	DeviceType,
	DeviceUpdatePayload,
	QrCodeResponse,
};
