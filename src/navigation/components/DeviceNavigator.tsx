import DeviceDetailScreen from '@/src/screens/main/device/DeviceDetailScreen';
import DeviceScreen from '@/src/screens/main/device/DeviceScreen';
import QrScanScreen from '@/src/screens/main/device/ScanQRDevice';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { DeviceStackParamList, NavigationRoutes } from '../types';

const DeviceStack = createNativeStackNavigator<DeviceStackParamList>();

const DeviceNavigator = () => {
	return (
		<DeviceStack.Navigator
			screenOptions={{ headerShown: false }}
			initialRouteName={NavigationRoutes.DEVICE_LIST}
		>
			<DeviceStack.Screen
				name={NavigationRoutes.DEVICE_LIST}
				component={DeviceScreen}
			/>
			<DeviceStack.Screen
				name={NavigationRoutes.DEVICE_DETAIL}
				component={DeviceDetailScreen}
			/>
			<DeviceStack.Screen
				name={NavigationRoutes.QR_SCAN}
				component={QrScanScreen}
				options={{
					headerShown: false,
					animation: 'slide_from_bottom',
					presentation: 'fullScreenModal',
				}}
			/>
		</DeviceStack.Navigator>
	);
};

export default DeviceNavigator;
