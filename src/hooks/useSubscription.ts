import { useState, useEffect, useCallback } from 'react';
import { constants } from '@/config/constants';
import { getAuthHeaders } from '@/utils/authHeaders';

interface SubscriptionPlan {
  id: string; // Ahora es slug (string)
  name: string;
  price: string; // Ahora es string
  currency: string;
  period: string;
  description: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CurrentSubscription {
  id: number;
  plan: {
    id: string; // Ahora es slug (string)
    name: string;
    price: string; // Ahora es string
    currency: string;
    period: string;
    description: string;
    features: string[];
    is_popular: boolean;
    is_active: boolean;
  };
  price_paid: number;
  status: 'active' | 'inactive' | 'cancelled' | 'expired';
  starts_at: string;
  ends_at: string;
  days_remaining: number;
  is_active: boolean;
  next_billing_date?: string;
}

interface SubscriptionHistory {
  id: number;
  plan_name: string;
  price_paid: number;
  status: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
}

export const useSubscription = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [history, setHistory] = useState<SubscriptionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener planes disponibles
  const loadPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${constants.api_url}/subscriptions/plans`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al cargar los planes de suscripción');
      }

      const data = await response.json();
      if (data.subscription_plans) {
        setPlans(data.subscription_plans);
      } else {
        throw new Error('Error al cargar planes');
      }
    } catch (err) {
      console.error('Error loading subscription plans:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener suscripción actual
  const loadCurrentSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${constants.api_url}/subscriptions/current`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCurrentSubscription(data.data);
        } else {
          setCurrentSubscription(null);
        }
      } else if (response.status === 404) {
        // No tiene suscripción activa
        setCurrentSubscription(null);
      } else {
        throw new Error('Error al cargar la suscripción actual');
      }
    } catch (err) {
      console.error('Error loading current subscription:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setCurrentSubscription(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener historial de suscripciones
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${constants.api_url}/subscriptions/history`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al cargar el historial de suscripciones');
      }

      const data = await response.json();
      if (data.success) {
        setHistory(data.data);
      } else {
        throw new Error(data.message || 'Error al cargar historial');
      }
    } catch (err) {
      console.error('Error loading subscription history:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Suscribirse a un plan
  const subscribe = useCallback(async (planId: string, paymentMethod: string = 'wompi', durationMonths: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      // Esta función ya no redirige - el modal se maneja desde SubscriptionSection
      console.warn("useSubscription.subscribe: Esta función está deprecada. Use el modal de pago desde SubscriptionSection.");
      return { success: false, message: "Use el modal de pago desde la sección de suscripciones" };
    } catch (err) {
      console.error('Error subscribing:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [loadCurrentSubscription]);

  // Cancelar suscripción
  const cancelSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${constants.api_url}/subscriptions/cancel`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al cancelar la suscripción');
      }

      const data = await response.json();
      if (data.success) {
        // Recargar suscripción actual
        await loadCurrentSubscription();
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Error al cancelar la suscripción');
      }
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [loadCurrentSubscription]);

  // Renovar suscripción
  const renewSubscription = useCallback(async (durationMonths: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${constants.api_url}/subscriptions/renew`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          duration_months: durationMonths,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al renovar la suscripción');
      }

      const data = await response.json();
      if (data.success) {
        // Recargar suscripción actual
        await loadCurrentSubscription();
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'Error al renovar la suscripción');
      }
    } catch (err) {
      console.error('Error renewing subscription:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [loadCurrentSubscription]);

  // Limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Estados
    plans,
    currentSubscription,
    history,
    loading,
    error,
    
    // Acciones
    loadPlans,
    loadCurrentSubscription,
    loadHistory,
    subscribe,
    cancelSubscription,
    renewSubscription,
    clearError,
  };
};
