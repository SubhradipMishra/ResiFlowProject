import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../services/api';

export type Role = 'super_admin' | 'admin' | 'resident' | 'staff' | null;

export interface User {
    id: string;
    _id?: string;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
    residence?: any;
    flat?: any;
    department?: string;
    phone?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    error: string | null;
    requiresOtp: boolean;
    tempEmail: string | null;
    tempPhone: string | null;
}

const getSavedUser = (): User | null => {
    try {
        const saved = localStorage.getItem('resiflow_user');
        return saved ? JSON.parse(saved) : null;
    } catch {
        return null;
    }
};

const initialSavedUser = getSavedUser();

const initialState: AuthState = {
    isAuthenticated: !!initialSavedUser,
    user: initialSavedUser,
    isLoading: false,
    error: null,
    requiresOtp: false,
    tempEmail: null,
    tempPhone: null,
};

export const checkAuthSession = createAsyncThunk(
    'auth/checkSession',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/auth/me');
            if (response.data.success && response.data.data.user) {
                return response.data.data.user;
            }
            return rejectWithValue('No user session found');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Session expired');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{ user: User }>
        ) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
            try {
                localStorage.setItem('resiflow_user', JSON.stringify(action.payload.user));
            } catch (e) {
                console.error('Failed to save user to localStorage', e);
            }
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
            try {
                localStorage.removeItem('resiflow_user');
            } catch (e) {
                console.error('Failed to remove user from localStorage', e);
            }
        },
        setRequiresOtp: (
            state,
            action: PayloadAction<{ email?: string; phone?: string }>
        ) => {
            state.requiresOtp = true;
            state.tempEmail = action.payload.email || null;
            state.tempPhone = action.payload.phone || null;
            state.isLoading = false;
            state.error = null;
        },
        clearTempAuth: (state) => {
            state.requiresOtp = false;
            state.tempEmail = null;
            state.tempPhone = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(checkAuthSession.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
            try {
                localStorage.setItem('resiflow_user', JSON.stringify(action.payload));
            } catch (e) {
                console.error('Failed to update user in localStorage', e);
            }
        });
        builder.addCase(checkAuthSession.rejected, (state) => {
            // Keep local user if offline or if checking failed gracefully
            state.isLoading = false;
        });
    }
});

export const { setCredentials, logout, setRequiresOtp, clearTempAuth, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;
