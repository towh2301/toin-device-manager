import Constants from 'expo-constants';

export enum API_KEYS {
	LOGIN = 'login',
	REFRESH_TOKEN = 'refresh_token',

	// Users
	GET_USER_INFO = 'get_user_info',
	UPDATE_USER_INFO = 'update_user_info',
	CREATE_USER = 'create_user',

	// Toin users
	TOIN_USERS = 'toin_users',
	ALL_TOIN_USERS = 'all_toin_users',
	TOIN_USER_INFO = 'toin_user_info',
	TOIN_USER_BY_ID = 'toin_user_by_id',
	DEPARTMENT_LIST = 'department_list',

	// Devices
	ALL_DEVICES = 'devices',
	DEVICE_DETAILS = 'device_details',
	DEVICE_BY_ID = 'device_by_id',
	DEVICE_BY_SERIAL_NUMBER = 'device_by_serial_number',
	DEVICE_BY_CATEGORY = 'device_by_category',
	DEVICE_BY_SEARCH = 'device_by_search',

	// Device Assignments
	DEVICE_ASSIGNMENTS = 'device_assignments',
	ALL_ASSIGNMENTS = 'all_assignments',

	// Device Software
	DEVICE_SOFTWARE = 'device_software',
	DEVICE_SOFTWARE_LINK = 'device_software_link',
	ALL_DEVICE_SOFTWARE_LINKS = 'all_device_software_links',

	// QR Code
	DEVICE_QR_CODE = 'device_qr_code',
}

// Get API URL from expo config with fallback and validation
export const API_URL = (() => {
	const apiUrl = Constants.expoConfig?.extra?.apiUrl;

	if (!apiUrl) {
		console.error('❌ API_URL not found in app.json extra config!');
		console.error(
			'📋 Please add "extra": { "apiUrl": "your-api-url" } to your app.json'
		);
		// Return a default for development, but log the error
		return 'http://localhost:3000/api/v1';
	}

	console.log('🌐 API_URL loaded:', apiUrl);
	return apiUrl;
})();
