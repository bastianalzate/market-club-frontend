"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import Link from "next/link";

export default function CheckoutFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const reason = searchParams.get("reason") || "unknown";
    const reference = searchParams.get("reference");

    // Mostrar mensaje de error específico
    switch (reason) {
      case "declined":
        showError(
          "Pago rechazado",
          "Tu pago fue rechazado. Por favor, intenta con otro método de pago."
        );
        break;
      case "cancelled":
        showError("Pago cancelado", "Has cancelado el proceso de pago.");
        break;
      case "timeout":
        showError(
          "Tiempo agotado",
          "El tiempo para completar el pago ha expirado."
        );
        break;
      default:
        showError(
          "Pago fallido",
          "No se pudo procesar tu pago. Por favor, intenta nuevamente."
        );
    }

    setIsLoading(false);
  }, [searchParams, showError]);

  const handleRetryPayment = () => {
    router.push("/checkout");
  };

  const handleGoHome = () => {
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icono de error */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Pago No Procesado
        </h1>

        {/* Mensaje */}
        <p className="text-gray-600 mb-6">
          No pudimos procesar tu pago. Esto puede deberse a:
        </p>

        <ul className="text-left text-sm text-gray-600 mb-8 space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
            Fondos insuficientes
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
            Datos de la tarjeta incorrectos
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
            Método de pago no disponible
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
            Cancelación del proceso
          </li>
        </ul>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            className="w-full bg-[#B58E31] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#A07D2A] transition-colors"
          >
            Intentar Pago Nuevamente
          </button>

          <button
            onClick={handleGoHome}
            className="w-full bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>

        {/* Información de contacto */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">¿Necesitas ayuda?</p>
          <Link
            href="/contacto"
            className="text-[#B58E31] hover:underline text-sm font-medium"
          >
            Contáctanos
          </Link>
        </div>
      </div>
    </div>
  );
}

