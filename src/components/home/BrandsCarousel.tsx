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
    <section className="relative overflow-hidden bg-white" style={{ height: '150px', maxHeight: '150px' }}>
      {/* Banda negra superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-black"></div>
      
      {/* Banda negra inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-black"></div>
      
      {/* Contenedor del carrusel de logos */}
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl" style={{ height: '150px' }}>
        <div className="flex items-center justify-center h-full">
          {/* Carousel de logos verdaderamente infinito */}
          <div className="w-full overflow-hidden h-full flex items-center">
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
