export type User = {
	id: string;
	username: string;
	email: string;
	role: Role;
	isActive: boolean;
};

export enum Role {
	ADMIN = 'admin',
	USER = 'user',
}
