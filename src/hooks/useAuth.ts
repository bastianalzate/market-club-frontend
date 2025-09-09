import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
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
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectLoginModalOpen,
  selectIsGuest,
} from '../store/slices/authSlice';

export function useAuth() {
  const dispatch = useAppDispatch();
  
  // Selectores
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isLoginModalOpen = useAppSelector(selectLoginModalOpen);
  const isGuest = useAppSelector(selectIsGuest);

  // Acciones del modal
  const openLoginModalAction = useCallback(() => {
    dispatch(openLoginModal());
  }, [dispatch]);

  const closeLoginModalAction = useCallback(() => {
    dispatch(closeLoginModal());
  }, [dispatch]);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    dispatch(loginStart());
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock de usuario logueado
      const user = {
        id: "1",
        name: "Usuario Demo",
        email: email,
        phone: "+57 300 123 4567",
        isGuest: false,
      };
      
      dispatch(loginSuccess(user));
      
    } catch (error) {
      dispatch(loginFailure("Error al iniciar sesión. Verifica tus credenciales."));
    }
  }, [dispatch]);

  // Registro
  const register = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    dispatch(registerStart());
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock de usuario registrado
      const user = {
        id: "1",
        name: data.name,
        email: data.email,
        phone: data.phone,
        isGuest: false,
      };
      
      dispatch(registerSuccess(user));
      
    } catch (error) {
      dispatch(registerFailure("Error al crear la cuenta. Intenta de nuevo."));
    }
  }, [dispatch]);

  // Checkout como invitado
  const guestCheckout = useCallback(async (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    dispatch(guestCheckoutStart());
    
    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Crear usuario temporal para el checkout
      const guestUser = {
        id: "guest-" + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        isGuest: true,
      };
      
      dispatch(guestCheckoutSuccess(guestUser));
      
      // Aquí podrías proceder al checkout
      console.log("Checkout como invitado:", { user: guestUser, address: data.address });
      
    } catch (error) {
      dispatch(guestCheckoutFailure("Error al procesar la información. Intenta de nuevo."));
    }
  }, [dispatch]);

  // Logout
  const logoutAction = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  // Limpiar errores
  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // Estado
    user,
    isAuthenticated,
    isLoading,
    error,
    isLoginModalOpen,
    isGuest,
    
    // Acciones del modal
    openLoginModal: openLoginModalAction,
    closeLoginModal: closeLoginModalAction,
    
    // Acciones de autenticación
    login,
    register,
    guestCheckout,
    logout: logoutAction,
    clearError: clearErrorAction,
  };
}
