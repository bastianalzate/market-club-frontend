"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/shared/Toast";
import { CheckCircle, ArrowRight, Home, User } from "lucide-react";

export default function SubscriptionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [isProcessing, setIsProcessing] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  useEffect(() => {
    const processSubscription = async () => {
      try {
        // Obtener parámetros de la URL
        const planId = searchParams.get("plan_id");
        const transactionId = searchParams.get("transaction_id");
        const reference = searchParams.get("reference");

        console.log("🎉 Processing subscription success:", { planId, transactionId, reference });

        if (planId) {
          setSubscriptionData({
            planId,
            transactionId,
            reference,
          });
        }

        setTransactionStatus("success");
        showSuccess(
          "¡Suscripción activada!",
          "Tu suscripción ha sido activada correctamente"
        );

      } catch (error) {
        console.error("Error processing subscription:", error);
        setTransactionStatus("failed");
        showError(
          "Error",
          error instanceof Error ? error.message : "Error al procesar la suscripción"
        );
      } finally {
        setIsProcessing(false);
      }
    };

    processSubscription();
  }, [searchParams, showSuccess, showError]);

  const [transactionStatus, setTransactionStatus] = useState<
    "processing" | "success" | "failed"
  >("processing");

  const handleGoToProfile = () => {
    router.push("/perfil?subscription=success");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando suscripción...</p>
        </div>
      </div>
    );
  }

  if (transactionStatus === "failed") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error en la suscripción</h1>
          <p className="text-gray-600 mb-6">
            Hubo un problema al procesar tu suscripción. Por favor, intenta nuevamente.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/club-socios")}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Intentar nuevamente
            </button>
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Ir al inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header de éxito */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-6 text-white">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">
            ¡Suscripción Activada!
          </h1>
          <p className="text-green-100 text-center text-lg">
            Tu suscripción ha sido activada correctamente
          </p>
        </div>

        {/* Contenido principal */}
        <div className="px-8 py-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Bienvenido al Club de Socios
            </h2>
            <p className="text-gray-600">
              Ya eres parte de nuestra comunidad exclusiva. Recibirás tu primera caja el próximo mes.
            </p>
          </div>

          {/* Información de la suscripción */}
          {subscriptionData && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Detalles de tu suscripción:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">Coleccionista Cervecero</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio mensual:</span>
                  <span className="font-medium">$200.000 COP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Próxima entrega:</span>
                  <span className="font-medium">Próximo mes</span>
                </div>
              </div>
            </div>
          )}

          {/* Beneficios */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Beneficios de tu suscripción:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                5 cervezas artesanales o importadas de distintos estilos
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Ocasionalmente, un licor del mundo en lugar de una cerveza
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Suscripción mensual por un año
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Cancela cuando quieras
              </li>
            </ul>
          </div>

          {/* Acciones */}
          <div className="space-y-3">
            <button
              onClick={handleGoToProfile}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <User className="w-5 h-5 mr-2" />
              Ver mi perfil
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={handleGoHome}
              className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Ir al inicio
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      <Toast
        isVisible={toast.isVisible}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={hideToast}
      />
    </div>
  );
}
