import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '../../features/products/types/product';

// Tipos
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string; // ISO string para serialización
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: CartState = {
  items: [],
  isOpen: false,
  isLoading: false,
  error: null,
};

// Slice del carrito
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Abrir/cerrar carrito
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    // Agregar producto al carrito
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      
      // Buscar si el producto ya existe
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Si existe, aumentar la cantidad
        existingItem.quantity += quantity;
      } else {
        // Si no existe, agregar nuevo item
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          addedAt: new Date().toISOString(),
        };
        state.items.push(newItem);
      }
    },

    // Actualizar cantidad de un item
    updateQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        if (quantity <= 0) {
          // Si la cantidad es 0 o menor, remover el item
          state.items = state.items.filter(item => item.id !== itemId);
        } else {
          item.quantity = quantity;
        }
      }
    },

    // Remover item del carrito
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
    },

    // Limpiar carrito
    clearCart: (state) => {
      state.items = [];
    },

    // Incrementar cantidad
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        item.quantity += 1;
      }
    },

    // Decrementar cantidad
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          // Si la cantidad es 1, remover el item
          state.items = state.items.filter(item => item.id !== itemId);
        }
      }
    },

    // Estados de carga
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Manejo de errores
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Restaurar carrito desde localStorage
    restoreCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

// Exportar acciones
export const {
  openCart,
  closeCart,
  toggleCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
  setLoading,
  setError,
  restoreCart,
} = cartSlice.actions;

// Selectores
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartIsOpen = (state: { cart: CartState }) => state.cart.isOpen;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;

// Selectores calculados
export const selectTotalItems = (state: { cart: CartState }) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

export const selectCartItemCount = (state: { cart: CartState }) => state.cart.items.length;

// Selector para verificar si un producto está en el carrito
export const selectIsInCart = (productId: number) => (state: { cart: CartState }) =>
  state.cart.items.some(item => item.product.id === productId);

// Selector para obtener la cantidad de un producto específico
export const selectProductQuantity = (productId: number) => (state: { cart: CartState }) => {
  const item = state.cart.items.find(item => item.product.id === productId);
  return item ? item.quantity : 0;
};

export default cartSlice.reducer;
