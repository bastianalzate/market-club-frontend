"use client";

import { useCartContext } from "@/contexts/CartContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function CheckoutContent() {
  const { cart, itemsCount, removeFromCart, subtotal, totalAmount } =
    useCartContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    billingAddress: "",
    billingCity: "",
    billingPostalCode: "",
    paymentMethod: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numPrice);
  };

  const total = totalAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      handleNextStep();
    } else {
      // Aquí se procesaría el pago
      console.log("Procesando pago...", formData);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-gray-100 sm:py-16 lg:py-20">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finalizar Compra
          </h1>
          <p className="text-gray-600">Completa tu pedido de forma segura</p>
          <div className="inline-flex items-center mt-4 px-4 py-2 bg-white rounded-full shadow-sm border">
            <span className="text-sm font-medium text-gray-700">
              {itemsCount} {itemsCount === 1 ? "producto" : "productos"} en tu
              carrito
            </span>
          </div>
        </div>

        {/* Indicador de Pasos Mejorado */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        step < currentStep
                          ? "bg-black text-white shadow-lg"
                          : step === currentStep
                          ? "text-white shadow-lg ring-4 ring-yellow-100"
                          : "bg-gray-200 text-gray-500"
                      }`}
                      style={
                        step === currentStep
                          ? { backgroundColor: "rgb(180, 140, 43)" }
                          : {}
                      }
                    >
                      {step < currentStep ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        step
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p
                        className={`text-sm font-medium transition-colors duration-300 ${
                          step <= currentStep
                            ? "text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {step === 1 && "Contacto"}
                        {step === 2 && "Envío"}
                        {step === 3 && "Facturación"}
                        {step === 4 && "Pago"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {step === 1 && "Información personal"}
                        {step === 2 && "Dirección de entrega"}
                        {step === 3 && "Datos de facturación"}
                        {step === 4 && "Método de pago"}
                      </p>
                    </div>
                  </div>
                  {step < 4 && (
                    <div className="flex-1 mx-4">
                      <div
                        className={`h-0.5 transition-all duration-500 ${
                          step < currentStep ? "bg-black" : "bg-gray-200"
                        }`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 md:mt-12">
          <div className="overflow-hidden bg-white shadow rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Panel Izquierdo - Resumen del Carrito */}
              <div className="px-6 py-8 bg-gradient-to-br from-gray-50 to-gray-100 md:px-8">
                <div className="flow-root">
                  <ul className="divide-y divide-gray-200 -my-7">
                    {cart?.items?.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-stretch justify-between space-x-5 py-6 hover:bg-white/50 transition-colors duration-200 rounded-lg px-3 -mx-3"
                      >
                        {item.product && (
                          <div className="flex items-stretch flex-1">
                            <div className="flex-shrink-0">
                              <div className="relative">
                                <div
                                  className={`flex items-center justify-center ${
                                    item.product.name.includes("Regalo")
                                      ? "w-8 h-8 rounded-lg"
                                      : "w-20 h-20"
                                  }`}
                                  style={
                                    item.product.name.includes("Regalo")
                                      ? { backgroundColor: "#B58E31" }
                                      : {}
                                  }
                                >
                                  <img
                                    className={`border border-gray-200 rounded-xl object-cover shadow-sm ${
                                      item.product.name.includes("Regalo")
                                        ? "w-8 h-8"
                                        : "w-20 h-20"
                                    }`}
                                    src={item.product.image_url}
                                    alt={item.product.name}
                                  />
                                </div>
                                <div
                                  className="absolute -top-2 -right-2 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                                  style={{
                                    backgroundColor: "rgb(180, 140, 43)",
                                  }}
                                >
                                  {item.quantity}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col justify-between ml-4">
                              <div className="flex-1">
                                <p className="text-sm font-bold text-gray-900 leading-tight">
                                  {item.product.name}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                  {item.product.name.split(" ")[0]}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                  {formatPrice(item.unit_price)} c/u
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col items-end justify-between ml-auto">
                              <p className="text-sm font-bold text-right text-gray-900">
                                {formatPrice(item.total_price)}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  removeFromCart({
                                    productId: item.product_id ?? undefined,
                                  })
                                }
                                className="inline-flex p-2 -m-2 text-gray-400 transition-all duration-200 rounded-lg hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                title="Eliminar producto"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <hr className="mt-6 border-gray-200" />

                {/* Sección de Cupón */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    ¿Tienes un cupón de descuento?
                  </h3>
                  <form action="#" className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        id="coupon"
                        name="coupon"
                        placeholder="Ingresa tu código"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200"
                        style={{ backgroundColor: "rgb(180, 140, 43)" }}
                      >
                        Aplicar
                      </button>
                    </div>
                  </form>
                </div>

                {/* Resumen de Totales */}
                <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Resumen del pedido
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Envío</span>
                      <span className="font-medium text-black">Gratis</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-gray-900">
                        Total
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Panel Derecho - Formularios por Pasos */}
              <div className="px-6 py-8 md:px-8">
                <div className="flow-root">
                  <div className="-my-6 divide-y divide-gray-200">
                    <form onSubmit={handleSubmit} className="py-6">
                      {/* Paso 1: Información de Contacto */}
                      <div className="py-6">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              currentStep >= 1
                                ? "text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                            style={
                              currentStep >= 1
                                ? { backgroundColor: "rgb(180, 140, 43)" }
                                : {}
                            }
                          >
                            1
                          </div>
                          <h2
                            className={`font-bold text-lg ${
                              currentStep >= 1
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            Información de Contacto
                          </h2>
                        </div>

                        {currentStep >= 1 && (
                          <div className="mt-6 space-y-5">
                            <div>
                              <label
                                htmlFor="fullName"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                              >
                                Nombre Completo *
                              </label>
                              <input
                                type="text"
                                name="fullName"
                                id="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Ingresa tu nombre completo"
                                className="block w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                                required
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                              >
                                Dirección de Email *
                              </label>
                              <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Ingresa tu dirección de email"
                                className="block w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                                required
                              />
                            </div>

                            {currentStep === 1 && (
                              <div className="pt-4">
                                <button
                                  type="submit"
                                  className="inline-flex items-center justify-center w-full px-6 py-4 text-sm font-bold text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                                  style={{
                                    backgroundColor: "rgb(180, 140, 43)",
                                  }}
                                >
                                  Continuar al Siguiente Paso
                                  <ChevronRight className="w-5 h-5 ml-2" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Paso 2: Información de Envío */}
                      <div className="py-6">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              currentStep >= 2
                                ? "text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                            style={
                              currentStep >= 2
                                ? { backgroundColor: "rgb(180, 140, 43)" }
                                : {}
                            }
                          >
                            2
                          </div>
                          <h2
                            className={`font-bold text-lg ${
                              currentStep >= 2
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            Información de Envío
                          </h2>
                        </div>

                        {currentStep >= 2 && (
                          <div className="mt-6 space-y-5">
                            <div>
                              <label
                                htmlFor="address"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                              >
                                Dirección *
                              </label>
                              <input
                                type="text"
                                name="address"
                                id="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Ingresa tu dirección"
                                className="block w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              <div>
                                <label
                                  htmlFor="city"
                                  className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                  Ciudad *
                                </label>
                                <input
                                  type="text"
                                  name="city"
                                  id="city"
                                  value={formData.city}
                                  onChange={handleInputChange}
                                  placeholder="Ciudad"
                                  className="block w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                                  required
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor="postalCode"
                                  className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                  Código Postal *
                                </label>
                                <input
                                  type="text"
                                  name="postalCode"
                                  id="postalCode"
                                  value={formData.postalCode}
                                  onChange={handleInputChange}
                                  placeholder="Código postal"
                                  className="block w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="phone"
                                className="block text-sm font-semibold text-gray-700 mb-2"
                              >
                                Teléfono *
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Ingresa tu número de teléfono"
                                className="block w-full px-4 py-3 text-sm text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors duration-200"
                                required
                              />
                            </div>

                            {currentStep === 2 && (
                              <div className="flex justify-between pt-4">
                                <button
                                  type="button"
                                  onClick={handlePrevStep}
                                  className="inline-flex items-center px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                  <ChevronLeft className="w-4 h-4 mr-2" />
                                  Anterior
                                </button>

                                <button
                                  type="submit"
                                  className="inline-flex items-center px-6 py-3 text-sm font-bold text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                                  style={{
                                    backgroundColor: "rgb(180, 140, 43)",
                                  }}
                                >
                                  Continuar al Siguiente Paso
                                  <ChevronRight className="w-5 h-5 ml-2" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Paso 3: Información de Facturación */}
                      <div className="py-6">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              currentStep >= 3
                                ? "text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                            style={
                              currentStep >= 3
                                ? { backgroundColor: "rgb(180, 140, 43)" }
                                : {}
                            }
                          >
                            3
                          </div>
                          <h2
                            className={`font-bold text-lg ${
                              currentStep >= 3
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            Información de Facturación
                          </h2>
                        </div>

                        {currentStep >= 3 && (
                          <div className="mt-6 space-y-5">
                            <div>
                              <label
                                htmlFor="billingAddress"
                                className="text-sm font-medium text-gray-600"
                              >
                                Dirección de Facturación
                              </label>
                              <div className="mt-2">
                                <input
                                  type="text"
                                  name="billingAddress"
                                  id="billingAddress"
                                  value={formData.billingAddress}
                                  onChange={handleInputChange}
                                  placeholder="Ingresa la dirección de facturación"
                                  className="block w-full px-4 py-3 text-sm font-normal text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md bg-gray-50 caret-gray-900 focus:ring-gray-900 focus:border-gray-900"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              <div>
                                <label
                                  htmlFor="billingCity"
                                  className="text-sm font-medium text-gray-600"
                                >
                                  Ciudad
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="billingCity"
                                    id="billingCity"
                                    value={formData.billingCity}
                                    onChange={handleInputChange}
                                    placeholder="Ciudad"
                                    className="block w-full px-4 py-3 text-sm font-normal text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md bg-gray-50 caret-gray-900 focus:ring-gray-900 focus:border-gray-900"
                                    required
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="billingPostalCode"
                                  className="text-sm font-medium text-gray-600"
                                >
                                  Código Postal
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="billingPostalCode"
                                    id="billingPostalCode"
                                    value={formData.billingPostalCode}
                                    onChange={handleInputChange}
                                    placeholder="Código postal"
                                    className="block w-full px-4 py-3 text-sm font-normal text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md bg-gray-50 caret-gray-900 focus:ring-gray-900 focus:border-gray-900"
                                    required
                                  />
                                </div>
                              </div>
                            </div>

                            {currentStep === 3 && (
                              <div className="flex justify-between">
                                <button
                                  type="button"
                                  onClick={handlePrevStep}
                                  className="inline-flex items-center px-6 py-3 text-sm font-bold text-gray-900 transition-all duration-200 bg-transparent border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-200 focus:bg-gray-200"
                                >
                                  <ChevronLeft className="w-4 h-4 mr-2" />
                                  Anterior
                                </button>

                                <button
                                  type="submit"
                                  className="inline-flex items-center px-6 py-3 text-sm font-bold text-white transition-all duration-200 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                  style={{
                                    backgroundColor: "rgb(180, 140, 43)",
                                  }}
                                >
                                  Continuar al Siguiente Paso
                                  <ChevronRight className="w-4 h-4 ml-2" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Paso 4: Método de Pago */}
                      <div className="py-6">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              currentStep >= 4
                                ? "text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                            style={
                              currentStep >= 4
                                ? { backgroundColor: "rgb(180, 140, 43)" }
                                : {}
                            }
                          >
                            4
                          </div>
                          <h2
                            className={`font-bold text-lg ${
                              currentStep >= 4
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            Método de Pago
                          </h2>
                        </div>

                        {currentStep >= 4 && (
                          <div className="mt-6 space-y-5">
                            <div>
                              <label
                                htmlFor="paymentMethod"
                                className="text-sm font-medium text-gray-600"
                              >
                                Método de Pago
                              </label>
                              <div className="mt-2">
                                <select
                                  name="paymentMethod"
                                  id="paymentMethod"
                                  value={formData.paymentMethod}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      paymentMethod: e.target.value,
                                    }))
                                  }
                                  className="block w-full px-4 py-3 text-sm font-normal text-gray-900 border border-gray-300 rounded-md bg-gray-50 caret-gray-900 focus:ring-gray-900 focus:border-gray-900"
                                  required
                                >
                                  <option value="">
                                    Selecciona un método de pago
                                  </option>
                                  <option value="credit">
                                    Tarjeta de Crédito
                                  </option>
                                  <option value="debit">
                                    Tarjeta de Débito
                                  </option>
                                  <option value="pse">PSE</option>
                                  <option value="nequi">Nequi</option>
                                </select>
                              </div>
                            </div>

                            {formData.paymentMethod === "credit" ||
                            formData.paymentMethod === "debit" ? (
                              <>
                                <div>
                                  <label
                                    htmlFor="cardNumber"
                                    className="text-sm font-medium text-gray-600"
                                  >
                                    Número de Tarjeta
                                  </label>
                                  <div className="mt-2">
                                    <input
                                      type="text"
                                      name="cardNumber"
                                      id="cardNumber"
                                      value={formData.cardNumber}
                                      onChange={handleInputChange}
                                      placeholder="1234 5678 9012 3456"
                                      className="block w-full px-4 py-3 text-sm font-normal text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md bg-gray-50 caret-gray-900 focus:ring-gray-900 focus:border-gray-900"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                  <div>
                                    <label
                                      htmlFor="expiryDate"
                                      className="text-sm font-medium text-gray-600"
                                    >
                                      Fecha de Vencimiento
                                    </label>
                                    <div className="mt-2">
                                      <input
                                        type="text"
                                        name="expiryDate"
                                        id="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleInputChange}
                                        placeholder="MM/AA"
                                        className="block w-full px-4 py-3 text-sm font-normal text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md bg-gray-50 caret-gray-900 focus:ring-gray-900 focus:border-gray-900"
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label
                                      htmlFor="cvv"
                                      className="text-sm font-medium text-gray-600"
                                    >
                                      CVV
                                    </label>
                                    <div className="mt-2">
                                      <input
                                        type="text"
                                        name="cvv"
                                        id="cvv"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                        placeholder="123"
                                        className="block w-full px-4 py-3 text-sm font-normal text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md bg-gray-50 caret-gray-900 focus:ring-gray-900 focus:border-gray-900"
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                              </>
                            ) : null}

                            {currentStep === 4 && (
                              <div className="flex justify-between">
                                <button
                                  type="button"
                                  onClick={handlePrevStep}
                                  className="inline-flex items-center px-6 py-3 text-sm font-bold text-gray-900 transition-all duration-200 bg-transparent border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-200 focus:bg-gray-200"
                                >
                                  <ChevronLeft className="w-4 h-4 mr-2" />
                                  Anterior
                                </button>

                                <button
                                  type="submit"
                                  className="inline-flex items-center px-6 py-3 text-sm font-bold text-white transition-all duration-200 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                                  style={{
                                    backgroundColor: "rgb(180, 140, 43)",
                                  }}
                                >
                                  Procesar Pago
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
