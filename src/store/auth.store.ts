// src/store/auth.store.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface AuthState {
	access_token: string | null;
	refresh_token: string | null;
	user: any | null; // Hoặc kiểu dữ liệu người dùng cụ thể của bạn

	setTokens: (
		access_token: string | null,
		refresh_token: string | null
	) => void;
	setUser: (user: any | null) => void;
	signOut: () => void;
	initializeFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
	access_token: null,
	refresh_token: null,
	user: null,

	setTokens: async (access_token, refresh_token) => {
		console.log('🔐 [AuthStore] Setting tokens');

		set({
			access_token,
			refresh_token,
		});

		// Persist to AsyncStorage
		try {
			if (access_token && refresh_token) {
				await AsyncStorage.multiSet([
					['access_token', access_token],
					['refresh_token', refresh_token],
				]);
				console.log('💾 [AuthStore] Tokens saved to storage');
			} else {
				await AsyncStorage.multiRemove([
					'access_token',
					'refresh_token',
				]);
				console.log('🗑️ [AuthStore] Tokens removed from storage');
			}
		} catch (error) {
			console.error('❌ [AuthStore] Failed to save tokens:', error);
		}
	},

	setUser: async (user) => {
		console.log('👤 [AuthStore] Setting user:', user);
		set({ user });

		// Persist user to AsyncStorage
		try {
			if (user) {
				await AsyncStorage.setItem('user', JSON.stringify(user));
				console.log('💾 [AuthStore] User saved to storage');
			} else {
				await AsyncStorage.removeItem('user');
				console.log('🗑️ [AuthStore] User removed from storage');
			}
		} catch (error) {
			console.error('❌ [AuthStore] Failed to save user:', error);
		}
	},

	signOut: async () => {
		console.log('🚪 [AuthStore] Signing out');

		set({
			access_token: null,
			refresh_token: null,
			user: null,
		});

		// Clear AsyncStorage
		try {
			await AsyncStorage.multiRemove([
				'access_token',
				'refresh_token',
				'user',
			]);
			console.log('🗑️ [AuthStore] All auth data cleared from storage');
		} catch (error) {
			console.error('❌ [AuthStore] Failed to clear storage:', error);
		}
	},

	initializeFromStorage: async () => {
		console.log('🔄 [AuthStore] Initializing from storage');

		try {
			const [access_token, refresh_token, userStr] =
				await AsyncStorage.multiGet([
					'access_token',
					'refresh_token',
					'user',
				]);

			const tokens = {
				access_token: access_token[1],
				refresh_token: refresh_token[1],
				user: userStr[1] ? JSON.parse(userStr[1]) : null,
			};

			set(tokens);
			console.log('✅ [AuthStore] Initialized from storage:', tokens);
		} catch (error) {
			console.error(
				'❌ [AuthStore] Failed to initialize from storage:',
				error
			);
		}
	},
}));
