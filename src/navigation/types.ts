import { NavigatorScreenParams, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Enum for routes in the navigation stack
export enum NavigationRoutes {
	MAIN = 'MainScreen',
	LOGIN = 'LoginScreen',

	// Dashboard Screen
	DASHBOARD = 'DashboardScreen',

	// Toin user management screens
	TOIN_USER = 'ToinUserScreen',
	TOIN_USER_LIST = 'ToinUserListScreen',
	TOIN_USER_DETAIL = 'ToinUserDetailScreen',
	TOIN_USER_CREATE = 'ToinUserCreateScreen',
	TOIN_USER_EDIT = 'ToinUserEditScreen',

	// Device Management Screens
	DEVICE = 'DeviceScreen',
	DEVICE_LIST = 'DeviceListScreen',
	DEVICE_DETAIL = 'DeviceDetailScreen',
	DEVICE_CREATE = 'DeviceCreateScreen',
	DEVICE_EDIT = 'DeviceEditScreen',
	QR_SCAN = 'QrScanScreen',

	// Software Management Screens
	SOFTWARE_LIST = 'SoftwareListScreen',
	SOFTWARE_DETAIL = 'SoftwareDetailScreen',
	SOFTWARE_CREATE = 'SoftwareCreateScreen',
	SOFTWARE_EDIT = 'SoftwareEditScreen',

	// Assignment Screen
	ASSIGNMENT_LIST = 'AssignmentListScreen',

	// Profile Screen
	PROFILE = 'ProfileScreen',
}

// Root stack parameter list
export type RootStackParamList = {
	[NavigationRoutes.MAIN]: NavigatorScreenParams<BottomTabParamList>;
	[NavigationRoutes.LOGIN]: undefined;
};

// Main stack parameter list
export type MainStackParamList = {
	[NavigationRoutes.DASHBOARD]: NavigatorScreenParams<DashboardStackParamList>;
	[NavigationRoutes.TOIN_USER]: NavigatorScreenParams<ToinUserStackParamList>;
	[NavigationRoutes.DEVICE]: NavigatorScreenParams<DeviceStackParamList>;
	[NavigationRoutes.PROFILE]: undefined;
};

// Dashboard stack parameter list
export type DashboardStackParamList = {
	[NavigationRoutes.DEVICE]: undefined;
	[NavigationRoutes.TOIN_USER]: undefined;
};

// Toin User stack parameter list
export type ToinUserStackParamList = {
	[NavigationRoutes.TOIN_USER_LIST]: undefined;
	[NavigationRoutes.TOIN_USER_DETAIL]: { userId: string };
	[NavigationRoutes.TOIN_USER_CREATE]: undefined;
	[NavigationRoutes.TOIN_USER_EDIT]: { userId: string };
};

// Device stack parameter list
export type DeviceStackParamList = {
	[NavigationRoutes.DEVICE_LIST]: { serialNumber?: string } | undefined;
	[NavigationRoutes.DEVICE_DETAIL]: {
		serialNumber: string;
	};
	[NavigationRoutes.DEVICE_CREATE]: undefined;
	[NavigationRoutes.DEVICE_EDIT]: { serialNumber: string };
	[NavigationRoutes.QR_SCAN]: undefined;
};

// Device detail stack parameter list
export type DeviceDetailStackParamList = {
	[NavigationRoutes.ASSIGNMENT_LIST]: { deviceId: string };
	[NavigationRoutes.SOFTWARE_LIST]: { deviceId: string };
	[NavigationRoutes.SOFTWARE_DETAIL]: {
		deviceId: string;
		softwareId: string;
	};
	[NavigationRoutes.SOFTWARE_CREATE]: { deviceId: string };
	[NavigationRoutes.SOFTWARE_EDIT]: { deviceId: string; softwareId: string };
};

// For bottom tab navigation
export type BottomTabParamList = MainStackParamList & {};
export type TabBarRouteProp<T extends keyof BottomTabParamList> = {
	route: RouteProp<BottomTabParamList, T>;
};

// Extend the global ReactNavigation namespace for type safety
declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

// Prop types
type ToinUserNavigationProps =
	NativeStackNavigationProp<ToinUserStackParamList>;

type DeviceScreenNavigationProp =
	NativeStackNavigationProp<DeviceStackParamList>;

export { DeviceScreenNavigationProp, ToinUserNavigationProps };
