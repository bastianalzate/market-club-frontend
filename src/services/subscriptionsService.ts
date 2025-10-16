import { constants } from "@/config/constants";

export interface BackendSubscriptionPlan {
  id: string; // slug
  name: string;
  price: string; // string number
  currency: string; // COP
  period: string; // mes
  description: string;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GetPlansResponse {
  subscription_plans: BackendSubscriptionPlan[];
  meta: {
    total_plans: number;
    currency: string;
  };
}

export async function fetchSubscriptionPlans(): Promise<GetPlansResponse> {
  const res = await fetch(`${constants.api_url}/subscriptions/plans`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("No se pudieron cargar los planes de suscripción");
  }
  return res.json();
}

export async function subscribeToPlan(planId: string, durationMonths = 1) {
  // Esta función ya no se usa directamente - el modal se maneja desde SubscriptionSection
  console.warn("subscribeToPlan: Esta función está deprecada. Use el modal de pago desde SubscriptionSection.");
  return { success: false, message: "Use el modal de pago desde la sección de suscripciones" };
}

export interface CurrentSubscriptionResponse {
  success: boolean;
  data: null | {
    id: number;
    status: string;
    plan: {
      id: string;
      name: string;
    };
  };
}

export async function getCurrentSubscription(): Promise<CurrentSubscriptionResponse | null> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  if (!token) return null;
  const res = await fetch(`${constants.api_url}/subscriptions/current`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

// Nuevos métodos para integración con Wompi

export interface CreatePaymentSessionRequest {
  plan_id: string;
  duration_months?: number;
  redirect_url: string;
}

export interface CreatePaymentSessionResponse {
  success: boolean;
  message: string;
  data: {
    widget_data: {
      publicKey: string;
      reference: string;
      amount: number;
      currency: string;
      integrity_signature: string;
      redirectUrl: string;
      customerData: {
        name: string;
        email: string;
        phoneNumber: string;
        phoneNumberPrefix: string;
      };
    };
    subscription_info: {
      plan_name: string;
      plan_id: string;
      duration_months: number;
      total_amount: number;
      reference: string;
    };
  };
}

export async function createSubscriptionPaymentSession(
  request: CreatePaymentSessionRequest
): Promise<CreatePaymentSessionResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  
  if (!token) {
    throw new Error("No estás autenticado");
  }

  const res = await fetch(`${constants.api_url}/subscriptions/create-payment-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error al crear la sesión de pago");
  }

  return res.json();
}

export interface ConfirmSubscriptionRequest {
  reference: string;
  transaction_id: string;
  plan_id: string;
  duration_months?: number;
}

export interface ConfirmSubscriptionResponse {
  success: boolean;
  message: string;
  data: {
    subscription: {
      id: number;
      plan_name: string;
      price_paid: number;
      starts_at: string;
      ends_at: string;
      next_billing_date: string;
      status: string;
      auto_renew: boolean;
    };
  };
}

export async function confirmSubscription(
  request: ConfirmSubscriptionRequest
): Promise<ConfirmSubscriptionResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  
  if (!token) {
    throw new Error("No estás autenticado");
  }

  const res = await fetch(`${constants.api_url}/subscriptions/confirm-subscription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Error al confirmar la suscripción");
  }

  return res.json();
}

