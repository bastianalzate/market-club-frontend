"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import { WOMPI_CONFIG } from "@/config/wompi";
import { constants } from "@/config/constants";
import { getAuthHeaders } from "@/config/api";
import { PaymentService } from "@/services/paymentService";
import { ShippingAddress } from "@/types/checkout";

interface SubscriptionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  durationMonths: number;
  totalAmount: number;
  customerEmail: string;
  customerName?: string;
  customerMobile?: string;
  onSuccess: (transactionId: string, reference: string) => void;
}

export default function SubscriptionPaymentModal({
  isOpen,
  onClose,
  planId,
  durationMonths,
  totalAmount,
  customerEmail,
  customerName,
  customerMobile,
  onSuccess,
}: SubscriptionPaymentModalProps) {
  // Estados del flujo de 3 pasos (igual que checkout)
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [wompiScriptLoaded, setWompiScriptLoaded] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string | null>(null);
  const [formData, setFormData] = useState<ShippingAddress>({
    first_name: customerName?.split(' ')[0] || "",
    last_name: customerName?.split(' ').slice(1).join(' ') || "",
    email: customerEmail || "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Colombia",
    phone: customerMobile || "",
  });
  const { showToast } = useToast();

  // Cargar y verificar el script de Wompi
  useEffect(() => {
    const loadWompiScript = () => {
      return new Promise((resolve, reject) => {
        // Verificar si el script ya está cargado
        if (typeof (window as any).WidgetCheckout !== "undefined") {
          console.log("✅ Wompi script already loaded");
          setWompiScriptLoaded(true);
          resolve((window as any).WidgetCheckout);
          return;
        }

        // Crear script element
        const script = document.createElement("script");
        script.src = WOMPI_CONFIG.WIDGET_URL;
        script.async = true;
        script.onload = () => {
          console.log("✅ Wompi script loaded successfully");
          setWompiScriptLoaded(true);
          resolve((window as any).WidgetCheckout);
        };
        script.onerror = (error) => {
          console.error("❌ Error loading Wompi script:", error);
          reject(new Error("Error loading Wompi script"));
        };

        document.head.appendChild(script);
      });
    };

    const checkWompiScript = async () => {
      try {
        await loadWompiScript();
      } catch (error) {
        console.error("❌ Failed to load Wompi script:", error);
        // Reintentar después de un delay
        setTimeout(checkWompiScript, 2000);
      }
    };

    checkWompiScript();
  }, []);

  // Limpiar estado cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      setError(null);
      setShippingAddress(null);
      setPaymentReference(null);
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Paso 1: Continuar al paso 2 (dirección)
  const handleStep1Continue = () => {
    setCurrentStep(2);
  };

  // Paso 2: Validar dirección y continuar al paso 3 (pago)
  const handleStep2Continue = () => {
    // Validar formulario igual que en checkout
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.address_line_1 ||
      !formData.city ||
      !formData.state ||
      !formData.phone
    ) {
      setError("Por favor completa todos los campos obligatorios incluyendo el email y teléfono");
      return;
    }

    // Guardar dirección y continuar al paso de pago
    setShippingAddress(formData);
    setCurrentStep(3);
    setError(null);
  };

  // Paso 3: Iniciar pago con Wompi (EXACTAMENTE igual que checkout)
  const handleStartPayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("🚀 Starting subscription payment process...");

      // Crear referencia única para la suscripción
      const subscriptionReference = `SUBS_${planId}_${Date.now()}`;
      console.log("📦 Subscription reference:", subscriptionReference);
      console.log("💰 Total amount:", totalAmount);

      // Verificar que Wompi esté cargado
      if (typeof (window as any).WidgetCheckout === "undefined") {
        console.error("❌ WidgetCheckout not available");
        showToast("Widget de Wompi no está disponible. Por favor, recarga la página.", "error");
        return;
      }

      console.log("✅ Wompi ready, generating signature...");

      // PASO 1: Crear sesión de pago para suscripción (endpoint específico)
      const signatureData = {
        plan_id: planId,
        duration_months: durationMonths,
        redirect_url: WOMPI_CONFIG.getSubscriptionRedirectUrl(),
      };

      console.log("🔐 Subscription payment session data:", signatureData);

      const signatureResponse = await PaymentService.generateSubscriptionSignature(signatureData);

      console.log("🔍 Full signature response:", signatureResponse);

      if (!signatureResponse.success || !signatureResponse.data?.widget_data) {
        console.error("❌ Signature response validation failed:", {
          success: signatureResponse.success,
          hasData: !!signatureResponse.data,
          hasWidgetData: !!signatureResponse.data?.widget_data,
          fullResponse: signatureResponse,
        });
        throw new Error("No se pudo crear la sesión de pago");
      }

      // PASO 2: Usar EXACTAMENTE los datos que devuelve el backend (igual que checkout)
      const widgetData = signatureResponse.data.widget_data;
      console.log("🔍 Raw widget data from backend:", widgetData);
      
      const { reference, amount, currency, signature, public_key } = widgetData;

      // Guardar la referencia para usar en la confirmación
      setPaymentReference(reference);
      
      // También guardar en una variable local para usar inmediatamente
      const currentPaymentReference = reference;

      console.log("✅ Using backend data:", {
        reference,
        amount,
        currency,
        signature,
        public_key,
      });
      


      // PASO 3: Configurar el widget con los datos EXACTOS del backend (igual que checkout)
      const widgetConfig = {
        currency: currency,
        amountInCents: amount, // Ya en centavos desde el backend
        reference: reference,
        publicKey: public_key, // Usar public_key del backend
        redirectUrl: WOMPI_CONFIG.getSubscriptionRedirectUrl(),
        signature: signature, // Usar signature del backend (formato {integrity: 'firma'})
        customerData: {
          email: formData.email?.trim() || "usuario@ejemplo.com",
          fullName: `${formData.first_name} ${formData.last_name}`.trim() || "Usuario",
          phoneNumber: formData.phone?.replace(/\D/g, "") || "3001234567",
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

      // PASO 4: Crear y abrir el widget (igual que checkout)
      console.log("🔧 Creating WidgetCheckout instance...");

      // Verificar que el script esté completamente cargado
      if (typeof (window as any).WidgetCheckout === "undefined") {
        throw new Error("WidgetCheckout no está disponible. Asegúrate de que el script de Wompi esté cargado.");
      }

      console.log("✅ WidgetCheckout constructor available:", typeof (window as any).WidgetCheckout);
      console.log("✅ Window.WidgetCheckout:", (window as any).WidgetCheckout);
      
      // Verificar que no haya errores en el script de Wompi
      if ((window as any).WompiError) {
        console.error("❌ Wompi script has errors:", (window as any).WompiError);
        throw new Error("Error en el script de Wompi");
      }

      // Verificar que el script esté completamente inicializado
      if (typeof (window as any).WidgetCheckout !== "function") {
        console.error("❌ WidgetCheckout is not a function:", typeof (window as any).WidgetCheckout);
        throw new Error("WidgetCheckout no está inicializado correctamente");
      }

      // Esperar un poco más para asegurar que el script esté completamente cargado
      await new Promise(resolve => setTimeout(resolve, 100));

      let checkout;
      try {
        
        checkout = new (window as any).WidgetCheckout(widgetConfig);
        console.log("✅ WidgetCheckout instance created:", checkout);
      } catch (widgetError) {
        console.error("❌ Error creating WidgetCheckout:", widgetError);
        console.error("❌ Widget config that failed:", widgetConfig);
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
          handlePaymentSuccess(result, currentPaymentReference);
        } else {
          console.error("❌ Invalid transaction result:", result);
          showToast("No se pudo procesar el pago", "error");
        }
      });
      console.log("✅ Widget.open() called successfully");

    } catch (error) {
      console.error("❌ Error opening Wompi widget:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      setError(errorMessage);
      showToast("No se pudo abrir el widget de pago: " + errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar éxito del pago
  const handlePaymentSuccess = async (transaction: any, reference?: string) => {
    try {
      console.log("Pago exitoso:", transaction);
      console.log("Reference guardada:", paymentReference);
      console.log("Reference pasada como parámetro:", reference);
      
      // Usar la referencia pasada como parámetro o la del estado
      const paymentRef = reference || paymentReference;
      
      if (!paymentRef) {
        throw new Error("No se encontró la referencia de pago");
      }
      
      // Confirmar suscripción en el backend
      const confirmResponse = await fetch(`${constants.api_url}/subscriptions/confirm-subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          reference: paymentRef, // Usar la referencia disponible
          transaction_id: transaction.transaction.id,
          plan_id: planId,
          duration_months: durationMonths,
        }),
      });

      const confirmData = await confirmResponse.json();

      if (!confirmData.success) {
        throw new Error(confirmData.message || "Error al confirmar la suscripción");
      }

      // Llamar callback de éxito
      onSuccess(transaction.transaction.id, paymentRef);
      
      // Cerrar modal
      onClose();

    } catch (error) {
      console.error("Error confirming subscription:", error);
      const errorMessage = error instanceof Error ? error.message : "Error al confirmar la suscripción";
      setError(errorMessage);
      showToast(errorMessage, "error");
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Suscripción a Plan {planId}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" title="Cerrar modal">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps (igual que checkout) */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: "Resumen", icon: "📋" },
              { step: 2, title: "Dirección", icon: "📍" },
              { step: 3, title: "Pago", icon: "💳" },
            ].map(({ step, title, icon }) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    currentStep >= step
                      ? "bg-yellow-600 border-yellow-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  <span className="text-lg">{icon}</span>
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {title}
                </span>
                {step < 3 && (
                  <div
                    className={`w-8 h-0.5 ml-4 transition-colors duration-200 ${
                      currentStep > step ? "bg-yellow-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="p-6">
          {/* PASO 1: Resumen del Plan */}
          {currentStep === 1 && (
            <div className="text-center">
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Resumen de tu Suscripción</h3>
                <div className="space-y-3 text-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold">{planId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duración:</span>
                    <span className="font-semibold">{durationMonths} mes{durationMonths > 1 ? 'es' : ''}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold border-t pt-3">
                    <span>Total:</span>
                    <span className="text-green-600">
                      ${(totalAmount || 0).toLocaleString()} COP
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleStep1Continue}
                className="bg-yellow-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
              >
                Continuar
              </button>
            </div>
          )}

          {/* PASO 2: Formulario de Dirección (igual que checkout) */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Dirección de Envío
                </h3>
                <p className="text-sm text-gray-600">
                  Ingresa la dirección donde quieres recibir tu suscripción
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Ingresa tu nombre"
                    required
                  />
                </div>

                {/* Apellido */}
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Ingresa tu apellido"
                    required
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                {/* Dirección Principal */}
                <div className="md:col-span-2">
                  <label htmlFor="address_line_1" className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Principal *
                  </label>
                  <input
                    type="text"
                    id="address_line_1"
                    name="address_line_1"
                    value={formData.address_line_1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Calle, carrera, avenida, etc."
                    required
                  />
                </div>

                {/* Dirección Secundaria */}
                <div className="md:col-span-2">
                  <label htmlFor="address_line_2" className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección Secundaria (Opcional)
                  </label>
                  <input
                    type="text"
                    id="address_line_2"
                    name="address_line_2"
                    value={formData.address_line_2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Apartamento, casa, piso, etc."
                  />
                </div>

                {/* Ciudad */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Ingresa tu ciudad"
                    required
                  />
                </div>

                {/* Departamento */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento *
                  </label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecciona un departamento</option>
                    <option value="Antioquia">Antioquia</option>
                    <option value="Atlántico">Atlántico</option>
                    <option value="Bogotá D.C.">Bogotá D.C.</option>
                    <option value="Bolívar">Bolívar</option>
                    <option value="Boyacá">Boyacá</option>
                    <option value="Caldas">Caldas</option>
                    <option value="Caquetá">Caquetá</option>
                    <option value="Cauca">Cauca</option>
                    <option value="Cesar">Cesar</option>
                    <option value="Córdoba">Córdoba</option>
                    <option value="Cundinamarca">Cundinamarca</option>
                    <option value="Huila">Huila</option>
                    <option value="La Guajira">La Guajira</option>
                    <option value="Magdalena">Magdalena</option>
                    <option value="Meta">Meta</option>
                    <option value="Nariño">Nariño</option>
                    <option value="Norte de Santander">Norte de Santander</option>
                    <option value="Quindío">Quindío</option>
                    <option value="Risaralda">Risaralda</option>
                    <option value="Santander">Santander</option>
                    <option value="Sucre">Sucre</option>
                    <option value="Tolima">Tolima</option>
                    <option value="Valle del Cauca">Valle del Cauca</option>
                  </select>
                </div>

                {/* Código Postal */}
                <div>
                  <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal
                  </label>
                  <input
                    type="text"
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="110111"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="+57 300 123 4567"
                    required
                  />
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Botones */}
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={handleStep2Continue}
                  className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Continuar al Pago
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: Resumen Final y Pago (igual que checkout) */}
          {currentStep === 3 && (
            <div>
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Resumen Final</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-semibold">{planId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duración:</span>
                    <span className="font-semibold">{durationMonths} mes{durationMonths > 1 ? 'es' : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cliente:</span>
                    <span className="font-semibold">{shippingAddress?.first_name} {shippingAddress?.last_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold">{shippingAddress?.email}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold border-t pt-3">
                    <span>Total a Pagar:</span>
                    <span className="text-green-600">
                      ${(totalAmount || 0).toLocaleString()} COP
                    </span>
                  </div>
                </div>
              </div>

              {/* Estado de Wompi */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-bold text-blue-900">Pago Seguro con Wompi</h3>
                    <p className="text-sm text-blue-800 mt-1">
                      Wompi es la plataforma de pagos más segura de Colombia. Al hacer clic en "Pagar con Wompi" podrás elegir entre tarjetas de crédito/débito, PSE, Nequi, Daviplata y más métodos de pago.
                    </p>
                    <div className="mt-2 flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${wompiScriptLoaded ? "bg-green-500" : "bg-yellow-500"}`}></div>
                      <span className="text-xs font-medium text-blue-700">
                        {wompiScriptLoaded ? "Wompi listo" : "Cargando Wompi..."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Botones */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Atrás
                </button>
                
                <button
                  onClick={handleStartPayment}
                  disabled={isLoading || !wompiScriptLoaded}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {!wompiScriptLoaded ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Cargando Wompi...
                    </div>
                  ) : isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Inicializando pago...
                    </div>
                  ) : (
                    "Pagar con Wompi"
                  )}
                </button>
              </div>

              {/* Footer de seguridad */}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500 flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  🔒 Pago 100% seguro con Wompi
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Aceptamos tarjetas, PSE, Nequi y más
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}