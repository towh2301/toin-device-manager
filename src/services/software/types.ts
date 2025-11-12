// Software Management Types - Based on API Documentation

/**
 * Software Response from API
 * GET /software
 * GET /software/:id
 */
export interface SoftwareResponse {
	id: string;
	name: string;
	version?: string;
	license_key?: string;
	purchased_date?: string; // ISO 8601 date string
	expiration_date?: string; // ISO 8601 date string
	vendor?: string;
	cost?: number;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Payload for creating new software
 * POST /software
 */
export interface SoftwareCreatePayload {
	name: string;
	version?: string;
	license_key?: string;
	purchased_date?: string; // ISO 8601 format
	expiration_date?: string; // ISO 8601 format
	vendor?: string;
	cost?: number;
	notes?: string;
}

/**
 * Payload for updating software
 * PATCH /software/:id
 * All fields are optional
 */
export interface SoftwareUpdatePayload {
	name?: string;
	version?: string;
	license_key?: string;
	purchased_date?: string; // ISO 8601 format
	expiration_date?: string; // ISO 8601 format
	vendor?: string;
	cost?: number;
	notes?: string;
}

/**
 * Filter parameters for querying software
 */
export interface SoftwareFilter {
	search?: string; // Search by name or vendor
	expired?: boolean; // Filter expired licenses
	expiringSoon?: boolean; // Filter licenses expiring within 30 days
}

/**
 * Paginated software response
 * GET /software/paginated
 */
export interface SoftwarePaginatedResponse {
	software: SoftwareResponse[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

/**
 * Device-Software Link Response
 */
export interface DeviceSoftwareLinkResponse {
	id: string;
	device_id: string;
	software_id: string;
	linked_date: string;
	createdAt: string;
	updatedAt: string;
}
