// Interfaces para el carrito del backend

export interface CartProduct {
  id: number;
  name: string;
  price: string | number;
  sale_price: string | number | null;
  current_price: string | number;
  image_url?: string;
  image?: string;
}

export interface CartItem {
  id: number;
  product_id: number | null;
  gift_id?: string;
  quantity: number;
  unit_price: string | number;
  total_price: string | number;
  product: CartProduct | null;
  is_gift?: boolean;
  gift_data?: any;
}

export interface Cart {
  id: number;
  user_id: number | null;
  session_id: string | null;
  subtotal: string | number;
  tax_amount: string | number;
  shipping_amount: string | number;
  total_amount: string | number;
  items: CartItem[];
}

export interface CartResponse {
  success: boolean;
  data: {
    cart: Cart;
    items_count: number;
    subtotal: string | number;
    tax_amount: string | number;
    shipping_amount: string | number;
    total_amount: string | number;
  };
}

export interface CartActionResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Interfaces para el estado del carrito en el frontend
export interface CartState {
  cart: Cart | null;
  itemsCount: number;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// Interfaces para las acciones del carrito
export interface AddToCartPayload {
  productId: number;
  quantity?: number;
}

export interface UpdateQuantityPayload {
  productId: number;
  quantity: number;
}

export interface RemoveFromCartPayload {
  productId?: number;
  giftId?: string;
}
