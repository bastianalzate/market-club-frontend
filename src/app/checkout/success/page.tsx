"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCheckout } from "@/hooks/useCheckout";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/shared/Toast";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyPayment, confirmOrder, checkoutState } = useCheckout();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [isProcessing, setIsProcessing] = useState(true);
  const [transactionStatus, setTransactionStatus] = useState<
    "processing" | "success" | "failed"
  >("processing");

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Obtener parámetros de la URL
        const orderId = searchParams.get("order_id");
        const transactionId = searchParams.get("transaction_id");
        const reference = searchParams.get("reference");

        if (!orderId) {
          throw new Error("ID de orden no encontrado");
        }

        // Si tenemos transaction_id, verificar directamente
        if (transactionId) {
          console.log(
            "🔍 Verifying payment with transaction_id:",
            transactionId
          );
          const verificationResponse = await verifyPayment(transactionId);

          if (
            verificationResponse.success &&
            verificationResponse.status === "approved"
          ) {
            // Confirmar la orden
            console.log("✅ Payment verified, confirming order:", orderId);
            await confirmOrder(orderId, transactionId);
            setTransactionStatus("success");
            showSuccess(
              "Pago exitoso",
              "Tu pago ha sido procesado correctamente"
            );
          } else {
            console.log(
              "❌ Payment verification failed:",
              verificationResponse
            );
            setTransactionStatus("failed");
            showError(
              "Pago fallido",
              verificationResponse.message || "El pago no fue exitoso"
            );
          }
        }
        // Si solo tenemos reference, asumir que el pago fue exitoso
        // (Wompi redirige solo en caso de éxito)
        else if (reference) {
          console.log("✅ Payment successful (reference only):", reference);
          setTransactionStatus("success");
          showSuccess(
            "Pago exitoso",
            "Tu pago ha sido procesado correctamente"
          );
        } else {
          throw new Error("Parámetros de pago no encontrados");
        }
      } catch (error) {
        console.error("Error processing payment:", error);
        setTransactionStatus("failed");
        showError(
          "Error",
          error instanceof Error ? error.message : "Error al procesar el pago"
        );
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [searchParams, verifyPayment, confirmOrder, showSuccess, showError]);

  const handleContinueShopping = () => {
    router.push("/");
  };

  const handleViewOrder = () => {
    // Aquí podrías redirigir a una página de detalles de la orden
    router.push("/");
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Procesando Pago
            </h3>
            <p className="text-gray-600">
              Por favor espera mientras verificamos tu pago...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md w-full mx-4">
        {transactionStatus === "success" ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Pago Exitoso!
            </h2>

            <p className="text-gray-600 mb-6">
              Tu pago ha sido procesado correctamente. Recibirás un email de
              confirmación pronto.
            </p>

            {searchParams.get("order_id") && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">
                  <strong>Número de orden:</strong>{" "}
                  {searchParams.get("order_id")}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleViewOrder}
                className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Ver Pedido
              </button>

              <button
                onClick={handleContinueShopping}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
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
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Pago Fallido
            </h2>

            <p className="text-gray-600 mb-6">
              No se pudo procesar tu pago. Por favor intenta nuevamente.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
              >
                Intentar Nuevamente
              </button>

              <button
                onClick={handleContinueShopping}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        )}

        {/* Toast */}
        <Toast
          isVisible={toast.isVisible}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={hideToast}
        />
      </div>
    </div>
  );
}
