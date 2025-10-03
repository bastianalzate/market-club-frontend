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
import { syncCartAfterLogin } from '../utils/cartUtils';
import { useProfileContext } from '../contexts/ProfileContext';

// Traducciones de mensajes de error del servidor
const errorTranslations: Record<string, string> = {
  // Errores de validación comunes
  'The given data was invalid.': 'Los datos proporcionados no son válidos.',
  'The provided credentials are incorrect.': 'Las credenciales proporcionadas son incorrectas.',
  'The email field is required.': 'El campo email es obligatorio.',
  'The password field is required.': 'El campo contraseña es obligatorio.',
  'The name field is required.': 'El campo nombre es obligatorio.',
  'The email has already been taken.': 'Este email ya está registrado.',
  'The email must be a valid email address.': 'El email debe ser una dirección válida.',
  'The password must be at least 8 characters.': 'La contraseña debe tener al menos 8 caracteres.',
  'The password confirmation does not match.': 'La confirmación de contraseña no coincide.',
  'The phone field is required.': 'El campo teléfono es obligatorio.',
  'The phone must be a valid phone number.': 'El teléfono debe ser un número válido.',
  
  // Errores de autenticación
  'Unauthenticated.': 'No estás autenticado.',
  'Invalid credentials.': 'Credenciales inválidas.',
  'User not found.': 'Usuario no encontrado.',
  'Account is disabled.': 'La cuenta está deshabilitada.',
  'Too many login attempts.': 'Demasiados intentos de inicio de sesión.',
  
  // Errores de servidor
  'Server error.': 'Error del servidor.',
  'Service unavailable.': 'Servicio no disponible.',
  'Network error.': 'Error de conexión.',
  'Request timeout.': 'Tiempo de espera agotado.',
};

// Función para traducir mensajes de error
const translateError = (error: string): string => {
  // Buscar traducción exacta
  if (errorTranslations[error]) {
    return errorTranslations[error];
  }
  
  // Buscar traducciones parciales
  for (const [key, translation] of Object.entries(errorTranslations)) {
    if (error.toLowerCase().includes(key.toLowerCase())) {
      return translation;
    }
  }
  
  // Si no se encuentra traducción, devolver el mensaje original
  return error;
};

export function useAuth() {
  const dispatch = useAppDispatch();
  const { clearProfile } = useProfileContext();
  
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
          const errorMessage = errorData.errors.email[0] || 'Credenciales incorrectas';
          throw new Error(translateError(errorMessage));
        }
        
        const errorMessage = errorData.message || 'Error al iniciar sesión';
        throw new Error(translateError(errorMessage));
      }

      const result = await response.json();
      
      // Mapear la respuesta del backend al formato del frontend
      const user = {
        id: result.user.id.toString(),
        name: result.user.name,
        email: result.user.email,
        phone: "+57 300 123 4567", // El backend no devuelve phone, usar valor por defecto
        isGuest: false,
        is_wholesaler: result.user.is_wholesaler || false,
      };

      // Guardar el token y user_id en localStorage
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('token', result.token); // También guardar como 'token' para compatibilidad
      localStorage.setItem('user_id', result.user.id.toString()); // Guardar user_id por separado
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch(loginSuccess(user));
      
      // Sincronizar carrito después del login exitoso
      try {
        await syncCartAfterLogin();
        console.log('Carrito sincronizado exitosamente después del login');
      } catch (cartError) {
        console.warn('Error al sincronizar carrito después del login:', cartError);
        // No fallar el login por error de sincronización del carrito
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión. Verifica tus credenciales.";
      dispatch(loginFailure(translateError(errorMessage)));
      // Lanzar la excepción para que el componente pueda manejarla
      throw error;
    }
  }, [dispatch]);

  // Registro
  const register = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    country: string;
    isWholesaler: boolean;
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
          phone: data.phone,
          country: data.country,
          is_wholesaler: data.isWholesaler,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Manejar errores de validación específicos
        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0];
          if (Array.isArray(firstError) && firstError.length > 0) {
            throw new Error(translateError(firstError[0]));
          }
        }
        
        const errorMessage = errorData.message || 'Error al crear la cuenta';
        throw new Error(translateError(errorMessage));
      }

      const result = await response.json();
      
      // Mapear la respuesta del backend al formato del frontend
      const user = {
        id: result.user.id.toString(),
        name: result.user.name,
        email: result.user.email,
        phone: data.phone, // El backend no devuelve phone, lo mantenemos del formulario
        isGuest: false,
        is_wholesaler: result.user.is_wholesaler || data.isWholesaler,
      };

      // Guardar el token y user_id en localStorage
      localStorage.setItem('auth_token', result.token);
      localStorage.setItem('token', result.token); // También guardar como 'token' para compatibilidad
      localStorage.setItem('user_id', result.user.id.toString()); // Guardar user_id por separado
      localStorage.setItem('user', JSON.stringify(user));
      
      // Usar loginSuccess en lugar de registerSuccess para que se loguee automáticamente
      dispatch(loginSuccess(user));
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear la cuenta. Intenta de nuevo.";
      dispatch(registerFailure(translateError(errorMessage)));
      // Lanzar la excepción para que el componente pueda manejarla
      throw error;
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
      const errorMessage = error instanceof Error ? error.message : "Error al procesar la información. Intenta de nuevo.";
      dispatch(guestCheckoutFailure(translateError(errorMessage)));
      // Lanzar la excepción para que el componente pueda manejarla
      throw error;
    }
  }, [dispatch]);

  // Logout
  const logoutAction = useCallback(() => {
    // Limpiar localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user');
    
    // Limpiar el perfil del contexto
    clearProfile();
    
    dispatch(logout());
  }, [dispatch, clearProfile]);

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
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
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
