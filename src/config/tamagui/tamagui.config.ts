// tamagui.config.ts
import { config as defaultConfig } from '@tamagui/config/v3';
import { createTamagui } from 'tamagui';
import { darkTheme, lightTheme } from './themes';
import { tokens } from './tokens';

// Optional: custom shorthands (if you want to override)
import { shorthands } from '@tamagui/shorthands';

// Merge default config with your custom tokens & themes
const config = createTamagui({
	...defaultConfig,

	// Override tokens
	tokens: {
		...defaultConfig.tokens,
		color: {
			...defaultConfig.tokens.color,
			...tokens.color,
		},
		// Optionally override size, space, etc. if needed
		size: {
			...defaultConfig.tokens.size,
			...tokens.size,
		},
		space: {
			...defaultConfig.tokens.space,
			...tokens.space,
		},
		radius: {
			...defaultConfig.tokens.radius,
			...tokens.radius,
		},
		zIndex: {
			...defaultConfig.tokens.zIndex,
			...tokens.zIndex,
		},
	},

	// Override themes
	themes: {
		...defaultConfig.themes,
		light: lightTheme,
		dark: darkTheme,
	},

	// Optional: override shorthands
	shorthands,

	// Optional: performance
	settings: {
		...defaultConfig.settings,
		shouldAddPrefersColorThemes: true,
		fastSchemeChange: true,
	},

	// Optional: media queries (you can extend or override)
	media: {
		...defaultConfig.media,
		xs: { maxWidth: 480 },
		sm: { maxWidth: 860 },
		md: { minWidth: 861, maxWidth: 1199 },
		lg: { minWidth: 1200 },
	},
});

export type AppConfig = typeof config;

declare global {
	interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
