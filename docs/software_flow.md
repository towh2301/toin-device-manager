# Device-Software-Account Integration Guide for Mobile App

## Overview

Hệ thống quản lý liên kết giữa thiết bị (Device), phần mềm/license (Software) và tài khoản đăng nhập (Account). Document này cung cấp đầy đủ thông tin về data models, relationships và APIs để AI generate mobile app code.

---

## 1. Data Models & Relationships

### 1.1 Core Entities

```typescript
// Device (thiết bị vật lý)
Device {
  _id: ObjectId
  name: string                // "MacBook Pro 16"
  brand: string               // "APPLE"
  type: string                // "LAPTOP"
  serialNumber: string        // "SN12345"
  status: DeviceStatus        // AVAILABLE, IN_USE, MAINTENANCE, RETIREMENT
  purchasedDate: Date
  isOverFiveYear: boolean
  createdAt: Date
  updatedAt: Date
}

// Software (phần mềm/license)
Software {
  _id: ObjectId
  name: string                // "Microsoft Office 365"
  version: string             // "2024"
  plan: string                // "Business Premium"
  licenseKey: string          // "XXXXX-XXXXX-XXXXX"
  account: ObjectId           // Reference to Account (tài khoản đăng nhập)
  purchaseDate: Date
  expiredDate: Date
  createdAt: Date
  updatedAt: Date
}

// Account (tài khoản đăng nhập software)
Account {
  _id: ObjectId
  username: string            // "admin@company.com"
  password: string            // "encrypted_password"
  relatedEmail: string        // "admin@company.com"
  note: string                // "Company account for Office 365"
  createdAt: Date
  updatedAt: Date
}

// DeviceSoftware (liên kết device-software)
DeviceSoftware {
  _id: ObjectId
  device: ObjectId            // Reference to Device
  software: ObjectId          // Reference to Software
  note: string                // "Installed on 2024-01-01"
  createdAt: Date
  updatedAt: Date
}

// ToinCredential (credential cho network folders)
ToinCredential {
  _id: ObjectId
  username: string
  password: string
  departments: Department[]   // [IT, QA, ...]
  allowedFolders: FolderName[] // [Toin_New, Sales, ...]
  createdAt: Date
  updatedAt: Date
}
```

### 1.2 Relationship Diagram

```
┌─────────────┐
│   Device    │
│  (thiết bị) │
└──────┬──────┘
       │
       │ 1:N
       │
       ▼
┌──────────────────┐         ┌─────────────┐
│ DeviceSoftware   │◄───────►│  Software   │
│  (liên kết)      │   N:1   │ (phần mềm)  │
└──────────────────┘         └──────┬──────┘
                                    │
                                    │ N:1
                                    │
                             ┌──────▼──────┐
                             │   Account   │
                             │ (tài khoản) │
                             └─────────────┘
```

**Giải thích**:

- **1 Device** có thể cài **nhiều Software** (1:N qua DeviceSoftware)
- **1 Software** có thể cài trên **nhiều Device** (N:M relationship)
- **1 Software** có thể có **1 Account** đăng nhập (N:1)
- **1 Account** có thể dùng cho **nhiều Software** (1:N)

### 1.3 Use Case Examples

#### Scenario 1: MacBook với Office 365

```
Device: MacBook Pro 16 (SN12345)
  └─> DeviceSoftware Link 1:
        └─> Software: Microsoft Office 365
              └─> Account: office365@company.com / password123

      DeviceSoftware Link 2:
        └─> Software: Adobe Creative Cloud
              └─> Account: adobe@company.com / adobepass456
```

#### Scenario 2: Shared License

```
Software: Zoom Business License (100 users)
  └─> Account: zoom@company.com / zoompass789

DeviceSoftware Links:
  - Device 1: MacBook Pro (CEO)
  - Device 2: Dell Laptop (Manager)
  - Device 3: HP Desktop (Staff)
  ... (100 devices có thể dùng chung 1 license)
```

---

## 2. Complete API Reference

### 2.1 Software Management APIs

#### 2.1.1 Create Software with Account

**Endpoint**: `POST /software`  
**Auth**: JWT Required (Admin/User)  
**Description**: Tạo software mới và tự động tạo account nếu cần

**Request Body**:

```json
{
	"name": "Microsoft Office 365",
	"version": "2024",
	"plan": "Business Premium",
	"licenseKey": "XXXXX-XXXXX-XXXXX",
	"account": {
		"username": "office365@company.com",
		"password": "secure_password",
		"relatedEmail": "admin@company.com",
		"note": "Main company Office 365 account"
	},
	"purchaseDate": "2024-01-01T00:00:00.000Z",
	"expiredDate": "2025-01-01T00:00:00.000Z"
}
```

**Response** (201):

