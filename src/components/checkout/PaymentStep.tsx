"use client";

import { useState, useEffect } from "react";
import {
  CreditCard,
  Building2,
  Smartphone,
  Banknote,
  ArrowLeft,
  Shield,
} from "lucide-react";
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
  console.log("💰 PaymentStep received totalAmount:", totalAmount);
  console.log(
    "💰 PaymentStep amountInCents will be:",
    Math.round(totalAmount * 100)
  );
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
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      showError("Error", "No se pudo inicializar el pago: " + errorMessage);
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

  // Función para abrir el Widget de Wompi con firma de integridad
  const openWompiWidget = async () => {
    try {
      console.log("🎯 Opening Wompi Widget for order:", orderId);

      // Verificar que el script de Wompi esté cargado
      if (typeof window === "undefined") {
        console.error("❌ Window not available");
        throw new Error("Window no está disponible");
      }

      if (!(window as any).WidgetCheckout) {
        console.error("❌ WidgetCheckout not available");
        throw new Error("Widget de Wompi no está cargado");
      }

      console.log("✅ WidgetCheckout found, generating signature...");

      // PASO 1: Crear el widget de Wompi desde el backend (ESTE ES EL PASO CLAVE)
      // Este endpoint guarda la payment_reference en la orden ANTES de abrir el widget
      const widgetData = {
        order_id: orderId,
        amount: totalAmount,
        redirect_url:
          window.location.origin + "/checkout/success?order_id=" + orderId,
        customer_email: customerEmail?.trim(),
        customer_name: customerName?.trim(),
        customer_phone: customerMobile?.replace(/\D/g, ""),
      };

      console.log("🎯 Creating Wompi widget with data:", widgetData);

      const widgetResponse = await PaymentService.createWompiWidget(
        orderId,
        totalAmount,
        window.location.origin + "/checkout/success?order_id=" + orderId,
        {
          email: customerEmail?.trim(),
          name: customerName?.trim(),
          phone: customerMobile?.replace(/\D/g, ""),
        }
      );

      console.log("🔍 Full widget response:", widgetResponse);
      console.log("🔍 Backend returned amount:", widgetResponse.data?.amount);
      console.log("🔍 Frontend totalAmount:", totalAmount);
      console.log(
        "🔍 Amount match:",
        widgetResponse.data?.amount === totalAmount
      );

      if (!widgetResponse.success || !widgetResponse.data?.reference) {
        console.error("❌ Widget response validation failed:", {
          success: widgetResponse.success,
          hasData: !!widgetResponse.data,
          hasReference: !!widgetResponse.data?.reference,
          fullResponse: widgetResponse,
        });
        throw new Error("No se pudo crear el widget de Wompi");
      }

      // PASO 2: Usar EXACTAMENTE los datos que devuelve el backend
      const { reference, amount, currency, integrity_signature, publicKey } =
        widgetResponse.data;

      console.log("✅ Using backend data:", {
        reference,
        amount,
        currency,
        integrity_signature,
        publicKey,
      });

      // PASO 3: Configurar el widget con los datos EXACTOS del backend
      const widgetConfig = {
        currency: currency, // ← Usar currency del backend
        amountInCents: amount, // ← Usar amount del backend (ya en centavos)
        reference: reference, // ← Usar reference del backend
        publicKey: publicKey, // ← Usar publicKey del backend
        redirectUrl:
          window.location.origin + "/checkout/success?order_id=" + orderId,
        signature: {
          integrity: integrity_signature, // ← Usar integrity_signature del backend
        },
        customerData: {
          email: customerEmail?.trim() || "usuario@ejemplo.com",
          fullName: customerName?.trim() || "Usuario",
          phoneNumber: customerMobile?.replace(/\D/g, "") || "3001234567",
          phoneNumberPrefix: "+57",
          legalId: "123456789", // Temporal
          legalIdType: "CC", // Temporal
        },
      };

      console.log("🎯 Widget config with signature:", widgetConfig);

      // Validar que todos los campos requeridos estén presentes
      const requiredFields = [
        "currency",
        "amountInCents",
        "reference",
        "publicKey",
        "signature",
      ] as const;
      const missingFields = requiredFields.filter(
        (field) => !(widgetConfig as any)[field]
      );

      if (missingFields.length > 0) {
        console.error("❌ Missing required widget fields:", missingFields);
        throw new Error(
          `Campos requeridos faltantes: ${missingFields.join(", ")}`
        );
      }

      // PASO 3: Crear y abrir el widget
      console.log("🔧 Creating WidgetCheckout instance...");
      console.log(
        "🔍 WidgetCheckout constructor available:",
        typeof (window as any).WidgetCheckout
      );

      let checkout;
      try {
        checkout = new (window as any).WidgetCheckout(widgetConfig);
        console.log("✅ WidgetCheckout instance created:", checkout);
      } catch (widgetError) {
        console.error("❌ Error creating WidgetCheckout:", widgetError);
        const errorMessage =
          widgetError instanceof Error
            ? widgetError.message
            : "Error desconocido";
        throw new Error(`Error creando el widget: ${errorMessage}`);
      }

      console.log("🚀 Opening widget...");
      checkout.open((result: any) => {
        console.log("🎉 Transaction completed:", result);
        if (result && result.transaction && result.transaction.id) {
          // El pago fue exitoso, llamar al callback de éxito
          console.log("✅ Payment successful, calling success callback...");
          handlePaymentSuccess(result);
        } else {
          console.error("❌ Invalid transaction result:", result);
          showError("Error", "No se pudo procesar el pago");
        }
      });
      console.log("✅ Widget.open() called successfully");
    } catch (error) {
      console.error("❌ Error opening Wompi widget:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      showError("Error", "No se pudo abrir el widget de pago: " + errorMessage);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-lato)' }}>Método de Pago</h2>
          <p className="text-sm font-medium text-gray-700 mt-1" style={{ fontFamily: 'var(--font-lato)' }}>
            Pagar de forma segura con Wompi
          </p>
        </div>

        <div className="px-6 py-6">
          {/* Información del pedido */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2" style={{ fontFamily: 'var(--font-lato)' }}>
              Resumen del Pago
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-lato)' }}>Número de orden:</span>
                <span className="font-medium text-gray-900" style={{ fontFamily: 'var(--font-lato)' }}>{orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700" style={{ fontFamily: 'var(--font-lato)' }}>Total a pagar:</span>
                <span className="font-bold text-lg text-gray-900" style={{ fontFamily: 'var(--font-lato)' }}>
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
                <h3 className="text-sm font-bold text-blue-900" style={{ fontFamily: 'var(--font-lato)' }}>
                  Pago Seguro con Wompi
                </h3>
                <p className="text-sm text-blue-800 mt-1" style={{ fontFamily: 'var(--font-lato)' }}>
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
                  <span className="text-xs font-medium text-blue-700" style={{ fontFamily: 'var(--font-lato)' }}>
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
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
              style={{ fontFamily: 'var(--font-lato)' }}
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
              <p className="text-xs font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-lato)' }}>
                Métodos de pago aceptados:
              </p>
              <div className="flex justify-center space-x-2 flex-wrap gap-2">
                <span className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1.5" style={{ fontFamily: 'var(--font-lato)' }}>
                  <CreditCard className="w-3 h-3" />
                  Tarjetas
                </span>
                <span className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1.5" style={{ fontFamily: 'var(--font-lato)' }}>
                  <Building2 className="w-3 h-3" />
                  PSE
                </span>
                <span className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1.5" style={{ fontFamily: 'var(--font-lato)' }}>
                  <Smartphone className="w-3 h-3" />
                  Nequi
                </span>
                <span className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1.5" style={{ fontFamily: 'var(--font-lato)' }}>
                  <Banknote className="w-3 h-3" />
                  Daviplata
                </span>
              </div>
            </div>
          </div>

          {/* Información de seguridad */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800" style={{ fontFamily: 'var(--font-lato)' }}>
                  Orden en Proceso
                </h3>
                <p className="text-sm text-yellow-700 mt-1" style={{ fontFamily: 'var(--font-lato)' }}>
                  Tu orden ya fue creada exitosamente. Complete el pago para
                  finalizar tu compra.
                </p>
              </div>
            </div>
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
