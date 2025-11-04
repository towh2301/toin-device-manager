// tokens.ts
import { createTokens } from '@tamagui/core';

const size = {
	0: 0,
	1: 4,
	2: 8,
	3: 12,
	4: 16,
	5: 20,
	6: 24,
	7: 32,
	8: 40,
	9: 48,
	10: 64,
	true: 16,
};

export const tokens = createTokens({
	size,
	space: { ...size, '-1': -4, '-2': -8, '-3': -12, '-4': -16 },
	radius: { 0: 0, 1: 4, 2: 8, 3: 12, 4: 16, round: 9999 },
	zIndex: { 0: 0, 1: 100, 2: 200, 3: 1000, modal: 10000 },
	color: {
		white: '#FFFFFF',
		black: '#000000',

		// TOIN Brand Colors
		brandPrimary: '#2563EB',
		brandPrimaryDark: '#1E40AF',
		brandSecondary: '#64748B',
		brandAccent: '#0EA5E9',
		brandBackground: '#F8FAFC',

		// Semantic
		success: '#22C55E',
		warning: '#FACC15',
		error: '#EF4444',

		// Dark mode
		darkBg: '#0F172A',
		darkColor: '#FFFFFF',
		darkSecondary: '#94A3B8',
		darkAccent: '#38BDF8',
	},
});
