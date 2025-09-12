"use client";

export default function ProductSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Imagen skeleton */}
      <div className="w-full h-48 bg-gray-200 rounded-t-lg mb-4 relative overflow-hidden">
        {/* Efecto de shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>

        {/* Icono de cerveza centrado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
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

// CSS para la animación shimmer
const shimmerStyles = `
  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

// Inyectar estilos
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = shimmerStyles;
  document.head.appendChild(styleSheet);
}
