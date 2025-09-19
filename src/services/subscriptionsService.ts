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
  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  const res = await fetch(`${constants.api_url}/subscriptions/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ plan_id: planId, payment_method: "wompi", duration_months: durationMonths }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "No se pudo procesar la suscripción");
  }
  return res.json();
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

