import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware';
import { Role, User } from '../types';

interface AuthState {
	user: User | null;
	role: Role[] | null;
	accessTokenState: string | null;
	refreshTokenState: string | null;
	setUser: (user: User) => void;
	setTokens: (accessToken: string, refreshToken: string) => void;
	clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			role: null,
			accessTokenState: null,
			refreshTokenState: null,

			setUser: (user) => set({ user }),
			setTokens: (accessToken, refreshToken) =>
				set({
					accessTokenState: accessToken,
					refreshTokenState: refreshToken,
				}),

			clearAuth: () =>
				set({
					user: null,
					role: null,
					accessTokenState: null,
					refreshTokenState: null,
				}),
		}),
		{
			name: 'auth-storage',
			storage: createJSONStorage(() => AsyncStorage as StateStorage),
		}
	)
);
