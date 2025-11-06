import HomeScreen from '@/src/screens/main/dashboard/HomeScreen';
import DeviceScreen from '@/src/screens/main/device/DeviceScreen';
import ProfileScreen from '@/src/screens/main/profile/ProfileScreen';
import ToinUserScreen from '@/src/screens/main/toin_user/ToinUserScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomFloatingBar from '@src/components/CustomFloatingBar';
import React from 'react';
import { BottomTabParamList, NavigationRoutes } from '../types';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigator = () => {
	return (
		<Tab.Navigator
			// Use the custom floating tab bar component
			tabBar={(props) => <CustomFloatingBar {...props} />}
			screenOptions={{
				// Crucial: Set the header to false
				headerShown: false,
			}}
		>
			<Tab.Screen
				name={NavigationRoutes.DASHBOARD}
				component={HomeScreen}
				options={{ tabBarLabel: 'Home' }}
			/>
			<Tab.Screen
				name={NavigationRoutes.DEVICE}
				component={DeviceScreen}
				options={{ tabBarLabel: 'Devices' }}
			/>
			<Tab.Screen
				name={NavigationRoutes.TOIN_USER}
				component={ToinUserScreen}
				options={{ tabBarLabel: 'Users' }}
			/>
			<Tab.Screen
				name={NavigationRoutes.PROFILE}
				component={ProfileScreen}
				options={{ tabBarLabel: 'Profile' }}
			/>
		</Tab.Navigator>
	);
};

export default TabNavigator;
