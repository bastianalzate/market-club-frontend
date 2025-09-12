"use client";

import { ImageOff } from "lucide-react";

export default function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Imagen skeleton */}
      <div
        className="w-full bg-gray-100 rounded-t-lg mb-4 relative overflow-hidden flex items-center justify-center"
        style={{ height: "354px" }}
      >
        {/* Icono de sin imagen */}
        <div className="flex flex-col items-center justify-center text-gray-400">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3">
            <ImageOff className="w-10 h-10 text-gray-500" />
          </div>
          <p className="text-sm font-medium text-gray-500">Sin imagen</p>
        </div>
      </div>

      {/* Información del producto skeleton */}
      <div className="space-y-3">
        {/* Nombre del producto */}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>

        {/* Descripción */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>

        {/* Precio */}
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>

        {/* Botón */}
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
  );
}
