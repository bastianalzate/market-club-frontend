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
  console.log("💰 PaymentStep totalAmount type:", typeof totalAmount);
  console.log(
    "💰 PaymentStep amountInCents will be:",
    Math.round(totalAmount * 100)
  );
  console.log("🔍 VERIFY: Este es el monto que SE DEBE COBRAR:", totalAmount);
  const { createPaymentSession, confirmOrder, checkoutState } = useCheckout();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [showWompiWidget, setShowWompiWidget] = useState(false);
  const [paymentSession, setPaymentSession] = useState<any>(null);
  const [wompiScriptLoaded, setWompiScriptLoaded] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string>("");

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

  // Esta función ya no es necesaria, el callback del widget maneja todo directamente
  // Dejamos esta función por compatibilidad pero ya no se usa
  const handlePaymentSuccess = async (transaction: any) => {
    console.log("handlePaymentSuccess called (deprecated):", transaction);
    // El webhook de Wompi actualizará el estado del pago en el backend
    // Solo necesitamos avanzar al paso 4
    onSuccess();
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
      console.log("🔍 SENDING TO BACKEND - Amount:", totalAmount);
      console.log(
        "🔍 SENDING TO BACKEND - Amount in cents:",
        Math.round(totalAmount * 100)
      );

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
      console.log(
        "🔍 Backend returned amount (in cents):",
        widgetResponse.data?.amount
      );
      console.log("🔍 Frontend totalAmount (in COP):", totalAmount);
      console.log(
        "🔍 Frontend totalAmount in cents:",
        Math.round(totalAmount * 100)
      );
      console.log(
        "🔍 Amount match (cents):",
        widgetResponse.data?.amount === Math.round(totalAmount * 100)
      );

      // VERIFICACIÓN CRÍTICA: Asegurar que el backend devolvió el monto correcto
      if (widgetResponse.data?.amount !== Math.round(totalAmount * 100)) {
        console.error("❌ MISMATCH DETECTED!");
        console.error("   Expected (cents):", Math.round(totalAmount * 100));
        console.error("   Received (cents):", widgetResponse.data?.amount);
        console.error("   Expected (COP):", totalAmount);
        console.error("   Received (COP):", widgetResponse.data?.amount / 100);

        // Mostrar alerta visual al usuario
        const expectedCOP = totalAmount;
        const receivedCOP = widgetResponse.data?.amount / 100;

        showError(
          "⚠️ Error de Monto",
          `El backend está devolviendo un monto incorrecto.\n\n` +
            `Monto esperado: $${expectedCOP.toLocaleString("es-CO")} COP\n` +
            `Monto recibido: $${receivedCOP.toLocaleString("es-CO")} COP\n\n` +
            `Por favor contacta al equipo de backend para corregir el endpoint.`
        );

        // NO continuar con el pago si hay un mismatch
        return;
      }

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

      // Guardar la referencia para usarla después
      setPaymentReference(reference);

      console.log("✅ Using backend data:", {
        reference,
        amount,
        currency,
        integrity_signature,
        publicKey,
      });

      // PASO 3: Configurar el widget con los datos EXACTOS del backend
      // NO usar redirectUrl para que el widget use el callback en lugar de redirigir
      const widgetConfig = {
        currency: currency, // ← Usar currency del backend
        amountInCents: amount, // ← Usar amount del backend (ya en centavos)
        reference: reference, // ← Usar reference del backend
        publicKey: publicKey, // ← Usar publicKey del backend
        // NO establecer redirectUrl - dejamos que el callback maneje el resultado
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
      checkout.open(async (result: any) => {
        console.log("🎉 Widget closed with result:", result);
        console.log("🔍 Result structure:", {
          hasResult: !!result,
          hasTransaction: !!(result && result.transaction),
          hasStatus: !!(
            result &&
            result.transaction &&
            result.transaction.status
          ),
          status: result?.transaction?.status,
          fullResult: result,
        });

        // Verificar el estado de la transacción
        if (result && result.transaction) {
          const status = result.transaction.status;
          const transactionId = result.transaction.id;
          console.log("📊 Transaction status:", status);
          console.log("🆔 Transaction ID:", transactionId);

          // Estados posibles de Wompi:
          // - APPROVED: Pago aprobado
          // - DECLINED: Pago rechazado
          // - ERROR: Error en el pago
          // - PENDING: Pago pendiente (para PSE u otros métodos que requieren confirmación)

          if (status === "APPROVED") {
            console.log("✅ Payment approved by Wompi!");
            console.log("🔔 Wompi will send webhook to backend automatically");
            console.log("📧 Backend will send confirmation email via webhook");
            console.log("🆔 Transaction ID:", transactionId);
            console.log("📦 Order ID:", orderId);

            // NO llamar a /payments/process - ese endpoint es para INICIAR pagos
            // El webhook de Wompi enviará el email automáticamente al backend
            // El frontend solo debe avanzar al paso 4 y esperar

            showSuccess(
              "Pago exitoso",
              "Tu pago ha sido aprobado. Recibirás un email de confirmación en breve."
            );

            // Avanzar al paso 4 donde el sistema verificará el estado con reintentos
            // Esto da tiempo al webhook de Wompi para actualizar la orden
            onSuccess();
          } else if (status === "PENDING") {
            console.log("⏳ Payment pending, advancing to step 4...");
            // Para pagos pendientes (como PSE), el webhook confirmará cuando se complete
            onSuccess();
          } else if (status === "DECLINED" || status === "ERROR") {
            console.log("❌ Payment declined/error:", status);
            showError(
              "Pago rechazado",
              "Tu pago fue rechazado. Por favor intenta con otro método de pago."
            );
          } else {
            console.log("❓ Unknown status:", status);
            showError("Error", "Estado de pago desconocido");
          }
        } else {
          // Si no hay resultado, el usuario cerró el widget sin completar el pago
          console.log("⚠️ Widget closed without completing payment");
          // No mostrar error, el usuario solo cerró el widget
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
          <h2
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Método de Pago
          </h2>
          <p
            className="text-sm font-medium text-gray-700 mt-1"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Pagar de forma segura con Wompi
          </p>
        </div>

        <div className="px-6 py-6">
          {/* Información del pedido */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3
              className="text-sm font-medium text-gray-900 mb-2"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              Resumen del Pago
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span
                  className="text-gray-700"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  Número de orden:
                </span>
                <span
                  className="font-medium text-gray-900"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  {orderId}
                </span>
              </div>
              <div className="flex justify-between">
                <span
                  className="text-gray-700"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  Total a pagar:
                </span>
                <span
                  className="font-bold text-lg text-gray-900"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
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
                <h3
                  className="text-sm font-bold text-blue-900"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  Pago Seguro con Wompi
                </h3>
                <p
                  className="text-sm text-blue-800 mt-1"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
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
                  <span
                    className="text-xs font-medium text-blue-700"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
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
              style={{ fontFamily: "var(--font-lato)" }}
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
              <p
                className="text-xs font-medium text-gray-700 mb-2"
                style={{ fontFamily: "var(--font-lato)" }}
              >
                Métodos de pago aceptados:
              </p>
              <div className="flex justify-center space-x-2 flex-wrap gap-2">
                <span
                  className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1.5"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  <CreditCard className="w-3 h-3" />
                  Tarjetas
                </span>
                <span
                  className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1.5"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  <Building2 className="w-3 h-3" />
                  PSE
                </span>
                <span
                  className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1.5"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  <Smartphone className="w-3 h-3" />
                  Nequi
                </span>
                <span
                  className="text-xs bg-gray-100 text-gray-800 font-medium px-3 py-1.5 rounded-md border border-gray-200 flex items-center gap-1.5"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
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
                <h3
                  className="text-sm font-medium text-yellow-800"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  Orden en Proceso
                </h3>
                <p
                  className="text-sm text-yellow-700 mt-1"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
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
