// Software Management Types - Based on API Documentation

/**
 * Account for software login
 */
export interface AccountResponse {
	_id: string;
	username: string;
	password: string; // Encrypted
	relatedEmail?: string;
	note?: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Account payload for creating/updating
 */
export interface AccountPayload {
	username: string;
	password: string;
	relatedEmail?: string;
	note?: string;
}

/**
 * Software Response from API
 * GET /software
 * GET /software/:id
 */
export interface SoftwareResponse {
	id: string;
	name: string;
	version?: string;
	plan?: string;
	license_key?: string;
	licenseKey?: string;
	purchased_date?: string; // ISO 8601 date string
	purchaseDate?: string;
	expiration_date?: string; // ISO 8601 date string
	expiredDate?: string;
	vendor?: string;
	cost?: number;
	notes?: string;
	account?: AccountResponse; // Populated account
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
	plan?: string;
	licenseKey?: string;
	license_key?: string;
	purchased_date?: string; // ISO 8601 format
	purchaseDate?: string;
	expiration_date?: string; // ISO 8601 format
	expiredDate?: string;
	vendor?: string;
	cost?: number;
	notes?: string;
	account?: AccountPayload; // Account credentials
}

/**
 * Payload for updating software
 * PATCH /software/:id
 * All fields are optional
 */
export interface SoftwareUpdatePayload {
	name?: string;
	version?: string;
	plan?: string;
	license_key?: string;
	licenseKey?: string;
	purchased_date?: string; // ISO 8601 format
	purchaseDate?: string;
	expiration_date?: string; // ISO 8601 format
	expiredDate?: string;
	vendor?: string;
	cost?: number;
	notes?: string;
	account?: AccountPayload; // Account credentials
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
