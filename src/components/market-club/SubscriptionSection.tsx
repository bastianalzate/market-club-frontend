"use client";
import { useEffect, useMemo, useState } from "react";
import SubscriptionCard from "./SubscriptionCard";
import { SubscriptionSectionConfig } from "@/types/market-club";
import {
  fetchSubscriptionPlans,
  getCurrentSubscription,
} from "@/services/subscriptionsService";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import SubscriptionPaymentModal from "@/components/subscriptions/SubscriptionPaymentModal";
import { useToast } from "@/hooks/useToast";

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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { isAuthenticated, openLoginModal, user } = useAuth();
  const { showToast } = useToast();
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
    return backendPlans.map((p) => {
      // Asignar imagen específica según el plan
      let image = "/images/market-club/corona-beer.png"; // Default para Curioso Cervecero
      
      if (p.id === "collector_brewer") {
        image = "/images/market-club/liefmans-coleccionista.png";
      } else if (p.id === "master_brewer") {
        image = "/images/market-club/liefmans-maestro.png";
      }

      return {
        id: p.id,
        name: p.name,
        price:
          new Intl.NumberFormat("es-CO")
            .format(parseInt(p.price, 10))
            .replace(/,/g, ".") + " / mes.",
        numericPrice: parseInt(p.price, 10), // Precio numérico para el modal
        description: p.description,
        features: p.features,
        image: image,
        buttonText: "Suscríbete",
        buttonColor: "#B58E31",
        imagePosition: (p.id === "collector_brewer" ? "right" : "left") as
          | "left"
          | "right",
      };
    });
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
                // Abrir modal de pago
                const plan = mapped.find(p => p.id === planId);
                if (plan) {
                  console.log("Plan encontrado:", plan);
                  console.log("Precio formateado:", plan.price, "Tipo:", typeof plan.price);
                  console.log("Precio numérico:", plan.numericPrice, "Tipo:", typeof plan.numericPrice);
                  setSelectedPlan(plan);
                  setShowPaymentModal(true);
                }
              }}
              isBusy={false}
            />
          ))}
        </div>
      </div>

      {/* Modal de pago */}
      {selectedPlan && (
        <SubscriptionPaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedPlan(null);
          }}
          planId={selectedPlan.id}
          durationMonths={1}
          totalAmount={selectedPlan.numericPrice || 0}
          customerEmail={user?.email || ""}
          customerName={user?.name}
          customerMobile={user?.phone}
          onSuccess={(transactionId, reference) => {
            showToast("¡Suscripción activada exitosamente!", "success");
            setShowPaymentModal(false);
            setSelectedPlan(null);
            // Recargar datos si es necesario
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
