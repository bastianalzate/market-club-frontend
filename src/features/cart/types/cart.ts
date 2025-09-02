import { Product } from '../../products/types/product';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AddToCartPayload {
  product: Product;
  quantity?: number;
}

export interface UpdateCartItemPayload {
  itemId: string;
  quantity: number;
}

export interface RemoveFromCartPayload {
  itemId: string;
}