```json
{
	"code": "TOIN-5003",
	"message": "Software created successfully",
	"data": {
		"id": "software_id_123",
		"name": "Microsoft Office 365",
		"version": "2024",
		"plan": "Business Premium",
		"licenseKey": "XXXXX-XXXXX-XXXXX",
		"account": {
			"_id": "account_id_456",
			"username": "office365@company.com",
			"password": "encrypted_password",
			"relatedEmail": "admin@company.com",
			"note": "Main company Office 365 account"
		},
		"purchaseDate": "2024-01-01T00:00:00.000Z",
		"expiredDate": "2025-01-01T00:00:00.000Z"
	}
}
```

**Note**: Account được tự động tạo và liên kết với Software. Password được encrypt trước khi lưu.

---

#### 2.1.2 Get Software with Account Details

**Endpoint**: `GET /software/:id`  
**Auth**: JWT Required (Admin/User)  
**Description**: Lấy thông tin software kèm account đăng nhập

**Response** (200):

```json
{
	"code": "TOIN-5004",
	"message": "Software fetched successfully",
	"data": {
		"id": "software_id_123",
		"name": "Microsoft Office 365",
		"version": "2024",
		"plan": "Business Premium",
		"licenseKey": "XXXXX-XXXXX-XXXXX",
		"account": {
			"_id": "account_id_456",
			"username": "office365@company.com",
			"password": "encrypted_password",
			"relatedEmail": "admin@company.com",
			"note": "Main company Office 365 account"
		},
		"purchaseDate": "2024-01-01T00:00:00.000Z",
		"expiredDate": "2025-01-01T00:00:00.000Z"
	}
}
```

**Mobile Implementation**:

```dart
// Model class
class Software {
  final String id;
  final String name;
  final String version;
  final String plan;
  final String licenseKey;
  final Account? account;  // Nullable - không phải software nào cũng có account
  final DateTime? purchaseDate;
  final DateTime? expiredDate;

  bool get isExpired => expiredDate?.isBefore(DateTime.now()) ?? false;
  bool get isExpiringSoon {
    if (expiredDate == null) return false;
    final daysUntilExpiry = expiredDate!.difference(DateTime.now()).inDays;
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  }
}

class Account {
  final String id;
  final String username;
  final String password;  // Displayed as ******* in UI
  final String? relatedEmail;
  final String? note;
}
```

---

#### 2.1.3 Update Software (including Account)

**Endpoint**: `PATCH /software/:id`  
**Auth**: JWT Required (Admin/User)  
**Description**: Update software info và account

**Request Body** (all optional):

```json
{
	"name": "Microsoft Office 365",
	"version": "2025",
	"plan": "Enterprise",
	"licenseKey": "YYYYY-YYYYY-YYYYY",
	"account": {
		"username": "new_office@company.com",
		"password": "new_secure_password",
		"relatedEmail": "admin@company.com",
		"note": "Updated to enterprise account"
	},
	"purchaseDate": "2024-01-01T00:00:00.000Z",
	"expiredDate": "2026-01-01T00:00:00.000Z"
}
```

---

#### 2.1.4 Get Software Statistics

**Endpoint**: `GET /software/stats`  
**Auth**: JWT Required (Admin/User)  
**Description**: Thống kê tổng quan về software/licenses

**Response** (200):

```json
{
	"code": 200,
	"message": "Success",
	"data": {
		"total": 50,
		"expired": 5,
		"expiringSoon": 8,
		"withLicense": 42
	}
}
```

---

#### 2.1.5 Get Expiring Licenses

**Endpoint**: `GET /software/expiring/:days`  
**Auth**: JWT Required (Admin/User)  
**Description**: Lấy danh sách license sắp hết hạn

**Example**: `GET /software/expiring/30` (licenses hết hạn trong 30 ngày)

**Response** (200):

```json
{
	"code": "TOIN-5004",
	"message": "Software fetched successfully",
	"data": [
		{
			"id": "software_id_1",
			"name": "Adobe Creative Cloud",
			"version": "2024",
			"licenseKey": "ADOBE-XXXXX",
			"expiredDate": "2024-12-15T00:00:00.000Z",
			"account": {
				"username": "adobe@company.com",
				"password": "encrypted_pass"
			}
		},
		{
			"id": "software_id_2",
			"name": "Zoom Business",
			"version": "5.0",
			"licenseKey": "ZOOM-YYYYY",
			"expiredDate": "2024-12-20T00:00:00.000Z",
			"account": {
				"username": "zoom@company.com",
				"password": "encrypted_pass"
			}
		}
	]
}
```

**Mobile UI Suggestion**:

