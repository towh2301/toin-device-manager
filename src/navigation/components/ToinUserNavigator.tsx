import ToinUserDetailScreen from '@/src/screens/main/toin_user/ToinUserDetailScreen';
import ToinUserScreen from '@/src/screens/main/toin_user/ToinUserScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { NavigationRoutes, ToinUserStackParamList } from '../types';

const ToinStack = createNativeStackNavigator<ToinUserStackParamList>();

const ToinUserNavigator = () => {
	return (
		<ToinStack.Navigator
			screenOptions={{ headerShown: false }}
			initialRouteName={NavigationRoutes.TOIN_USER_LIST}
		>
			<ToinStack.Screen
				name={NavigationRoutes.TOIN_USER_LIST}
				component={ToinUserScreen}
			/>
			<ToinStack.Screen
				name={NavigationRoutes.TOIN_USER_DETAIL}
				component={ToinUserDetailScreen}
			/>
		</ToinStack.Navigator>
	);
};

export default ToinUserNavigator;
