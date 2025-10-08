import { CartService } from '../services/cartService';

/**
 * Sincroniza el carrito del usuario después del login
 * Esta función debe ser llamada después de que el usuario se autentique
 */
export const syncCartAfterLogin = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const sessionId = localStorage.getItem('session_id');
    
    // Si no hay session_id, no hay nada que sincronizar
    if (!sessionId) {
      return { 
        success: true, 
        message: 'No hay carrito de sesión para sincronizar' 
      };
    }
    
    const response = await CartService.syncCart();
    
    if (response.success) {
      // Limpiar session_id después de sincronización exitosa
      localStorage.removeItem('session_id');
      return { 
        success: true, 
        message: 'Carrito sincronizado exitosamente' 
      };
    } else {
      return { 
        success: false, 
        message: response.message || 'Error al sincronizar carrito' 
      };
    }
  } catch (error) {
    console.error('Error syncing cart after login:', error);
    return { 
      success: false, 
      message: 'Error al sincronizar carrito' 
    };
  }
};

/**
 * Verifica si hay un carrito de sesión pendiente de sincronizar
 */
export const hasPendingSessionCart = (): boolean => {
  return !!localStorage.getItem('session_id');
};

/**
 * Limpia el session_id (útil para logout)
 */
export const clearSessionCart = (): void => {
  localStorage.removeItem('session_id');
};
