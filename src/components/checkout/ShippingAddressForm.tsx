"use client";

import { useState } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { ShippingAddress } from "@/types/checkout";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/shared/Toast";

interface ShippingAddressFormProps {
  onNext: (address: ShippingAddress) => void;
  onBack: () => void;
}

export default function ShippingAddressForm({
  onNext,
  onBack,
}: ShippingAddressFormProps) {
  const { calculateShipping } = useCheckout();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const [formData, setFormData] = useState<ShippingAddress>({
    first_name: "",
    last_name: "",
    email: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Colombia",
    phone: "",
  });

  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCalculateShipping = async () => {
    if (!formData.city || !formData.state || !formData.postal_code) {
      showError(
        "Campos requeridos",
        "Por favor completa ciudad, departamento y código postal"
      );
      return;
    }

    try {
      setIsCalculatingShipping(true);
      const response = await calculateShipping(
        formData.city,
        formData.state,
        formData.postal_code
      );

      if (response.success) {
        setShippingCost(response.shipping_amount);
        showSuccess(
          "Envío calculado",
          `Costo de envío: $${response.shipping_amount.toLocaleString()} - ${
            response.estimated_days
          } días hábiles`
        );
      }
    } catch (error) {
      console.error("Error calculating shipping:", error);
      showError("Error", "No se pudo calcular el costo de envío");
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.address_line_1 ||
      !formData.city ||
      !formData.state ||
      !formData.postal_code ||
      !formData.phone
    ) {
      showError(
        "Campos requeridos",
        "Por favor completa todos los campos obligatorios incluyendo el email y teléfono"
      );
      return;
    }

    // Continuar directamente sin validar la dirección
    console.log("📍 Dirección ingresada:", formData);
    showSuccess("Dirección guardada", "Continuando con el proceso de pago");
    onNext(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Dirección de Envío
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Ingresa la dirección donde quieres recibir tu pedido
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre *
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
              placeholder="Ingresa tu nombre"
              required
            />
          </div>

          {/* Apellido */}
          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Apellido *
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
              placeholder="Ingresa tu apellido"
              required
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
              placeholder="tu@email.com"
              required
            />
          </div>

          {/* Dirección Principal */}
          <div className="md:col-span-2">
            <label
              htmlFor="address_line_1"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Dirección Principal *
            </label>
            <input
              type="text"
              id="address_line_1"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
              placeholder="Calle, carrera, avenida, etc."
              required
            />
          </div>

          {/* Dirección Secundaria */}
          <div className="md:col-span-2">
            <label
              htmlFor="address_line_2"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Dirección Secundaria (Opcional)
            </label>
            <input
              type="text"
              id="address_line_2"
              name="address_line_2"
              value={formData.address_line_2}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
              placeholder="Apartamento, casa, piso, etc."
            />
          </div>

          {/* Ciudad */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Ciudad *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
              placeholder="Ingresa tu ciudad"
              required
            />
          </div>

          {/* Departamento/Estado */}
          <div>
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Departamento *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 bg-white"
              required
            >
              <option value="">Selecciona un departamento</option>
              <option value="Antioquia">Antioquia</option>
              <option value="Cundinamarca">Cundinamarca</option>
              <option value="Valle del Cauca">Valle del Cauca</option>
              <option value="Atlántico">Atlántico</option>
              <option value="Santander">Santander</option>
              <option value="Bolívar">Bolívar</option>
              <option value="Nariño">Nariño</option>
              <option value="Córdoba">Córdoba</option>
              <option value="Huila">Huila</option>
              <option value="Tolima">Tolima</option>
              <option value="Meta">Meta</option>
              <option value="Cauca">Cauca</option>
              <option value="Norte de Santander">Norte de Santander</option>
              <option value="Magdalena">Magdalena</option>
              <option value="Risaralda">Risaralda</option>
              <option value="Quindío">Quindío</option>
              <option value="Boyacá">Boyacá</option>
              <option value="Caldas">Caldas</option>
              <option value="Sucre">Sucre</option>
              <option value="Cesar">Cesar</option>
              <option value="Casanare">Casanare</option>
              <option value="Arauca">Arauca</option>
              <option value="Putumayo">Putumayo</option>
              <option value="Caquetá">Caquetá</option>
              <option value="Chocó">Chocó</option>
              <option value="La Guajira">La Guajira</option>
              <option value="Amazonas">Amazonas</option>
              <option value="Vaupés">Vaupés</option>
              <option value="Vichada">Vichada</option>
              <option value="Guainía">Guainía</option>
              <option value="Guaviare">Guaviare</option>
              <option value="San Andrés y Providencia">
                San Andrés y Providencia
              </option>
            </select>
          </div>

          {/* Código Postal */}
          <div>
            <label
              htmlFor="postal_code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Código Postal *
            </label>
            <input
              type="text"
              id="postal_code"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
              placeholder="110111"
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Teléfono *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
              placeholder="+57 300 123 4567"
              required
            />
          </div>
        </div>

        {/* Calculate Shipping Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleCalculateShipping}
            disabled={
              isCalculatingShipping ||
              !formData.city ||
              !formData.state ||
              !formData.postal_code
            }
            className="w-full md:w-auto bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculatingShipping
              ? "Calculando..."
              : "Calcular Costo de Envío"}
          </button>

          {shippingCost && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Costo de envío:</strong> $
                {shippingCost.toLocaleString()} COP
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex flex-col md:flex-row gap-4">
          <button
            type="button"
            onClick={onBack}
            className="w-full md:w-auto bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Volver
          </button>

          <button
            type="submit"
            className="w-full md:w-auto bg-yellow-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-700 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          >
            Continuar al Pago
          </button>
        </div>
      </form>

      {/* Toast */}
      <Toast
        isVisible={toast.isVisible}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={hideToast}
      />
    </div>
  );
}
