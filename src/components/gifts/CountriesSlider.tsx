"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Globe,
  Award,
  Users,
  Star,
} from "lucide-react";

interface Country {
  id: string;
  name: string;
  flag: string; // URL de la imagen de la bandera
  beerCount: number;
  popularBeers: string[];
  description: string;
  capital: string;
  population: string;
  beerTradition: string;
  specialty: string;
}

const countries: Country[] = [
  {
    id: "germany",
    name: "Alemania",
    flag: "https://flagcdn.com/w80/de.png",
    beerCount: 2,
    popularBeers: ["PAULANER WEISSBIER", "ERDINGER"],
    description: "Cuna de la cerveza de trigo y la Ley de Pureza de 1516",
    capital: "Berlín",
    population: "83.2M",
    beerTradition: "500+ años",
    specialty: "Weissbier & Pilsner",
  },
  {
    id: "belgium",
    name: "Bélgica",
    flag: "https://flagcdn.com/w80/be.png",
    beerCount: 2,
    popularBeers: ["LIEFMANS FRUITESSE", "STELLA ARTOIS"],
    description: "Patrimonio UNESCO de la tradición cervecera",
    capital: "Bruselas",
    population: "11.6M",
    beerTradition: "1000+ años",
    specialty: "Trappist & Lambic",
  },
  {
    id: "netherlands",
    name: "Holanda",
    flag: "https://flagcdn.com/w80/nl.png",
    beerCount: 1,
    popularBeers: ["HEINEKEN"],
    description: "Innovación en cerveza lager premium",
    capital: "Ámsterdam",
    population: "17.5M",
    beerTradition: "400+ años",
    specialty: "Lager & Pilsner",
  },
  {
    id: "mexico",
    name: "México",
    flag: "https://flagcdn.com/w80/mx.png",
    beerCount: 1,
    popularBeers: ["CORONA EXTRA"],
    description: "Cerveza refrescante perfecta para el clima tropical",
    capital: "Ciudad de México",
    population: "128.9M",
    beerTradition: "150+ años",
    specialty: "Lager Clara",
  },
  {
    id: "ireland",
    name: "Irlanda",
    flag: "https://flagcdn.com/w80/ie.png",
    beerCount: 1,
    popularBeers: ["GUINNESS"],
    description: "Tradición centenaria de stout irlandesa",
    capital: "Dublín",
    population: "5.0M",
    beerTradition: "300+ años",
    specialty: "Stout & Porter",
  },
  {
    id: "usa",
    name: "Estados Unidos",
    flag: "https://flagcdn.com/w80/us.png",
    beerCount: 1,
    popularBeers: ["BUDWEISER"],
    description: "Craft beer revolution y tradición americana",
    capital: "Washington D.C.",
    population: "331.9M",
    beerTradition: "200+ años",
    specialty: "IPA & Lager",
  },
];

