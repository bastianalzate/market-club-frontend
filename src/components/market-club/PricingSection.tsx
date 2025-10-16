"use client";

import { useEffect, useMemo, useState } from "react";
import PricingCard from "./PricingCard";
import { PricingSectionConfig, PricingPlan } from "@/types/market-club";
import { fetchSubscriptionPlans, getCurrentSubscription } from "@/services/subscriptionsService";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import SubscriptionPaymentModal from "@/components/subscriptions/SubscriptionPaymentModal";
import { useToast } from "@/hooks/useToast";

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

  // Nota: No redirigimos automáticamente si el usuario ya tiene una suscripción.

  const mappedPlans = useMemo(() => {
    if (backendPlans.length === 0) return plans; // fallback a los quemados si falla
    
    // Mapear los planes y reordenarlos: Curioso, Coleccionista, Maestro
    const mapped = backendPlans.map((p): PricingPlan => ({
      id: p.id,
      name: p.name,
      price: `$${new Intl.NumberFormat("es-CO").format(parseInt(p.price, 10)).replace(/,/g, ".")}`,
      numericPrice: parseInt(p.price, 10), // Precio numérico para el modal
      period: ` / ${p.period}`,
      description: p.description,
      features: p.features,
      buttonText: "Empieza ahora",
      buttonColor: "#B58E31",
      isHighlighted: p.is_popular || false,
    }));

    // Reordenar: Curioso (1), Maestro (2), Coleccionista (3)
    const orderMap: { [key: string]: number } = {
      'curioso-cervecero': 1,
      'maestro-cervecero': 2,
      'coleccionista-cervecero': 3,
    };

    return mapped.sort((a, b) => {
      const orderA = orderMap[a.id] || 999;
      const orderB = orderMap[b.id] || 999;
      return orderA - orderB;
    });
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
      style={{ 
        background: 'linear-gradient(135deg, #B58E31 0%, #D4AF37 25%, #FFD700 50%, #D4AF37 75%, #B58E31 100%)',
        backgroundSize: '400% 400%',
        animation: 'goldenShimmer 8s ease-in-out infinite'
      }}
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
                // Abrir modal de pago
                setSelectedPlan(plan);
                setShowPaymentModal(true);
              }}
              isBusy={false}
            />
          ))}
        </div>
      </div>

      {/* Modal de pago de suscripción */}
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
