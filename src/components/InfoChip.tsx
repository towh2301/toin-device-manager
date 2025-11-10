import React from 'react';
import { Text, XStack } from 'tamagui';
import { AppColors } from '../common/app-color';

// --- INFO CHIP ---
export const InfoChip = ({
	icon: Icon,
	value,
}: {
	icon: any;
	value: string | number;
}) => (
	<XStack
		alignItems="center"
		gap="$1.5"
		backgroundColor={AppColors.surfaceElevated}
		borderRadius="$6"
		paddingHorizontal="$2.5"
		paddingVertical="$1.5"
		borderWidth={1}
		borderColor={AppColors.border}
	>
		<Icon size={12} color={AppColors.textSecondary} strokeWidth={2.5} />
		<Text fontSize={11} color={AppColors.textSecondary} fontWeight="600">
			{value}
		</Text>
	</XStack>
);
