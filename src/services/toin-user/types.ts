// Toin User Types - Based on API Documentation

/**
 * Department enum matching API specification
 */
export enum Department {
	DTP = 'DTP',
	SAN_XUAT = 'Sản xuất',
	CTP = 'CTP',
	TONG_VU = 'Tổng vụ',
	KINH_DOANH = 'Kinh doanh',
	QC = 'QC',
	QA = 'QA',
	IT = 'IT',
	THIET_KE = 'Thiết kế',
	KE_TOAN = 'Kế toán',
	BAO_TRI = 'Bảo trì',
	MUA_HANG = 'Mua hàng',
	PHONG_IN = 'Phòng in',
	KE_HOACH = 'Kế hoạch',
	XUAT_NHAP_KHAU = 'Xuất nhập khẩu',
	KHO = 'Kho',
	XUONG_1 = 'Xưởng 1',
	XUONG_2 = 'Xưởng 2',
	XUONG_3 = 'Xưởng 3',
}

/**
 * Position enum matching API specification
 */
export enum Position {
	INTERN = 'Intern',
	STAFF = 'Staff',
	MANAGER = 'Manager',
	DIRECTOR = 'Director',
	SENIOR_MANAGER = 'Senior Manager',
	LEADER = 'Leader',
	ASM = 'ASM',
	CHIEF_ACCOUNTANT = 'Chief Accountant',
	SUPERVISOR = 'Supervisor',
	TONG_GIAM_DOC = 'Tổng Giám Đốc',
	PHO_TONG_GIAM_DOC = 'Phó Tổng Giám Đốc',
	DEVELOPER = 'DEVELOPER',
}

/**
 * Toin User Response from API
 * GET /toin-user/all
 * GET /toin-user/:id
 */
export interface ToinUserResponse {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	phone_number: string;
	department: string; // Department enum values
	position: string; // Position enum values
	joinedDate: string; // ISO 8601 date string
	isDeleted: boolean;
	createdBy?: string;
	createdAt: string;
	updatedAt: string;
}

/**
 * Payload for creating a new Toin User
 * POST /toin-user/create
 */
export interface ToinUserCreatePayload {
	firstname: string;
	lastname: string;
	email: string;
	phone_number: string;
	department: string;
	position: string;
	joinedDate: string; // Format: "YYYY-MM-DD"
}

/**
 * Payload for updating an existing Toin User
 * PATCH /toin-user/:id
 * All fields are optional
 */
export interface ToinUserUpdatePayload {
	firstname?: string;
	lastname?: string;
	email?: string;
	phone_number?: string;
	department?: string;
	position?: string;
	joinedDate?: string; // Format: "YYYY-MM-DD"
	isDeleted?: boolean;
}

/**
 * Filter parameters for querying Toin Users
 */
export interface ToinUserFilter {
	department?: string;
	position?: string;
	isDeleted?: boolean;
	search?: string; // For searching by name, email, etc.
}

/**
 * Display format for Toin User (computed fields)
 */
export interface ToinUserDisplay extends ToinUserResponse {
	fullName: string; // firstname + lastname
	isActive: boolean; // !isDeleted
}