export default function CountriesSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % countries.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + countries.length) % countries.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % countries.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Título de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Cervezas de Todo el Mundo
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre la diversidad de sabores y tradiciones cerveceras de
            diferentes países
          </p>
        </div>

        {/* Slider de países */}
        <div className="relative">
          {/* Botones de navegación */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Contenedor del slider */}
          <div ref={sliderRef} className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {countries.map((country, index) => (
                <div key={country.id} className="w-full flex-shrink-0">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden mx-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                      {/* Información del país */}
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center mb-8">
                          <div className="w-24 h-18 mr-8 rounded-xl overflow-hidden shadow-xl border-3 border-gray-200">
                            <img
                              src={country.flag}
                              alt={`Bandera de ${country.name}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-4xl font-bold text-gray-900 mb-3">
                              {country.name}
                            </h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                              {country.description}
                            </p>
                          </div>
                        </div>

                        {/* Estadísticas del país */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <Globe className="w-4 h-4 text-[#B58E31] mr-2" />
                              <span className="text-sm font-medium text-gray-700">
                                Capital
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {country.capital}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center mb-2">
                              <Users className="w-4 h-4 text-[#B58E31] mr-2" />
                              <span className="text-sm font-medium text-gray-700">
                                Población
                              </span>
                            </div>
                            <p className="text-lg font-semibold text-gray-900">
                              {country.population}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="flex items-center text-[#B58E31] bg-[#B58E31]/5 rounded-lg p-4">
                            <Award className="w-6 h-6 mr-3" />
                            <div>
                              <span className="font-bold text-lg">
                                {country.beerCount}{" "}
                                {country.beerCount === 1
                                  ? "cerveza"
                                  : "cervezas"}{" "}
                                disponible{country.beerCount > 1 ? "s" : ""}
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                Tradición: {country.beerTradition} •
                                Especialidad: {country.specialty}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center">
                              <Star className="w-5 h-5 text-[#B58E31] mr-2" />
                              Cervezas populares:
                            </h4>
                            <ul className="space-y-3">
                              {country.popularBeers.map((beer, beerIndex) => (
                                <li
                                  key={beerIndex}
                                  className="text-gray-700 flex items-center bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                                >
                                  <span className="w-3 h-3 bg-[#B58E31] rounded-full mr-4"></span>
                                  <span className="font-medium">{beer}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Grid de banderas de países */}
                      <div className="grid grid-cols-2 gap-4">
                        {countries.map((flagCountry) => (
                          <div
                            key={flagCountry.id}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                              flagCountry.id === country.id
                                ? "border-[#B58E31] bg-[#B58E31]/5 shadow-lg"
                                : "border-gray-200 hover:border-[#B58E31] hover:shadow-md"
                            }`}
                            onMouseEnter={() => setIsHovered(flagCountry.id)}
                            onMouseLeave={() => setIsHovered(null)}
                          >
                            <div className="text-center">
                              <div className="w-12 h-8 mx-auto mb-3 rounded overflow-hidden shadow-md border border-gray-200">
                                <img
                                  src={flagCountry.flag}
                                  alt={`Bandera de ${flagCountry.name}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <h5 className="font-semibold text-gray-900 text-sm mb-1">
                                {flagCountry.name}
                              </h5>
                              <p className="text-xs text-gray-500">
                                {flagCountry.beerCount} cerveza
                                {flagCountry.beerCount > 1 ? "s" : ""}
                              </p>

                              {/* Tooltip en hover */}
                              {isHovered === flagCountry.id && (
                                <div className="absolute z-20 mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg transform -translate-x-1/2 left-1/2">
                                  <div className="font-semibold mb-1">
                                    {flagCountry.name}
                                  </div>
                                  <div>{flagCountry.description}</div>
                                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores */}
          <div className="flex justify-center mt-8 space-x-2">
            {countries.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-[#B58E31] scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Estadísticas globales */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Nuestra Selección Global
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Cuidadosamente seleccionadas de los mejores productores del mundo
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-[#B58E31] to-[#D4A853] rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#B58E31] mb-2">
                {countries.length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Países</div>
              <div className="text-xs text-gray-500 mt-1">Representados</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-[#B58E31] to-[#D4A853] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#B58E31] mb-2">
                {countries.reduce((sum, country) => sum + country.beerCount, 0)}
              </div>
              <div className="text-sm text-gray-600 font-medium">Cervezas</div>
              <div className="text-xs text-gray-500 mt-1">Premium</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-[#B58E31] to-[#D4A853] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#B58E31] mb-2">4</div>
              <div className="text-sm text-gray-600 font-medium">
                Categorías
              </div>
              <div className="text-xs text-gray-500 mt-1">Diferentes</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-[#B58E31] to-[#D4A853] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-[#B58E31] mb-2">100%</div>
              <div className="text-sm text-gray-600 font-medium">Calidad</div>
              <div className="text-xs text-gray-500 mt-1">Garantizada</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
