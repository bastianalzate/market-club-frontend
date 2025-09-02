"use client";

export default function NewFlavorsSection() {
  return (
    <section className="relative py-16 bg-black overflow-hidden">
      {/* Gradiente sutil en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400 opacity-30"></div>

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Bloque izquierdo - Título principal */}
          <div className="lg:pr-8">
            <h2
              className="text-white leading-none"
              style={{
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontSize: "58px",
                lineHeight: "77px",
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
                fontSize: "28px",
                lineHeight: "34px",
                letterSpacing: "0px",
              }}
            >
              Descubre las novedades que tenemos para ti: productos únicos,
              seleccionados para sorprenderte.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