```dart
// Alert widget for expiring licenses
Widget buildExpiryAlert(Software software) {
  final daysLeft = software.expiredDate!.difference(DateTime.now()).inDays;
  final color = daysLeft <= 7 ? Colors.red : Colors.orange;

  return Card(
    color: color.withOpacity(0.1),
    child: ListTile(
      leading: Icon(Icons.warning, color: color),
      title: Text(software.name),
      subtitle: Text('Expires in $daysLeft days'),
      trailing: TextButton(
        onPressed: () => showAccountDetails(software.account),
        child: Text('View Account'),
      ),
    ),
  );
}
```

---

### 2.2 Account Management APIs

#### 2.2.1 Get All Accounts

**Endpoint**: `GET /account`  
**Auth**: JWT Required (Admin/User)  
**Description**: Lấy tất cả accounts trong hệ thống

**Response** (200):

```json
{
	"code": "TOIN-7002",
	"message": "Account fetched successfully",
	"data": [
		{
			"id": "account_id_1",
			"username": "office365@company.com",
			"password": "encrypted_password",
			"relatedEmail": "admin@company.com",
			"note": "Company Office 365 account",
			"createdAt": "2024-01-01T00:00:00.000Z",
			"updatedAt": "2024-01-01T00:00:00.000Z"
		},
		{
			"id": "account_id_2",
			"username": "adobe@company.com",
			"password": "encrypted_password",
			"relatedEmail": "design@company.com",
			"note": "Adobe Creative Cloud for design team"
		}
	]
}
```

---

#### 2.2.2 Create Standalone Account

**Endpoint**: `POST /account`  
**Auth**: JWT Required (Admin/User)  
**Description**: Tạo account độc lập (không gắn với software ngay)

**Request Body**:

```json
{
	"username": "slack@company.com",
	"password": "secure_password",
	"relatedEmail": "admin@company.com",
	"note": "Slack workspace admin account"
}
```

**Response** (201):

