import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Tipos
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isGuest?: boolean; // Para distinguir usuarios invitados
  is_wholesaler?: boolean; // Para distinguir usuarios mayoristas
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginModalOpen: boolean;
}

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  loginModalOpen: false,
};

// Slice de autenticación
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Abrir/cerrar modal de login
    openLoginModal: (state) => {
      state.loginModalOpen = true;
    },
    closeLoginModal: (state) => {
      state.loginModalOpen = false;
    },

    // Login
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.loginModalOpen = false;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Registro
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.loginModalOpen = false;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Checkout como invitado
    guestCheckoutStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    guestCheckoutSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = false; // No está realmente autenticado
      state.error = null;
      state.loginModalOpen = false;
    },
    guestCheckoutFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    // Limpiar errores
    clearError: (state) => {
      state.error = null;
    },

    // Restaurar usuario desde localStorage
    restoreUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload && !action.payload.isGuest;
    },
  },
});

// Exportar acciones
export const {
  openLoginModal,
  closeLoginModal,
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  guestCheckoutStart,
  guestCheckoutSuccess,
  guestCheckoutFailure,
  logout,
  clearError,
  restoreUser,
} = authSlice.actions;

// Selectores
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectLoginModalOpen = (state: { auth: AuthState }) => state.auth.loginModalOpen;

// Selector para verificar si es usuario invitado
export const selectIsGuest = (state: { auth: AuthState }) => 
  state.auth.user?.isGuest || false;

export default authSlice.reducer;
