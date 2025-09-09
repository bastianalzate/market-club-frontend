import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  openCart,
  closeCart,
  toggleCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
  selectCartItems,
  selectCartIsOpen,
  selectCartLoading,
  selectCartError,
  selectTotalItems,
  selectSubtotal,
  selectCartItemCount,
  selectIsInCart,
  selectProductQuantity,
} from '../store/slices/cartSlice';
import { Product } from '../features/products/types/product';

export function useCart() {
  const dispatch = useAppDispatch();
  
  // Selectores
  const items = useAppSelector(selectCartItems);
  const isOpen = useAppSelector(selectCartIsOpen);
  const isLoading = useAppSelector(selectCartLoading);
  const error = useAppSelector(selectCartError);
  const totalItems = useAppSelector(selectTotalItems);
  const subtotal = useAppSelector(selectSubtotal);
  const itemCount = useAppSelector(selectCartItemCount);

  // Acciones
  const openCartAction = useCallback(() => {
    dispatch(openCart());
  }, [dispatch]);

  const closeCartAction = useCallback(() => {
    dispatch(closeCart());
  }, [dispatch]);

  const toggleCartAction = useCallback(() => {
    dispatch(toggleCart());
  }, [dispatch]);

  const addToCartAction = useCallback((product: Product, quantity: number = 1) => {
    dispatch(addToCart({ product, quantity }));
  }, [dispatch]);

  const updateQuantityAction = useCallback((itemId: string, quantity: number) => {
    dispatch(updateQuantity({ itemId, quantity }));
  }, [dispatch]);

  const removeFromCartAction = useCallback((itemId: string) => {
    dispatch(removeFromCart(itemId));
  }, [dispatch]);

  const clearCartAction = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

  const incrementQuantityAction = useCallback((itemId: string) => {
    dispatch(incrementQuantity(itemId));
  }, [dispatch]);

  const decrementQuantityAction = useCallback((itemId: string) => {
    dispatch(decrementQuantity(itemId));
  }, [dispatch]);

  // Funciones de utilidad
  const isInCart = useCallback((productId: number) => {
    return useAppSelector(selectIsInCart(productId));
  }, []);

  const getProductQuantity = useCallback((productId: number) => {
    return useAppSelector(selectProductQuantity(productId));
  }, []);

  // Función de checkout (placeholder)
  const checkout = useCallback(() => {
    console.log('Proceeding to checkout with items:', items);
    // Aquí iría la lógica de checkout
    closeCartAction();
  }, [items, closeCartAction]);

  return {
    // Estado
    items,
    isOpen,
    isLoading,
    error,
    totalItems,
    subtotal,
    itemCount,
    
    // Acciones
    openCart: openCartAction,
    closeCart: closeCartAction,
    toggleCart: toggleCartAction,
    addToCart: addToCartAction,
    updateQuantity: updateQuantityAction,
    removeFromCart: removeFromCartAction,
    clearCart: clearCartAction,
    incrementQuantity: incrementQuantityAction,
    decrementQuantity: decrementQuantityAction,
    checkout,
    
    // Utilidades
    isInCart,
    getProductQuantity,
  };
}
