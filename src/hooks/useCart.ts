import { useState, useEffect, useCallback } from 'react';
import { CartService } from '../services/cartService';
import { CartState, CartResponse, AddToCartPayload, UpdateQuantityPayload, RemoveFromCartPayload } from '../types/cart';
import { getOrCreateSessionId } from '../config/api';

// Estado inicial del carrito
const initialState: CartState = {
  cart: null,
  itemsCount: 0,
  subtotal: 0,
  taxAmount: 0,
  shippingAmount: 0,
  totalAmount: 0,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const useCart = () => {
  const [state, setState] = useState<CartState>(initialState);

  // Función para actualizar el estado del carrito
  const updateCartState = useCallback((cartData: CartResponse['data']) => {
    console.log('🛒 Updating cart state with data:', cartData);
    console.log('🛒 Backend items_count:', cartData.items_count);
    console.log('🛒 Backend cart.items.length:', cartData.cart.items?.length);
    
    // Calcular itemsCount basado en la suma de cantidades de los items
    const calculatedItemsCount = cartData.cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    
    console.log('🛒 Calculated itemsCount:', calculatedItemsCount);
    console.log('🛒 Backend items_count:', cartData.items_count);
    
    setState(prev => ({
      ...prev,
      cart: cartData.cart,
      itemsCount: calculatedItemsCount, // Usar el calculado en lugar del del backend
      subtotal: parseFloat(String(cartData.subtotal)) || 0,
      taxAmount: parseFloat(String(cartData.tax_amount)) || 0,
      shippingAmount: parseFloat(String(cartData.shipping_amount)) || 0,
      totalAmount: parseFloat(String(cartData.total_amount)) || 0,
      loading: false,
      error: null,
      lastUpdated: Date.now(),
    }));
  }, []);

  // Función para manejar errores
  const handleError = useCallback((error: any, action: string) => {
    console.error(`Error ${action}:`, error);
    setState(prev => ({
      ...prev,
      loading: false,
      error: error.message || `Error al ${action}`,
    }));
  }, []);

  // Cargar el carrito desde el backend
  const loadCart = useCallback(async () => {
    try {
      console.log('🛒 Loading cart...');
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Asegurar que tenemos un session_id
      getOrCreateSessionId();
      
      const response = await CartService.getCart();
      console.log('🛒 Cart response:', response);
      
      if (response.success) {
        updateCartState(response.data);
      } else {
        throw new Error(response.message || 'Error al cargar el carrito');
      }
    } catch (error) {
      // Si es error de autenticación, crear un carrito vacío
      if (error instanceof Error && error.message.includes('Unauthenticated')) {
        console.warn('Usuario no autenticado, creando carrito vacío');
        setState(prev => ({
          ...prev,
          cart: null,
          itemsCount: 0,
          subtotal: 0,
          taxAmount: 0,
          shippingAmount: 0,
          totalAmount: 0,
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        }));
      } else {
        // Para otros errores, también crear carrito vacío para no romper la UX
        console.warn('Error al cargar carrito, creando carrito vacío:', error);
        setState(prev => ({
          ...prev,
          cart: null,
          itemsCount: 0,
          subtotal: 0,
          taxAmount: 0,
          shippingAmount: 0,
          totalAmount: 0,
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        }));
      }
    }
  }, [updateCartState]);

  // Agregar producto al carrito
  const addToCart = useCallback(async (payload: AddToCartPayload) => {
    try {
      console.log('🛒 Adding to cart:', payload);
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await CartService.addProduct(
        payload.productId, 
        payload.quantity || 1
      );
      
      console.log('🛒 Add to cart response:', response);
      
      if (response.success) {
        console.log('🛒 Product added successfully, updating state directly...');
        // Actualizar el estado directamente con la respuesta
        if (response.data) {
          updateCartState(response.data);
        }
        console.log('🛒 State updated directly');
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al agregar producto');
      }
    } catch (error) {
      // Manejar errores de manera más amigable
      console.error('🛒 Error adding to cart:', error);
      setState(prev => ({ ...prev, loading: false, error: null }));
      return { success: false, message: 'No se pudo agregar el producto al carrito. Intenta nuevamente.' };
    }
  }, [updateCartState]);

  // Agregar regalo personalizado al carrito
  const addGift = useCallback(async (giftData: any) => {
    try {
      console.log('🎁 Adding gift to cart:', giftData);
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await CartService.addGift(giftData);
      
      console.log('🎁 Add gift response:', response);
      
      if (response.success) {
        console.log('🎁 Gift added successfully, updating state...');
        // Actualizar el estado directamente con la respuesta
        if (response.data) {
          updateCartState(response.data);
        } else {
          // Si no hay data en la respuesta, recargar el carrito
          console.log('🎁 No data in response, reloading cart...');
          await loadCart();
        }
        console.log('🎁 Gift state updated');
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al agregar regalo');
      }
    } catch (error) {
      // Manejar errores de manera más amigable
      console.error('🎁 Error adding gift to cart:', error);
      setState(prev => ({ ...prev, loading: false, error: null }));
      return { success: false, message: 'No se pudo agregar el regalo al carrito. Intenta nuevamente.' };
    }
  }, [updateCartState, loadCart]);

  // Actualizar cantidad de un producto
  const updateQuantity = useCallback(async (payload: UpdateQuantityPayload) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await CartService.updateQuantity(
        payload.productId, 
        payload.quantity
      );
      
      if (response.success) {
        // Recargar el carrito después de actualizar
        await loadCart();
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al actualizar cantidad');
      }
    } catch (error) {
      handleError(error, 'actualizar cantidad');
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [loadCart]);

  // Remover producto del carrito
  const removeFromCart = useCallback(async (payload: RemoveFromCartPayload) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await CartService.removeProduct(payload.productId, payload.giftId);
      
      if (response.success) {
        // Recargar el carrito después de remover
        await loadCart();
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al remover producto');
      }
    } catch (error) {
      handleError(error, 'remover producto');
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [loadCart]);

  // Limpiar carrito
  const clearCart = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await CartService.clearCart();
      
      if (response.success) {
        // Recargar el carrito después de limpiar
        await loadCart();
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al limpiar carrito');
      }
    } catch (error) {
      handleError(error, 'limpiar carrito');
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [loadCart]);

  // Sincronizar carrito
  const syncCart = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await CartService.syncCart();
      
      if (response.success) {
        // Limpiar session_id después de sincronización exitosa
        localStorage.removeItem('session_id');
        await loadCart();
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al sincronizar carrito');
      }
    } catch (error) {
      handleError(error, 'sincronizar carrito');
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [loadCart]);

  // Función para obtener la cantidad de un producto específico
  const getProductQuantity = useCallback((productId: number) => {
    if (!state.cart) return 0;
    
    const item = state.cart.items.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  }, [state.cart]);

  // Función para verificar si un producto está en el carrito
  const isInCart = useCallback((productId: number) => {
    if (!state.cart) return false;
    
    return state.cart.items.some(item => item.product_id === productId);
  }, [state.cart]);

  // Cargar carrito al montar el componente
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Log del estado cuando cambie
  useEffect(() => {
    console.log('🛒 Cart state changed:', {
      itemsCount: state.itemsCount,
      cartItems: state.cart?.items?.length || 0,
      subtotal: state.subtotal,
      totalAmount: state.totalAmount,
      loading: state.loading,
      error: state.error,
      lastUpdated: state.lastUpdated
    });
    console.log('🛒 State itemsCount vs cart.items.length:', {
      itemsCount: state.itemsCount,
      cartItemsLength: state.cart?.items?.length || 0,
      match: state.itemsCount === (state.cart?.items?.length || 0)
    });
  }, [state.itemsCount, state.cart?.items?.length, state.subtotal, state.totalAmount, state.loading, state.error, state.lastUpdated]);

  // Retornar estado y funciones
  return {
    // Estado
    cart: state.cart,
    itemsCount: state.itemsCount,
    subtotal: state.subtotal,
    taxAmount: state.taxAmount,
    shippingAmount: state.shippingAmount,
    totalAmount: state.totalAmount,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    
    // Funciones
    loadCart,
    addToCart,
    addGift,
    updateQuantity,
    removeFromCart,
    clearCart,
    syncCart,
    getProductQuantity,
    isInCart,
  };
};