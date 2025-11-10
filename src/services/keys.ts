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
	TOIN_USER_INFO = 'toin_user_info',

	// Devices
	ALL_DEVICES = 'devices',
	DEVICE_DETAILS = 'device_details',
	DEVICE_BY_ID = 'device_by_id',
	DEVICE_BY_SERIAL_NUMBER = 'device_by_serial_number',
	DEVICE_BY_CATEGORY = 'device_by_category',
	DEVICE_BY_SEARCH = 'device_by_search',
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
