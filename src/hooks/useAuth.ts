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
  restoreUser as restoreUserAction,
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectLoginModalOpen,
  selectIsGuest,
} from '../store/slices/authSlice';
import { constants } from '../config/constants';

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
      const response = await fetch(`${constants.api_url}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Manejar errores de validación específicos
        if (errorData.errors && errorData.errors.email) {
          throw new Error(errorData.errors.email[0] || 'Credenciales incorrectas');
        }
        
        throw new Error(errorData.message || 'Error al iniciar sesión');
      }

      const result = await response.json();
      
      // Mapear la respuesta del backend al formato del frontend
      const user = {
        id: result.user.id.toString(),
        name: result.user.name,
        email: result.user.email,
        phone: "+57 300 123 4567", // El backend no devuelve phone, usar valor por defecto
        isGuest: false,
      };

      // Guardar el token en localStorage
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch(loginSuccess(user));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión. Verifica tus credenciales.";
      dispatch(loginFailure(errorMessage));
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
      const response = await fetch(`${constants.api_url}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Manejar errores de validación específicos
        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            throw new Error(firstError[0]);
          }
        }
        
        throw new Error(errorData.message || 'Error al crear la cuenta');
      }

      const result = await response.json();
      
      // Mapear la respuesta del backend al formato del frontend
      const user = {
        id: result.user.id.toString(),
        name: result.user.name,
        email: result.user.email,
        phone: data.phone, // El backend no devuelve phone, lo mantenemos del formulario
        isGuest: false,
      };

      // Guardar el token en localStorage
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Usar loginSuccess en lugar de registerSuccess para que se loguee automáticamente
      dispatch(loginSuccess(user));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear la cuenta. Intenta de nuevo.";
      dispatch(registerFailure(errorMessage));
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
    // Limpiar localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    dispatch(logout());
  }, [dispatch]);

  // Restaurar usuario desde localStorage
  const restoreUser = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('auth_token');
      
      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        dispatch(restoreUserAction(user));
      }
    } catch (error) {
      console.error('Error al restaurar usuario:', error);
      // Limpiar datos corruptos
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
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
    restoreUser,
    clearError: clearErrorAction,
  };
}
