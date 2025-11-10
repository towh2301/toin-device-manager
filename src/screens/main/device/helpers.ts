import { DeviceStackParamList, NavigationRoutes } from '@/src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DeviceScreenNavigationProp = NativeStackNavigationProp<
	DeviceStackParamList,
	NavigationRoutes.DEVICE_LIST
>;

export type { DeviceScreenNavigationProp };
