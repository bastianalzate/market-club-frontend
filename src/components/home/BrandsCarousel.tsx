import Image from "next/image";

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
  {
    id: 5,
    name: "Proveedor 5",
    logo: "/images/proveedores/proveedor-05.png",
    alt: "Logo Proveedor 5",
  },
];

export default function BrandsCarousel() {

  return (
    <section className="py-10 bg-white sm:py-16 lg:py-24 relative overflow-hidden">
      {/* Banda negra superior */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-black"></div>
      
      {/* Banda negra inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-black"></div>
      
      {/* Línea dorada vertical izquierda */}
      
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-center">
          {/* Carousel de logos verdaderamente infinito */}
          <div className="w-full overflow-hidden">
            <div className="whitespace-nowrap overflow-hidden">
              <div 
                className="inline-block"
                style={{
                  animation: 'scroll-logos 15s linear infinite'
                }}
              >
              {/* Primera secuencia de logos */}
              {proveedores.map((proveedor) => (
                <div key={`first-${proveedor.id}`} className="inline-block w-64 mx-8">
                  <div className="flex justify-center">
                    <Image
                      className="object-contain w-auto h-32 sm:h-40 lg:h-48"
                      src={proveedor.logo}
                      alt={proveedor.alt}
                      width={250}
                      height={150}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
              
              {/* Segunda secuencia de logos (duplicada para scroll infinito) */}
              {proveedores.map((proveedor) => (
                <div key={`second-${proveedor.id}`} className="inline-block w-64 mx-8">
                  <div className="flex justify-center">
                    <Image
                      className="object-contain w-auto h-32 sm:h-40 lg:h-48"
                      src={proveedor.logo}
                      alt={proveedor.alt}
                      width={250}
                      height={150}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
