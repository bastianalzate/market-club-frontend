"use client";

import { useState } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { useToast } from "@/hooks/useToast";
import WompiWidget from "@/components/payment/WompiWidget";
import Toast from "@/components/shared/Toast";
import { WOMPI_CONFIG } from "@/config/wompi";

interface PaymentStepProps {
  orderId: string;
  totalAmount: number;
  customerEmail?: string;
  customerName?: string;
  customerMobile?: string;
  onBack: () => void;
  onSuccess: () => void;
}

export default function PaymentStep({
  orderId,
  totalAmount,
  customerEmail,
  customerName,
  customerMobile,
  onBack,
  onSuccess,
}: PaymentStepProps) {
  const { createPaymentSession, confirmOrder, checkoutState } = useCheckout();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [showWompiWidget, setShowWompiWidget] = useState(false);
  const [paymentSession, setPaymentSession] = useState<any>(null);

  // Configuración de Wompi
  const { PUBLIC_KEY: WOMPI_PUBLIC_KEY } = WOMPI_CONFIG;

  const handleStartPayment = async () => {
    try {
      const redirectUrl = WOMPI_CONFIG.getRedirectUrl(orderId);

      // Preparar datos del cliente (opcional - el backend los obtiene automáticamente)
      const customerData = {
        email: customerEmail,
        name: customerName,
        phone: customerMobile,
      };

      console.log("👤 Customer data (optional):", customerData);
      console.log("📦 Order ID being sent:", orderId);

      const sessionResponse = await createPaymentSession(
        orderId,
        totalAmount,
        redirectUrl,
        customerData
      );

      if (sessionResponse.success && sessionResponse.data.payment_url) {
        // Redirigir directamente a Wompi
        console.log(
          "🚀 Redirecting to Wompi:",
          sessionResponse.data.payment_url
        );
        window.location.href = sessionResponse.data.payment_url;
      } else {
        throw new Error(
          sessionResponse.message || "No se obtuvo la URL de pago"
        );
      }
    } catch (error) {
      console.error("Error creating payment session:", error);
      showError("Error", "No se pudo inicializar el pago");
    }
  };

  const handlePaymentSuccess = async (transaction: any) => {
    try {
      console.log("Payment success transaction:", transaction);

      // Confirmar la orden en el backend
      const confirmResponse = await confirmOrder(orderId, transaction.id);

      if (confirmResponse.success) {
        showSuccess("Pago exitoso", "Tu pago ha sido procesado correctamente");
        setShowWompiWidget(false);
        onSuccess();
      }
    } catch (error) {
      console.error("Error confirming order:", error);
      showError("Error", "Error al confirmar el pago");
    }
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error);
    showError(
      "Error en el pago",
      error.message || "No se pudo procesar el pago"
    );
  };

  const handleCloseWidget = () => {
    setShowWompiWidget(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Método de Pago
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Pagar de forma segura con Wompi
          </p>
        </div>

        <div className="px-6 py-6">
          {/* Información del pedido */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Resumen del Pago
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Número de orden:</span>
                <span className="font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total a pagar:</span>
                <span className="font-medium text-lg">
                  ${totalAmount.toLocaleString()} COP
                </span>
              </div>
            </div>
          </div>

          {/* Información de Wompi */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Pago Seguro con Wompi
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Wompi es la plataforma de pagos más segura de Colombia. Acepta
                  tarjetas de crédito, débito, PSE, Nequi y Daviplata.
                </p>
              </div>
            </div>
          </div>

          {/* Botón de pago */}
          <div className="space-y-4">
            <button
              onClick={handleStartPayment}
              disabled={checkoutState.loading || showWompiWidget}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {checkoutState.loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Inicializando pago...
                </>
              ) : showWompiWidget ? (
                "Procesando pago..."
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Pagar con Wompi
                </>
              )}
            </button>

            {/* Métodos de pago aceptados */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                Métodos de pago aceptados:
              </p>
              <div className="flex justify-center space-x-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  💳 Tarjetas
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  🏦 PSE
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  📱 Nequi
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  💸 Daviplata
                </span>
              </div>
            </div>
          </div>

          {/* Botón de volver */}
          <div className="mt-6">
            <button
              type="button"
              onClick={onBack}
              disabled={showWompiWidget}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Volver a Dirección
            </button>
          </div>
        </div>
      </div>

      {/* Widget de Wompi */}
      {showWompiWidget && paymentSession && (
        <WompiWidget
          publicKey={WOMPI_PUBLIC_KEY}
          currency="COP"
          amountInCents={Math.round(totalAmount * 100)}
          reference={paymentSession.reference || `ORDER_${orderId}`}
          redirectUrl={paymentSession.redirect_url}
          customerEmail={customerEmail}
          customerName={customerName}
          customerMobile={customerMobile}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          onClose={handleCloseWidget}
        />
      )}

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
