"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/hooks/useCheckout";
import { useCartContext } from "@/contexts/CartContext";
import { ShippingAddress } from "@/types/checkout";
import CheckoutSummary from "./CheckoutSummary";
import ShippingAddressForm from "./ShippingAddressForm";
import PaymentStep from "./PaymentStep";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/shared/Toast";

export default function CheckoutFlow() {
  const router = useRouter();
  const { cart, itemsCount } = useCartContext();
  const { checkoutState, createOrder, setCurrentStep, resetCheckout } =
    useCheckout();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [currentStep, setCurrentStepLocal] = useState(1);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (itemsCount === 0) {
      router.push("/tienda");
    }
  }, [itemsCount, router]);

  const handleStepChange = (step: number) => {
    setCurrentStepLocal(step);
    setCurrentStep(step);
    setServerError(null); // Limpiar error al cambiar de paso
  };

  const handleShippingNext = async (address: ShippingAddress) => {
    try {
      setShippingAddress(address);
      const orderResponse = await createOrder(address, null, "");

      if (orderResponse.success) {
        showSuccess("Orden creada", "Tu orden ha sido creada exitosamente");
        handleStepChange(3); // Move to payment step
      }
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";

      // Manejar errores específicos del backend
      if (errorMessage.includes("generateOrderNumber")) {
        setServerError(
          "Hay un problema temporal en el servidor. Por favor intenta de nuevo en unos minutos."
        );
        showError(
          "Error del servidor",
          "Hay un problema temporal en el servidor. Por favor intenta de nuevo en unos minutos."
        );
      } else if (errorMessage.includes("user_id")) {
        setServerError(
          "Hay un problema con tu sesión. Por favor inicia sesión nuevamente."
        );
        showError(
          "Error de autenticación",
          "Hay un problema con tu sesión. Por favor inicia sesión nuevamente."
        );
      } else {
        setServerError(errorMessage || "No se pudo crear la orden");
        showError("Error", errorMessage || "No se pudo crear la orden");
      }
    }
  };

  const handlePaymentSuccess = () => {
    showSuccess("Pago exitoso", "Tu pago ha sido procesado exitosamente");
    handleStepChange(4); // Move to success step
  };

  const handleCompleteOrder = () => {
    resetCheckout();
    router.push("/");
  };

  if (itemsCount === 0) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Completa tu pedido de forma segura
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: "Resumen", icon: "📋" },
              { step: 2, title: "Dirección", icon: "📍" },
              { step: 3, title: "Pago", icon: "💳" },
              { step: 4, title: "Confirmación", icon: "✅" },
            ].map(({ step, title, icon }) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step
                      ? "bg-yellow-600 border-yellow-600 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {currentStep > step ? "✓" : icon}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {title}
                </span>
                {step < 4 && (
                  <div
                    className={`w-8 h-0.5 ml-4 ${
                      currentStep > step ? "bg-yellow-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <CheckoutSummary onContinue={() => handleStepChange(2)} />
            )}

            {currentStep === 2 && (
              <>
                {serverError && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-red-800">
                          Error del servidor
                        </h3>
                        <p className="mt-1 text-sm text-red-700">
                          {serverError}
                        </p>
                        <div className="mt-3">
                          <button
                            onClick={() => setServerError(null)}
                            className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                          >
                            Reintentar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <ShippingAddressForm
                  onNext={handleShippingNext}
                  onBack={() => handleStepChange(1)}
                />
              </>
            )}

            {currentStep === 3 && (
              <div>
                {/* Debug info */}
                <div className="mb-4 p-3 bg-gray-100 rounded-lg text-sm">
                  <p>
                    <strong>Debug Info:</strong>
                  </p>
                  <p>Current Step: {currentStep}</p>
                  <p>
                    Checkout State Order ID:{" "}
                    {checkoutState.orderId || "No order ID"}
                  </p>
                  <p>Cart exists: {cart ? "Yes" : "No"}</p>
                  <p>Cart items count: {cart?.items?.length || 0}</p>
                </div>

                {checkoutState.orderId && cart ? (
                  <PaymentStep
                    orderId={checkoutState.orderId}
                    totalAmount={parseFloat(String(cart.total_amount))}
                    customerEmail={
                      shippingAddress?.phone ? undefined : undefined
                    } // Se puede obtener del usuario logueado
                    customerName={
                      shippingAddress
                        ? `${shippingAddress.first_name} ${shippingAddress.last_name}`
                        : undefined
                    }
                    customerMobile={shippingAddress?.phone}
                    onBack={() => handleStepChange(2)}
                    onSuccess={handlePaymentSuccess}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Error al crear la orden
                      </h3>
                      <p className="text-gray-600 mb-4">
                        No se pudo crear la orden. Por favor intenta de nuevo.
                      </p>
                      <button
                        onClick={() => handleStepChange(2)}
                        className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                      >
                        Volver a Dirección
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
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

                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    ¡Pedido Completado!
                  </h2>

                  <p className="text-gray-600 mb-6">
                    Tu pedido ha sido procesado exitosamente. Recibirás un email
                    de confirmación pronto.
                  </p>

                  {checkoutState.orderId && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-600">
                        <strong>Número de orden:</strong>{" "}
                        {checkoutState.orderId}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleCompleteOrder}
                    className="bg-yellow-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                  >
                    Continuar Comprando
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          {currentStep < 4 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Resumen del Pedido
                </h3>

                {cart && (
                  <>
                    <div className="space-y-3 mb-4">
                      {cart.items?.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-3"
                        >
                          <img
                            src={
                              item.product.image_url ||
                              item.product.image ||
                              "/images/cervezas/bottella-01.png"
                            }
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {item.product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Cantidad: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            $
                            {parseFloat(
                              String(item.total_price)
                            ).toLocaleString()}
                          </p>
                        </div>
                      ))}

                      {cart.items && cart.items.length > 3 && (
                        <p className="text-sm text-gray-500 text-center">
                          +{cart.items.length - 3} productos más
                        </p>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-medium">
                          ${parseFloat(String(cart.subtotal)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Envío:</span>
                        <span className="font-medium">
                          $
                          {parseFloat(
                            String(cart.shipping_amount)
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                        <span>Total:</span>
                        <span>
                          $
                          {parseFloat(
                            String(cart.total_amount)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
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
    </div>
  );
}
