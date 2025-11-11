# Device Manager API Reference for Mobile App Development

## Base Information

**Base URL**: `http://localhost:3000/api`  
**Authentication**: JWT Bearer Token  
**Response Format**: All responses follow standardized format:

```json
{
  "code": "TOIN-XXXX" | number,
  "message": "Success message",
  "data": {} | [] | null
}
```

---

## 1. Authentication APIs

### 1.1 Login

**Endpoint**: `POST /auth/login`  
**Auth Required**: No  
**Description**: Authenticate user and receive access/refresh tokens

**Request Body**:

```json
{
	"username": "string",
	"password": "string"
}
```

**Response** (200):

```json
{
  "code": "TOIN-0002",
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "admin" | "user",
      "isActive": true
    }
  }
}
```

**Error Response** (401):

```json
{
	"code": "TOIN-0003",
	"message": "Invalid username or password",
	"data": null
}
```

---

### 1.2 Register (Public)

**Endpoint**: `POST /auth/register`  
**Auth Required**: No  
**Description**: Self-registration for new users (role automatically set to 'user')

**Request Body**:

```json
{
	"username": "string",
	"email": "string",
	"password": "string"
}
```

**Response** (201):

```json
{
	"code": "TOIN-0001",
	"message": "User registered successfully",
	"data": {
		"message": "User registered successfully",
		"user": {
			"id": "string",
			"username": "string",
			"email": "string",
			"role": ["user"]
		}
	}
}
```

**Error Response** (409):

```json
{
	"code": 409,
	"message": "User already exists",
	"data": null
}
```

---

### 1.3 Refresh Token

**Endpoint**: `POST /auth/refresh`  
**Auth Required**: No  
**Description**: Get new access token using refresh token

**Request Body**:

```json
{
	"refresh_token": "string"
}
```

**Response** (200):

```json
{
	"code": 200,
	"message": "Success",
	"data": {
		"access_token": "new_access_token",
		"refresh_token": "new_refresh_token"
	}
}
```

---

### 1.4 Get Profile

**Endpoint**: `GET /auth/profile`  
**Auth Required**: Yes  
**Description**: Get current authenticated user's profile

**Headers**:

```
Authorization: Bearer {access_token}
```

**Response** (200):

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "admin" | "user",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 1.5 Logout

**Endpoint**: `POST /auth/logout`  
**Auth Required**: No  
**Description**: Logout and invalidate refresh token

**Request Body** (optional):

```json
{
	"refresh_token": "string"
}
```

**Response** (200):

```json
{
	"code": 200,
	"message": "Success",
	"data": {
		"message": "Logout successful"
	}
}
```

---

### 1.6 Validate Username

**Endpoint**: `POST /auth/validate/username`  
**Auth Required**: No  
**Description**: Check if username is available

**Request Body**:

```json
{
	"username": "string"
}
```

**Response** (200):

```json
{
	"code": 200,
	"message": "Success",
	"data": {
		"available": true
	}
}
```

---

### 1.7 Validate Email

**Endpoint**: `POST /auth/validate/email`  
**Auth Required**: No  
**Description**: Check if email is available

**Request Body**:

```json
{
	"email": "string"
}
```

**Response** (200):

```json
{
	"code": 200,
	"message": "Success",
	"data": {
		"available": true
	}
}
```

---

## 2. Device Management APIs

### 2.1 Get All Devices (Simple)

**Endpoint**: `GET /device/all`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get all devices without pagination

**Headers**:

```
Authorization: Bearer {access_token}
```

**Response** (200):

