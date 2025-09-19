"use client";
import { useEffect, useMemo, useState } from "react";
import SubscriptionCard from "./SubscriptionCard";
import { SubscriptionSectionConfig } from "@/types/market-club";
import { fetchSubscriptionPlans } from "@/services/subscriptionsService";
import { useAuth } from "@/hooks/useAuth";

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
      price: new Intl.NumberFormat("es-CO").format(parseInt(p.price, 10)).replace(/,/g, ".") + " / mes.",
      description: p.description,
      features: p.features,
      image: "/images/market-club/corona-beer.png",
      buttonText: "Suscríbete",
      buttonColor: "#B58E31",
      imagePosition: p.id === "collector_brewer" ? "right" : "left",
    }));
  }, [backendPlans, plans]);

  return (
    <div className={containerClassName}>
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-6 text-red-600 text-sm">{error}</div>
        )}
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
                // Aquí luego llamamos subscribeToPlan(planId)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
