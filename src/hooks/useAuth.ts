"use client";

import { useState, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginModalState {
  isOpen: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  });

  const [loginModalState, setLoginModalState] = useState<LoginModalState>({
    isOpen: false,
  });

  // Abrir modal de login
  const openLoginModal = useCallback(() => {
    setLoginModalState({ isOpen: true });
  }, []);

  // Cerrar modal de login
  const closeLoginModal = useCallback(() => {
    setLoginModalState({ isOpen: false });
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock de usuario logueado
      const user: User = {
        id: "1",
        name: "Usuario Demo",
        email: email,
        phone: "+57 300 123 4567",
      };
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      closeLoginModal();
      
      // Aquí podrías mostrar una notificación de éxito
      console.log("Login exitoso:", user);
      
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: "Error al iniciar sesión. Verifica tus credenciales.",
      }));
    }
  }, [closeLoginModal]);

  // Registro
  const register = useCallback(async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock de usuario registrado
      const user: User = {
        id: "1",
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      closeLoginModal();
      
      // Aquí podrías mostrar una notificación de éxito
      console.log("Registro exitoso:", user);
      
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: "Error al crear la cuenta. Intenta de nuevo.",
      }));
    }
  }, [closeLoginModal]);

  // Checkout como invitado
  const guestCheckout = useCallback(async (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simular procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Crear usuario temporal para el checkout
      const guestUser: User = {
        id: "guest-" + Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
      
      setAuthState({
        user: guestUser,
        isAuthenticated: false, // No está realmente autenticado
        isLoading: false,
        error: null,
      });
      
      closeLoginModal();
      
      // Aquí podrías proceder al checkout
      console.log("Checkout como invitado:", { user: guestUser, address: data.address });
      
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: "Error al procesar la información. Intenta de nuevo.",
      }));
    }
  }, [closeLoginModal]);

  // Logout
  const logout = useCallback(() => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    // Estado de autenticación
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    
    // Estado del modal
    isLoginModalOpen: loginModalState.isOpen,
    
    // Acciones
    openLoginModal,
    closeLoginModal,
    login,
    register,
    guestCheckout,
    logout,
  };
}
