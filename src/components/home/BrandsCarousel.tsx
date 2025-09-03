"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Datos reales de los proveedores usando las imágenes locales
const proveedores = [
  {
    id: 1,
    name: "Proveedor 1",
    logo: "/images/proveedores/proveedor-01.png",
    alt: "Logo Proveedor 1",
  },
  {
    id: 2,
    name: "Proveedor 2",
    logo: "/images/proveedores/proveedor-02.png",
    alt: "Logo Proveedor 2",
  },
  {
    id: 3,
    name: "Proveedor 3",
    logo: "/images/proveedores/proveedor-03.png",
    alt: "Logo Proveedor 3",
  },
  {
    id: 4,
    name: "Proveedor 4",
    logo: "/images/proveedores/proveedor-04.png",
    alt: "Logo Proveedor 4",
  },
];

export default function BrandsCarousel() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const animate = () => {
      setScrollPosition((prev) => {
        const newPosition = prev + 0.5; // Movimiento más lento
        // Reset cuando llega al final para crear loop infinito
        return newPosition >= 100 ? 0 : newPosition;
      });
    };

    const interval = setInterval(animate, 50); // Actualización cada 50ms para movimiento suave
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-10 bg-white sm:py-16 lg:py-24 relative overflow-hidden">
      {/* Banda negra superior */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-black"></div>
      
      {/* Banda negra inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-black"></div>
      
      {/* Línea dorada vertical izquierda */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-600"></div>
      
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-center">
          {/* Carousel de logos con movimiento continuo */}
          <div className="w-full overflow-hidden">
            <div 
              className="flex transition-transform duration-0"
              style={{
                transform: `translateX(-${scrollPosition}%)`,
                width: `${proveedores.length * 3 * 25}%` // 3 pasadas para movimiento suave
              }}
            >
              {/* Primera pasada de logos */}
              {proveedores.map((proveedor) => (
                <div key={`first-${proveedor.id}`} className="flex-shrink-0 w-1/4 px-1">
                  <div className="flex justify-center">
                    <Image
                      className="object-contain w-auto h-16 sm:h-20 lg:h-24"
                      src={proveedor.logo}
                      alt={proveedor.alt}
                      width={160}
                      height={96}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
              
              {/* Segunda pasada de logos */}
              {proveedores.map((proveedor) => (
                <div key={`second-${proveedor.id}`} className="flex-shrink-0 w-1/4 px-1">
                  <div className="flex justify-center">
                    <Image
                      className="object-contain w-auto h-16 sm:h-20 lg:h-24"
                      src={proveedor.logo}
                      alt={proveedor.alt}
                      width={160}
                      height={96}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
              
              {/* Tercera pasada de logos */}
              {proveedores.map((proveedor) => (
                <div key={`third-${proveedor.id}`} className="flex-shrink-0 w-1/4 px-1">
                  <div className="flex justify-center">
                    <Image
                      className="object-contain w-auto h-16 sm:h-20 lg:h-24"
                      src={proveedor.logo}
                      alt={proveedor.alt}
                      width={160}
                      height={96}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
