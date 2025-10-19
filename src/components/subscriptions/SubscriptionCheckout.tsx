"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import SubscriptionPaymentFlow from "./SubscriptionPaymentFlow";
import Toast from "@/components/shared/Toast";

interface SubscriptionCheckoutProps {
  planId: string;
  planName: string;
  totalAmount: number;
  onSuccess: () => void;
  onClose: () => void;
}

export default function SubscriptionCheckout({
  planId,
  planName,
  totalAmount,
  onSuccess,
  onClose,
}: SubscriptionCheckoutProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    console.log('🔐 SubscriptionCheckout - Auth status:', { isAuthenticated, user: !!user });
    if (!isAuthenticated) {
      console.warn('⚠️ User not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handlePaymentSuccess = async (transaction: any) => {
    try {
      setIsProcessing(true);
      console.log("✅ Subscription payment successful:", transaction);
      
      // Aquí podrías hacer una llamada al backend para confirmar la suscripción
      // await confirmSubscription(planId, transaction.id);
      
      showSuccess(
        "¡Suscripción activada!",
        "Tu suscripción ha sido activada exitosamente. Recibirás un email de confirmación."
      );
      
      // Redirigir al perfil o página de éxito
      setTimeout(() => {
        router.push("/perfil?subscription=success");
        onSuccess();
      }, 2000);
      
    } catch (error) {
      console.error("Error processing subscription:", error);
      showError("Error", "Error al procesar la suscripción");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentError = (error: any) => {
    console.error("Subscription payment error:", error);
    showError("Error en el pago", "No se pudo procesar el pago de la suscripción");
  };

  const handleClose = () => {
    onClose();
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Inicia sesión para continuar
          </h3>
          <p className="text-gray-600 mb-4">
            Necesitas iniciar sesión para suscribirte a nuestros planes.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SubscriptionPaymentFlow
        planId={planId}
        planName={planName}
        totalAmount={totalAmount}
        customerEmail={user?.email}
        customerName={user?.name}
        customerMobile={user?.phone}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
        onClose={handleClose}
      />

      {/* Toast */}
      <Toast
        isVisible={toast.isVisible}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={hideToast}
      />
    </>
  );
}
