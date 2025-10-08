"use client";
import { useEffect, useMemo, useState } from "react";
import SubscriptionCard from "./SubscriptionCard";
import { SubscriptionSectionConfig } from "@/types/market-club";
import {
  fetchSubscriptionPlans,
  getCurrentSubscription,
  subscribeToPlan,
} from "@/services/subscriptionsService";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface SubscriptionSectionProps extends SubscriptionSectionConfig {
  containerClassName?: string;
}

export default function SubscriptionSection({
  plans,
  containerClassName = "bg-white py-16 px-4",
}: SubscriptionSectionProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendPlans, setBackendPlans] = useState<any[]>([]);
  const { isAuthenticated, openLoginModal } = useAuth();
  const [subscribingPlanId, setSubscribingPlanId] = useState<string | null>(
    null
  );
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

  const mapped = useMemo(() => {
    if (backendPlans.length === 0) return plans; // fallback a los quemados si falla
    return backendPlans.map((p) => ({
      id: p.id,
      name: p.name,
      price:
        new Intl.NumberFormat("es-CO")
          .format(parseInt(p.price, 10))
          .replace(/,/g, ".") + " / mes.",
      description: p.description,
      features: p.features,
      image: "/images/market-club/corona-beer.png",
      buttonText: "Suscríbete",
      buttonColor: "#B58E31",
      imagePosition: (p.id === "collector_brewer" ? "right" : "left") as
        | "left"
        | "right",
    }));
  }, [backendPlans, plans]);

  if (loading) {
    return (
      <div className={containerClassName}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-gray-700">
              <svg
                className="animate-spin h-5 w-5 text-yellow-600"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Cargando…</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <div className="max-w-7xl mx-auto">
        {error && <div className="mb-6 text-red-600 text-sm">{error}</div>}
        <div className="space-y-12">
          {mapped.map((plan) => (
            <SubscriptionCard
              key={plan.id}
              {...plan}
              onSubscribeClick={(planId) => {
                if (!isAuthenticated) {
                  openLoginModal();
                  return;
                }
                (async () => {
                  try {
                    setSubscribingPlanId(plan.id as string);
                    const current = await getCurrentSubscription();
                    if (current && current.success && current.data) {
                      router.push("/perfil");
                      return;
                    }
                    await subscribeToPlan(plan.id as string, 1);
                    router.push("/perfil");
                  } catch (e) {
                    router.push("/perfil");
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
