"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { PaymentService } from "@/services/paymentService";
import { WOMPI_CONFIG } from "@/config/wompi";
import Toast from "@/components/shared/Toast";
import { Shield, CreditCard, Building2, Smartphone, Banknote } from "lucide-react";

interface SubscriptionPaymentFlowProps {
  planId: string;
  planName: string;
  totalAmount: number;
  customerEmail?: string;
  customerName?: string;
  customerMobile?: string;
  onSuccess: (transaction: any) => void;
  onError: (error: any) => void;
  onClose: () => void;
}

export default function SubscriptionPaymentFlow({
  planId,
  planName,
  totalAmount,
  customerEmail,
  customerName,
  customerMobile,
  onSuccess,
  onError,
  onClose,
}: SubscriptionPaymentFlowProps) {
  const router = useRouter();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [wompiScriptLoaded, setWompiScriptLoaded] = useState(false);
  const [showWompiWidget, setShowWompiWidget] = useState(false);

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
      console.log("🚀 Starting subscription payment process...");
      setIsLoading(true);

      // Verificar que Wompi esté cargado
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

      // Abrir Widget de Wompi (mismo flujo que checkout)
      await openWompiWidget();
    } catch (error) {
      console.error("❌ Error opening Wompi checkout:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      showError("Error", "No se pudo inicializar el pago: " + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (transaction: any) => {
    try {
      console.log("Payment success transaction:", transaction);
      
      // Procesar la suscripción usando el servicio de pagos
      const result = await PaymentService.processSubscriptionPayment(
        planId,
        transaction.transaction?.id || transaction.id,
        transaction.reference || `SUBSCRIPTION_${planId}_${Date.now()}`,
        totalAmount
      );

      if (result.success) {
        showSuccess("¡Suscripción activada!", "Tu suscripción ha sido activada correctamente");
        setShowWompiWidget(false);
        onSuccess(transaction);
      } else {
        throw new Error(result.message || "Error al procesar la suscripción");
      }
    } catch (error) {
      console.error("Error processing subscription:", error);
      showError("Error", error instanceof Error ? error.message : "Error al procesar la suscripción");
    }
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error);
    showError(
      "Error en el pago",
      error.message || "No se pudo procesar el pago"
    );
    onError(error);
  };

  const handleCloseWidget = () => {
    setShowWompiWidget(false);
    onClose();
  };

  // Función para abrir el Widget de Wompi con firma de integridad (IGUAL QUE CHECKOUT)
  const openWompiWidget = async () => {
    try {
      console.log("🎯 Opening Wompi Widget for subscription:", planId);

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

      // PASO 1: Generar la firma de integridad desde el backend
      const signatureData = {
        plan_id: planId,
        amount: totalAmount,
        type: 'subscription'
      };

      console.log("🔐 Signature data for subscription:", signatureData);
      console.log("🔍 Plan ID type:", typeof planId, "Value:", planId);
      console.log("🔍 Plan ID is empty or undefined:", !planId || planId === '');

      const signatureResponse = await PaymentService.generateSubscriptionSignature(signatureData);

      console.log("🔍 Full signature response:", signatureResponse);

      if (!signatureResponse.success || !signatureResponse.data?.signature) {
        console.error("❌ Signature response validation failed:", {
          success: signatureResponse.success,
          hasData: !!signatureResponse.data,
          hasSignature: !!signatureResponse.data?.signature,
          fullResponse: signatureResponse,
        });
        throw new Error("No se pudo generar la firma de integridad");
      }

      // PASO 2: Usar EXACTAMENTE los datos que devuelve el backend
      const { reference, amount, currency, signature, public_key } =
        signatureResponse.data;

      console.log("✅ Using backend data:", {
        reference,
        amount,
        currency,
        signature,
        public_key,
      });

      // PASO 3: Configurar el widget con los datos EXACTOS del backend
      const widgetConfig = {
        currency: currency,
        amountInCents: amount,
        reference: reference,
        publicKey: public_key,
        redirectUrl: WOMPI_CONFIG.getSubscriptionRedirectUrl(planId),
        signature: signature,
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

      // PASO 4: Crear y abrir el widget
      console.log("🔧 Creating WidgetCheckout instance...");

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
          <h2 
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Suscripción a {planName}
          </h2>
          <p 
            className="text-sm font-medium text-gray-700 mt-1"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Pagar de forma segura con Wompi
          </p>
        </div>

        <div className="px-6 py-6">
          {/* Información de la suscripción */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 
              className="text-sm font-medium text-gray-900 mb-2"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              Resumen de la Suscripción
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Plan:</span>
                <span className="font-medium text-gray-900">{planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Precio mensual:</span>
                <span className="font-bold text-lg text-gray-900">
                  ${totalAmount.toLocaleString()} COP
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Periodo:</span>
                <span className="font-medium text-gray-900">Mensual</span>
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
                  <span className="text-xs font-medium text-blue-700">
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
              disabled={isLoading || showWompiWidget || !wompiScriptLoaded}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              {!wompiScriptLoaded ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cargando Wompi...
                </>
              ) : isLoading ? (
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
                  Suscripción Mensual
                </h3>
                <p 
                  className="text-sm text-yellow-700 mt-1"
                  style={{ fontFamily: "var(--font-lato)" }}
                >
                  Tu suscripción se renovará automáticamente cada mes. Puedes cancelar en cualquier momento desde tu perfil.
                </p>
              </div>
            </div>
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
    </>
  );
}
