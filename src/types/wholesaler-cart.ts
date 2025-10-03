// Tipos para el carrito de mayoristas

export interface WholesalerCartItem {
  id: number;
  wholesaler_cart_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_snapshot: any;
  is_wholesaler_item: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  product?: {
    id: number;
    name: string;
    slug: string;
    description: string;
    current_price: number;
    image?: string;
    stock_quantity: number;
    is_active: boolean;
  };
}

export interface WholesalerCart {
  id: number;
  wholesaler_id?: number;
  session_id?: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total_amount: number;
  metadata?: any;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: WholesalerCartItem[];
}

export interface WholesalerCartResponse {
  success: boolean;
  message: string;
  data: {
    cart: WholesalerCart;
    items_count: number;
    subtotal: number;
    tax_amount: number;
    shipping_amount: number;
    discount_amount: number;
    total_amount: number;
    is_empty: boolean;
    wholesaler_discount: number;
  };
}

export interface WholesalerCartState {
  cart: WholesalerCart | null;
  itemsCount: number;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
  wholesalerDiscount: number;
}

export interface AddToWholesalerCartPayload {
  productId: number;
  quantity?: number;
}

export interface UpdateWholesalerCartQuantityPayload {
  productId: number;
  quantity: number;
}

export interface RemoveFromWholesalerCartPayload {
  productId: number;
}

export interface ApplyDiscountPayload {
  discountAmount: number;
  reason?: string;
}

export interface AddNotesPayload {
  notes: string;
}
