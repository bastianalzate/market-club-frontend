"use client";

import {
  Filter,
  Search,
  Globe,
  Tag,
  DollarSign,
  X,
  Package,
} from "lucide-react";
import { useFilters } from "@/hooks/useFilters";

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedPriceRange: string;
  onPriceRangeChange: (priceRange: string) => void;
  selectedPackaging: string;
  onPackagingChange: (packaging: string) => void;
  onClearFilters: () => void;
  hidePriceFilter?: boolean; // Nueva prop opcional para ocultar el filtro de precios
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
  selectedPackaging,
  onPackagingChange,
  onClearFilters,
  hidePriceFilter = false,
}: ProductFiltersProps) {
  // Obtener filtros desde el backend
  const { filters, loading: filtersLoading } = useFilters();

  // Transformar datos del backend al formato esperado
  const countries = [
    { value: "", label: "Todos" },
    ...filters.countries.map((country) => ({
      value: country,
      label: country,
    })),
  ];

  const categories = [
    { value: "", label: "Todas" },
    ...filters.beer_styles.map((style) => ({
      value: style,
      label: style.charAt(0).toUpperCase() + style.slice(1).replace("_", " "),
    })),
  ];

  const packagingTypes = [
    { value: "", label: "Todos" },
    ...filters.packaging_types.map((type) => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    })),
  ];

  const priceRanges = [
    { value: "", label: "Todos los precios" },
    ...filters.price_ranges
      .sort((a, b) => {
        // Extraer números para ordenar correctamente
        const getMinValue = (range: string) => {
          if (range.includes("+")) {
            // Para rangos como "50k+", usar el valor base
            return parseInt(range.replace("k+", "")) * 1000;
          }
          // Para rangos como "0-10k", "10k-25k", etc.
          const match = range.match(/(\d+)k?-(\d+)k?/);
          return match ? parseInt(match[1]) * 1000 : 0;
        };
        
        return getMinValue(a) - getMinValue(b);
      })
      .map((range) => ({
        value: range,
        label: range.replace("k", "k").replace("-", " - "),
      })),
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
        {!hidePriceFilter && (
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
        )}

        {/* Tipo de Empaque */}
        <div className="space-y-3 mt-6">
          <h4 className="text-sm font-medium text-gray-700 flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Tipo de empaque
          </h4>
          <select
            value={selectedPackaging}
            onChange={(e) => onPackagingChange(e.target.value)}
            disabled={filtersLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B58E31] focus:border-transparent text-sm text-gray-900 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {filtersLoading ? (
              <option value="">Cargando...</option>
            ) : (
              packagingTypes.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                  className="text-gray-900 bg-white"
                >
                  {type.label}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Botón Limpiar Filtros */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClearFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        </div>
      </div>
    </div>
  );
}
