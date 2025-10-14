"use client";

export default function TiendaSEOText() {
  const scrollToFilters = () => {
    const filtersElement = document.getElementById('product-filters');
    if (filtersElement) {
      filtersElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  return (
    <section className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none text-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Compra cervezas artesanales e importadas en Market Club
        </h2>
        <p>
          Bienvenido a nuestra tienda de cervezas, el lugar ideal para
          descubrir, comparar y comprar cervezas artesanales e importadas de
          marcas destacadas. Explora una selección curada por estilo, país de
          origen, precio y presentación para encontrar tu próxima favorita.
        </p>
        <br />
        <p>
          Filtra por países como Alemania, Bélgica, Inglaterra o México, o
          navega por estilos populares como IPA, Lager, Stout, Witbier y más.
          También puedes ajustar por rango de precios y tipo de empaque para una
          experiencia de compra rápida y precisa.
        </p>
        <br />
        <p>
          En Market Club te ofrecemos promociones, envíos confiables y un
          catálogo en constante actualización. Si buscas variedad, calidad y un
          buen precio, aquí encontrarás la mejor selección para armar tu pedido
          ideal.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-3">
          ¿Qué cervezas puedes encontrar?
        </h3>
        <ul className="list-disc pl-6">
          <li>Cervezas artesanales locales y de importación</li>
          <li>Estilos clásicos: Lager, Pilsner, Ale, Porter, Stout</li>
          <li>Estilos modernos: IPA, NEIPA, Sour, Witbier</li>
          <li>Presentaciones en botella y lata</li>
        </ul>
        <p className="mt-6">
          ¿Tienes dudas para elegir? Utiliza los filtros o el buscador para
          encontrar exactamente lo que necesitas y disfruta de una experiencia
          de compra sencilla y segura.
        </p>
        <div className="mt-8 text-center">
          <button
            onClick={scrollToFilters}
            className="inline-flex items-center px-6 py-3 bg-[#B58E31] text-white font-semibold rounded-lg hover:bg-[#A07A2A] transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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

