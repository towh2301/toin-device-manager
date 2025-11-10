import React from 'react';
import { Text, XStack } from 'tamagui';
import { AppColors } from '../common/app-color';
import { DeviceType } from '../services/device/types';

// --- TYPE BADGE ---
export const TypeBadge = ({
	type,
	backgroundColor,
}: {
	type: DeviceType;
	backgroundColor: string;
}) => (
	<XStack
		backgroundColor={backgroundColor} // 15 = ~8% opacity
		borderRadius="$8"
		paddingHorizontal="$3"
		paddingVertical="$1.5"
		borderWidth={1}
		borderColor={AppColors.primaryLight + '40'} // 40 = ~25% opacity
		alignSelf="flex-start"
	>
		<Text
			fontSize={11}
			fontWeight="700"
			color={AppColors.primary}
			letterSpacing={0.5}
			textTransform="uppercase"
		>
			{type}
		</Text>
	</XStack>
);
