"use client";

import { Filter, Search, Globe } from "lucide-react";

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

export default function ProductFilters({
  searchTerm,
  onSearchChange,
  selectedCountry,
  onCountryChange,
}: ProductFiltersProps) {
  const categories = [
    "Todas",
    "Lager",
    "IPA",
    "Stout",
    "Sin Alcohol",
    "Artesanal",
  ];

  const countries = [
    { value: "", label: "Todos" },
    { value: "inglaterra", label: "Inglaterra" },
    { value: "colombia", label: "Colombia" },
    { value: "alemania", label: "Alemania" },
    { value: "italia", label: "Italia" },
    { value: "escocia", label: "Escocia" },
    { value: "belgica", label: "Bélgica" },
    { value: "espana", label: "España" },
    { value: "paises bajos", label: "Países Bajos" },
    { value: "japon", label: "Japón" },
    { value: "mexico", label: "México" },
    { value: "peru", label: "Perú" },
    { value: "republica checa", label: "República Checa" },
    { value: "estados unidos", label: "Estados Unidos" },
    { value: "tailandia", label: "Tailandia" },
  ];

  return (
    <div className="lg:w-64 space-y-6">
      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar cervezas..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58E31] focus:border-transparent"
        />
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </h3>

        {/* País de origen */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center">
            <Globe className="w-4 h-4 mr-2" />
            País de origen
          </h4>
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58E31] focus:border-transparent text-sm text-gray-900 bg-white"
          >
            {countries.map((country) => (
              <option
                key={country.value}
                value={country.value}
                className="text-gray-900 bg-white"
              >
                {country.label}
              </option>
            ))}
          </select>
        </div>

        {/* Categorías */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Categorías</h4>
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-600">{category}</span>
            </label>
          ))}
        </div>

        {/* Precio */}
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Precio</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-600">Menos de $20.000</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-600">$20.000 - $30.000</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-600">Más de $30.000</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
