"use client";

export default function FeaturedProductSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
      {/* Imagen skeleton */}
      <div
        className="aspect-w-1 aspect-h-1 overflow-hidden pt-4"
        style={{ height: "400px" }}
      >
        <div className="w-full h-full bg-gray-200 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
        </div>
      </div>

      {/* Contenido skeleton */}
      <div className="p-6 space-y-4">
        {/* Volumen y precio */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-16"></div>
        </div>

        {/* Nombre del producto */}
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>

        {/* Botones */}
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 h-12 bg-gray-200 rounded-lg"></div>
        </div>
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
