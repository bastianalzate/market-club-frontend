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
import { constants } from "@/config/constants";

export default function CheckoutFlow() {
  const router = useRouter();
  const { cart, itemsCount, loadCart } = useCartContext();
  const { checkoutState, createOrder, setCurrentStep, resetCheckout } =
    useCheckout();
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Helper function para formatear precios
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  // Helper function para obtener la URL de imagen del producto
  const getProductImageUrl = (product: any, item?: any): string => {
    // Si es un regalo, usar imagen de regalo
    if (item?.is_gift || item?.gift_data) {
      return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSI4IiBmaWxsPSIjQjU4RTMxIi8+PHJlY3QgeD0iMyIgeT0iOCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjQiIHJ4PSIxIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xMiA4djEzIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0xOSAxMnY3YTIgMiAwIDAgMS0yIDJIN2EyIDIgMCAwIDEtMi0ydi03IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik03LjUgOGEyLjUgMi41IDAgMCAxIDAtNUE0LjggOCAwIDAgMSAxMiA4YTQuOCA4IDAgMCAxIDQuNS01IDIuNSAyLjUgMCAwIDEgMCA1IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPgo=";
    }

    // Verificar que el producto no sea null o undefined
    if (!product) {
      return "/images/cervezas/bottella-01.png";
    }

    if (product.image_url) {
      return product.image_url;
    }
    if (product.image) {
      // Si la imagen ya incluye la URL completa, usarla tal como está
      if (product.image.startsWith("http")) {
        return product.image;
      }
      // Si es una ruta relativa, construir la URL completa
      const baseUrl = constants.api_url.replace("/api", "");
      return `${baseUrl}/storage/${product.image}`;
    }
    return "/images/cervezas/bottella-01.png";
  };

  const [currentStep, setCurrentStepLocal] = useState(1);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  // Redirect if cart is empty, but only if no order has been created
  useEffect(() => {
    if (itemsCount === 0 && !checkoutState.orderId) {
      router.push("/tienda");
    }
  }, [itemsCount, router, checkoutState.orderId]);

  const handleStepChange = (step: number) => {
    setCurrentStepLocal(step);
    setCurrentStep(step);
    setServerError(null); // Limpiar error al cambiar de paso
  };

  const handleShippingNext = async (address: ShippingAddress) => {
    try {
      setShippingAddress(address);

      // Guardar los datos del carrito antes de crear la orden
      if (cart) {
        console.log("🔍 Cart data before saving:", cart);

        // Calcular subtotal manualmente para asegurar precisión
        const manualSubtotal =
          cart.items?.reduce((sum, item) => {
            return sum + parseFloat(String(item.unit_price)) * item.quantity;
          }, 0) || 0;

        // Calcular impuestos (IVA 19% en Colombia)
        const TAX_RATE = 0.19; // 19%
        const calculatedTaxAmount = Math.round(manualSubtotal * TAX_RATE);

        // Usar impuestos calculados si el backend no los proporciona
        const finalTaxAmount =
          parseFloat(String(cart.tax_amount || 0)) || calculatedTaxAmount;
        const shippingAmount = parseFloat(String(cart.shipping_amount || 0));

        const savedData = {
          items: cart.items,
          subtotal: manualSubtotal,
          shipping_amount: shippingAmount,
          tax_amount: finalTaxAmount,
          total_amount: manualSubtotal + shippingAmount + finalTaxAmount,
        };
        console.log("💾 Saving order data:", savedData);
        setOrderData(savedData);
      }

      const orderResponse = await createOrder(address, undefined, "");

      if (orderResponse.success) {
        showSuccess("Orden creada", "Tu orden ha sido creada exitosamente");
        // Sincronizar el carrito después de crear la orden exitosamente
        await loadCart();
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

  const handlePaymentSuccess = async () => {
    showSuccess("Pago exitoso", "Tu pago ha sido procesado exitosamente");
    // Sincronizar el carrito después del pago exitoso
    await loadCart();
    handleStepChange(4); // Move to success step
  };

  const handleCompleteOrder = async () => {
    resetCheckout();
    // Asegurar sincronización final del carrito antes de redirigir
    await loadCart();
    router.push("/");
  };

  if (itemsCount === 0 && !checkoutState.orderId) {
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
              {
                step: 1,
                title: "Resumen",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                ),
              },
              {
                step: 2,
                title: "Dirección",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ),
              },
              {
                step: 3,
                title: "Pago",
                icon: (
                  <svg
                    className="w-5 h-5"
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
                ),
              },
              {
                step: 4,
                title: "Confirmación",
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
            ].map(({ step, title, icon }) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-0 ${
                    currentStep >= step
                      ? "bg-yellow-600 border-yellow-600 text-white shadow-lg"
                      : "bg-white border-gray-300 text-gray-400"
                  } ${
                    checkoutState.orderId && step < 3
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  {currentStep > step ? (
                    <svg
                      className="w-6 h-6"
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
                  ) : (
                    icon
                  )}
                </div>
                <span
                  className={`ml-3 text-sm font-medium transition-colors duration-200 ${
                    currentStep >= step ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {title}
                </span>
                {step < 4 && (
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
                            className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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
                {checkoutState.orderId && orderData ? (
                  <>
                    <PaymentStep
                      orderId={checkoutState.orderId}
                      totalAmount={parseFloat(String(orderData.total_amount))}
                      customerEmail={
                        shippingAddress?.email || "usuario@ejemplo.com"
                      } // Email requerido por Wompi
                      customerName={
                        shippingAddress
                          ? `${shippingAddress.first_name} ${shippingAddress.last_name}`
                          : undefined
                      }
                      customerMobile={shippingAddress?.phone}
                      onBack={() => handleStepChange(2)}
                      onSuccess={handlePaymentSuccess}
                    />
                  </>
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
                        className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
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
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Resumen del Pedido
                  </h3>
                </div>

                {(cart || orderData) && (
                  <>
                    <div className="space-y-3 mb-6">
                      {(currentStep < 3 ? cart?.items : orderData?.items)
                        ?.slice(0, 3)
                        .map((item: any) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={getProductImageUrl(item.product, item)}
                              alt={
                                item.product?.name ||
                                item.gift_data?.name ||
                                "Producto"
                              }
                              className="w-12 h-12 rounded-lg object-cover shadow-sm"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/images/cervezas/bottella-01.png";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {item.product?.name ||
                                  item.gift_data?.name ||
                                  "Producto personalizado"}
                              </p>
                              <p className="text-sm text-gray-500">
                                Cantidad: {item.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-bold text-gray-900">
                              {formatPrice(
                                parseFloat(String(item.unit_price)) *
                                  item.quantity
                              )}
                            </p>
                          </div>
                        ))}

                      {(currentStep < 3 ? cart?.items : orderData?.items) &&
                        (currentStep < 3 ? cart?.items : orderData?.items)
                          .length > 3 && (
                          <div className="text-center py-2">
                            <p className="text-sm text-gray-500 bg-gray-100 rounded-lg py-2 px-3">
                              +
                              {(currentStep < 3
                                ? cart?.items
                                : orderData?.items
                              ).length - 3}{" "}
                              productos más
                            </p>
                          </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 pt-4 space-y-3 bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(
                            currentStep < 3
                              ? cart?.items?.reduce(
                                  (sum, item) =>
                                    sum +
                                    parseFloat(String(item.unit_price)) *
                                      item.quantity,
                                  0
                                ) || 0
                              : orderData?.subtotal || 0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Envío:</span>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(
                            currentStep < 3
                              ? parseFloat(String(cart?.shipping_amount || 0))
                              : orderData?.shipping_amount || 0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Impuestos (IVA 19%):
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formatPrice(
                            currentStep < 3
                              ? (() => {
                                  const subtotal =
                                    cart?.items?.reduce(
                                      (sum, item) =>
                                        sum +
                                        parseFloat(String(item.unit_price)) *
                                          item.quantity,
                                      0
                                    ) || 0;
                                  const TAX_RATE = 0.19;
                                  const calculatedTax = Math.round(
                                    subtotal * TAX_RATE
                                  );
                                  return (
                                    parseFloat(String(cart?.tax_amount || 0)) ||
                                    calculatedTax
                                  );
                                })()
                              : orderData?.tax_amount || 0
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-gray-900">
                          {formatPrice(
                            currentStep < 3
                              ? (() => {
                                  const subtotal =
                                    cart?.items?.reduce(
                                      (sum, item) =>
                                        sum +
                                        parseFloat(String(item.unit_price)) *
                                          item.quantity,
                                      0
                                    ) || 0;
                                  const shipping = parseFloat(
                                    String(cart?.shipping_amount || 0)
                                  );
                                  const TAX_RATE = 0.19;
                                  const calculatedTax = Math.round(
                                    subtotal * TAX_RATE
                                  );
                                  const finalTax =
                                    parseFloat(String(cart?.tax_amount || 0)) ||
                                    calculatedTax;
                                  return subtotal + shipping + finalTax;
                                })()
                              : orderData?.total_amount || 0
                          )}
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
