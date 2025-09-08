"use client";

export default function NewFlavorsSection() {
  return (
    <section className="relative py-16 bg-black overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-center lg:justify-between">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Beauty & Personal Care
          </h2>

          <div className="hidden lg:flex">
            <a
              href="#"
              title=""
              className="inline-flex items-center justify-center p-1 -m-1 text-sm font-bold text-gray-600 transition-all duration-200 rounded-md focus:text-gray-900 focus:ring-gray-900 focus:ring-2 focus:ring-offset-2 focus:outline-none hover:text-gray-900"
            >
              Check all items
              <svg
                className="w-5 h-5 ml-2 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>

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
