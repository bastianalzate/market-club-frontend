"use client";

import { Filter, Search, Globe, Tag, DollarSign, X } from "lucide-react";

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPriceRange: string;
  onPriceRangeChange: (priceRange: string) => void;
  onClearFilters: () => void;
}

export default function ProductFilters({
  searchTerm,
  onSearchChange,
  selectedCountry,
  onCountryChange,
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceRangeChange,
  onClearFilters,
}: ProductFiltersProps) {
  const categories = [
    { value: "", label: "Todas" },
    { value: "ale", label: "Cervezas Ale" },
    { value: "blonde", label: "Cervezas Rubias" },
    { value: "dark", label: "Cervezas Oscuras" },
    { value: "ipa", label: "India Pale Ale" },
    { value: "lager", label: "Cervezas Lager" },
    { value: "pale_ale", label: "Pale Ale" },
    { value: "pilsner", label: "Cervezas Pilsner" },
    { value: "porter", label: "Cervezas Porter" },
    { value: "wheat", label: "Cervezas de Trigo" },
  ];

  const priceRanges = [
    { value: "", label: "Todos los precios" },
    { value: "less_than_15000", label: "Menos de $15.000" },
    { value: "15000_25000", label: "$15.000 - $25.000" },
    { value: "25000_35000", label: "$25.000 - $35.000" },
    { value: "35000_50000", label: "$35.000 - $50.000" },
    { value: "50000_75000", label: "$50.000 - $75.000" },
    { value: "75000_100000", label: "$75.000 - $100.000" },
    { value: "more_than_100000", label: "Más de $100.000" },
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
        <div className="space-y-3 mt-6">
          <h4 className="text-sm font-medium text-gray-700 flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            Estilo de cerveza
          </h4>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58E31] focus:border-transparent text-sm text-gray-900 bg-white"
          >
            {categories.map((category) => (
              <option
                key={category.value}
                value={category.value}
                className="text-gray-900 bg-white"
              >
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Rango de Precios */}
        <div className="space-y-3 mt-6">
          <h4 className="text-sm font-medium text-gray-700 flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            Rango de precios
          </h4>
          <select
            value={selectedPriceRange}
            onChange={(e) => onPriceRangeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58E31] focus:border-transparent text-sm text-gray-900 bg-white"
          >
            {priceRanges.map((range) => (
              <option
                key={range.value}
                value={range.value}
                className="text-gray-900 bg-white"
              >
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Botón Limpiar Filtros */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClearFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
