"use client";
import { useEffect, useMemo, useState } from "react";
import SubscriptionCard from "./SubscriptionCard";
import SubscriptionCheckout from "@/components/subscriptions/SubscriptionCheckout";
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
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
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

    console.log("🔍 Backend plans data:", backendPlans);

    // Mapear planes con imágenes correctas
    const mappedPlans = backendPlans.map((p) => {
      // Corregir nombres según precios:
      // - El más caro ($149.000) debe ser "Maestro Cervecero"
      // - El de $99.000 debe ser "Coleccionista Cervecero"
      let displayName = p.name;
      const price = parseInt(p.price, 10);

      if (price === 149000) {
        displayName = "Maestro Cervecero";
      } else if (price === 99000) {
        displayName = "Coleccionista Cervecero";
      }

      // Asignar imagen específica según el slug del plan
      let image = "/images/market-club/corona-beer.png"; // Default para Curioso Cervecero

      if (p.slug === "curious_brewer") {
        image = "/images/market-club/corona-beer.png";
      } else if (p.slug === "master_brewer" || price === 149000) {
        image = "/images/market-club/delirium-maestro.png";
      } else if (p.slug === "collector_brewer" || price === 99000) {
        image = "/images/market-club/liefmans-coleccionista.png";
      }

      const mappedPlan = {
        id: p.id,
        slug: p.slug,
        name: displayName,
        price:
          new Intl.NumberFormat("es-CO")
            .format(parseInt(p.price, 10))
            .replace(/,/g, ".") + " / mes.",
        description: p.description,
        features: p.features,
        image: image,
        buttonText: "Suscríbete",
        buttonColor: "#B58E31",
        imagePosition: "left" as "left" | "right", // Se asignará después del ordenamiento
      };

      console.log("🔍 Mapped plan:", mappedPlan);
      console.log("🔍 Plan slug in mapped:", mappedPlan.slug);

      return mappedPlan;
    });

    // Ordenar por precio: Curioso, Coleccionista ($99k), Maestro ($149k)
    const sortedPlans = mappedPlans.sort((a, b) => {
      const planA = backendPlans.find((p) => p.id === a.id);
      const planB = backendPlans.find((p) => p.id === b.id);

      // Ordenar por precio (ascendente): más barato primero
      const priceA = planA ? parseInt(planA.price, 10) : 999999;
      const priceB = planB ? parseInt(planB.price, 10) : 999999;

      return priceA - priceB;
    });

    // Asignar posiciones intercaladas después del ordenamiento
    return sortedPlans.map((plan, index) => ({
      ...plan,
      imagePosition: (index % 2 === 0 ? "left" : "right") as "left" | "right",
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
              <span style={{ fontFamily: "var(--font-lato)" }}>Cargando…</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <div className="max-w-7xl mx-auto">
        {error && (
          <div
            className="mb-6 text-red-600 text-sm"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            {error}
          </div>
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
                // Mostrar checkout de suscripción con Wompi
                console.log("🔍 Selected plan for checkout:", plan);
                console.log("🔍 Plan slug:", plan.slug);
                console.log("🔍 Plan slug type:", typeof plan.slug);
                console.log(
                  "🔍 Plan slug is empty:",
                  !plan.slug || plan.slug === ""
                );
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-xl font-bold text-gray-900"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  Suscribirse a {selectedPlan.name}
                </h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400 hover:text-gray-600"
                  title="Cerrar"
                  aria-label="Cerrar modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <SubscriptionCheckout
                planId={selectedPlan.slug}
                planName={selectedPlan.name}
                totalAmount={parseInt(
                  selectedPlan.price.replace(/[^0-9]/g, "")
                )}
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
