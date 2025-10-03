import { useState, useEffect, useCallback } from 'react';
import { wholesalerCartService } from '../services/wholesalerCartService';
import {
  WholesalerCartState,
  WholesalerCartResponse,
  AddToWholesalerCartPayload,
  UpdateWholesalerCartQuantityPayload,
  RemoveFromWholesalerCartPayload,
  ApplyDiscountPayload,
  AddNotesPayload,
} from '../types/wholesaler-cart';
import { getOrCreateSessionId } from '../config/api';

// Estado inicial del carrito de mayoristas
const initialState: WholesalerCartState = {
  cart: null,
  itemsCount: 0,
  subtotal: 0,
  taxAmount: 0,
  shippingAmount: 0,
  discountAmount: 0,
  totalAmount: 0,
  loading: false,
  error: null,
  lastUpdated: null,
  wholesalerDiscount: 15, // 15% de descuento por defecto
};

export const useWholesalerCart = () => {
  const [state, setState] = useState<WholesalerCartState>(initialState);

  // Función para actualizar el estado del carrito
  const updateCartState = useCallback((cartData: WholesalerCartResponse['data']) => {
    console.log('🛒 [Wholesaler] Updating cart state with data:', cartData);
    console.log('🛒 [Wholesaler] Backend items_count:', cartData.items_count);
    console.log('🛒 [Wholesaler] Backend cart.items.length:', cartData.cart.items?.length);
    
    // Calcular itemsCount basado en la suma de cantidades de los items
    const calculatedItemsCount = cartData.cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    
    console.log('🛒 [Wholesaler] Calculated itemsCount:', calculatedItemsCount);
    
    setState(prev => ({
      ...prev,
      cart: cartData.cart,
      itemsCount: calculatedItemsCount,
      subtotal: parseFloat(String(cartData.subtotal)) || 0,
      taxAmount: parseFloat(String(cartData.tax_amount)) || 0,
      shippingAmount: parseFloat(String(cartData.shipping_amount)) || 0,
      discountAmount: parseFloat(String(cartData.discount_amount)) || 0,
      totalAmount: parseFloat(String(cartData.total_amount)) || 0,
      wholesalerDiscount: cartData.wholesaler_discount || 15,
      loading: false,
      error: null,
      lastUpdated: Date.now(),
    }));
  }, []);

  // Función para manejar errores
  const handleError = useCallback((error: any, action: string) => {
    console.error(`Error ${action} [Wholesaler]:`, error);
    setState(prev => ({
      ...prev,
      loading: false,
      error: error.message || `Error al ${action}`,
    }));
  }, []);

  // Cargar el carrito desde el backend
  const loadCart = useCallback(async () => {
    try {
      console.log('🛒 [Wholesaler] Loading cart...');
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      // Asegurar que tenemos un session_id
      getOrCreateSessionId();
      
      const response = await wholesalerCartService.getCart();
      console.log('🛒 [Wholesaler] Cart response:', response);
      
      if (response.success) {
        updateCartState(response.data);
      } else {
        throw new Error(response.message || 'Error al cargar el carrito');
      }
    } catch (error) {
      // Si es error de autenticación, crear un carrito vacío
      if (error instanceof Error && error.message.includes('Unauthenticated')) {
        console.warn('Mayorista no autenticado, creando carrito vacío');
        setState(prev => ({
          ...prev,
          cart: null,
          itemsCount: 0,
          subtotal: 0,
          taxAmount: 0,
          shippingAmount: 0,
          discountAmount: 0,
          totalAmount: 0,
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        }));
      } else {
        // Para otros errores, también crear carrito vacío para no romper la UX
        console.warn('Error al cargar carrito mayorista, creando carrito vacío:', error);
        setState(prev => ({
          ...prev,
          cart: null,
          itemsCount: 0,
          subtotal: 0,
          taxAmount: 0,
          shippingAmount: 0,
          discountAmount: 0,
          totalAmount: 0,
          loading: false,
          error: null,
          lastUpdated: Date.now(),
        }));
      }
    }
  }, [updateCartState]);

  // Agregar producto al carrito
  const addToCart = useCallback(async (payload: AddToWholesalerCartPayload) => {
    try {
      console.log('🛒 [Wholesaler] Adding to cart:', payload);
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await wholesalerCartService.addProduct(payload);
      
      console.log('🛒 [Wholesaler] Add to cart response:', response);
      
      if (response.success) {
        console.log('🛒 [Wholesaler] Product added successfully, updating state...');
        if (response.data) {
          updateCartState(response.data);
        }
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al agregar producto');
      }
    } catch (error) {
      console.error('🛒 [Wholesaler] Error adding to cart:', error);
      setState(prev => ({ ...prev, loading: false, error: null }));
      return { success: false, message: 'No se pudo agregar el producto al carrito. Intenta nuevamente.' };
    }
  }, [updateCartState]);

  // Actualizar cantidad de un producto
  const updateQuantity = useCallback(async (payload: UpdateWholesalerCartQuantityPayload) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await wholesalerCartService.updateQuantity(payload);
      
      if (response.success) {
        if (response.data) {
          updateCartState(response.data);
        } else {
          await loadCart();
        }
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al actualizar cantidad');
      }
    } catch (error) {
      handleError(error, 'actualizar cantidad');
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [updateCartState, loadCart]);

  // Remover producto del carrito
  const removeFromCart = useCallback(async (payload: RemoveFromWholesalerCartPayload) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await wholesalerCartService.removeProduct(payload);
      
      if (response.success) {
        if (response.data) {
          updateCartState(response.data);
        } else {
          await loadCart();
        }
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al remover producto');
      }
    } catch (error) {
      handleError(error, 'remover producto');
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [updateCartState, loadCart]);

  // Limpiar carrito
  const clearCart = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await wholesalerCartService.clearCart();
      
      if (response.success) {
        if (response.data) {
          updateCartState(response.data);
        } else {
          await loadCart();
        }
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al limpiar carrito');
      }
    } catch (error) {
      handleError(error, 'limpiar carrito');
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [updateCartState, loadCart]);

  // Aplicar descuento especial
  const applyDiscount = useCallback(async (payload: ApplyDiscountPayload) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await wholesalerCartService.applyDiscount(payload);
      
      if (response.success) {
        if (response.data) {
          updateCartState(response.data);
        } else {
          await loadCart();
        }
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al aplicar descuento');
      }
    } catch (error) {
      handleError(error, 'aplicar descuento');
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [updateCartState, loadCart]);

  // Agregar notas al carrito
  const addNotes = useCallback(async (payload: AddNotesPayload) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await wholesalerCartService.addNotes(payload);
      
      if (response.success) {
        if (response.data) {
          updateCartState(response.data);
        } else {
          await loadCart();
        }
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al agregar notas');
      }
    } catch (error) {
      handleError(error, 'agregar notas');
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [updateCartState, loadCart]);

  // Sincronizar carrito
  const syncCart = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await wholesalerCartService.syncCart();
      
      if (response.success) {
        // Limpiar session_id después de sincronización exitosa
        localStorage.removeItem('session_id');
        if (response.data) {
          updateCartState(response.data);
        } else {
          await loadCart();
        }
        return { success: true, message: response.message };
      } else {
        throw new Error(response.message || 'Error al sincronizar carrito');
      }
    } catch (error) {
      handleError(error, 'sincronizar carrito');
      return { success: false, message: error instanceof Error ? error.message : 'Error desconocido' };
    }
  }, [updateCartState, loadCart]);

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
    console.log('🛒 [Wholesaler] Cart state changed:', {
      itemsCount: state.itemsCount,
      cartItems: state.cart?.items?.length || 0,
      subtotal: state.subtotal,
      totalAmount: state.totalAmount,
      discountAmount: state.discountAmount,
      wholesalerDiscount: state.wholesalerDiscount,
      loading: state.loading,
      error: state.error,
      lastUpdated: state.lastUpdated
    });
  }, [state.itemsCount, state.cart?.items?.length, state.subtotal, state.totalAmount, state.discountAmount, state.wholesalerDiscount, state.loading, state.error, state.lastUpdated]);

  // Retornar estado y funciones
  return {
    // Estado
    cart: state.cart,
    itemsCount: state.itemsCount,
    subtotal: state.subtotal,
    taxAmount: state.taxAmount,
    shippingAmount: state.shippingAmount,
    discountAmount: state.discountAmount,
    totalAmount: state.totalAmount,
    loading: state.loading,
    error: state.error,
    lastUpdated: state.lastUpdated,
    wholesalerDiscount: state.wholesalerDiscount,
    
    // Funciones
    loadCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyDiscount,
    addNotes,
    syncCart,
    getProductQuantity,
    isInCart,
  };
};
