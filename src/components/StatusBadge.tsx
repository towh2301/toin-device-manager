import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import { AppColors } from '../common/app-color';
import { DeviceStatus } from '../services/device/types';

// --- STATUS CONFIGURATION ---
export const getStatusConfig = (status: DeviceStatus) => {
	switch (status) {
		case 'AVAILABLE':
			return {
				bg: AppColors.successLight,
				solid: AppColors.success,
				border: AppColors.success,
				text: AppColors.successDark,
				icon: '✓',
				label: 'Sẵn sàng',
			};
		case 'IN_USE':
			return {
				bg: AppColors.infoLight,
				solid: AppColors.inUse,
				border: AppColors.inUse,
				text: AppColors.infoDark,
				icon: '⟳',
				label: 'Đang dùng',
			};
		case 'MAINTENANCE':
			return {
				bg: AppColors.warningLight,
				solid: AppColors.maintenance,
				border: AppColors.maintenance,
				text: AppColors.warningDark,
				icon: '⚠',
				label: 'Bảo trì',
			};
		case 'RETIREMENT':
			return {
				bg: '#F3F4F6',
				solid: AppColors.retired,
				border: AppColors.retired,
				text: '#374151',
				icon: '◷',
				label: 'Ngưng dùng',
			};
		default:
			return {
				bg: '#F3F4F6',
				solid: '#9CA3AF',
				border: '#9CA3AF',
				text: '#374151',
				icon: '•',
				label: status,
			};
	}
};

// --- STATUS BADGE ---
export const StatusBadge = ({ status }: { status: DeviceStatus }) => {
	const config = getStatusConfig(status);
	return (
		<XStack
			alignItems="center"
			gap="$1.5"
			backgroundColor={config.bg}
			borderRadius="$8"
			paddingHorizontal="$2.5"
			paddingVertical="$1.5"
			borderWidth={1}
			borderColor={config.border}
			alignSelf="flex-start"
		>
			<YStack
				width={14}
				height={14}
				borderRadius="$10"
				backgroundColor={config.solid}
				alignItems="center"
				justifyContent="center"
			>
				<Text
					fontSize={9}
					lineHeight={10}
					fontWeight="900"
					color="white"
				>
					{config.icon}
				</Text>
			</YStack>
			<Text
				fontSize={11}
				fontWeight="700"
				color={config.text}
				letterSpacing={0.3}
			>
				{config.label}
			</Text>
		</XStack>
	);
};
