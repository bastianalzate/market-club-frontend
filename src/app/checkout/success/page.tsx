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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  MARKET CLUB
                </span>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                Inicio
              </a>
              <a href="/tienda" className="text-gray-600 hover:text-gray-900">
                Tienda
              </a>
              <a
                href="/arma-tu-regalo"
                className="text-gray-600 hover:text-gray-900"
              >
                Armá tu regalo
              </a>
              <a
                href="/quienes-somos"
                className="text-gray-600 hover:text-gray-900"
              >
                Quiénes somos
              </a>
              <a
                href="/club-socios"
                className="text-gray-600 hover:text-gray-900"
              >
                Club de socios
              </a>
              <a href="/contacto" className="text-gray-600 hover:text-gray-900">
                Contacto
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Checkout Progress */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            <p className="text-gray-600">Completa tu pedido de forma segura</p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-center space-x-8">
            {/* Resumen */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                Resumen
              </span>
            </div>

            {/* Dirección */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                Dirección
              </span>
            </div>

            {/* Pago */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                Pago
              </span>
            </div>

            {/* Confirmación */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="ml-2 text-sm font-medium text-gray-900">
                Confirmación
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-lg">
            {transactionStatus === "success" ? (
              <div className="text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-green-600"
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

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  ¡Pedido Completado!
                </h2>

                {/* Message */}
                <p className="text-gray-600 mb-8 text-lg">
                  Tu pedido ha sido procesado exitosamente. Recibirás un email
                  de confirmación pronto.
                </p>

                {/* Order Number */}
                {searchParams.get("order_id") && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-8">
                    <p className="text-lg font-medium text-gray-900">
                      Número de orden: {searchParams.get("order_id")}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={handleContinueShopping}
                  className="w-full bg-yellow-600 text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-10 h-10 text-red-600"
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

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Pago Fallido
                </h2>

                <p className="text-gray-600 mb-8 text-lg">
                  No se pudo procesar tu pago. Por favor intenta nuevamente.
                </p>

                <div className="space-y-4">
                  <button
                    onClick={() => router.push("/checkout")}
                    className="w-full bg-yellow-600 text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    Intentar Nuevamente
                  </button>

                  <button
                    onClick={handleContinueShopping}
                    className="w-full bg-gray-100 text-gray-700 py-4 px-8 rounded-lg font-bold text-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Continuar Comprando
                  </button>
                </div>
              </div>
            )}
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