```json
{
  "code": "TOIN-1015",
  "message": "Device fetched successfully",
  "data": [
    {
      "id": "string",
      "name": "MacBook Pro 16",
      "brand": "APPLE",
      "type": "LAPTOP",
      "purchasedDate": "2024-01-01T00:00:00.000Z",
      "serialNumber": "SN12345",
      "status": "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "RETIREMENT",
      "isOverFiveYear": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 2.2 Get Devices (Paginated with Filters)

**Endpoint**: `GET /device/paginated`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get devices with pagination, search and filters

**Query Parameters**:

- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)
- `search` (string, optional) - Search by name or serial number
- `status` (string, optional) - Filter by status: AVAILABLE | IN_USE | MAINTENANCE | RETIREMENT
- `type` (string, optional) - Filter by type: LAPTOP | DESKTOP | TABLET | SMARTPHONE | PRINTER | CAMERA | ROUTER | SWITCH | MONITOR | OTHER
- `brand` (string, optional) - Filter by brand: HP | LENOVO | DELL | ASUS | ACER | APPLE | MICROSOFT | XIAOMI | SAMSUNG | CANON | NIKON | SONY | FUJIFILM | CISCO | JUNIPER | FORTINET | TP_LINK | NETGEAR | LG | SIEMENS | OTHER
- `isOverFiveYear` (boolean, optional) - Filter devices over 5 years old

**Example**: `GET /device/paginated?page=1&limit=20&search=macbook&status=AVAILABLE&type=LAPTOP&brand=APPLE`

**Response** (200):

```json
{
	"code": "TOIN-1015",
	"message": "Device fetched successfully",
	"data": {
		"devices": [
			{
				"id": "string",
				"name": "MacBook Pro 16",
				"brand": "APPLE",
				"type": "LAPTOP",
				"purchasedDate": "2024-01-01T00:00:00.000Z",
				"serialNumber": "SN12345",
				"status": "AVAILABLE",
				"isOverFiveYear": false,
				"createdAt": "2024-01-01T00:00:00.000Z",
				"updatedAt": "2024-01-01T00:00:00.000Z"
			}
		],
		"total": 100,
		"page": 1,
		"limit": 20,
		"totalPages": 5
	}
}
```

---

### 2.3 Get Device by ID

**Endpoint**: `GET /device/:id`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get single device details

**Response** (200):

```json
{
	"code": "TOIN-1015",
	"message": "Device fetched successfully",
	"data": {
		"id": "string",
		"name": "MacBook Pro 16",
		"brand": "APPLE",
		"type": "LAPTOP",
		"purchasedDate": "2024-01-01T00:00:00.000Z",
		"serialNumber": "SN12345",
		"status": "AVAILABLE",
		"isOverFiveYear": false,
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

**Error Response** (404):

```json
{
	"code": "TOIN-1005",
	"message": "Device not found",
	"data": null
}
```

---

### 2.4 Get Device by Serial Number

**Endpoint**: `GET /device/serial/:serialNumber`  
**Auth Required**: Yes (Admin/User)  
**Description**: Find device by serial number (useful for QR code scanning)

**Response** (200):

```json
{
	"code": "TOIN-1015",
	"message": "Device fetched successfully",
	"data": {
		"id": "string",
		"name": "MacBook Pro 16",
		"brand": "APPLE",
		"type": "LAPTOP",
		"purchasedDate": "2024-01-01T00:00:00.000Z",
		"serialNumber": "SN12345",
		"status": "AVAILABLE",
		"isOverFiveYear": false
	}
}
```

---

### 2.5 Create Device

**Endpoint**: `POST /device/create`  
**Auth Required**: Yes (Admin/User)  
**Description**: Create new device

**Request Body**:

```json
{
	"name": "MacBook Pro 16",
	"brand": "APPLE",
	"type": "LAPTOP",
	"purchasedDate": "2024-01-01T00:00:00.000Z",
	"serialNumber": "SN12345",
	"status": "AVAILABLE"
}
```

**Response** (201):

```json
{
	"code": "TOIN-1014",
	"message": "Device created successfully",
	"data": {
		"id": "string",
		"name": "MacBook Pro 16",
		"brand": "APPLE",
		"type": "LAPTOP",
		"purchasedDate": "2024-01-01T00:00:00.000Z",
		"serialNumber": "SN12345",
		"status": "AVAILABLE",
		"isOverFiveYear": false,
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

---

### 2.6 Update Device

**Endpoint**: `PATCH /device/:id`  
**Auth Required**: Yes (Admin/User)  
**Description**: Update device information

**Request Body** (all fields optional):

```json
{
  "name": "string",
  "brand": "string",
  "type": "string",
  "purchasedDate": "2024-01-01T00:00:00.000Z",
  "serialNumber": "string",
  "status": "AVAILABLE" | "IN_USE" | "MAINTENANCE" | "RETIREMENT"
}
```

**Response** (200):

```json
{
	"code": "TOIN-1003",
	"message": "Device information updated",
	"data": {
		"id": "string",
		"name": "MacBook Pro 16",
		"brand": "APPLE",
		"type": "LAPTOP",
		"purchasedDate": "2024-01-01T00:00:00.000Z",
		"serialNumber": "SN12345",
		"status": "MAINTENANCE",
		"isOverFiveYear": false,
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

---

### 2.7 Delete Device

**Endpoint**: `DELETE /device/:id`  
**Auth Required**: Yes (Admin/User)  
**Description**: Delete device

**Response** (200):

```json
{
	"code": "TOIN-1004",
	"message": "Device record deleted",
	"data": {
		"id": "string",
		"name": "MacBook Pro 16",
		"serialNumber": "SN12345"
	}
}
```

---

### 2.8 Get Device Statistics

**Endpoint**: `GET /device/stats`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get device statistics overview

**Response** (200):

```json
{
	"code": 200,
	"message": "Success",
	"data": {
		"total": 100,
		"byStatus": {
			"AVAILABLE": 50,
			"IN_USE": 30,
			"MAINTENANCE": 15,
			"RETIREMENT": 5
		},
		"byType": {
			"LAPTOP": 60,
			"DESKTOP": 30,
			"PRINTER": 10
		},
		"overFiveYears": 20
	}
}
```

---

### 2.9 Bulk Update Device Status

**Endpoint**: `PUT /device/bulk-update`  
**Auth Required**: Yes (Admin/User)  
**Description**: Update status for multiple devices

**Request Body**:

```json
{
	"deviceIds": ["id1", "id2", "id3"],
	"status": "MAINTENANCE"
}
```

**Response** (200):

```json
{
	"code": "TOIN-1003",
	"message": "Device information updated",
	"data": {
		"modifiedCount": 3,
		"deviceIds": ["id1", "id2", "id3"]
	}
}
```

---

### 2.10 Generate QR Code

**Endpoint**: `GET /device/:id/qrcode`  
**Auth Required**: Yes (Admin/User)  
**Description**: Generate QR code for device

**Response** (200):

```json
{
	"code": "TOIN-4001",
	"message": "QR code generated successfully",
	"data": {
		"qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
		"deviceId": "string",
		"serialNumber": "SN12345"
	}
}
```

---

## 3. Device Assignment APIs

### 3.1 Assign Device

**Endpoint**: `POST /device/assign`  
**Auth Required**: Yes (Admin/User)  
**Description**: Assign a device to a Toin user

**Request Body**:

```json
{
	"device": "device_id",
	"assigned_to": "toin_user_id",
	"issued_by": "system_user_id",
	"assigned_date": "2024-01-01T00:00:00.000Z",
	"note": "Assigned for project X"
}
```

**Response** (201):

```json
{
	"code": "TOIN-1017",
	"message": "Device assigned successfully",
	"data": {
		"id": "assignment_id",
		"device": {
			"id": "device_id",
			"name": "MacBook Pro 16",
			"serialNumber": "SN12345",
			"type": "LAPTOP",
			"brand": "APPLE",
			"status": "IN_USE"
		},
		"assigned_to": {
			"id": "toin_user_id",
			"firstname": "John",
			"lastname": "Doe",
			"email": "john@example.com",
			"department": "IT",
			"position": "DEVELOPER"
		},
		"issued_by": {
			"id": "system_user_id",
			"username": "admin",
			"email": "admin@example.com",
			"role": "admin"
		},
		"assigned_date": "2024-01-01T00:00:00.000Z",
		"returned_date": null,
		"note": "Assigned for project X",
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

---

### 3.2 Unassign Device

**Endpoint**: `DELETE /device/unassign/:assignmentId`  
**Auth Required**: Yes (Admin/User)  
**Description**: Remove device assignment

**Response** (200):

```json
{
	"code": "TOIN-1018",
	"message": "Device unassigned successfully",
	"data": {
		"id": "assignment_id",
		"device": {
			"id": "device_id",
			"name": "MacBook Pro 16",
			"serialNumber": "SN12345",
			"type": "LAPTOP",
			"brand": "APPLE",
			"status": "AVAILABLE"
		},
		"assigned_to": {
			"id": "toin_user_id",
			"firstname": "John",
			"lastname": "Doe",
			"email": "john@example.com",
			"department": "IT",
			"position": "DEVELOPER"
		},
		"issued_by": {
			"id": "system_user_id",
			"username": "admin",
			"email": "admin@example.com",
			"role": "admin"
		},
		"assigned_date": "2024-01-01T00:00:00.000Z",
		"returned_date": "2024-01-15T00:00:00.000Z",
		"note": "Returned after project completion"
	}
}
```

---

### 3.3 Get Device Assignments

**Endpoint**: `GET /device/:id/assignments`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get all assignment history for a specific device

**Response** (200):

```json
{
	"code": "TOIN-1019",
	"message": "Device assignment fetched successfully",
	"data": [
		{
			"id": "assignment_id",
			"device": {
				"id": "device_id",
				"name": "MacBook Pro 16",
				"serialNumber": "SN12345",
				"type": "LAPTOP",
				"brand": "APPLE",
				"status": "IN_USE"
			},
			"assigned_to": {
				"id": "toin_user_id",
				"firstname": "John",
				"lastname": "Doe",
				"email": "john@example.com",
				"department": "IT",
				"position": "DEVELOPER"
			},
			"issued_by": {
				"id": "system_user_id",
				"username": "admin",
				"email": "admin@example.com",
				"role": "admin"
			},
			"assigned_date": "2024-01-01T00:00:00.000Z",
			"returned_date": null,
			"note": "Assigned for project X",
			"createdAt": "2024-01-01T00:00:00.000Z",
			"updatedAt": "2024-01-01T00:00:00.000Z"
		}
	]
}
```

---

### 3.4 Get All Assignments

**Endpoint**: `GET /device/assignments/all`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get all device assignments in the system

**Response** (200):

```json
{
	"code": "TOIN-1019",
	"message": "Device assignment fetched successfully",
	"data": [
		{
			"id": "assignment_id",
			"device": {
				"id": "device_id",
				"name": "MacBook Pro 16",
				"serialNumber": "SN12345",
				"type": "LAPTOP",
				"brand": "APPLE",
				"status": "IN_USE"
			},
			"assigned_to": {
				"id": "toin_user_id",
				"firstname": "John",
				"lastname": "Doe",
				"email": "john@example.com",
				"department": "IT",
				"position": "DEVELOPER"
			},
			"issued_by": {
				"id": "system_user_id",
				"username": "admin",
				"email": "admin@example.com",
				"role": "admin"
			},
			"assigned_date": "2024-01-01T00:00:00.000Z",
			"returned_date": null,
			"note": "Assigned for project X"
		}
	]
}
```

---

## 4. Toin User Management APIs

### 4.1 Get All Toin Users

**Endpoint**: `GET /toin-user/all`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get all Toin users (employees)

**Response** (200):

```json
{
	"code": "TOIN-2006",
	"message": "Toin user list fetched successfully",
	"data": [
		{
			"id": "string",
			"firstname": "John",
			"lastname": "Doe",
			"email": "john@example.com",
			"phone_number": "+84123456789",
			"department": "IT",
			"position": "DEVELOPER",
			"joinedDate": "2024-01-01",
			"isDeleted": false,
			"createdBy": "admin_id",
			"createdAt": "2024-01-01T00:00:00.000Z",
			"updatedAt": "2024-01-01T00:00:00.000Z"
		}
	]
}
```

---

### 4.2 Get Toin User by ID

**Endpoint**: `GET /toin-user/:id`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get single Toin user details

**Response** (200):

```json
{
	"code": 200,
	"message": "Success",
	"data": {
		"id": "string",
		"firstname": "John",
		"lastname": "Doe",
		"email": "john@example.com",
		"phone_number": "+84123456789",
		"department": "IT",
		"position": "DEVELOPER",
		"joinedDate": "2024-01-01",
		"isDeleted": false,
		"createdBy": "admin_id",
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

---

### 4.3 Create Toin User

**Endpoint**: `POST /toin-user/create`  
**Auth Required**: Yes (Admin/User)  
**Description**: Create new Toin user (employee)

**Request Body**:

```json
{
	"firstname": "John",
	"lastname": "Doe",
	"email": "john@example.com",
	"phone_number": "+84123456789",
	"department": "IT",
	"position": "DEVELOPER",
	"joinedDate": "2024-01-01"
}
```

**Response** (201):

```json
{
	"code": "TOIN-2007",
	"message": "Toin user created successfully",
	"data": {
		"id": "string",
		"firstname": "John",
		"lastname": "Doe",
		"email": "john@example.com",
		"phone_number": "+84123456789",
		"department": "IT",
		"position": "DEVELOPER",
		"joinedDate": "2024-01-01",
		"isDeleted": false,
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

---

### 4.4 Update Toin User

**Endpoint**: `PATCH /toin-user/:id`  
**Auth Required**: Yes (Admin/User)  
**Description**: Update Toin user information

**Request Body** (all fields optional):

```json
{
	"firstname": "string",
	"lastname": "string",
	"email": "string",
	"phone_number": "string",
	"department": "string",
	"position": "string",
	"joinedDate": "string",
	"isDeleted": false
}
```

**Response** (200):

```json
{
	"code": "TOIN-2004",
	"message": "Toin user information updated successfully",
	"data": {
		"id": "string",
		"firstname": "John",
		"lastname": "Doe",
		"email": "john@example.com",
		"phone_number": "+84123456789",
		"department": "IT",
		"position": "MANAGER",
		"joinedDate": "2024-01-01",
		"isDeleted": false,
		"updatedAt": "2024-01-15T00:00:00.000Z"
	}
}
```

---

### 4.5 Delete Toin User

**Endpoint**: `DELETE /toin-user/:id`  
**Auth Required**: Yes (Admin/User)  
**Description**: Delete Toin user

**Response** (200):

```json
{
	"code": "TOIN-2005",
	"message": "Toin user deleted successfully",
	"data": {
		"id": "string",
		"firstname": "John",
		"lastname": "Doe",
		"email": "john@example.com"
	}
}
```

---

### 4.6 Get Department List

**Endpoint**: `GET /toin-user/departments/list`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get list of all available departments

**Response** (200):

```json
{
	"code": "TOIN-3001",
	"message": "Department list fetched successfully",
	"data": [
		"DTP",
		"Sản xuất",
		"CTP",
		"Tổng vụ",
		"Kinh doanh",
		"QC",
		"QA",
		"IT",
		"Thiết kế",
		"Kế toán",
		"Bảo trì",
		"Mua hàng",
		"Phòng in",
		"Kế hoạch",
		"Xuất nhập khẩu",
		"Kho",
		"Xưởng 1",
		"Xưởng 2",
		"Xưởng 3"
	]
}
```

---

## 5. Software Management APIs

### 5.1 Get All Software

**Endpoint**: `GET /software`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get all software without pagination

**Response** (200):

```json
{
	"code": "TOIN-5004",
	"message": "Software fetched successfully",
	"data": [
		{
			"id": "string",
			"name": "Microsoft Office 365",
			"version": "2024",
			"license_key": "XXXXX-XXXXX-XXXXX",
			"purchased_date": "2024-01-01T00:00:00.000Z",
			"expiration_date": "2025-01-01T00:00:00.000Z",
			"vendor": "Microsoft",
			"cost": 1000000,
			"notes": "Annual subscription",
			"createdAt": "2024-01-01T00:00:00.000Z",
			"updatedAt": "2024-01-01T00:00:00.000Z"
		}
	]
}
```

---

### 5.2 Get Software (Paginated with Filters)

**Endpoint**: `GET /software/paginated`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get software with pagination and filters

**Query Parameters**:

- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)
- `search` (string, optional) - Search by name or vendor
- `expired` (boolean, optional) - Filter expired licenses
- `expiringSoon` (boolean, optional) - Filter licenses expiring within 30 days

**Example**: `GET /software/paginated?page=1&limit=20&search=office&expiringSoon=true`

**Response** (200):

```json
{
	"code": "TOIN-5004",
	"message": "Software fetched successfully",
	"data": {
		"software": [
			{
				"id": "string",
				"name": "Microsoft Office 365",
				"version": "2024",
				"license_key": "XXXXX-XXXXX-XXXXX",
				"purchased_date": "2024-01-01T00:00:00.000Z",
				"expiration_date": "2025-01-01T00:00:00.000Z",
				"vendor": "Microsoft",
				"cost": 1000000,
				"notes": "Annual subscription"
			}
		],
		"total": 50,
		"page": 1,
		"limit": 20,
		"totalPages": 3
	}
}
```

---

### 5.3 Get Software by ID

**Endpoint**: `GET /software/:id`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get single software details

**Response** (200):

```json
{
	"code": "TOIN-5004",
	"message": "Software fetched successfully",
	"data": {
		"id": "string",
		"name": "Microsoft Office 365",
		"version": "2024",
		"license_key": "XXXXX-XXXXX-XXXXX",
		"purchased_date": "2024-01-01T00:00:00.000Z",
		"expiration_date": "2025-01-01T00:00:00.000Z",
		"vendor": "Microsoft",
		"cost": 1000000,
		"notes": "Annual subscription"
	}
}
```

---

### 5.4 Create Software

**Endpoint**: `POST /software`  
**Auth Required**: Yes (Admin/User)  
**Description**: Create new software license

**Request Body**:

```json
{
	"name": "Microsoft Office 365",
	"version": "2024",
	"license_key": "XXXXX-XXXXX-XXXXX",
	"purchased_date": "2024-01-01T00:00:00.000Z",
	"expiration_date": "2025-01-01T00:00:00.000Z",
	"vendor": "Microsoft",
	"cost": 1000000,
	"notes": "Annual subscription"
}
```

**Response** (201):

```json
{
	"code": "TOIN-5003",
	"message": "Software created successfully",
	"data": {
		"id": "string",
		"name": "Microsoft Office 365",
		"version": "2024",
		"license_key": "XXXXX-XXXXX-XXXXX",
		"purchased_date": "2024-01-01T00:00:00.000Z",
		"expiration_date": "2025-01-01T00:00:00.000Z",
		"vendor": "Microsoft",
		"cost": 1000000,
		"notes": "Annual subscription",
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

---

### 5.5 Update Software

**Endpoint**: `PATCH /software/:id`  
**Auth Required**: Yes (Admin/User)  
**Description**: Update software information

**Request Body** (all fields optional):

```json
{
	"name": "string",
	"version": "string",
	"license_key": "string",
	"purchased_date": "2024-01-01T00:00:00.000Z",
	"expiration_date": "2025-01-01T00:00:00.000Z",
	"vendor": "string",
	"cost": 1000000,
	"notes": "string"
}
```

**Response** (200):

```json
{
	"code": "TOIN-5005",
	"message": "Software updated successfully",
	"data": {
		"id": "string",
		"name": "Microsoft Office 365",
		"version": "2024",
		"license_key": "XXXXX-XXXXX-XXXXX",
		"purchased_date": "2024-01-01T00:00:00.000Z",
		"expiration_date": "2026-01-01T00:00:00.000Z",
		"vendor": "Microsoft",
		"cost": 1200000,
		"notes": "Renewed subscription"
	}
}
```

---

### 5.6 Delete Software

**Endpoint**: `DELETE /software/:id`  
**Auth Required**: Yes (Admin/User)  
**Description**: Delete software license

**Response** (200):

```json
{
	"code": "TOIN-5006",
	"message": "Software deleted successfully",
	"data": null
}
```

---

### 5.7 Get Software Statistics

**Endpoint**: `GET /software/stats`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get software statistics overview

**Response** (200):

```json
{
	"code": 200,
	"message": "Success",
	"data": {
		"total": 50,
		"active": 40,
		"expired": 10,
		"expiringSoon": 5,
		"totalCost": 50000000
	}
}
```

---

### 5.8 Get Expiring Licenses

**Endpoint**: `GET /software/expiring/:days`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get licenses expiring within X days

**Example**: `GET /software/expiring/30`

**Response** (200):

```json
{
	"code": "TOIN-5004",
	"message": "Software fetched successfully",
	"data": [
		{
			"id": "string",
			"name": "Adobe Creative Cloud",
			"version": "2024",
			"license_key": "XXXXX-XXXXX-XXXXX",
			"expiration_date": "2024-12-15T00:00:00.000Z",
			"vendor": "Adobe",
			"daysUntilExpiration": 25
		}
	]
}
```

---

## 6. Account Management APIs

### 6.1 Get All Accounts

**Endpoint**: `GET /account`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get all accounts

**Response** (200):

```json
{
	"code": "TOIN-7002",
	"message": "Account fetched successfully",
	"data": [
		{
			"id": "string",
			"username": "company_email",
			"password": "encrypted_password",
			"platform": "Google",
			"description": "Company Gmail account",
			"createdAt": "2024-01-01T00:00:00.000Z",
			"updatedAt": "2024-01-01T00:00:00.000Z"
		}
	]
}
```

---

### 6.2 Get Account by ID

**Endpoint**: `GET /account/:id`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get single account details

**Response** (200):

```json
{
	"code": "TOIN-7002",
	"message": "Account fetched successfully",
	"data": {
		"id": "string",
		"username": "company_email",
		"password": "encrypted_password",
		"platform": "Google",
		"description": "Company Gmail account"
	}
}
```

---

### 6.3 Get Account by Username

**Endpoint**: `GET /account/username/:username`  
**Auth Required**: Yes (Admin/User)  
**Description**: Find account by username

**Response** (200):

```json
{
	"code": "TOIN-7002",
	"message": "Account fetched successfully",
	"data": {
		"id": "string",
		"username": "company_email",
		"password": "encrypted_password",
		"platform": "Google",
		"description": "Company Gmail account"
	}
}
```

---

### 6.4 Create Account

**Endpoint**: `POST /account`  
**Auth Required**: Yes (Admin/User)  
**Description**: Create new account

**Request Body**:

```json
{
	"username": "company_email",
	"password": "secure_password",
	"platform": "Google",
	"description": "Company Gmail account"
}
```

**Response** (201):

```json
{
	"code": "TOIN-7001",
	"message": "Account created successfully",
	"data": {
		"id": "string",
		"username": "company_email",
		"password": "encrypted_password",
		"platform": "Google",
		"description": "Company Gmail account",
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

---

### 6.5 Update Account

**Endpoint**: `PATCH /account/:id`  
**Auth Required**: Yes (Admin/User)  
**Description**: Update account information

**Request Body** (all fields optional):

```json
{
	"username": "string",
	"password": "string",
	"platform": "string",
	"description": "string"
}
```

**Response** (200):

```json
{
	"code": "TOIN-7003",
	"message": "Account updated successfully",
	"data": {
		"id": "string",
		"username": "updated_email",
		"password": "encrypted_password",
		"platform": "Google",
		"description": "Updated description"
	}
}
```

---

### 6.6 Delete Account

**Endpoint**: `DELETE /account/:id`  
**Auth Required**: Yes (Admin only)  
**Description**: Delete account (admin only)

**Response** (200):

```json
{
	"code": "TOIN-7004",
	"message": "Account deleted successfully",
	"data": {
		"id": "string",
		"username": "company_email"
	}
}
```

---

## 7. Credentials Management APIs

### 7.1 Get All Credentials

**Endpoint**: `GET /credential`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get all credentials

**Response** (200):

```json
{
	"code": "TOIN-6002",
	"message": "Credential fetched successfully",
	"data": [
		{
			"id": 1,
			"service_name": "AWS",
			"username": "admin@company.com",
			"password": "encrypted_password",
			"api_key": "XXXXX-XXXXX-XXXXX",
			"notes": "Production AWS account",
			"createdAt": "2024-01-01T00:00:00.000Z",
			"updatedAt": "2024-01-01T00:00:00.000Z"
		}
	]
}
```

---

### 7.2 Get Credential by ID

**Endpoint**: `GET /credential/:id`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get single credential details

**Response** (200):

```json
{
	"code": "TOIN-6002",
	"message": "Credential fetched successfully",
	"data": {
		"id": 1,
		"service_name": "AWS",
		"username": "admin@company.com",
		"password": "encrypted_password",
		"api_key": "XXXXX-XXXXX-XXXXX",
		"notes": "Production AWS account"
	}
}
```

---

### 7.3 Create Credential

**Endpoint**: `POST /credential`  
**Auth Required**: Yes (Admin only)  
**Description**: Create new credential (admin only)

**Request Body**:

```json
{
	"service_name": "AWS",
	"username": "admin@company.com",
	"password": "secure_password",
	"api_key": "XXXXX-XXXXX-XXXXX",
	"notes": "Production AWS account"
}
```

**Response** (201):

```json
{
	"code": "TOIN-6001",
	"message": "Credential created successfully",
	"data": {
		"id": 1,
		"service_name": "AWS",
		"username": "admin@company.com",
		"password": "encrypted_password",
		"api_key": "XXXXX-XXXXX-XXXXX",
		"notes": "Production AWS account",
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

---

### 7.4 Update Credential

**Endpoint**: `PATCH /credential/:id`  
**Auth Required**: Yes (Admin only)  
**Description**: Update credential (admin only)

**Request Body** (all fields optional):

```json
{
	"service_name": "string",
	"username": "string",
	"password": "string",
	"api_key": "string",
	"notes": "string"
}
```

**Response** (200):

```json
{
	"code": "TOIN-6003",
	"message": "Credential updated successfully",
	"data": {
		"id": 1,
		"service_name": "AWS",
		"username": "new_admin@company.com",
		"password": "encrypted_password",
		"api_key": "XXXXX-XXXXX-XXXXX",
		"notes": "Updated production account"
	}
}
```

---

### 7.5 Delete Credential

**Endpoint**: `DELETE /credential/:id`  
**Auth Required**: Yes (Admin only)  
**Description**: Delete credential (admin only)

**Response** (200):

```json
{
	"code": "TOIN-6004",
	"message": "Credential deleted successfully",
	"data": {
		"id": 1,
		"service_name": "AWS"
	}
}
```

---

## 8. Device-Software Linking APIs

### 8.1 Link Software to Device

**Endpoint**: `POST /device/:id/link-software/:softwareId`  
**Auth Required**: Yes (Admin/User)  
**Description**: Link software license to device

**Response** (200):

```json
{
	"code": "TOIN-5001",
	"message": "Software linked to device successfully",
	"data": {
		"id": "link_id",
		"device_id": "device_id",
		"software_id": "software_id",
		"linked_date": "2024-01-01T00:00:00.000Z"
	}
}
```

---

### 8.2 Unlink Software from Device

**Endpoint**: `POST /device/:id/unlink-software/:softwareId`  
**Auth Required**: Yes (Admin/User)  
**Description**: Remove software link from device

**Response** (200):

```json
{
	"code": "TOIN-5002",
	"message": "Software unlinked from device successfully",
	"data": {
		"id": "link_id",
		"device_id": "device_id",
		"software_id": "software_id"
	}
}
```

---

### 8.3 Get Software for Device

**Endpoint**: `GET /device/:id/software`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get all software installed on a device

**Response** (200):

```json
{
	"code": "TOIN-1015",
	"message": "Device fetched successfully",
	"data": [
		{
			"id": "software_id",
			"name": "Microsoft Office 365",
			"version": "2024",
			"license_key": "XXXXX-XXXXX-XXXXX",
			"expiration_date": "2025-01-01T00:00:00.000Z"
		}
	]
}
```

---

### 8.4 Get All Device-Software Links

**Endpoint**: `GET /device/software/links/all`  
**Auth Required**: Yes (Admin/User)  
**Description**: Get all device-software links in the system

**Response** (200):

```json
{
	"code": "TOIN-1015",
	"message": "Device fetched successfully",
	"data": [
		{
			"id": "link_id",
			"device": {
				"id": "device_id",
				"name": "MacBook Pro 16",
				"serialNumber": "SN12345"
			},
			"software": {
				"id": "software_id",
				"name": "Microsoft Office 365",
				"version": "2024"
			},
			"linked_date": "2024-01-01T00:00:00.000Z"
		}
	]
}
```

---

## 9. Enums and Constants

### Device Status

```typescript
enum DeviceStatus {
	AVAILABLE = 'AVAILABLE',
	IN_USE = 'IN_USE',
	MAINTENANCE = 'MAINTENANCE',
	RETIREMENT = 'RETIREMENT',
}
```

### Device Type

```typescript
enum DeviceType {
	LAPTOP = 'LAPTOP',
	DESKTOP = 'DESKTOP',
	TABLET = 'TABLET',
	SMARTPHONE = 'SMARTPHONE',
	PRINTER = 'PRINTER',
	CAMERA = 'CAMERA',
	ROUTER = 'ROUTER',
	SWITCH = 'SWITCH',
	MONITOR = 'MONITOR',
	OTHER = 'OTHER',
}
```

### Brand

```typescript
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
```

### Department

```typescript
enum Department {
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
```

### Position

```typescript
enum Position {
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
}
```

### User Role

```typescript
enum Role {
	ADMIN = 'admin',
	USER = 'user',
}
```

---

## 10. Error Codes Reference

### Generic Errors

- `200` - Success
- `400` - Bad request
- `401` - Unauthorized access
- `403` - Forbidden
- `404` - Resource not found
- `409` - Conflict occurred
- `412` - Precondition failed
- `500` - Internal server error

### Authentication (TOIN-00XX)

- `TOIN-0001` - User registered successfully
- `TOIN-0002` - Login successful
- `TOIN-0003` - Invalid username or password
- `TOIN-0004` - Authentication token has expired
- `TOIN-0005` - System user not found

### Device Management (TOIN-10XX)

- `TOIN-1001` - Device registered successfully
- `TOIN-1002` - Device already exists
- `TOIN-1003` - Device information updated
- `TOIN-1004` - Device record deleted
- `TOIN-1005` - Device not found
- `TOIN-1014` - Device created successfully
- `TOIN-1015` - Device fetched successfully
- `TOIN-1017` - Device assigned successfully
- `TOIN-1018` - Device unassigned successfully
- `TOIN-1019` - Device assignment fetched successfully
- `TOIN-1020` - Device assignment failed
- `TOIN-1021` - Device assignment not found

### Toin User (TOIN-20XX)

- `TOIN-2001` - Toin user created successfully
- `TOIN-2002` - Toin user already exists
- `TOIN-2003` - Toin user not found
- `TOIN-2004` - Toin user updated successfully
- `TOIN-2005` - Toin user deleted successfully
- `TOIN-2006` - Toin user list fetched successfully

### Department (TOIN-30XX)

- `TOIN-3001` - Department list fetched successfully

### QR Code (TOIN-40XX)

- `TOIN-4001` - QR code generated successfully

### Software (TOIN-50XX)

- `TOIN-5001` - Software linked to device successfully
- `TOIN-5002` - Software unlinked from device successfully
- `TOIN-5003` - Software created successfully
- `TOIN-5004` - Software fetched successfully
- `TOIN-5005` - Software updated successfully
- `TOIN-5006` - Software deleted successfully
- `TOIN-5007` - Software not found

### Credentials (TOIN-60XX)

- `TOIN-6001` - Credential created successfully
- `TOIN-6002` - Credential fetched successfully
- `TOIN-6003` - Credential updated successfully
- `TOIN-6004` - Credential deleted successfully
- `TOIN-6005` - Credential not found
- `TOIN-6006` - Credential already exists

### Accounts (TOIN-70XX)

- `TOIN-7001` - Account created successfully
- `TOIN-7002` - Account fetched successfully
- `TOIN-7003` - Account updated successfully
- `TOIN-7004` - Account deleted successfully
- `TOIN-7005` - Account not found
- `TOIN-7006` - Account already exists

---

## 11. Authentication Flow

### Initial Login

1. User enters username/password
2. POST `/auth/login`
3. Receive `access_token` (expires in 7200s = 2 hours) and `refresh_token` (expires in 7 days)
4. Store both tokens securely
5. Use `access_token` in Authorization header for all subsequent requests

### Token Refresh

1. When `access_token` expires (401 error)
2. POST `/auth/refresh` with `refresh_token`
3. Receive new `access_token` and `refresh_token`
4. Update stored tokens
5. Retry original request with new token

### Logout

1. POST `/auth/logout` with `refresh_token`
2. Clear stored tokens
3. Navigate to login screen

---

## 12. Common Use Cases

### UC1: Device Assignment Workflow

```
1. GET /device/paginated - Browse available devices
2. GET /toin-user/all - Get list of employees
3. POST /device/assign - Assign device to employee
   Body: {
     device: "device_id",
     assigned_to: "employee_id",
     issued_by: "admin_id",
     assigned_date: "2024-01-01T00:00:00.000Z",
     note: "For project work"
   }
4. GET /device/:id/assignments - View assignment history
```

### UC2: QR Code Scanning

```
1. Scan QR code to get serial number
2. GET /device/serial/:serialNumber - Get device details
3. Display device information
4. Option to assign/unassign or view history
```

### UC3: Software License Tracking

```
1. GET /software/expiring/30 - Get licenses expiring soon
2. Display alert for licenses needing renewal
3. PATCH /software/:id - Update expiration date after renewal
```

### UC4: Device Inventory Report

```
1. GET /device/stats - Get device statistics
2. GET /device/paginated?status=MAINTENANCE - Get devices in maintenance
3. GET /device/paginated?isOverFiveYear=true - Get aging devices
4. Generate report with summary and details
```

### UC5: Employee Device Management

```
1. GET /toin-user/:id - Get employee details
2. GET /device/assignments/all - Get all assignments
3. Filter assignments by employee_id
4. Display devices currently assigned to employee
5. Show assignment history
```

---

## 13. Mobile App Implementation Notes

### Authentication Storage

- Use secure storage (Keychain/Keystore) for tokens
- Implement automatic token refresh interceptor
- Handle 401 errors globally with token refresh

### Offline Support

- Cache device list for offline viewing
- Queue assignment operations when offline
- Sync when connection restored

### QR Code Integration

- Use camera for QR scanning
- Parse serial number from QR data
- Fetch device details immediately after scan

### Push Notifications

- License expiration alerts (30, 15, 7 days before)
- Device assignment notifications
- Maintenance reminders

### UI Recommendations

- Dashboard: Device stats, recent assignments, expiring licenses
- Device List: Filterable/searchable with status badges
- Device Detail: Full info, QR code, assignment history
- Assignment Form: Device selector, employee selector, date picker
- Profile: User info, logout

### Data Refresh Strategy

- Pull-to-refresh for lists
- Auto-refresh on app foreground
- Background sync for critical data
- Pagination for large lists (20-50 items per page)

---

## 14. API Testing with Swagger

**Swagger UI**: `http://localhost:3000/api/docs`

All endpoints are documented and testable through Swagger UI with:

- Request/response schemas
- Example values
- Authentication support
- Try-it-out functionality

---

**Last Updated**: 2024-01-01  
**API Version**: 1.0  
**Backend Framework**: NestJS 10+  
**Database**: MongoDB with Mongoose ODM
