// themes.ts
import { tokens } from './tokens';

export const lightTheme = {
	bg: tokens.color.brandBackground,
	color: tokens.color.black,
	primary: tokens.color.brandPrimary,
	secondary: tokens.color.brandSecondary,
	accent: tokens.color.brandAccent,
};

export const darkTheme = {
	bg: tokens.color.darkBg,
	color: tokens.color.darkColor,
	primary: tokens.color.brandAccent,
	secondary: tokens.color.darkSecondary,
	accent: tokens.color.darkAccent,
};