```json
{
	"code": "TOIN-7001",
	"message": "Account created successfully",
	"data": {
		"id": "account_id_789",
		"username": "slack@company.com",
		"password": "encrypted_password",
		"relatedEmail": "admin@company.com",
		"note": "Slack workspace admin account",
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

**Use Case**: Tạo account trước, sau đó gán vào software khi cần.

---

#### 2.2.3 Get Account by Username

**Endpoint**: `GET /account/username/:username`  
**Auth**: JWT Required (Admin/User)  
**Description**: Tìm account theo username (useful for search/autocomplete)

**Example**: `GET /account/username/office365@company.com`

**Response** (200):

```json
{
	"code": "TOIN-7002",
	"message": "Account fetched successfully",
	"data": {
		"id": "account_id_456",
		"username": "office365@company.com",
		"password": "encrypted_password",
		"relatedEmail": "admin@company.com",
		"note": "Main company Office 365 account"
	}
}
```

---

#### 2.2.4 Update Account

**Endpoint**: `PATCH /account/:id`  
**Auth**: JWT Required (Admin/User)  
**Description**: Update account credentials

**Request Body** (all optional):

```json
{
	"username": "new_username@company.com",
	"password": "new_secure_password",
	"relatedEmail": "new_email@company.com",
	"note": "Updated account info"
}
```

**Important**: Khi update account, tất cả software sử dụng account này sẽ tự động có thông tin mới.

---

### 2.3 Device-Software Linking APIs

#### 2.3.1 Link Software to Device

**Endpoint**: `POST /device/:deviceId/link-software/:softwareId`  
**Auth**: JWT Required (Admin/User)  
**Description**: Cài đặt software lên device

**Example**: `POST /device/device123/link-software/software456`

**Response** (200):

```json
{
	"code": "TOIN-5001",
	"message": "Software linked to device successfully",
	"data": {
		"id": "link_id_789",
		"device": "device123",
		"software": "software456",
		"note": "",
		"createdAt": "2024-01-01T00:00:00.000Z",
		"updatedAt": "2024-01-01T00:00:00.000Z"
	}
}
```

**Mobile Workflow**:

```
1. User scans QR code → Get device details
2. Show list of available software
3. User selects software to install
4. Call POST /device/:deviceId/link-software/:softwareId
5. Show success message with account credentials
```

---

#### 2.3.2 Get Software Installed on Device

**Endpoint**: `GET /device/:deviceId/software`  
**Auth**: JWT Required (Admin/User)  
**Description**: Lấy danh sách software đã cài trên device

**Response** (200):

```json
{
	"code": "TOIN-1015",
	"message": "Device fetched successfully",
	"data": [
		{
			"id": "software_id_1",
			"name": "Microsoft Office 365",
			"version": "2024",
			"licenseKey": "XXXXX-XXXXX-XXXXX",
			"expiredDate": "2025-01-01T00:00:00.000Z",
			"account": {
				"username": "office365@company.com",
				"password": "encrypted_password",
				"note": "Main company account"
			}
		},
		{
			"id": "software_id_2",
			"name": "Adobe Creative Cloud",
			"version": "2024",
			"licenseKey": "ADOBE-XXXXX",
			"expiredDate": "2025-06-01T00:00:00.000Z",
			"account": {
				"username": "adobe@company.com",
				"password": "encrypted_password"
			}
		}
	]
}
```

**Mobile UI Suggestion**:

```dart
class DeviceSoftwareListScreen extends StatelessWidget {
  final Device device;

  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('${device.name} - Software')),
      body: FutureBuilder<List<Software>>(
        future: apiService.getDeviceSoftware(device.id),
        builder: (context, snapshot) {
          if (!snapshot.hasData) return CircularProgressIndicator();

          return ListView.builder(
            itemCount: snapshot.data!.length,
            itemBuilder: (ctx, i) {
              final software = snapshot.data![i];
              return ExpansionTile(
                title: Text(software.name),
                subtitle: Text('Version ${software.version}'),
                children: [
                  ListTile(
                    title: Text('License Key'),
                    subtitle: SelectableText(software.licenseKey),
                    trailing: IconButton(
                      icon: Icon(Icons.copy),
                      onPressed: () => copyToClipboard(software.licenseKey),
                    ),
                  ),
                  if (software.account != null) ...[
                    ListTile(
                      title: Text('Account Username'),
                      subtitle: SelectableText(software.account!.username),
                    ),
                    ListTile(
                      title: Text('Password'),
                      subtitle: Text('••••••••'),
                      trailing: IconButton(
                        icon: Icon(Icons.visibility),
                        onPressed: () => showPasswordDialog(software.account!),
                      ),
                    ),
                  ],
                ],
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () => showAddSoftwareDialog(device),
      ),
    );
  }
}
```

---

#### 2.3.3 Unlink Software from Device

**Endpoint**: `POST /device/:deviceId/unlink-software/:softwareId`  
**Auth**: JWT Required (Admin/User)  
**Description**: Gỡ cài đặt software khỏi device

**Response** (200):

```json
{
	"code": "TOIN-5002",
	"message": "Software unlinked from device successfully",
	"data": {
		"id": "link_id_789",
		"device": "device123",
		"software": "software456"
	}
}
```

---

#### 2.3.4 Get All Device-Software Links

**Endpoint**: `GET /device/software/links/all`  
**Auth**: JWT Required (Admin/User)  
**Description**: Lấy tất cả liên kết device-software (for reporting)

**Response** (200):

```json
{
	"code": "TOIN-1015",
	"message": "Device fetched successfully",
	"data": [
		{
			"id": "link_id_1",
			"device": {
				"id": "device_id_1",
				"name": "MacBook Pro 16",
				"serialNumber": "SN12345",
				"type": "LAPTOP",
				"brand": "APPLE",
				"status": "IN_USE"
			},
			"software": {
				"id": "software_id_1",
				"name": "Microsoft Office 365",
				"version": "2024",
				"licenseKey": "XXXXX-XXXXX-XXXXX",
				"account": {
					"username": "office365@company.com",
					"password": "encrypted_password"
				}
			},
			"createdAt": "2024-01-01T00:00:00.000Z"
		}
	]
}
```

**Use Case**: Generate report showing which devices have which software installed.

---

#### 2.3.5 Get Specific Device-Software Link

**Endpoint**: `GET /device/links/software/:linkId`  
**Auth**: JWT Required (Admin/User)  
**Description**: Lấy chi tiết 1 liên kết cụ thể

**Response** (200):

```json
{
	"code": "TOIN-1015",
	"message": "Device fetched successfully",
	"data": {
		"id": "link_id_789",
		"device": {
			"id": "device_id_123",
			"name": "Dell Latitude 7490",
			"serialNumber": "DELL-SN789",
			"type": "LAPTOP"
		},
		"software": {
			"id": "software_id_456",
			"name": "Adobe Photoshop",
			"version": "2024",
			"licenseKey": "ADOBE-PS-XXXXX",
			"account": {
				"username": "adobe@company.com",
				"password": "encrypted_password",
				"note": "Shared account for design team"
			}
		},
		"note": "Installed for design work",
		"createdAt": "2024-01-15T00:00:00.000Z"
	}
}
```

---

### 2.4 Credential Management APIs (Network Folders)

#### 2.4.1 Get All Credentials

**Endpoint**: `GET /credential`  
**Auth**: JWT Required (Admin/User)  
**Description**: Lấy danh sách credentials cho network folders

**Response** (200):

```json
{
	"code": "TOIN-6002",
	"message": "Credential fetched successfully",
	"data": [
		{
			"id": 1,
			"username": "network_user1",
			"password": "encrypted_password",
			"departments": ["IT", "QA"],
			"allowedFolders": ["Toin_New", "Sales", "Thietke_New"],
			"createdAt": "2024-01-01T00:00:00.000Z",
			"updatedAt": "2024-01-01T00:00:00.000Z"
		}
	]
}
```

**Note**: Credentials này dùng cho truy cập network folders, khác với Account (dùng cho software).

---

#### 2.4.2 Create Credential

**Endpoint**: `POST /credential`  
**Auth**: JWT Required (Admin only)  
**Description**: Tạo credential mới (chỉ Admin)

**Request Body**:

```json
{
	"username": "network_user2",
	"password": "secure_password",
	"departments": ["IT", "Designing dept"],
	"allowedFolders": ["Toin_New", "Thietke_New", "Designing dept"]
}
```

---

## 3. Common Use Cases & Workflows

### UC1: Setup New Device with Software

```
Step 1: Create/Get Device
  POST /device/create
  Body: { name, brand, type, serialNumber, ... }

Step 2: Get Available Software
  GET /software

Step 3: Link Software to Device
  POST /device/{deviceId}/link-software/{softwareId}

Step 4: Get Device Software List (verify)
  GET /device/{deviceId}/software
  Response includes account credentials for each software

Step 5: Display Account Info to User
  Show username, password for software activation
```

---

### UC2: Software License Renewal

```
Step 1: Get Expiring Licenses
  GET /software/expiring/30

Step 2: Select Software to Renew
  Display list with expiry dates

Step 3: Update Software Expiry Date
  PATCH /software/{id}
  Body: { expiredDate: "2026-01-01T00:00:00.000Z" }

Step 4: Optionally Update Account Credentials
  If login changed, update in same request:
  Body: {
    expiredDate: "2026-01-01T00:00:00.000Z",
    account: {
      username: "new_email@company.com",
      password: "new_password"
    }
  }
```

---

### UC3: Find Which Devices Use Specific Software

```
Step 1: Get Software Details
  GET /software/{id}

Step 2: Get All Device-Software Links
  GET /device/software/links/all

Step 3: Filter by Software ID
  Client-side filter or backend pagination

Result: List of devices with that software installed
```

---

### UC4: Account Management for Shared License

```
Scenario: 100 devices share 1 Zoom license with 1 account

Step 1: Create Software with Account
  POST /software
  Body: {
    name: "Zoom Business",
    licenseKey: "ZOOM-100USERS",
    account: {
      username: "zoom@company.com",
      password: "zoompass"
    }
  }

Step 2: Link to Multiple Devices
  For each device:
    POST /device/{deviceId}/link-software/{zoomSoftwareId}

Step 3: Update Account Password (affects all devices)
  PATCH /account/{accountId}
  Body: { password: "new_zoom_password" }

  → All 100 devices automatically have new password
```

---

### UC5: Device Software Inventory Report

```
Step 1: Get All Device-Software Links
  GET /device/software/links/all

Step 2: Group by Software
  Client-side processing:
  {
    "Microsoft Office 365": [
      { device: "MacBook Pro", user: "John Doe" },
      { device: "Dell Laptop", user: "Jane Smith" }
    ],
    "Adobe Creative Cloud": [
      { device: "MacBook Pro", user: "Designer 1" }
    ]
  }

Step 3: Calculate License Usage
  - Total licenses purchased
  - Licenses in use (linked to devices)
  - Available licenses
  - Over-allocated licenses (if any)
```

---

## 4. Data Flow Examples

### Example 1: Complete Device Setup

```json
// 1. Create Device
POST /device/create
Request: {
  "name": "MacBook Pro 16",
  "brand": "APPLE",
  "type": "LAPTOP",
  "serialNumber": "APPLE-MBP-2024-001",
  "status": "AVAILABLE",
  "purchasedDate": "2024-01-01T00:00:00.000Z"
}
Response: {
  "code": "TOIN-1014",
  "data": {
    "id": "device_001",
    "name": "MacBook Pro 16",
    ...
  }
}

// 2. Create Software with Account
POST /software
Request: {
  "name": "Microsoft Office 365",
  "version": "2024",
  "licenseKey": "XXXXX-XXXXX-XXXXX",
  "account": {
    "username": "office365@company.com",
    "password": "SecurePass123",
    "note": "Company account"
  },
  "expiredDate": "2025-01-01T00:00:00.000Z"
}
Response: {
  "code": "TOIN-5003",
  "data": {
    "id": "software_001",
    "name": "Microsoft Office 365",
    "account": {
      "id": "account_001",
      "username": "office365@company.com",
      ...
    }
  }
}

// 3. Link Software to Device
POST /device/device_001/link-software/software_001
Response: {
  "code": "TOIN-5001",
  "data": {
    "id": "link_001",
    "device": "device_001",
    "software": "software_001"
  }
}

// 4. Assign Device to User
POST /device/assign
Request: {
  "device": "device_001",
  "assigned_to": "employee_001",
  "issued_by": "admin_001",
  "assigned_date": "2024-01-05T00:00:00.000Z",
  "note": "For project work"
}

// 5. Get Complete Device Info
GET /device/device_001/software
Response: {
  "data": [
    {
      "id": "software_001",
      "name": "Microsoft Office 365",
      "licenseKey": "XXXXX-XXXXX-XXXXX",
      "account": {
        "username": "office365@company.com",
        "password": "encrypted_SecurePass123"
      },
      "expiredDate": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Example 2: License Expiry Alert & Renewal

```json
// 1. Get Expiring Licenses (30 days)
GET /software/expiring/30
Response: {
  "data": [
    {
      "id": "software_002",
      "name": "Adobe Creative Cloud",
      "expiredDate": "2024-12-15T00:00:00.000Z",
      "account": {
        "username": "adobe@company.com"
      }
    }
  ]
}

// 2. Get Software Stats
GET /software/stats
Response: {
  "data": {
    "total": 50,
    "expired": 3,
    "expiringSoon": 8,
    "withLicense": 45
  }
}

// 3. Renew License
PATCH /software/software_002
Request: {
  "expiredDate": "2025-12-15T00:00:00.000Z",
  "licenseKey": "NEW-ADOBE-KEY-2025",
  "account": {
    "password": "NewAdobe2025Pass"
  }
}
Response: {
  "code": "TOIN-5005",
  "data": {
    "id": "software_002",
    "name": "Adobe Creative Cloud",
    "expiredDate": "2025-12-15T00:00:00.000Z",
    "account": {
      "username": "adobe@company.com",
      "password": "encrypted_NewAdobe2025Pass"
    }
  }
}
```

---

## 5. Mobile App Implementation Guide

### 5.1 State Management Structure

```dart
// Recommended state structure
class AppState {
  List<Device> devices;
  List<Software> softwareList;
  List<Account> accounts;
  List<DeviceSoftwareLink> links;

  // Computed properties
  Map<String, List<Software>> get deviceSoftwareMap {
    // Group software by device
  }

  List<Software> get expiringSoftware {
    // Filter software expiring within 30 days
  }

  Map<String, int> get licenseUsage {
    // Count devices per software
  }
}
```

---

### 5.2 API Service Layer

```dart
class DeviceSoftwareService {
  final ApiClient _client;

  // Software APIs
  Future<Software> createSoftware(CreateSoftwareDto dto) async {
    final response = await _client.post('/software', body: dto.toJson());
    return Software.fromJson(response.data);
  }

  Future<List<Software>> getExpiringSoftware(int days) async {
    final response = await _client.get('/software/expiring/$days');
    return (response.data as List)
        .map((json) => Software.fromJson(json))
        .toList();
  }

  // Device-Software Linking
  Future<DeviceSoftwareLink> linkSoftware(
    String deviceId,
    String softwareId
  ) async {
    final response = await _client.post(
      '/device/$deviceId/link-software/$softwareId'
    );
    return DeviceSoftwareLink.fromJson(response.data);
  }

  Future<List<Software>> getDeviceSoftware(String deviceId) async {
    final response = await _client.get('/device/$deviceId/software');
    return (response.data as List)
        .map((json) => Software.fromJson(json))
        .toList();
  }

  // Account APIs
  Future<Account> createAccount(CreateAccountDto dto) async {
    final response = await _client.post('/account', body: dto.toJson());
    return Account.fromJson(response.data);
  }

  Future<Account> getAccountByUsername(String username) async {
    final response = await _client.get('/account/username/$username');
    return Account.fromJson(response.data);
  }
}
```

---

### 5.3 UI Screens

#### Screen 1: Device Software List

```dart
class DeviceSoftwareScreen extends StatelessWidget {
  final Device device;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${device.name} - Software'),
        actions: [
          IconButton(
            icon: Icon(Icons.add),
            onPressed: () => _showAddSoftwareDialog(context),
          ),
        ],
      ),
      body: FutureBuilder<List<Software>>(
        future: deviceSoftwareService.getDeviceSoftware(device.id),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return ErrorWidget(snapshot.error);
          }

          final softwareList = snapshot.data ?? [];

          if (softwareList.isEmpty) {
            return EmptyState(
              message: 'No software installed',
              action: TextButton(
                onPressed: () => _showAddSoftwareDialog(context),
                child: Text('Add Software'),
              ),
            );
          }

          return ListView.builder(
            itemCount: softwareList.length,
            itemBuilder: (context, index) {
              final software = softwareList[index];
              return SoftwareCard(
                software: software,
                onUnlink: () => _unlinkSoftware(software),
                onViewAccount: () => _showAccountDetails(software.account),
              );
            },
          );
        },
      ),
    );
  }
}
```

#### Screen 2: License Expiry Dashboard

```dart
class LicenseExpiryDashboard extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('License Management')),
      body: Column(
        children: [
          // Stats Cards
          FutureBuilder<SoftwareStats>(
            future: softwareService.getStats(),
            builder: (context, snapshot) {
              if (!snapshot.hasData) return LoadingWidget();

              final stats = snapshot.data!;
              return Row(
                children: [
                  StatCard(
                    title: 'Total',
                    value: stats.total.toString(),
                    color: Colors.blue,
                  ),
                  StatCard(
                    title: 'Expired',
                    value: stats.expired.toString(),
                    color: Colors.red,
                  ),
                  StatCard(
                    title: 'Expiring Soon',
                    value: stats.expiringSoon.toString(),
                    color: Colors.orange,
                  ),
                ],
              );
            },
          ),

          // Expiring Software List
          Expanded(
            child: FutureBuilder<List<Software>>(
              future: softwareService.getExpiringSoftware(30),
              builder: (context, snapshot) {
                if (!snapshot.hasData) return LoadingWidget();

                return ListView.builder(
                  itemCount: snapshot.data!.length,
                  itemBuilder: (context, index) {
                    final software = snapshot.data![index];
                    final daysLeft = software.expiredDate!
                        .difference(DateTime.now())
                        .inDays;

                    return Card(
                      color: daysLeft <= 7
                          ? Colors.red.shade50
                          : Colors.orange.shade50,
                      child: ListTile(
                        leading: Icon(
                          Icons.warning,
                          color: daysLeft <= 7
                              ? Colors.red
                              : Colors.orange,
                        ),
                        title: Text(software.name),
                        subtitle: Text(
                          'Expires in $daysLeft days\n'
                          'License: ${software.licenseKey}'
                        ),
                        trailing: ElevatedButton(
                          onPressed: () => _renewLicense(software),
                          child: Text('Renew'),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

#### Screen 3: Software Detail with Account

```dart
class SoftwareDetailScreen extends StatelessWidget {
  final Software software;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(software.name),
        actions: [
          IconButton(
            icon: Icon(Icons.edit),
            onPressed: () => _editSoftware(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Software Info Card
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Software Information',
                        style: Theme.of(context).textTheme.headline6),
                    SizedBox(height: 16),
                    InfoRow(label: 'Name', value: software.name),
                    InfoRow(label: 'Version', value: software.version),
                    InfoRow(label: 'Plan', value: software.plan),
                    InfoRow(
                      label: 'License Key',
                      value: software.licenseKey,
                      copyable: true,
                    ),
                    InfoRow(
                      label: 'Purchase Date',
                      value: DateFormat('yyyy-MM-dd')
                          .format(software.purchaseDate!),
                    ),
                    InfoRow(
                      label: 'Expiry Date',
                      value: DateFormat('yyyy-MM-dd')
                          .format(software.expiredDate!),
                      color: software.isExpired
                          ? Colors.red
                          : software.isExpiringSoon
                              ? Colors.orange
                              : null,
                    ),
                  ],
                ),
              ),
            ),

            SizedBox(height: 16),

            // Account Info Card
            if (software.account != null)
              Card(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Account Credentials',
                              style: Theme.of(context).textTheme.headline6),
                          IconButton(
                            icon: Icon(Icons.edit),
                            onPressed: () => _editAccount(
                                context, software.account!),
                          ),
                        ],
                      ),
                      SizedBox(height: 16),
                      InfoRow(
                        label: 'Username',
                        value: software.account!.username,
                        copyable: true,
                      ),
                      InfoRow(
                        label: 'Password',
                        value: '••••••••',
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: Icon(Icons.visibility),
                              onPressed: () => _showPassword(
                                  context, software.account!.password),
                            ),
                            IconButton(
                              icon: Icon(Icons.copy),
                              onPressed: () => _copyPassword(
                                  software.account!.password),
                            ),
                          ],
                        ),
                      ),
                      if (software.account!.relatedEmail != null)
                        InfoRow(
                          label: 'Related Email',
                          value: software.account!.relatedEmail!,
                        ),
                      if (software.account!.note != null)
                        InfoRow(
                          label: 'Note',
                          value: software.account!.note!,
                        ),
                    ],
                  ),
                ),
              ),

            SizedBox(height: 16),

            // Devices Using This Software
            Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Devices Using This Software',
                        style: Theme.of(context).textTheme.headline6),
                    SizedBox(height: 16),
                    FutureBuilder<List<Device>>(
                      future: _getDevicesUsingSoftware(software.id),
                      builder: (context, snapshot) {
                        if (!snapshot.hasData)
                          return CircularProgressIndicator();

                        return Column(
                          children: snapshot.data!.map((device) {
                            return ListTile(
                              leading: Icon(Icons.devices),
                              title: Text(device.name),
                              subtitle: Text(device.serialNumber),
                              trailing: IconButton(
                                icon: Icon(Icons.remove_circle_outline),
                                onPressed: () => _unlinkFromDevice(
                                    device, software),
                              ),
                            );
                          }).toList(),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

### 5.4 Offline Support

```dart
class OfflineSoftwareRepository {
  final HiveBox<Software> softwareBox;
  final HiveBox<Account> accountBox;
  final HiveBox<DeviceSoftwareLink> linkBox;

  // Cache data when online
  Future<void> cacheSoftware(List<Software> software) async {
    await softwareBox.clear();
    await softwareBox.addAll(software);
  }

  // Get cached data when offline
  List<Software> getCachedSoftware() {
    return softwareBox.values.toList();
  }

  // Queue offline operations
  Future<void> queueLinkOperation(String deviceId, String softwareId) async {
    // Store in pending operations queue
    // Sync when connection restored
  }
}
```

---

### 5.5 Push Notifications

```dart
class LicenseNotificationService {
  // Check for expiring licenses daily
  Future<void> checkExpiringLicenses() async {
    final expiring = await softwareService.getExpiringSoftware(7);

    for (var software in expiring) {
      final daysLeft = software.expiredDate!
          .difference(DateTime.now())
          .inDays;

      await showNotification(
        title: 'License Expiring Soon',
        body: '${software.name} expires in $daysLeft days',
        payload: software.id,
      );
    }
  }

  // Handle notification tap
  Future<void> onNotificationTapped(String? payload) async {
    if (payload != null) {
      // Navigate to software detail screen
      final software = await softwareService.getSoftware(payload);
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => SoftwareDetailScreen(software: software),
        ),
      );
    }
  }
}
```

---

## 6. Security Considerations

### 6.1 Password Handling

- **Storage**: Passwords encrypted trong database
- **Display**: Hiển thị dạng ••••••• mặc định
- **Copy**: Cho phép copy nhưng log action
- **Visibility**: Chỉ hiện khi user tap "show" button

### 6.2 Access Control

- **Software**: Admin/User đều có thể view
- **Account**: Chỉ authenticated users
- **Credential**: Admin only để create/update/delete

### 6.3 Audit Trail

- Log mỗi lần user view/copy password
- Track software license usage
- Monitor account credential changes

---

## 7. Testing Scenarios

### Test 1: Create Software with Account

```
1. POST /software with account data
2. Verify software created
3. Verify account created and linked
4. GET /software/:id → check account populated
```

### Test 2: Link Software to Multiple Devices

```
1. Create 1 software with shared account
2. Link to 10 devices
3. Verify all devices can access same account
4. Update account password
5. Verify all devices see new password
```

### Test 3: License Expiry Workflow

```
1. Create software with expiry date in 5 days
2. GET /software/expiring/7 → verify software appears
3. GET /software/stats → verify expiringSoon count
4. PATCH /software with new expiry date
5. GET /software/expiring/7 → verify software gone
```

### Test 4: Unlink Software

```
1. Link software to device
2. GET /device/:id/software → verify software appears
3. POST /device/:id/unlink-software/:softwareId
4. GET /device/:id/software → verify software removed
5. Software and account still exist (not deleted)
```

---

## 8. API Response Codes Summary

### Software Operations

- `TOIN-5001`: Software linked to device successfully
- `TOIN-5002`: Software unlinked from device successfully
- `TOIN-5003`: Software created successfully
- `TOIN-5004`: Software fetched successfully
- `TOIN-5005`: Software updated successfully
- `TOIN-5006`: Software deleted successfully
- `TOIN-5007`: Software not found

### Account Operations

- `TOIN-7001`: Account created successfully
- `TOIN-7002`: Account fetched successfully
- `TOIN-7003`: Account updated successfully
- `TOIN-7004`: Account deleted successfully
- `TOIN-7005`: Account not found
- `TOIN-7006`: Account already exists

### Credential Operations

- `TOIN-6001`: Credential created successfully
- `TOIN-6002`: Credential fetched successfully
- `TOIN-6003`: Credential updated successfully
- `TOIN-6004`: Credential deleted successfully
- `TOIN-6005`: Credential not found

---

## 9. Best Practices

### For Mobile Development:

1. **Cache account credentials** securely (encrypted local storage)
2. **Mask passwords** by default, show only when needed
3. **Copy to clipboard** with confirmation toast
4. **Show expiry alerts** prominently (30, 15, 7 days before)
5. **Group devices by software** for better overview
6. **Enable QR scan** for quick device-software linking
7. **Offline support** for viewing cached data
8. **Sync queue** for operations done offline

### For Backend:

1. **Encrypt passwords** before storing
2. **Populate relationships** automatically
3. **Cascade updates** (account change affects all software)
4. **Soft delete** for audit purposes
5. **Index foreign keys** for performance

---

**Last Updated**: 2024-11-12  
**Document Version**: 1.0  
**Purpose**: AI-assisted mobile app development prompt
