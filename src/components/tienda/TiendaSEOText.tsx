"use client";

export default function TiendaSEOText() {
  const scrollToFilters = () => {
    const filtersElement = document.getElementById("product-filters");
    if (filtersElement) {
      filtersElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  return (
    <section className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none text-gray-700">
        <h2
          className="text-[30px] sm:text-2xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: "var(--font-lato)" }}
        >
          ¡Market Club es el parche pa' la pola artesanal e importada! 🍺
        </h2>
        <p style={{ fontFamily: "var(--font-lato)" }}>
          ¡Bienvenido a nuestro rincón cervecero! Este es el lugar bacano pa'
          que descubras, compares y te antojes de las polas artesanales e
          importadas con buen tumbao. Tenemos la selección curada perfecta para
          vos, lista pa' filtrar por estilo, país de origen, precio y
          presentación pa' que encuentres esa nueva favorita sin enredos.
        </p>
        <br />
        <p style={{ fontFamily: "var(--font-lato)" }}>
          Ponle el ojo a países como Alemania, Bélgica, Inglaterra o México, o
          navegá por estilos organizados según nuestro nuevo catálogo: Lager
          Clásica / Pilsner, Lager Oscura / Fuerte, Lager Ligera, India Pale Ale
          (IPA), Cerveza de Trigo (Wheat), Ale Belga Clásica, Stout / Porter y
          Cervezas de Fruta o Saborizadas. También podés cuadrar el filtro por
          rango de precios y tipo de empaque (lata o botella) pa' que la compra
          sea rápida y precisa.
        </p>
        <br />
        <p style={{ fontFamily: "var(--font-lato)" }}>
          En Market Club te tiramos promos que enamoran, te aseguramos envíos
          confiables y tenemos el catálogo que siempre está al día. Si estás
          buscando variedad, calidad y un buen precio, aquí está la mejor
          selección pa' que armés tu pedido ideal.
        </p>
        <h3
          className="text-[30px] sm:text-xl font-semibold text-gray-900 mt-8 mb-3"
          style={{ fontFamily: "var(--font-lato)" }}
        >
          ¿Y qué polas podés encontrar?
        </h3>
        <ul
          className="list-disc pl-6"
          style={{ fontFamily: "var(--font-lato)" }}
        >
          <li>Artesanales (locales e importadas).</li>
          <li>
            Estilos Clásicos que refrescan: Lager Clásica / Pilsner, Lager
            Oscura / Fuerte y Lager Ligera.
          </li>
          <li>
            Estilos Modernos que están de moda: India Pale Ale (IPA), Cervezas
            de Trigo y Ales Belgas Clásicas.
          </li>
          <li>En el formato que te guste: botella o lata.</li>
        </ul>
        <p className="mt-6" style={{ fontFamily: "var(--font-lato)" }}>
          ¿Tenés dudas pa' elegir? Usá los filtros o el buscador pa' que
          encontrés exactamente lo que necesitás. ¡Disfrutá la compra, que aquí
          es sencilla y segura!
        </p>
        <h3
          className="text-[30px] sm:text-xl font-semibold text-gray-900 mt-8 mb-3"
          style={{ fontFamily: "var(--font-lato)" }}
        >
          Nuestras categorías
        </h3>
        <ul
          className="list-disc pl-6 space-y-2"
          style={{ fontFamily: "var(--font-lato)" }}
        >
          <li>
            <strong>Lager Clásica / Pilsner:</strong> Lager claras y
            refrescantes (incluye Helles, Dortmunder y Pilsners
            alemanas/checas).
          </li>
          <li>
            <strong>Lager Oscura / Fuerte:</strong> Lagers de color oscuro
            (Dunkel, Schwarzbier) y Lagers de alta graduación (Bock, Strong
            Lager).
          </li>
          <li>
            <strong>Lager Ligera:</strong> Lagers con bajo contenido de alcohol
            o alto uso de adjuntos para hacerlas muy pálidas y ligeras (incluye
            la mayoría de las mexicanas y estadounidenses).
          </li>
          <li>
            <strong>India Pale Ale (IPA):</strong> Cervezas Ale intensamente
            lupuladas y amargas.
          </li>
          <li>
            <strong>Cerveza de Trigo (Wheat):</strong> Cervezas elaboradas con
            malta de trigo (Hefeweizen, Witbier, etc.).
          </li>
          <li>
            <strong>Ale Belga Clásica:</strong> Cervezas Ale complejas, de alta
            fermentación, a menudo fuertes (Tripel, Dubbel, Quadrupel, Strong
            Golden Ale).
          </li>
          <li>
            <strong>Stout / Porter:</strong> Cervezas muy oscuras, con sabores a
            café, chocolate o malta tostada.
          </li>
          <li>
            <strong>Cerveza de Fruta / Saborizada:</strong> Cervezas que tienen
            frutas añadidas o son Radler (mezclas con zumo).
          </li>
        </ul>
        <div className="mt-8 text-center">
          <button
            onClick={scrollToFilters}
            className="inline-flex items-center px-6 py-3 bg-[#B58E31] text-white font-semibold rounded-lg hover:bg-[#A07A2A] transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Buscar ahora
          </button>
        </div>
      </div>
    </section>
  );
}
