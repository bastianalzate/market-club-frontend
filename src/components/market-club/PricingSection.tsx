"use client";

import { useEffect, useMemo, useState } from "react";
import PricingCard from "./PricingCard";
import SubscriptionCheckout from "@/components/subscriptions/SubscriptionCheckout";
import { PricingSectionConfig, PricingPlan } from "@/types/market-club";
import {
  fetchSubscriptionPlans,
  subscribeToPlan,
  getCurrentSubscription,
} from "@/services/subscriptionsService";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface PricingSectionProps extends PricingSectionConfig {
  containerClassName?: string;
}

export default function PricingSection({
  plans,
  backgroundColor = "#B58E31",
  containerClassName,
}: PricingSectionProps) {
  const defaultClassName = "py-16 px-4";
  const finalClassName = containerClassName || defaultClassName;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendPlans, setBackendPlans] = useState<any[]>([]);
  const { isAuthenticated, openLoginModal } = useAuth();
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(
    null
  );
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchSubscriptionPlans();
        if (!mounted) return;
        setBackendPlans(data.subscription_plans || []);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Error cargando planes");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Nota: No redirigimos automáticamente si el usuario ya tiene una suscripción.

  const mappedPlans = useMemo(() => {
    if (backendPlans.length === 0) return plans; // fallback a los quemados si falla

    // Mapear los planes y reordenarlos: Curioso, Maestro, Coleccionista
    const mapped = backendPlans.map(
      (p): PricingPlan => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        price: `$${new Intl.NumberFormat("es-CO")
          .format(parseInt(p.price, 10))
          .replace(/,/g, ".")}`,
        period: " / mes",
        description: p.description,
        features: p.features || [],
        buttonText: "Empieza ahora",
        buttonColor: "#B58E31",
        isHighlighted: p.is_popular || false,
      })
    );

    // Reordenar: Curioso (1), Maestro (2), Coleccionista (3)
    const orderMap: { [key: string]: number } = {
      "curious_brewer": 1,
      "master_brewer": 2,
      "collector_brewer": 3,
    };

    return mapped.sort((a, b) => {
      const planA = backendPlans.find(p => p.id === a.id);
      const planB = backendPlans.find(p => p.id === b.id);
      const orderA = orderMap[planA?.slug || ''] || 999;
      const orderB = orderMap[planB?.slug || ''] || 999;
      return orderA - orderB;
    });
  }, [backendPlans, plans]);

  if (loading) {
    return (
      <div className={finalClassName} style={{ backgroundColor }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-white" style={{ fontFamily: "var(--font-lato)" }}>Cargando planes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={finalClassName}
      style={{
        backgroundColor: "#B58E31",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 text-red-100 text-sm text-center" style={{ fontFamily: "var(--font-lato)" }}>{error}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mappedPlans.map((plan) => (
            <PricingCard
              key={plan.id}
              {...plan}
              onActionClick={() => {
                if (!isAuthenticated) {
                  openLoginModal();
                  return;
                }
                // Mostrar checkout de suscripción con Wompi
                setSelectedPlan(plan);
                setShowCheckout(true);
              }}
              isBusy={subscribingPlanId === plan.id}
            />
          ))}
        </div>
      </div>

      {/* Modal de Checkout de Suscripción */}
      {showCheckout && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  Suscribirse a {selectedPlan.name}
                </h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Cerrar"
                  aria-label="Cerrar modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <SubscriptionCheckout
                planId={selectedPlan.slug}
                planName={selectedPlan.name}
                totalAmount={parseInt(selectedPlan.price.replace(/[^0-9]/g, ''))}
                onSuccess={() => {
                  setShowCheckout(false);
                  router.push("/perfil?subscription=success");
                }}
                onClose={() => setShowCheckout(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
