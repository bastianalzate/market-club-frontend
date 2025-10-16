"use client";

export default function NewFlavorsSection() {
  return (
    <section className="md:sticky md:top-0 md:z-50 py-8 bg-black overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Bloque izquierdo - Título principal */}
          <div className="lg:pr-8">
            <h2
              className="text-white leading-none"
              style={{
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontSize: "42px",
                lineHeight: "56px",
                letterSpacing: "0px",
                verticalAlign: "middle",
              }}
            >
              Nuevos sabores, estilos y experiencias.
            </h2>
          </div>

          {/* Bloque derecho - Descripción */}
          <div className="lg:pl-8">
            <p
              className="text-white"
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "26px",
                letterSpacing: "0px",
              }}
            >
              Descubre nuestra selección de productos únicos y de calidad, pensados para sorprenderte. 
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
