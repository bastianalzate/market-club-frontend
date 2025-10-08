import { useState, useCallback, useEffect } from 'react';
import wishlistService from '@/services/wishlistService';
import { useAuth } from '@/hooks/useAuth';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

interface WishlistItem {
  id: number;
  product_id: number;
  product: Product;
}

interface UseWishlistOptions {
  showSuccess?: (title: string, message: string) => void;
  showError?: (title: string, message: string) => void;
}

interface UpdateProductCallback {
  (productId: number, isFavorite: boolean): void;
}

export const useWishlist = (options?: UseWishlistOptions & { 
  onProductFavoriteUpdate?: UpdateProductCallback 
}) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalFavorites, setTotalFavorites] = useState(0);
  const { user } = useAuth();
  
  // Usar las funciones de toast pasadas como parámetros o funciones vacías por defecto
  const showSuccess = options?.showSuccess || (() => {});
  const showError = options?.showError || (() => {});
  const onProductFavoriteUpdate = options?.onProductFavoriteUpdate || (() => {});

  // Función para actualizar el estado is_favorite de un producto en cualquier lista
  const updateProductFavoriteStatus = useCallback((productId: number, isFavorite: boolean) => {
    console.log(`🔄 Actualizando estado local del producto ${productId} a is_favorite: ${isFavorite}`);
    onProductFavoriteUpdate(productId, isFavorite);
    return { productId, isFavorite };
  }, [onProductFavoriteUpdate]);

  // Cargar wishlist inicial
  useEffect(() => {
    if (user && !user.isGuest) {
      loadWishlist();
    }
  }, [user]);

  // Cargar lista de favoritos
  const loadWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const result = await wishlistService.getWishlist();
      
      if (result.success && Array.isArray(result.data)) {
        setWishlistItems(result.data);
        setTotalFavorites(result.data.length);
      } else {
        // Fallback si no hay datos o no es un array
        setWishlistItems([]);
        setTotalFavorites(0);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
      setWishlistItems([]);
      setTotalFavorites(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle favorito
  const toggleWishlist = useCallback(async (productId: number) => {
    console.log(`🎯 Hook: Iniciando toggle para producto ${productId}`);
    
    if (!user || user.isGuest) {
      console.log('❌ Hook: Usuario no autenticado');
      showError('Inicia sesión', 'Debes iniciar sesión para agregar favoritos');
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      setLoading(true);
      console.log(`⏳ Hook: Loading iniciado para producto ${productId}`);
      
      const result = await wishlistService.toggleWishlist(productId);
      console.log(`📋 Hook: Resultado del servicio:`, result);
      
      if (result.success && result.data) {
        const { action, is_in_wishlist, total_favorites, product } = result.data;
        console.log(`✅ Hook: Operación exitosa - ${action}`);
        
        // Actualizar estado local
        if (action === 'added') {
          setWishlistItems(prev => {
            const prevArray = Array.isArray(prev) ? prev : [];
            const newItem = {
              id: Date.now(), // Temporal ID
              product_id: productId,
              product: product
            };
            console.log(`➕ Hook: Agregando producto al estado local:`, newItem);
            return [...prevArray, newItem];
          });
          
          // Actualizar el estado del producto en la lista de productos
          updateProductFavoriteStatus(productId, true);
          
          showSuccess(
            '❤️ ¡Agregado a favoritos!',
            `${product.name} se agregó a tus favoritos`
          );
        } else {
          setWishlistItems(prev => {
            const prevArray = Array.isArray(prev) ? prev : [];
            const filtered = prevArray.filter(item => item.product_id !== productId);
            console.log(`➖ Hook: Removiendo producto del estado local. Items antes: ${prevArray.length}, después: ${filtered.length}`);
            return filtered;
          });
          
          // Actualizar el estado del producto en la lista de productos
          updateProductFavoriteStatus(productId, false);
          
          showSuccess(
            '🗑️ ¡Eliminado de favoritos!',
            `${product.name} se eliminó de tus favoritos`
          );
        }
        
        setTotalFavorites(total_favorites);
        console.log(`📊 Hook: Total de favoritos actualizado: ${total_favorites}`);
        
        return {
          success: true,
          action,
          isInWishlist: is_in_wishlist,
          product
        };
      } else {
        console.error('❌ Hook: Servicio reportó error:', result);
        
        // Mostrar error más específico basado en el tipo de error
        let errorTitle = 'Error en favoritos';
        let errorMessage = result.message || 'No se pudo actualizar favoritos';
        
        if (result.error?.type === 'NetworkError') {
          errorTitle = 'Error de conexión';
          errorMessage = 'Verifica tu conexión a internet e intenta nuevamente';
        } else if (result.message?.includes('token') || result.message?.includes('autenticación')) {
          errorTitle = 'Sesión expirada';
          errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente';
        }
        
        showError(errorTitle, errorMessage);
        return { success: false, error: result.message };
      }
    } catch (error) {
      console.error(`💥 Hook: Error crítico en toggle para producto ${productId}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      showError(
        'Error inesperado', 
        'Ocurrió un error inesperado. Por favor, intenta nuevamente'
      );
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
      console.log(`🏁 Hook: Loading finalizado para producto ${productId}`);
    }
  }, [user, showSuccess, showError]);

  // Verificar si un producto está en favoritos
  const isInWishlist = useCallback((productId: number, productData?: any): boolean => {
    // Si el producto viene con la propiedad is_favorite del API, usarla
    if (productData && typeof productData.is_favorite === 'boolean') {
      return productData.is_favorite;
    }
    
    // Fallback: verificar en el estado local
    if (!Array.isArray(wishlistItems)) return false;
    return wishlistItems.some(item => item.product_id === productId);
  }, [wishlistItems]);

  // Mover al carrito
  const moveToCart = useCallback(async (productId: number, quantity: number = 1) => {
    try {
      setLoading(true);
      const result = await wishlistService.moveToCart(productId, quantity);
      
      if (result.success) {
        // Remover del wishlist local
        setWishlistItems(prev => {
          const prevArray = Array.isArray(prev) ? prev : [];
          return prevArray.filter(item => item.product_id !== productId);
        });
        setTotalFavorites(prev => Math.max(0, prev - 1));
        
        showSuccess(
          '🛒 ¡Agregado al carrito!',
          'Producto movido del wishlist al carrito'
        );
        
        return { success: true };
      } else {
        showError('Error', result.message || 'No se pudo mover al carrito');
        return { success: false };
      }
    } catch (error) {
      console.error('Error moving to cart:', error);
      showError('Error', 'Error de conexión');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  // Limpiar wishlist
  const clearWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const result = await wishlistService.clearWishlist();
      
      if (result.success) {
        setWishlistItems([]);
        setTotalFavorites(0);
        showSuccess('🗑️ Favoritos limpiados', 'Se eliminaron todos los favoritos');
        return { success: true };
      } else {
        showError('Error', result.message || 'No se pudo limpiar favoritos');
        return { success: false };
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      showError('Error', 'Error de conexión');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  return {
    wishlistItems,
    totalFavorites,
    loading,
    toggleWishlist,
    isInWishlist,
    moveToCart,
    clearWishlist,
    loadWishlist,
    updateProductFavoriteStatus
  };
};
