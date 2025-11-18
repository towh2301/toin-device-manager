// Credential Management Types - Based on API Documentation

import { Department } from '../toin-user';

/**
 * Credential Response from API
 * GET /credential
 * GET /credential/:id
 */
export interface CredentialResponse {
	id: string;
	username: string;
	password: string; // Encrypted password
	departments?: Department[];
	allowedFolders?: string[];
}

/**
 * Payload for creating new credential
 * POST /credential
 */
export interface CredentialCreatePayload {
	username: string;
	password: string; // Encrypted password
	departments?: Department[];
	allowedFolders?: string[];
}

/**
 * Payload for updating credential
 * PATCH /credential/:id
 * All fields are optional
 */
export interface CredentialUpdatePayload {
	username: string;
	password: string; // Encrypted password
	departments?: Department[];
	allowedFolders?: string[];
}

/**
 * Filter parameters for querying credentials
 */
export interface CredentialFilter {
	search?: string; // Search by service_name or username
	service_name?: string;
}
