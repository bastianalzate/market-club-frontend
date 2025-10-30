"use client";

import { useState, useRef, useEffect } from "react";

interface LazyImageProps {
  src: string | null;
  alt: string;
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export default function LazyImage({
  src,
  alt,
  className = "",
  fallbackIcon,
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Si no hay imagen o es placeholder, mostrar el fallback
  if (!src || src === "/images/products/placeholder.jpg") {
    // Detectar si es un espacio pequeño (como en el carrito)
    const isSmallSpace = className.includes('w-16') || className.includes('w-12') || className.includes('w-20');
    
    return (
      <div
        className={`w-full h-full flex items-center justify-center relative ${className}`}
        style={{
          backgroundImage: `url('/images/cervezas/MARKET-FD.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Imagen de cerveza superpuesta */}
        <img
          src="/images/cervezas/MARKET-CLUB-BEER.png"
          alt={alt}
          className="w-full h-full object-contain"
        />
        {fallbackIcon && (
          <div className="absolute inset-0 flex items-center justify-center">
            {fallbackIcon}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {/* Skeleton mientras carga */}
      {isLoading && isInView && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer"></div>
        </div>
      )}

      {/* Imagen real */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-contain transition-all duration-300 hover:scale-105 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div
          className="w-full h-full flex items-center justify-center relative"
          style={{
            backgroundImage: `url('/images/cervezas/MARKET-FD.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {/* Imagen de cerveza superpuesta */}
          <img
            src="/images/cervezas/MARKET-CLUB-BEER.png"
            alt={alt}
            className="w-full h-full object-contain"
          />
          {fallbackIcon && (
            <div className="absolute inset-0 flex items-center justify-center">
              {fallbackIcon}
            </div>
          )}
        </div>
      )}
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
