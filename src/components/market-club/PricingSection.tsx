"use client";

import { useEffect, useMemo, useState } from "react";
import PricingCard from "./PricingCard";
import { PricingSectionConfig, PricingPlan } from "@/types/market-club";
import { fetchSubscriptionPlans, subscribeToPlan, getCurrentSubscription } from "@/services/subscriptionsService";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface PricingSectionProps extends PricingSectionConfig {
  containerClassName?: string;
}

export default function PricingSection({ 
  plans,
  backgroundColor = "#B58E31",
  containerClassName
}: PricingSectionProps) {
  const defaultClassName = "py-16 px-4";
  const finalClassName = containerClassName || defaultClassName;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendPlans, setBackendPlans] = useState<any[]>([]);
  const { isAuthenticated, openLoginModal } = useAuth();
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(null);
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
    
    return backendPlans.map((p): PricingPlan => ({
      id: p.id,
      name: p.name,
      price: `$${new Intl.NumberFormat("es-CO").format(parseInt(p.price, 10)).replace(/,/g, ".")}`,
      period: ` / ${p.period}`,
      description: p.description,
      features: p.features,
      buttonText: "Empieza ahora",
      buttonColor: "#B58E31",
      isHighlighted: p.is_popular || false,
    }));
  }, [backendPlans, plans]);

  if (loading) {
    return (
      <div 
        className={finalClassName}
        style={{ backgroundColor }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-white">Cargando planes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={finalClassName}
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 text-red-100 text-sm text-center">{error}</div>
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
                // Si ya tiene suscripción activa, no cambiarla y redirigir al perfil inmediatamente
                (async () => {
                  try {
                    setSubscribingPlanId(plan.id);
                    const current = await getCurrentSubscription();
                    if (current && current.success && current.data) {
                      router.push('/perfil');
                      return;
                    }
                    // Si no tiene suscripción, crearla y luego redirigir
                    await subscribeToPlan(plan.id, 1);
                    router.push('/perfil');
                  } catch (e) {
                    // Ante cualquier error, no intentar cambiar el plan actual
                    router.push('/perfil');
                  } finally {
                    setSubscribingPlanId(null);
                  }
                })();
              }}
              isBusy={subscribingPlanId === plan.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
