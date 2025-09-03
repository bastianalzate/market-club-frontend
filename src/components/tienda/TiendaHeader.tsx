"use client";

import { ShoppingCart } from "lucide-react";

interface TiendaHeaderProps {
  productCount: number;
}

export default function TiendaHeader({ productCount }: TiendaHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Título y descripción */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tienda</h1>
            <p className="text-gray-600 mt-1">
              Descubre nuestra selección de cervezas artesanales e importadas
            </p>
          </div>

          {/* Contador de productos */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              {productCount} productos
            </span>
            <button className="relative p-2 text-gray-600 hover:text-gray-900">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
