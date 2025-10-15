"use client";

import {
  Beer,
  Users,
  Heart,
  Star,
  Quote,
  Sparkles,
  Trophy,
  Smile,
  Globe,
  Coffee,
} from "lucide-react";
import Image from "next/image";

export default function QuienesSomosPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B58E31]/20 to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#B58E31]/10 backdrop-blur-sm border border-[#B58E31]/20 rounded-full px-6 py-3 mb-8">
              <Beer className="w-5 h-5 text-[#B58E31]" />
              <span className="text-[#B58E31] font-medium">
                Nuestra Historia
              </span>
            </div>
            <h1
              className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-oswald)", fontWeight: 700 }}
            >
              ¿Quiénes Somos?
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              En Market Club creemos que la vida se disfruta mejor entre risas,
              buena música y una pola bien fría
            </p>
            <div className="flex items-center justify-center gap-3 mt-12">
              <div className="w-16 h-1 bg-[#B58E31] rounded-full"></div>
              <Beer className="w-6 h-6 text-[#B58E31]" />
              <div className="w-16 h-1 bg-[#B58E31] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B58E31]/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Contenido principal */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-[#B58E31]/10 rounded-full px-4 py-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#B58E31]" />
                  <span className="text-[#B58E31] font-medium text-sm">
                    Desde el corazón
                  </span>
                </div>

                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p>
                    Nacimos con la idea de hacer de cada trago un parche, de
                    esos que no se planean, pero terminan siendo los mejores.
                  </p>
                  <p>
                    El nombre{" "}
                    <span className="font-bold text-gray-900">Market Club</span>{" "}
                    nació inspirado en{" "}
                    <span className="font-bold text-[#B58E31]">
                      Club Colombia
                    </span>
                    , una de las cervezas que más han acompañado los buenos
                    momentos de los colombianos.
                  </p>
                  <p>
                    Pero no queríamos ser sólo una bebida, sino todo lo que pasa
                    alrededor de ella: las charlas con los parceros, los
                    brindis, la energía del partido, los días de sol y los
                    planes que simplemente fluyen.
                  </p>
                </div>
              </div>

              {/* Elemento destacado - Card grande */}
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#B58E31]/20 rounded-full blur-xl"></div>
                <div className="relative bg-gradient-to-br from-[#B58E31] to-[#A67D2A] rounded-3xl p-10 lg:p-12 text-white shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <div className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-8 mx-auto">
                    <Heart className="w-10 h-10" />
                  </div>

                  <div className="space-y-6 text-center">
                    <p className="text-lg leading-relaxed">
                      Así, Market Club se volvió{" "}
                      <span className="font-bold">más que una marca</span>: un
                      punto de encuentro, un espacio para compartir, reírse y
                      desconectarse del día a día.
                    </p>
                    <p className="text-lg leading-relaxed">
                      Somos esa cerveza que acompaña los momentos simples, pero
                      que se sienten grandes cuando estás rodeado de buena
                      gente.
                    </p>
                    <p className="text-lg leading-relaxed font-medium">
                      Hecha con berraquera, sabor y el toque justo pa' compartir
                      con los que más querés.
                    </p>

                    <div className="border-t border-white/30 pt-8 mt-8">
                      <Quote className="w-8 h-8 mx-auto mb-4 opacity-50" />
                      <p className="text-2xl lg:text-3xl font-bold italic">
                        "Market Club no solo se toma… se vive."
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
      <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header de sección */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 mb-6 shadow-sm border border-gray-200">
                <Trophy className="w-5 h-5 text-[#B58E31]" />
                <span className="text-gray-900 font-medium">
                  Nuestra Esencia
                </span>
              </div>
              <h2
                className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: "var(--font-oswald)", fontWeight: 700 }}
              >
                Lo que nos hace únicos
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                En Market Club creemos que cada cerveza cuenta una historia, y
                nosotros te traemos las mejores del mundo para que las vivás a
                tu manera.
              </p>
            </div>

            {/* Cards mejoradas */}
            <div className="grid lg:grid-cols-3 gap-8 mb-20">
              {/* Card 1 */}
              <div className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#B58E31] to-[#A67D2A] rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  <h3
                    className="text-2xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    Historias que Cuentan
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Cada cerveza cuenta una historia, y nosotros te traemos las
                    mejores del mundo para que las vivás a tu manera.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#B58E31] to-[#A67D2A] rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Globe className="w-10 h-10 text-white" />
                  </div>
                  <h3
                    className="text-2xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    Variedad Mundial
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Reunimos en un solo lugar cervezas importadas de casi todos
                    los rincones del planeta, pa' que probés, comparés y
                    encontrés tu favorita sin salir del parche.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="group bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#B58E31] to-[#A67D2A] rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3
                    className="text-2xl font-bold text-gray-900 mb-4"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    Punto de Encuentro
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Market Club es ese punto de encuentro donde se juntan los
                    amigos, los brindis, los goles y las risas.
                  </p>
                </div>
              </div>
            </div>

            {/* Texto destacado grande */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-12 lg:p-20 text-white text-center overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#B58E31]/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B58E31]/10 rounded-full blur-3xl"></div>

                <div className="relative max-w-4xl mx-auto">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-[#B58E31] rounded-full mb-10 shadow-2xl">
                    <Quote className="w-12 h-12 text-white" />
                  </div>

                  <p className="text-xl lg:text-2xl leading-relaxed mb-8 text-gray-300">
                    Un espacio hecho pa' compartir, relajarse y disfrutar lo
                    mejor de todo el mundo… como solo nosotros sabemos hacerlo.
                    🍻
                  </p>

                  <div className="w-20 h-1 bg-[#B58E31] mx-auto mb-8 rounded-full"></div>

                  <p
                    className="text-3xl lg:text-4xl font-bold leading-tight"
                    style={{ fontFamily: "var(--font-oswald)" }}
                  >
                    No somos un bar cualquiera: Somos el club donde cada cerveza
                    tiene su momento, y cada momento tiene su cerveza.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beto Section */}
      <section className="py-20 lg:py-32 bg-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B58E31]/5 rounded-full blur-3xl"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-[#B58E31]/10 rounded-full px-6 py-3 mb-6 border border-[#B58E31]/20">
                <Smile className="w-5 h-5 text-[#B58E31]" />
                <span className="text-[#B58E31] font-medium">
                  El alma de Market
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Tarjeta visual de Beto */}
              <div className="order-2 lg:order-1">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#B58E31]/20 rounded-full blur-2xl"></div>
                  <div className="relative bg-gradient-to-br from-[#B58E31] via-[#A67D2A] to-[#8B6F1F] rounded-3xl p-16 text-white text-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <div className="inline-flex items-center justify-center w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full mb-8 shadow-xl">
                      <Users className="w-16 h-16" />
                    </div>
                    <h3
                      className="text-5xl lg:text-6xl font-bold mb-6"
                      style={{
                        fontFamily: "var(--font-oswald)",
                        fontWeight: 700,
                      }}
                    >
                      Beto
                    </h3>
                    <div className="w-20 h-1 bg-white/50 mx-auto mb-6 rounded-full"></div>
                    <p className="text-2xl font-medium">
                      El corazón de Market Club
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-2">
                      <Heart className="w-6 h-6 text-white/80" />
                      <Heart className="w-8 h-8" />
                      <Heart className="w-6 h-6 text-white/80" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenido sobre Beto */}
              <div className="order-1 lg:order-2 space-y-6">
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  <p className="text-xl">
                    Si has pasado por Market Club,{" "}
                    <span className="font-bold text-gray-900">
                      seguro ya lo conocés.
                    </span>
                  </p>
                  <p>
                    Beto es quien siempre te recibe con una sonrisa; es él quien
                    se asegura de que nunca falte la buena atención, la charla
                    amable y ese ambiente de casa que tanto nos gusta.
                  </p>
                  <p className="font-semibold text-gray-900">
                    Más que un anfitrión, es la cara y el corazón de Market.
                  </p>
                  <p>
                    El que le pone el toque humano a cada encuentro, el que se
                    sabe todos los nombres y que siempre pregunta si ya probaste
                    una nueva cerveza.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-[#B58E31]/10 to-[#A67D2A]/10 rounded-2xl p-8 mt-10 border-l-4 border-[#B58E31] shadow-lg">
                  <div className="flex items-start gap-4">
                    <Quote className="w-8 h-8 text-[#B58E31] flex-shrink-0 mt-1" />
                    <p className="text-xl font-semibold text-gray-900 leading-relaxed">
                      Porque en Market Club no solo servimos cerveza, servimos
                      momentos, y con Beto ahí —como siempre— pa' que cada uno
                      sea especial.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-24 lg:py-32 bg-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#B58E31]/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B58E31]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#B58E31]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#B58E31]/10 backdrop-blur-sm border border-[#B58E31]/20 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-[#B58E31]" />
              <span className="text-[#B58E31] font-medium">
                Empieza tu experiencia
              </span>
            </div>

            <h2
              className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "var(--font-oswald)", fontWeight: 700 }}
            >
              ¿Listo para vivir la experiencia Market Club?
            </h2>

            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Descubre nuestras cervezas importadas, arma tu regalo perfecto y
              únete al club donde cada momento cuenta
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="/tienda"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#B58E31] text-black font-bold text-lg rounded-2xl hover:bg-[#A67D2A] transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-[#B58E31]/50 cursor-pointer"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                <Beer className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                Explorar Tienda
              </a>
              <a
                href="/arma-tu-regalo"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-transparent border-2 border-[#B58E31] text-[#B58E31] font-bold text-lg rounded-2xl hover:bg-[#B58E31] hover:text-black transition-all duration-300 transform hover:scale-105 cursor-pointer"
                style={{ fontFamily: "var(--font-oswald)" }}
              >
                <Heart className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                Armá tu Regalo
              </a>
            </div>

            <div className="flex items-center justify-center gap-3 mt-16 opacity-50">
              <div className="w-12 h-1 bg-[#B58E31] rounded-full"></div>
              <Beer className="w-5 h-5 text-[#B58E31]" />
              <div className="w-12 h-1 bg-[#B58E31] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
