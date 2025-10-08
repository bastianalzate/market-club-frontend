import { useState, useCallback } from 'react';
import { CheckoutService } from '../services/checkoutService';
import { PaymentService } from '../services/paymentService';
import { 
  CheckoutState, 
  ShippingAddress, 
  BillingAddress, 
  CheckoutSummary,
  AddressValidationResponse,
  ShippingCalculationResponse,
  CreateOrderResponse,
  CardData,
  PaymentTokenResponse,
  ProcessPaymentResponse,
  VerifyPaymentResponse,
  PaymentMethod
} from '../types/checkout';

export const useCheckout = () => {
  const [checkoutState, setCheckoutState] = useState<CheckoutState>({
    currentStep: 1,
    shippingAddress: null,
    billingAddress: null,
    selectedPaymentMethod: null,
    orderNotes: '',
    loading: false,
    error: null,
    orderId: null,
    paymentStatus: 'pending'
  });

  const [summary, setSummary] = useState<CheckoutSummary | null>(null);



  // Calcular costo de envío
  const calculateShipping = useCallback(async (city: string, state: string, postalCode: string): Promise<ShippingCalculationResponse> => {
    try {
      setCheckoutState(prev => ({ ...prev, loading: true, error: null }));
      const response = await CheckoutService.calculateShipping(city, state, postalCode);
      
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Error al calcular envío');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setCheckoutState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setCheckoutState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Crear orden
  const createOrder = useCallback(async (
    shippingAddress: ShippingAddress, 
    billingAddress?: BillingAddress, 
    notes?: string
  ): Promise<CreateOrderResponse> => {
    try {
      setCheckoutState(prev => ({ ...prev, loading: true, error: null }));
      const response = await CheckoutService.createOrder(shippingAddress, billingAddress as any, notes);
      
      if (response.success) {
        // Verificar todos los posibles IDs disponibles
        console.log('📦 Full response data:', response);
        console.log('🔍 Available IDs:');
        console.log('  - response.data.order.id:', response.data?.order?.id);
        console.log('  - response.data.order.order_number:', response.data?.order?.order_number);
        console.log('  - response.order_id:', response.order_id);
        console.log('  - response.data.order_id:', response.data?.order_id);
        console.log('  - response.data.id:', response.data?.id);
        
        // Priorizar ID numérico sobre order_number
        const orderId = response.data?.order?.id || 
                       response.data?.order?.order_number || 
                       response.order_id || 
                       response.data?.order_id || 
                       response.data?.id;
                       
        console.log('✅ Selected orderId:', orderId, 'Type:', typeof orderId);
        setCheckoutState(prev => ({ 
          ...prev, 
          orderId: orderId,
          shippingAddress,
          billingAddress: billingAddress || null,
          orderNotes: notes || ''
        }));
        return response;
      } else {
        throw new Error(response.message || 'Error al crear orden');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setCheckoutState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setCheckoutState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Crear sesión de pago con Wompi
  const createPaymentSession = useCallback(async (
    orderId: string, 
    totalAmount: number, 
    redirectUrl: string,
    customerData?: { email?: string; name?: string; phone?: string }
  ): Promise<any> => {
    try {
      setCheckoutState(prev => ({ ...prev, loading: true, error: null }));
      const response = await PaymentService.createPaymentSession(orderId, totalAmount, redirectUrl, customerData);
      
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Error al crear sesión de pago');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setCheckoutState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setCheckoutState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Confirmar orden después de pago exitoso
  const confirmOrder = useCallback(async (orderId: string, transactionId: string): Promise<any> => {
    try {
      setCheckoutState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null, 
        paymentStatus: 'processing' 
      }));
      
      const response = await PaymentService.confirmOrder(orderId, transactionId);
      
      if (response.success) {
        setCheckoutState(prev => ({ 
          ...prev, 
          paymentStatus: 'completed'
        }));
        return response;
      } else {
        setCheckoutState(prev => ({ ...prev, paymentStatus: 'failed' }));
        throw new Error(response.message || 'Error al confirmar orden');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setCheckoutState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        paymentStatus: 'failed' 
      }));
      throw error;
    } finally {
      setCheckoutState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Verificar pago
  const verifyPayment = useCallback(async (transactionId: string): Promise<VerifyPaymentResponse> => {
    try {
      setCheckoutState(prev => ({ ...prev, loading: true, error: null }));
      const response = await PaymentService.verifyPayment(transactionId);
      
      if (response.success) {
        setCheckoutState(prev => ({ 
          ...prev, 
          paymentStatus: response.status === 'approved' ? 'completed' : 'failed'
        }));
        return response;
      } else {
        throw new Error(response.message || 'Error al verificar pago');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setCheckoutState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setCheckoutState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Obtener métodos de pago disponibles
  const getPaymentMethods = useCallback(async (): Promise<PaymentMethod[]> => {
    try {
      setCheckoutState(prev => ({ ...prev, loading: true, error: null }));
      const response = await PaymentService.getPaymentMethods();
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Error al obtener métodos de pago');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setCheckoutState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    } finally {
      setCheckoutState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  // Actualizar paso actual
  const setCurrentStep = useCallback((step: number) => {
    setCheckoutState(prev => ({ ...prev, currentStep: step }));
  }, []);

  // Limpiar errores
  const clearError = useCallback(() => {
    setCheckoutState(prev => ({ ...prev, error: null }));
  }, []);

  // Resetear estado del checkout
  const resetCheckout = useCallback(() => {
    setCheckoutState({
      currentStep: 1,
      shippingAddress: null,
      billingAddress: null,
      selectedPaymentMethod: null,
      orderNotes: '',
      loading: false,
      error: null,
      orderId: null,
      paymentStatus: 'pending'
    });
    setSummary(null);
  }, []);

  return {
    checkoutState,
    summary,
    calculateShipping,
    createOrder,
    createPaymentSession,
    confirmOrder,
    verifyPayment,
    setCurrentStep,
    clearError,
    resetCheckout
  };
};
