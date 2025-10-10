"use client";

import { Beer, Users, Heart, Star, Quote } from "lucide-react";

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-yellow-50 to-yellow-100 py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 rounded-full mb-8 shadow-lg">
              <Beer className="w-10 h-10 text-white" />
            </div>
            <h1 
              className="text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight"
              style={{ fontFamily: 'var(--font-oswald)', fontWeight: 700 }}
            >
              ¿Quiénes somos?
            </h1>
            <div className="w-32 h-1 bg-yellow-500 mx-auto rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Contenido principal */}
              <div className="space-y-8">
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    En Market Club creemos que la vida se disfruta mejor entre risas, buena música y una pola bien fría.
                  </p>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    Nacimos con la idea de hacer de cada trago un parche, de esos que no se planean, pero terminan siendo los mejores.
                  </p>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    El nombre Market Club nació inspirado en Club Colombia, una de las cervezas que más han acompañado los buenos momentos de los colombianos. Pero no queríamos ser sólo una bebida, sino todo lo que pasa alrededor de ella: las charlas con los parceros, los brindis, la energía del partido, los días de sol y los planes que simplemente fluyen.
                  </p>
                </div>
              </div>
              
              {/* Elemento destacado */}
              <div className="relative">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl p-8 lg:p-12 text-white shadow-2xl">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                      <Heart className="w-8 h-8" />
                    </div>
                    <p className="text-lg leading-relaxed mb-6">
                      Así, Market Club se volvió más que una marca: un punto de encuentro, un espacio para compartir, reírse y desconectarse del día a día.
                    </p>
                    <p className="text-lg leading-relaxed mb-6">
                      Somos esa cerveza que acompaña los momentos simples, pero que se sienten grandes cuando estás rodeado de buena gente.
                    </p>
                    <p className="text-lg leading-relaxed mb-8">
                      Hecha con berraquera, sabor y el toque justo pa' compartir con los que más querés.
                    </p>
                    <div className="border-t border-white/20 pt-6">
                      <p className="text-2xl font-bold italic">
                        "Porque al final, Market Club no solo se toma… se vive."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lo que nos hace únicos */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: 'var(--font-oswald)', fontWeight: 700 }}
              >
                Lo que nos hace únicos
              </h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid lg:grid-cols-3 gap-12 mb-16">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-6">
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Historias que Cuentan</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Cada cerveza cuenta una historia, y nosotros te traemos las mejores del mundo para que las vivás a tu manera.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-6">
                    <Beer className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Variedad Mundial</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Reunimos cervezas importadas de casi todos los rincones del planeta, pa' que probés, comparés y encontrés tu favorita sin salir del parche.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-6">
                    <Users className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Punto de Encuentro</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Market Club es ese punto de encuentro donde se juntan los amigos, los brindis, los goles y las risas.
                  </p>
                </div>
              </div>
            </div>

            {/* Texto destacado */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 lg:p-16 text-white text-center">
              <div className="max-w-4xl mx-auto">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 rounded-full mb-8">
                  <Quote className="w-10 h-10 text-white" />
                </div>
                <p className="text-xl lg:text-2xl leading-relaxed mb-6">
                  Un espacio hecho pa' compartir, relajarse y disfrutar lo mejor de todo el mundo… como solo nosotros sabemos hacerlo. 🍻
                </p>
                <p className="text-2xl lg:text-3xl font-bold">
                  Porque no somos un bar cualquiera: Somos el club donde cada cerveza tiene su momento, y cada momento tiene su cerveza.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beto Section */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Imagen/Elemento visual */}
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-3xl p-12 lg:p-16 text-white text-center shadow-2xl">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-8">
                    <Users className="w-12 h-12" />
                  </div>
                  <h3 
                    className="text-4xl font-bold mb-4"
                    style={{ fontFamily: 'var(--font-oswald)', fontWeight: 700 }}
                  >
                    Beto
                  </h3>
                  <p className="text-xl opacity-90">El corazón de Market Club</p>
                </div>
              </div>
              
              {/* Contenido */}
              <div className="order-1 lg:order-2">
                <h2 
                  className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8"
                  style={{ fontFamily: 'var(--font-oswald)', fontWeight: 700 }}
                >
                  Conoce a Beto
                </h2>
                <div className="space-y-6">
                  <p className="text-xl text-gray-700 leading-relaxed">
                    Si has pasado por Market Club, seguro ya lo conocés.
                  </p>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    Beto es quien siempre te recibe con una sonrisa; es él quien se asegura de que nunca falte la buena atención, la charla amable y ese ambiente de casa que tanto nos gusta.
                  </p>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    Más que un anfitrión, es la cara y el corazón de Market.
                  </p>
                  <p className="text-xl text-gray-700 leading-relaxed">
                    El que le pone el toque humano a cada encuentro, el que se sabe todos los nombres y que siempre pregunta si ya probaste una nueva cerveza.
                  </p>
                  
                  <div className="bg-yellow-50 rounded-2xl p-8 mt-12 border-l-4 border-yellow-500">
                    <p className="text-xl font-semibold text-gray-900 leading-relaxed">
                      Porque en Market Club no solo servimos cerveza, servimos momentos,
                      y con Beto ahí —como siempre— pa' que cada uno sea especial.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 lg:py-28 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 
              className="text-4xl lg:text-5xl font-bold text-white mb-8"
              style={{ fontFamily: 'var(--font-oswald)', fontWeight: 700 }}
            >
              ¿Listo para vivir la experiencia Market Club?
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Descubre nuestras cervezas importadas y arma tu regalo perfecto
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a
                href="/tienda"
                className="inline-flex items-center justify-center px-10 py-5 bg-yellow-500 text-white font-bold text-lg rounded-2xl hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Explorar Tienda
              </a>
              <a
                href="/arma-tu-regalo"
                className="inline-flex items-center justify-center px-10 py-5 bg-transparent border-2 border-yellow-500 text-yellow-500 font-bold text-lg rounded-2xl hover:bg-yellow-500 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Armá tu Regalo
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}