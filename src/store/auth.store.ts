// src/store/auth.store.ts
import { create } from 'zustand';

interface AuthState {
	access_token: string | null;
	refresh_token: string | null;
	user: any | null; // Hoặc kiểu dữ liệu người dùng cụ thể của bạn

	setTokens: (access: string | null, refresh: string | null) => void;
	setUser: (user: any | null) => void;
	signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	access_token: null,
	refresh_token: null,
	user: null,

	setTokens: (access, refresh) =>
		set({
			access_token: access,
			refresh_token: refresh,
		}),

	setUser: (user) => set({ user }),

	signOut: () =>
		set({
			access_token: null,
			refresh_token: null,
			user: null,
		}),
}));
