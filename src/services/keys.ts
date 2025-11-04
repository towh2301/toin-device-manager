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
	DEVICE_DETAILS = 'device_details/:id',
	DEVICE_BY_ID = 'device_by_id',
	DEVICE_BY_CATEGORY = 'device_by_category',
	DEVICE_BY_SEARCH = 'device_by_search',
}

export const API_URL = Constants.expoConfig?.extra?.apiUrl;
