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
  const {
    checkoutState,
    createOrder,
    setCurrentStep,
    resetCheckout,
    saveOrderData,
  } = useCheckout();
  const { toast, showSuccess, showError, hideToast } = useToast();

  // Estado para controlar el mensaje del paso 4
  const [orderStatus, setOrderStatus] = useState<
    "loading" | "success" | "failed" | "pending"
  >("loading");

  // Ejecutar consulta cuando llegue al paso 4
  useEffect(() => {
    if (checkoutState.currentStep === 4) {
      console.log("🚀 STEP 4 REACHED - Will check order status");

      // Obtener orderId de la URL o del estado
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get("order_id") || checkoutState.orderId;

      if (orderId) {
        console.log("🔍 Will check order status for:", orderId);

        // Función para verificar el estado del pago
        const checkPaymentStatus = async (retryCount = 0) => {
          const MAX_RETRIES = 5; // Máximo 5 intentos
          const RETRY_DELAY = 2000; // 2 segundos entre intentos

          try {
            console.log(
              `🔍 Checking payment status (attempt ${
                retryCount + 1
              }/${MAX_RETRIES})...`
            );

            // Verificar si el usuario está autenticado
            const token = localStorage.getItem("token");
            const isAuthenticated = !!token;

            console.log("🔍 User authentication status:", isAuthenticated);

            // Usar ruta diferente según el estado de autenticación
            const apiUrl = isAuthenticated
              ? `${process.env.NEXT_PUBLIC_API_URL}/user/orders/${orderId}`
              : `${process.env.NEXT_PUBLIC_API_URL}/payments/check-status`;

            const requestOptions: RequestInit = isAuthenticated
              ? {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              : {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ order_id: orderId }),
                };

            const response = await fetch(apiUrl, requestOptions);
            console.log("🔍 API Response status:", response.status);
            const data = await response.json();
            console.log("🔍 API Response data:", data);

            if (data.success && data.data) {
              const responseData = data.data;

              // Manejar diferentes estructuras de respuesta según la ruta
              const paymentStatus = responseData.payment_status;
              const orderStatus = isAuthenticated
                ? responseData.status
                : responseData.order_status;

              console.log("🔍 Payment status from API:", paymentStatus);
              console.log("🔍 Order status from API:", orderStatus);

              // Normalizar el payment_status para comparación robusta
              const normalizedPaymentStatus = paymentStatus
                ?.toString()
                .toLowerCase()
                .trim();

              if (normalizedPaymentStatus === "paid") {
                console.log("✅ Payment is PAID - showing success");
                setOrderStatus("success");
                showSuccess(
                  "Pago exitoso",
                  "Tu pago ha sido procesado exitosamente"
                );
                return; // Salir del loop de reintentos
              } else if (normalizedPaymentStatus === "failed") {
                console.log("❌ Payment is FAILED - showing failed");
                setOrderStatus("failed");
                showError(
                  "Pago fallido",
                  "Tu pago no pudo ser procesado. Por favor intenta nuevamente."
                );
                return; // Salir del loop de reintentos
              } else if (normalizedPaymentStatus === "pending") {
                // Si está pendiente y aún tenemos reintentos, esperar y reintentar
                if (retryCount < MAX_RETRIES - 1) {
                  console.log(
                    `⏳ Payment is PENDING - retrying in ${RETRY_DELAY}ms...`
                  );
                  setTimeout(
                    () => checkPaymentStatus(retryCount + 1),
                    RETRY_DELAY
                  );
                } else {
                  // Si alcanzamos el máximo de reintentos, mostrar pendiente
                  console.log("⏳ Payment is still PENDING after max retries");
                  setOrderStatus("pending");
                  // No mostrar mensaje de error ni éxito, solo actualizar el estado visual
                }
                return;
              } else {
                // Estado desconocido - reintentar si es posible
                if (retryCount < MAX_RETRIES - 1) {
                  console.log(
                    `❓ Unknown status: ${paymentStatus} - retrying in ${RETRY_DELAY}ms...`
                  );
                  setTimeout(
                    () => checkPaymentStatus(retryCount + 1),
                    RETRY_DELAY
                  );
                } else {
                  console.log(
                    "❓ Unknown payment status after max retries:",
                    paymentStatus
                  );
                  setOrderStatus("failed");
                  showError(
                    "Error de pago",
                    "No se pudo verificar el estado de tu pago. Por favor contacta con soporte."
                  );
                }
              }
            } else {
              // Error en la respuesta - reintentar si es posible
              if (retryCount < MAX_RETRIES - 1) {
                console.log(
                  `❌ Invalid API response - retrying in ${RETRY_DELAY}ms...`
                );
                setTimeout(
                  () => checkPaymentStatus(retryCount + 1),
                  RETRY_DELAY
                );
              } else {
                console.log("❌ Invalid API response after max retries");
                setOrderStatus("failed");
                showError(
                  "Error de pago",
                  "No se pudo verificar el estado de tu pago. Por favor contacta con soporte."
                );
              }
            }
          } catch (error) {
            console.error("❌ API Error:", error);
            // Reintentar si es posible
            if (retryCount < MAX_RETRIES - 1) {
              console.log(
                `❌ Error in API call - retrying in ${RETRY_DELAY}ms...`
              );
              setTimeout(() => checkPaymentStatus(retryCount + 1), RETRY_DELAY);
            } else {
              console.error("❌ API Error after max retries:", error);
              setOrderStatus("failed");
              showError(
                "Error de pago",
                "No se pudo verificar el estado de tu pago. Por favor contacta con soporte."
              );
            }
          }
        };

        // Iniciar la verificación después de un breve delay para dar tiempo al webhook
        setTimeout(() => checkPaymentStatus(0), 1000);
      }
    }
  }, [checkoutState.currentStep]);

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
      return `${baseUrl}/${product.image}`;
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

      // Guardar los datos de la orden antes de crear la orden
      if (cart) {
        console.log("🔍 Cart data before saving:", cart);

        // Calcular subtotal manualmente para asegurar precisión
        const manualSubtotal =
          cart.items?.reduce((sum, item) => {
            return sum + parseFloat(String(item.unit_price)) * item.quantity;
          }, 0) || 0;

        // Agregar tarifa de envío fija de $12,000 (sin impuestos)
        const SHIPPING_FEE = 12000;
        const orderData = {
          items: cart.items,
          subtotal: manualSubtotal,
          shipping_amount: SHIPPING_FEE,
          tax_amount: 0,
          total_amount: manualSubtotal + SHIPPING_FEE, // Total = Subtotal + Envío (sin impuestos)
        };
        console.log("💾 Saving order data:", orderData);

        // Guardar en Redux
        saveOrderData(orderData);
        setOrderData(orderData);
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
    // Sincronizar el carrito después del pago
    await loadCart();
    handleStepChange(4); // Move to confirmation step where we'll check the actual payment status
  };

  const handleCompleteOrder = async () => {
    // Limpiar el carrito - el carrito ya se limpia automáticamente después del pago
    // Solo necesitamos limpiar el estado del checkout
    resetCheckout();
    // Asegurar sincronización final del carrito antes de redirigir
    await loadCart();
    router.push("/tienda");
  };

  if (itemsCount === 0 && !checkoutState.orderId) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Checkout
          </h1>
          <p
            className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 px-4"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Completa tu pedido de forma segura
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 lg:space-x-8 overflow-x-auto pb-2">
            {[
              {
                step: 1,
                title: "Resumen",
                icon: (
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
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
                    className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
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
                    className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
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
                    className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
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
              <div key={step} className="flex items-center flex-shrink-0">
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
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
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
                  style={{ fontFamily: "var(--font-lato)" }}
                  className={`ml-2 sm:ml-3 text-xs sm:text-sm font-medium transition-colors duration-200 hidden sm:block ${
                    currentStep >= step ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {title}
                </span>
                {step < 4 && (
                  <div
                    className={`w-4 sm:w-6 lg:w-8 h-0.5 ml-2 sm:ml-4 transition-colors duration-200 ${
                      currentStep > step ? "bg-yellow-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 4 ? (
          // Para el paso 4 (confirmación), no usar grid
          <div className="flex items-center justify-center min-h-[60vh] px-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-4xl w-full">
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-8 text-center">
                  {orderStatus === "loading" ? (
                    // Estado de carga
                    <>
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-yellow-600 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h2
                        className="text-2xl font-bold text-gray-900 mb-2"
                        style={{ fontFamily: "var(--font-lato)" }}
                      >
                        Verificando Pago...
                      </h2>
                      <p
                        className="text-gray-600 mb-6"
                        style={{ fontFamily: "var(--font-lato)" }}
                      >
                        Estamos verificando el estado de tu pago. Por favor
                        espera un momento.
                      </p>
                    </>
                  ) : orderStatus === "success" ? (
                    // Estado de éxito
                    <>
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
                      <h2
                        className="text-2xl font-bold text-gray-900 mb-2"
                        style={{ fontFamily: "var(--font-lato)" }}
                      >
                        ¡Pedido Completado!
                      </h2>
                      <p
                        className="text-gray-600 mb-6"
                        style={{ fontFamily: "var(--font-lato)" }}
                      >
                        Tu pago ha sido procesado exitosamente. Recibirás un
                        email de confirmación pronto.
                      </p>
                    </>
                  ) : orderStatus === "failed" ? (
                    // Estado de fallo
                    <>
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                      <h2
                        className="text-2xl font-bold text-gray-900 mb-2"
                        style={{ fontFamily: "var(--font-lato)" }}
                      >
                        Pago Fallido
                      </h2>
                      <p
                        className="text-gray-600 mb-6"
                        style={{ fontFamily: "var(--font-lato)" }}
                      >
                        Tu pago no pudo ser procesado. Por favor intenta
                        nuevamente o contacta con soporte.
                      </p>
                    </>
                  ) : orderStatus === "pending" ? (
                    // Estado pendiente
                    <>
                      <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-yellow-600 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h2
                        className="text-2xl font-bold text-gray-900 mb-2"
                        style={{ fontFamily: "var(--font-lato)" }}
                      >
                        Pago Pendiente
                      </h2>
                      <p
                        className="text-gray-600 mb-6"
                        style={{ fontFamily: "var(--font-lato)" }}
                      >
                        Tu pago está siendo procesado. Te notificaremos cuando
                        esté confirmado.
                      </p>
                    </>
                  ) : null}

                  {checkoutState.orderId && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <div className="text-center mb-4">
                        <p
                          className="text-lg font-semibold text-gray-900"
                          style={{ fontFamily: "var(--font-lato)" }}
                        >
                          Número de orden: {checkoutState.orderId}
                        </p>
                      </div>

                      {/* Detalles de productos */}
                      {checkoutState.orderData &&
                        checkoutState.orderData.items &&
                        checkoutState.orderData.items.length > 0 && (
                          <div className="border-t pt-4">
                            <h4
                              className="text-sm font-semibold text-gray-900 mb-3"
                              style={{ fontFamily: "var(--font-lato)" }}
                            >
                              Productos comprados:
                            </h4>
                            <div className="space-y-2">
                              {checkoutState.orderData.items.map(
                                (item: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center text-sm"
                                  >
                                    <div className="text-left">
                                      <p
                                        className="font-medium text-gray-900"
                                        style={{
                                          fontFamily: "var(--font-lato)",
                                        }}
                                      >
                                        {item.product?.name || "Producto"}
                                      </p>
                                      <p
                                        className="text-gray-600"
                                        style={{
                                          fontFamily: "var(--font-lato)",
                                        }}
                                      >
                                        Cantidad: {item.quantity}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p
                                        className="font-semibold text-gray-900"
                                        style={{
                                          fontFamily: "var(--font-lato)",
                                        }}
                                      >
                                        $
                                        {new Intl.NumberFormat("es-CO").format(
                                          item.total_price
                                        )}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>

                            {/* Resumen de totales */}
                            <div className="border-t pt-4 mt-4">
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span
                                    className="text-gray-900"
                                    style={{ fontFamily: "var(--font-lato)" }}
                                  >
                                    Subtotal:
                                  </span>
                                  <span
                                    className="font-medium text-gray-900"
                                    style={{ fontFamily: "var(--font-lato)" }}
                                  >
                                    $
                                    {new Intl.NumberFormat("es-CO").format(
                                      checkoutState.orderData?.subtotal || 0
                                    )}
                                  </span>
                                </div>
                                {/* Envío */}
                                {checkoutState.orderData?.shipping_amount &&
                                  checkoutState.orderData.shipping_amount >
                                    0 && (
                                    <div className="flex justify-between">
                                      <span
                                        className="text-gray-900"
                                        style={{
                                          fontFamily: "var(--font-lato)",
                                        }}
                                      >
                                        Envío:
                                      </span>
                                      <span
                                        className="font-medium text-gray-900"
                                        style={{
                                          fontFamily: "var(--font-lato)",
                                        }}
                                      >
                                        $
                                        {new Intl.NumberFormat("es-CO").format(
                                          checkoutState.orderData
                                            ?.shipping_amount || 0
                                        )}
                                      </span>
                                    </div>
                                  )}
                                {/* Impuestos no se cobran */}
                                <div className="flex justify-between border-t pt-2 font-semibold text-lg">
                                  <span
                                    className="text-black"
                                    style={{ fontFamily: "var(--font-lato)" }}
                                  >
                                    Total:
                                  </span>
                                  <span
                                    className="text-black"
                                    style={{ fontFamily: "var(--font-lato)" }}
                                  >
                                    $
                                    {new Intl.NumberFormat("es-CO").format(
                                      checkoutState.orderData?.total_amount || 0
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  <button
                    onClick={handleCompleteOrder}
                    className="bg-yellow-600 text-white py-3 px-8 rounded-lg font-medium hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    style={{ fontFamily: "var(--font-lato)" }}
                  >
                    Continuar Comprando
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 order-2 lg:order-1">
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
                          <h3
                            className="text-sm font-medium text-red-800"
                            style={{ fontFamily: "var(--font-lato)" }}
                          >
                            Error del servidor
                          </h3>
                          <p
                            className="mt-1 text-sm text-red-700"
                            style={{ fontFamily: "var(--font-lato)" }}
                          >
                            {serverError}
                          </p>
                          <div className="mt-3">
                            <button
                              onClick={() => setServerError(null)}
                              className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                              style={{ fontFamily: "var(--font-lato)" }}
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
                        <h3
                          className="text-lg font-medium text-gray-900 mb-2"
                          style={{ fontFamily: "var(--font-lato)" }}
                        >
                          Error al crear la orden
                        </h3>
                        <p
                          className="text-gray-600 mb-4"
                          style={{ fontFamily: "var(--font-lato)" }}
                        >
                          No se pudo crear la orden. Por favor intenta de nuevo.
                        </p>
                        <button
                          onClick={() => handleStepChange(2)}
                          className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                          style={{ fontFamily: "var(--font-lato)" }}
                        >
                          Volver a Dirección
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar - Order Summary */}
            {currentStep < 4 && (
              <div className="lg:col-span-1 order-1 lg:order-2">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 sticky top-4 sm:top-8 max-h-[80vh] overflow-y-auto">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                      <svg
                        className="w-3 h-3 sm:w-5 sm:h-5 text-amber-600"
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
                    <h3
                      className="text-sm sm:text-lg font-bold text-gray-900"
                      style={{ fontFamily: "var(--font-lato)" }}
                    >
                      Resumen del Pedido
                    </h3>
                  </div>

                  {(cart || orderData) && (
                    <>
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        {(currentStep < 3 ? cart?.items : orderData?.items)
                          ?.slice(0, 3)
                          .map((item: any) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg"
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
                                  target.src =
                                    "/images/cervezas/bottella-01.png";
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-sm font-semibold text-gray-900 truncate"
                                  style={{ fontFamily: "var(--font-lato)" }}
                                >
                                  {item.product?.name ||
                                    item.gift_data?.name ||
                                    "Producto personalizado"}
                                </p>
                                <p
                                  className="text-xs sm:text-sm text-gray-500"
                                  style={{ fontFamily: "var(--font-lato)" }}
                                >
                                  Cantidad: {item.quantity}
                                </p>
                              </div>
                              <p
                                className="text-xs sm:text-sm font-bold text-gray-900"
                                style={{ fontFamily: "var(--font-lato)" }}
                              >
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
                              <p
                                className="text-sm text-gray-500 bg-gray-100 rounded-lg py-2 px-3"
                                style={{ fontFamily: "var(--font-lato)" }}
                              >
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

                      <div className="border-t border-gray-200 pt-3 sm:pt-4 space-y-2 sm:space-y-3 bg-gray-50 rounded-lg p-3 sm:p-4">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span
                            className="text-gray-600"
                            style={{ fontFamily: "var(--font-lato)" }}
                          >
                            Subtotal:
                          </span>
                          <span
                            className="font-semibold text-gray-900"
                            style={{ fontFamily: "var(--font-lato)" }}
                          >
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
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span
                            className="text-gray-600"
                            style={{ fontFamily: "var(--font-lato)" }}
                          >
                            Envío:
                          </span>
                          <span
                            className="font-semibold text-gray-900"
                            style={{ fontFamily: "var(--font-lato)" }}
                          >
                            {formatPrice(12000)}
                          </span>
                        </div>
                        {/* Impuestos no se cobran */}
                        <div className="flex justify-between text-base sm:text-lg font-bold border-t border-gray-200 pt-2 sm:pt-3">
                          <span
                            className="text-gray-900"
                            style={{ fontFamily: "var(--font-lato)" }}
                          >
                            Total:
                          </span>
                          <span
                            className="text-gray-900"
                            style={{ fontFamily: "var(--font-lato)" }}
                          >
                            {formatPrice(
                              currentStep < 3
                                ? (cart?.items?.reduce(
                                    (sum, item) =>
                                      sum +
                                      parseFloat(String(item.unit_price)) *
                                        item.quantity,
                                    0
                                  ) || 0) + 12000
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
        )}

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
