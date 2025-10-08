"use client";

import React from "react";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del perfil - Skeleton */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar Skeleton */}
            <div className="relative">
              <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse"></div>
            </div>

            {/* Información del usuario - Skeleton */}
            <div className="flex-1 space-y-3">
              {/* Nombre */}
              <div className="h-8 bg-gray-200 rounded animate-pulse w-64"></div>
              
              {/* Email y teléfono */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
              </div>
              
              {/* Badge */}
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal - Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navegación lateral - Skeleton */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                {/* Título */}
                <div className="h-5 bg-gray-200 rounded animate-pulse w-24"></div>
                
                {/* Items de navegación */}
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-32"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contenido de la pestaña - Skeleton */}
          <div className="flex-1">
            <div className="space-y-6">
              {/* Tarjetas de estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((card) => (
                  <div key={card} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                        <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                      </div>
                      <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sección de premium */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-48"></div>
                    <div className="h-4 bg-gray-100 rounded animate-pulse w-64"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






