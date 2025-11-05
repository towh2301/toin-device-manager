export interface Auth {
	access_token: string;
	refresh_token: string;
	user: User;
}

export interface User {
	id: string;
	username: string;
	email: string;
	role: string[];
	isActive: boolean;
}

export enum LoginKey {
	USERNAME = 'username',
	PASSWORD = 'password',
}

export interface LoginPayload {
	[LoginKey.USERNAME]: string;
	[LoginKey.PASSWORD]: string;
}
export interface RefreshTokenPayload {
	token: string;
}
