"use client";

import { useState, useEffect } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { useToast } from "@/hooks/useToast";
import WompiWidget from "@/components/payment/WompiWidget";
import Toast from "@/components/shared/Toast";
import { WOMPI_CONFIG } from "@/config/wompi";
import { PaymentService } from "@/services/paymentService";

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
  const [wompiScriptLoaded, setWompiScriptLoaded] = useState(false);

  // Configuración de Wompi
  const { PUBLIC_KEY: WOMPI_PUBLIC_KEY } = WOMPI_CONFIG;

  // Verificar si el script de Wompi está cargado
  useEffect(() => {
    const checkWompiScript = () => {
      if (typeof (window as any).WidgetCheckout !== "undefined") {
        console.log("✅ Wompi script loaded successfully");
        setWompiScriptLoaded(true);
      } else {
        console.log("⏳ Wompi script not loaded yet, retrying...");
        setTimeout(checkWompiScript, 1000);
      }
    };

    checkWompiScript();
  }, []);

  const handleStartPayment = async () => {
    try {
      console.log("🚀 Starting payment process...");

      const redirectUrl = WOMPI_CONFIG.getRedirectUrl(orderId);
      console.log("🔗 Redirect URL:", redirectUrl);

      // Preparar datos del cliente (opcional - el backend los obtiene automáticamente)
      const customerData = {
        email: customerEmail,
        name: customerName,
        phone: customerMobile,
      };

      console.log("👤 Customer data (optional):", customerData);
      console.log("📦 Order ID being sent:", orderId);
      console.log("💰 Total amount:", totalAmount);

      // Verificar que Wompi esté cargado antes de continuar
      console.log("🔍 Checking Wompi script status...");
      console.log("  - wompiScriptLoaded:", wompiScriptLoaded);
      console.log(
        "  - WidgetCheckout available:",
        typeof (window as any).WidgetCheckout !== "undefined"
      );

      if (!wompiScriptLoaded) {
        console.warn("⚠️ Wompi script not loaded, waiting...");
        showError(
          "Error",
          "Wompi no está cargado. Por favor, espera un momento y vuelve a intentar."
        );
        return;
      }

      if (typeof (window as any).WidgetCheckout === "undefined") {
        console.error("❌ WidgetCheckout not available");
        showError(
          "Error",
          "Widget de Wompi no está disponible. Por favor, recarga la página."
        );
        return;
      }

      console.log("✅ Wompi ready, opening widget...");

      // Abrir Widget de Wompi (configuración mínima que funciona)
      await openWompiWidget();
    } catch (error) {
      console.error("❌ Error opening Wompi checkout:", error);
      showError("Error", "No se pudo inicializar el pago: " + error.message);
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

  // Función para crear el Checkout Web de Wompi (ya no necesaria - se hace directamente en openWompiCheckout)

  // Función para abrir el Widget de Wompi (configuración mínima que funciona)
  const openWompiWidget = async () => {
    try {
      console.log("🎯 Opening Wompi Widget for order:", orderId);
      console.log(
        "🔍 WidgetCheckout type:",
        typeof (window as any).WidgetCheckout
      );
      console.log(
        "🔍 WidgetCheckout available:",
        !!(window as any).WidgetCheckout
      );

      // Verificar que el script de Wompi esté cargado
      if (typeof window === "undefined") {
        console.error("❌ Window not available");
        throw new Error("Window no está disponible");
      }

      if (!(window as any).WidgetCheckout) {
        console.error("❌ WidgetCheckout not available");
        console.log(
          "🔍 Available window properties:",
          Object.keys(window).filter(
            (key) =>
              key.toLowerCase().includes("widget") ||
              key.toLowerCase().includes("wompi")
          )
        );
        throw new Error("Widget de Wompi no está cargado");
      }

      console.log("✅ WidgetCheckout found, creating widget...");

      // Debug: Verificar datos del cliente y monto antes de crear el widget
      console.log("🔍 Customer data debug:");
      console.log(
        "  - customerName:",
        customerName,
        "Type:",
        typeof customerName
      );
      console.log(
        "  - customerEmail:",
        customerEmail,
        "Type:",
        typeof customerEmail
      );
      console.log(
        "  - customerMobile:",
        customerMobile,
        "Type:",
        typeof customerMobile
      );
      console.log("💰 Payment amount debug:");
      console.log("  - totalAmount:", totalAmount, "Type:", typeof totalAmount);
      console.log("  - amountInCents:", totalAmount * 100);

      // Intentar con datos reales del formulario
      console.log("✅ Attempting with real customer data from form");

      try {
        const widgetConfigWithData = {
          currency: "COP",
          amountInCents: totalAmount * 100,
          reference: `ORDER_${orderId}_${Date.now()}`,
          publicKey: "pub_test_6j4AFOkyelP8Sb8HsS9u9l7aagAaRak4",
          redirectUrl:
            window.location.origin + "/checkout/success?order_id=" + orderId,
          // Datos reales del formulario de dirección (formato correcto según docs.wompi.co)
          customerData: {
            email: customerEmail.trim(),
            fullName: customerName.trim(), // ← fullName, NO name
            phoneNumber: customerMobile.replace(/\D/g, ""), // Solo números
            phoneNumberPrefix: "+57", // Colombia
            legalId: "123456789", // ← Temporal - se puede mejorar después
            legalIdType: "CC", // ← Temporal - se puede mejorar después
          },
        };

        console.log(
          "🎯 Widget config with real customer data:",
          widgetConfigWithData
        );

        // Debug de los datos del cliente
        console.log("🔍 Customer data:", widgetConfigWithData.customerData);
        console.log("🔧 Creating WidgetCheckout instance (with data)...");
        const checkout = new (window as any).WidgetCheckout(
          widgetConfigWithData
        );
        console.log(
          "✅ WidgetCheckout instance created (with data):",
          checkout
        );

        console.log("🚀 Opening widget (with data)...");
        checkout.open((result: any) => {
          console.log("🎉 Transaction completed:", result);
          if (result && result.transaction && result.transaction.id) {
            handlePaymentSuccess(result.transaction);
          } else {
            console.error("❌ Invalid transaction result:", result);
            showError("Error", "No se pudo procesar el pago");
          }
        });
        console.log("✅ Widget.open() called successfully (with data)");
      } catch (customerDataError) {
        console.warn(
          "⚠️ Customer data format issue, falling back to minimal config:",
          customerDataError
        );

        // Fallback a configuración mínima (sin customerData)
        const minimalConfig = {
          currency: "COP",
          amountInCents: totalAmount * 100,
          reference: `ORDER_${orderId}_${Date.now()}`,
          publicKey: "pub_test_6j4AFOkyelP8Sb8HsS9u9l7aagAaRak4",
          redirectUrl:
            window.location.origin + "/checkout/success?order_id=" + orderId,
        };

        console.log("🎯 Using minimal config as fallback:", minimalConfig);

        console.log("🔧 Creating WidgetCheckout instance (minimal)...");
        const checkout = new (window as any).WidgetCheckout(minimalConfig);
        console.log("✅ WidgetCheckout instance created (minimal):", checkout);

        console.log("🚀 Opening widget (minimal)...");
        checkout.open((result: any) => {
          console.log("🎉 Transaction completed:", result);
          if (result && result.transaction && result.transaction.id) {
            handlePaymentSuccess(result.transaction);
          } else {
            console.error("❌ Invalid transaction result:", result);
            showError("Error", "No se pudo procesar el pago");
          }
        });
        console.log("✅ Widget.open() called successfully (minimal)");
      }
    } catch (error) {
      console.error("❌ Error opening Wompi widget:", error);
      showError(
        "Error",
        "No se pudo abrir el widget de pago: " + error.message
      );
    }
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
                  Wompi es la plataforma de pagos más segura de Colombia. Al
                  hacer clic en "Pagar con Wompi" podrás elegir entre tarjetas
                  de crédito/débito, PSE, Nequi, Daviplata y más métodos de
                  pago.
                </p>
                <div className="mt-2 flex items-center">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      wompiScriptLoaded ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  ></div>
                  <span className="text-xs text-blue-600">
                    {wompiScriptLoaded ? "Wompi listo" : "Cargando Wompi..."}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de pago */}
          <div className="space-y-4">
            <button
              onClick={handleStartPayment}
              disabled={
                checkoutState.loading || showWompiWidget || !wompiScriptLoaded
              }
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {!wompiScriptLoaded ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cargando Wompi...
                </>
              ) : checkoutState.loading ? (
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
