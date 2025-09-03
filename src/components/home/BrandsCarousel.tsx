"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    let animationId: number;
    let currentPosition = 0;
    const speed = 3; // Velocidad rápida

    const animate = () => {
      currentPosition += speed;
      
      // Si llegamos al final de la primera secuencia, reiniciamos sin salto visual
      if (currentPosition >= proveedores.length * 64) {
        currentPosition = 0;
      }
      
      scrollElement.style.transform = `translateX(-${currentPosition}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
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
          {/* Carousel de logos verdaderamente infinito */}
          <div className="w-full overflow-hidden">
            <div 
              ref={scrollRef}
              className="flex transition-transform duration-0"
              style={{
                width: `${proveedores.length * 6 * 64}px`
              }}
            >
              {/* Primera pasada de logos */}
              {proveedores.map((proveedor) => (
                <div key={`first-${proveedor.id}`} className="flex-shrink-0 w-64">
                  <div className="flex justify-center">
                    <Image
                      className="object-contain w-auto h-24 sm:h-32 lg:h-40"
                      src={proveedor.logo}
                      alt={proveedor.alt}
                      width={200}
                      height={120}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
              
              {/* Segunda pasada de logos */}
              {proveedores.map((proveedor) => (
                <div key={`second-${proveedor.id}`} className="flex-shrink-0 w-64">
                  <div className="flex justify-center">
                    <Image
                      className="object-contain w-auto h-24 sm:h-32 lg:h-40"
                      src={proveedor.logo}
                      alt={proveedor.alt}
                      width={200}
                      height={120}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
              
              {/* Tercera pasada de logos */}
              {proveedores.map((proveedor) => (
                <div key={`third-${proveedor.id}`} className="flex-shrink-0 w-64">
                  <div className="flex justify-center">
                    <Image
                      className="object-contain w-auto h-24 sm:h-32 lg:h-40"
                      src={proveedor.logo}
                      alt={proveedor.alt}
                      width={200}
                      height={120}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
              
              {/* Cuarta pasada de logos */}
              {proveedores.map((proveedor) => (
                <div key={`fourth-${proveedor.id}`} className="flex-shrink-0 w-64">
                  <div className="flex justify-center">
                    <Image
                      className="object-contain w-auto h-24 sm:h-32 lg:h-40"
                      src={proveedor.logo}
                      alt={proveedor.alt}
                      width={200}
                      height={120}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
              
              {/* Quinta pasada de logos */}
              {proveedores.map((proveedor) => (
                <div key={`fifth-${proveedor.id}`} className="flex-shrink-0 w-64">
                  <div className="flex justify-center">
                    <Image
                      className="object-contain w-auto h-24 sm:h-32 lg:h-40"
                      src={proveedor.logo}
                      alt={proveedor.alt}
                      width={200}
                      height={120}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
              
              {/* Sexta pasada de logos */}
              {proveedores.map((proveedor) => (
                <div key={`sixth-${proveedor.id}`} className="flex-shrink-0 w-64">
                  <div className="flex justify-center">
                    <Image
                      className="object-contain w-auto h-24 sm:h-32 lg:h-40"
                      src={proveedor.logo}
                      alt={proveedor.alt}
                      width={200}
                      height={120}
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
