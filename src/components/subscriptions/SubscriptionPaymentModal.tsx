"use client";

import { useState, FormEvent } from "react";
import { X, CreditCard, Lock, Check } from "lucide-react";
import {
  tokenizeCard,
  validateCardNumber,
  validateExpirationDate,
  validateCVC,
  formatCardNumber,
  getLastFourDigits,
  getCardType,
} from "@/services/wompiService";
import { subscribeToPlan, type SubscribeWithPaymentData } from "@/services/subscriptionsService";

interface SubscriptionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    id: string;
    name: string;
    price: string;
    description?: string;
  };
  onSuccess?: () => void;
}

export default function SubscriptionPaymentModal({
  isOpen,
  onClose,
  plan,
  onSuccess,
}: SubscriptionPaymentModalProps) {
  const [step, setStep] = useState<"payment" | "processing" | "success" | "error">("payment");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Datos de la tarjeta
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [autoRenew, setAutoRenew] = useState(true);
  
  // Errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const resetForm = () => {
    setCardNumber("");
    setCardHolder("");
    setExpMonth("");
    setExpYear("");
    setCvc("");
    setAutoRenew(true);
    setErrors({});
    setError(null);
    setStep("payment");
  };

  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!cardNumber) {
      newErrors.cardNumber = "Ingresa el número de tarjeta";
    } else {
      const cleanNumber = cardNumber.replace(/\s/g, "");
      if (cleanNumber.length !== 16) {
        newErrors.cardNumber = "El número de tarjeta debe tener 16 dígitos";
      } else if (!validateCardNumber(cardNumber)) {
        newErrors.cardNumber = "Número de tarjeta inválido";
      }
    }

    if (!cardHolder || cardHolder.trim().length < 3) {
      newErrors.cardHolder = "Ingresa el nombre del titular";
    }

    if (!expMonth || !expYear) {
      newErrors.expiration = "Ingresa la fecha de vencimiento";
    } else if (!validateExpirationDate(expMonth, expYear)) {
      newErrors.expiration = "Fecha de vencimiento inválida o vencida";
    }

    if (!cvc) {
      newErrors.cvc = "Ingresa el CVC";
    } else if (!validateCVC(cvc)) {
      newErrors.cvc = "CVC inválido (3 o 4 dígitos)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setStep("processing");

    try {
       // 1. Tokenizar tarjeta con Wompi
       console.log("🔐 Tokenizando tarjeta...");
       
       // Limpiar número de tarjeta (remover espacios)
       const cleanCardNumber = cardNumber.replace(/\s/g, "");
       
       // Wompi requiere año en formato de 2 dígitos
       const yearForWompi = expYear.length === 4 ? expYear.slice(-2) : expYear;
       
       const tokenResult = await tokenizeCard({
         number: cleanCardNumber,
         cvc: cvc,
         exp_month: expMonth.padStart(2, "0"),
         exp_year: yearForWompi,
         card_holder: cardHolder.trim(),
       });

      if (!tokenResult.success || !tokenResult.data?.id) {
        throw new Error(tokenResult.error || "No se pudo tokenizar la tarjeta");
      }

      console.log("✅ Token creado:", tokenResult.data.id.substring(0, 20) + "...");

      // 2. Suscribirse con el token
      console.log("📝 Creando suscripción...");
      const subscriptionData: SubscribeWithPaymentData = {
        plan_id: plan.id,
        payment_token: tokenResult.data.id,
        payment_method_type: "CARD",
        last_four_digits: getLastFourDigits(cardNumber),
        auto_renew: autoRenew,
        duration_months: 1,
      };

      const subscriptionResult = await subscribeToPlan(subscriptionData);

      if (!subscriptionResult.success) {
        throw new Error(subscriptionResult.message || "No se pudo crear la suscripción");
      }

      console.log("✅ Suscripción creada exitosamente");
      setStep("success");

      // Llamar callback de éxito después de 2 segundos
      setTimeout(() => {
        onSuccess?.();
        handleClose();
      }, 2000);

    } catch (err: any) {
      console.error("❌ Error en suscripción:", err);
      setError(err.message || "Ocurrió un error al procesar tu suscripción");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    if (formatted.replace(/\s/g, "").length <= 19) {
      setCardNumber(formatted);
      if (errors.cardNumber) {
        setErrors({ ...errors, cardNumber: "" });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative p-6 border-b">
          <button
            onClick={handleClose}
            disabled={loading}
            aria-label="Cerrar modal"
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">
            {step === "payment" && "Completa tu suscripción"}
            {step === "processing" && "Procesando pago..."}
            {step === "success" && "¡Suscripción exitosa!"}
            {step === "error" && "Error en el pago"}
          </h2>
          <p className="text-gray-600 mt-1">
            {step === "payment" && `Plan: ${plan.name}`}
            {step === "processing" && "Espera un momento..."}
            {step === "success" && "¡Bienvenido a Market Club!"}
            {step === "error" && "No se pudo procesar el pago"}
          </p>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Paso 1: Formulario de pago */}
          {step === "payment" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Resumen del plan */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Plan seleccionado</p>
                    <p className="font-semibold text-gray-900">{plan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">${plan.price}</p>
                    <p className="text-sm text-gray-600">/ mes</p>
                  </div>
                </div>
              </div>

              {/* Número de tarjeta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => handleCardNumberChange(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                   className={`w-full px-4 py-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                     errors.cardNumber ? "border-red-500" : "border-gray-300"
                   }`}
                  disabled={loading}
                />
                {cardNumber && (
                  <p className="text-xs text-gray-500 mt-1">
                    {getCardType(cardNumber)}
                  </p>
                )}
                {errors.cardNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
                )}
              </div>

              {/* Titular */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titular de la Tarjeta
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => {
                    setCardHolder(e.target.value.toUpperCase());
                    if (errors.cardHolder) setErrors({ ...errors, cardHolder: "" });
                  }}
                  placeholder="NOMBRE APELLIDO"
                   className={`w-full px-4 py-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                     errors.cardHolder ? "border-red-500" : "border-gray-300"
                   }`}
                  disabled={loading}
                />
                {errors.cardHolder && (
                  <p className="text-xs text-red-500 mt-1">{errors.cardHolder}</p>
                )}
              </div>

              {/* Expiración y CVC */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mes
                  </label>
                  <input
                    type="text"
                    value={expMonth}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 2 && (val === "" || parseInt(val) <= 12)) {
                        setExpMonth(val);
                        if (errors.expiration) setErrors({ ...errors, expiration: "" });
                      }
                    }}
                    placeholder="MM"
                    maxLength={2}
                    className={`w-full px-3 py-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.expiration ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año
                  </label>
                  <input
                    type="text"
                    value={expYear}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 2) {
                        setExpYear(val);
                        if (errors.expiration) setErrors({ ...errors, expiration: "" });
                      }
                    }}
                    placeholder="YY"
                    maxLength={2}
                    className={`w-full px-3 py-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.expiration ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      if (val.length <= 4) {
                        setCvc(val);
                        if (errors.cvc) setErrors({ ...errors, cvc: "" });
                      }
                    }}
                    placeholder="123"
                    maxLength={4}
                     className={`w-full px-3 py-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                       errors.cvc ? "border-red-500" : "border-gray-300"
                     }`}
                    disabled={loading}
                  />
                </div>
              </div>
              {errors.expiration && (
                <p className="text-xs text-red-500 -mt-2">{errors.expiration}</p>
              )}
              {errors.cvc && (
                <p className="text-xs text-red-500 -mt-2">{errors.cvc}</p>
              )}

              {/* Auto-renovación */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRenew}
                    onChange={(e) => setAutoRenew(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={loading}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Activar renovación automática
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Tu suscripción se renovará automáticamente cada mes. Puedes cancelar en cualquier momento.
                    </p>
                  </div>
                </label>
              </div>

              {/* Seguridad */}
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Pago seguro encriptado con Wompi</span>
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Procesando..." : `Suscribirse por $${plan.price}/mes`}
              </button>
            </form>
          )}

          {/* Paso 2: Procesando */}
          {step === "processing" && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Procesando tu pago de forma segura...</p>
              <p className="text-sm text-gray-500 mt-2">Esto tomará solo unos segundos</p>
            </div>
          )}

          {/* Paso 3: Éxito */}
          {step === "success" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ¡Suscripción exitosa!
              </h3>
              <p className="text-gray-600 mb-4">
                Ya formas parte del {plan.name}
              </p>
              <p className="text-sm text-gray-500">
                Recibirás un email de confirmación pronto
              </p>
            </div>
          )}

          {/* Paso 4: Error */}
          {step === "error" && (
            <div className="py-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button
                onClick={() => setStep("payment")}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

