import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/ApiService';
import { storageService } from '../../utils/storage';
export interface User {
	name: string;
	email: string;
	id: number;
	avatar?: string;
	role?: string;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isGuestMode: boolean;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	token: null,
	isAuthenticated: false,
	isGuestMode: false,
	loading: false,
	error: null,
};

export const loginUser = createAsyncThunk(
	'auth/login',
	async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
		try {
			const response = await apiService.login(email, password);
			console.log('Login response from API:', response);

			if (response.success) {
				// Redux Persist will handle storing the state, no need for manual AsyncStorage calls
				console.log('User data from response:', response.data);
				console.log('Token from response:', response.data?.token);
				return { user: response.data, token: response.data?.token };
			}
			return rejectWithValue(response.message || 'Login failed');
		} catch (error) {
			return rejectWithValue('Network error. Please check your connection.');
		}
	}
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
	try {
		// Redux Persist will handle clearing the state, but we also clear AsyncStorage for cleanup
		await storageService.removeAuthToken();
		await storageService.removeUserData();
		return true;
	} catch (error) {
		return rejectWithValue('Logout failed');
	}
});

export const checkAuthStatus = createAsyncThunk('auth/checkStatus', async (_, { getState, rejectWithValue }) => {
	try {
		console.log('Checking auth status...');
		// Redux Persist automatically rehydrates state, so we check the current state
		const state = getState() as { auth: AuthState };
		const { token, user } = state.auth;

		console.log('Current Redux state:', { token: !!token, user: !!user });

		if (token && user) {
			console.log('Found token and user in Redux state');
			return { user, token };
		}

		// Fallback: check AsyncStorage if Redux state is empty
		console.log('Checking AsyncStorage fallback...');
		const storedToken = await storageService.getAuthToken();
		const storedUserData = await storageService.getUserData();
		console.log('AsyncStorage data:', { token: !!storedToken, user: !!storedUserData });

		if (storedToken && storedUserData) {
			console.log('Found token and user in AsyncStorage');
			return { user: storedUserData, token: storedToken };
		}

		console.log('No stored credentials found');
		return rejectWithValue('No stored credentials');
	} catch (error) {
		console.error('Error checking auth status:', error);
		return rejectWithValue('Failed to check auth status');
	}
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = null;
		},
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		enableGuestMode: (state) => {
			state.isGuestMode = true;
		},
		disableGuestMode: (state) => {
			state.isGuestMode = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
				state.token = action.payload.token;
				console.log('Login successful, user authenticated:', action.payload.user?.name);
				console.log('Token stored:', !!action.payload.token);
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});

		builder
			.addCase(logoutUser.pending, (state) => {
				state.loading = true;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.loading = false;
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
				state.error = null;
			})
			.addCase(logoutUser.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});

		builder
			.addCase(checkAuthStatus.pending, (state) => {
				state.loading = true;
			})
			.addCase(checkAuthStatus.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = action.payload.user;
				state.token = action.payload.token;
				state.error = null;
				console.log('Auth status check successful, user is authenticated:', action.payload.user?.name);
			})
			.addCase(checkAuthStatus.rejected, (state) => {
				state.loading = false;
				state.isAuthenticated = false;
				state.user = null;
				state.token = null;
			});
	},
});

export const { clearError, setLoading, enableGuestMode, disableGuestMode } = authSlice.actions;
export default authSlice.reducer;
