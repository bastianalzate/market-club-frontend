"use client";

import { useEffect, useState } from "react";

interface WompiWidgetProps {
  publicKey: string;
  currency: string;
  amountInCents: number;
  reference: string;
  redirectUrl: string;
  customerEmail?: string;
  customerName?: string;
  customerMobile?: string;
  onSuccess?: (transaction: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    WompiWidget: any;
  }
}

export default function WompiWidget({
  publicKey,
  currency,
  amountInCents,
  reference,
  redirectUrl,
  customerEmail,
  customerName,
  customerMobile,
  onSuccess,
  onError,
  onClose,
}: WompiWidgetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWompiScript = () => {
      return new Promise((resolve, reject) => {
        // Verificar si el script ya está cargado
        if (window.WidgetCheckout) {
          resolve(window.WidgetCheckout);
          return;
        }

        // Crear script element
        const script = document.createElement("script");
        script.src = "https://checkout.wompi.co/widget.js";
        script.async = true;
        script.onload = () => {
          console.log("Wompi script loaded successfully");
          resolve(window.WidgetCheckout);
        };
        script.onerror = (error) => {
          console.error("Error loading Wompi script:", error);
          reject(new Error("Error loading Wompi script"));
        };

        document.head.appendChild(script);
      });
    };

    const initializeWidget = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Starting Wompi widget initialization...");
        console.log("Public key:", publicKey);
        console.log("Currency:", currency);
        console.log("Amount in cents:", amountInCents);
        console.log("Reference:", reference);
        await loadWompiScript();

        console.log("Wompi script loaded, checking widget availability...");
        console.log("window.WidgetCheckout:", window.WidgetCheckout);

        if (!window.WidgetCheckout) {
          throw new Error("Wompi widget not available");
        }

        // Validar datos del cliente
        if (!customerEmail || !customerName) {
          throw new Error("Datos del cliente incompletos");
        }

        console.log("Customer data:", {
          name: customerName,
          email: customerEmail,
          phoneNumber: customerMobile ? customerMobile.replace(/\D/g, "") : "",
          phoneNumberPrefix: "+57"
        });

        // Configurar el widget de Wompi
        const wompiWidget = new window.WidgetCheckout({
          publicKey: publicKey,
          currency: currency,
          amountInCents: amountInCents,
          reference: reference,
          redirectUrl: redirectUrl,
          customerData: {
            name: customerName || "",
            email: customerEmail || "",
            phoneNumber: customerMobile ? customerMobile.replace(/\D/g, "") : "",
            phoneNumberPrefix: "+57",
          },
          onSuccess: (transaction: any) => {
            console.log("Wompi payment success:", transaction);
            if (onSuccess) {
              onSuccess(transaction);
            }
          },
          onError: (error: any) => {
            console.error("Wompi payment error:", error);
            setError(error.message || "Error en el pago");
            if (onError) {
              onError(error);
            }
          },
          onExit: () => {
            console.log("Wompi widget closed");
            if (onClose) {
              onClose();
            }
          },
        });

        // Mostrar el widget
        wompiWidget.open();
      } catch (error) {
        console.error("Error initializing Wompi widget:", error);
        console.error("Error details:", {
          message: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          windowWidgetCheckout: window.WidgetCheckout,
          publicKey: publicKey,
          currency: currency,
          amountInCents: amountInCents,
          reference: reference
        });
        setError(
          error instanceof Error
            ? error.message
            : "Error al cargar el widget de pago"
        );
      } finally {
        setIsLoading(false);
      }
    };

    initializeWidget();
  }, [
    publicKey,
    currency,
    amountInCents,
    reference,
    redirectUrl,
    customerEmail,
    customerName,
    customerMobile,
    onSuccess,
    onError,
    onClose,
  ]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cargando Widget de Pago
            </h3>
            <p className="text-gray-600">
              Por favor espera mientras se carga el sistema de pago seguro...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6 text-red-600"
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error al Cargar el Pago
            </h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // El widget de Wompi se renderiza automáticamente
  return null;
}
