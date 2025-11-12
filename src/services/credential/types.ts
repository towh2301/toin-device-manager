// Credential Management Types - Based on API Documentation

/**
 * Credential Response from API
 * GET /credential
 * GET /credential/:id
 */
export interface CredentialResponse {
	id: string | number;
	service_name: string;
	username: string;
	password: string; // Encrypted password
	api_key?: string;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Payload for creating new credential
 * POST /credential
 */
export interface CredentialCreatePayload {
	service_name: string;
	username: string;
	password: string;
	api_key?: string;
	notes?: string;
}

/**
 * Payload for updating credential
 * PATCH /credential/:id
 * All fields are optional
 */
export interface CredentialUpdatePayload {
	service_name?: string;
	username?: string;
	password?: string;
	api_key?: string;
	notes?: string;
}

/**
 * Filter parameters for querying credentials
 */
export interface CredentialFilter {
	search?: string; // Search by service_name or username
	service_name?: string;
}
