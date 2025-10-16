// Interfaces para checkout y pagos

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  email: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code?: string;
  country: string;
  phone?: string;
}

export interface BillingAddress {
  first_name: string;
  last_name: string;
  email: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface CheckoutSummary {
  cart_items: CartItem[];
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  estimated_delivery: string;
  available_payment_methods: PaymentMethod[];
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: {
    id: number;
    name: string;
    image?: string;
    image_url?: string;
  };
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'pse' | 'nequi' | 'daviplata';
  is_active: boolean;
  icon?: string;
  description?: string;
}

export interface AddressValidationResponse {
  success: boolean;
  valid: boolean;
  message?: string;
  suggestions?: string[];
}

export interface ShippingCalculationResponse {
  success: boolean;
  shipping_amount: number;
  estimated_days: number;
  carrier: string;
  message?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  order_id: string;
  order_number: string;
  total_amount: number;
  payment_url?: string;
  message?: string;
}

export interface CardData {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
  cardHolder: string;
}

export interface PaymentTokenResponse {
  success: boolean;
  token: string;
  card_type: string;
  last_four: string;
  message?: string;
}

export interface ProcessPaymentResponse {
  success: boolean;
  transaction_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'failed';
  payment_method: string;
  amount: number;
  message?: string;
  redirect_url?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'failed';
  transaction_id: string;
  amount: number;
  payment_method: string;
  message?: string;
}

export interface CheckoutState {
  currentStep: number;
  shippingAddress: ShippingAddress | null;
  billingAddress: BillingAddress | null;
  selectedPaymentMethod: PaymentMethod | null;
  orderNotes: string;
  loading: boolean;
  error: string | null;
  orderId: string | null;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
  saveCard: boolean;
}
