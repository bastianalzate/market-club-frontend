"use client";

import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="">
      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden sm:pb-16 lg:pb-20 xl:pb-24">
        {/* Fondo negro simple */}
        <div className="absolute inset-0 z-0 bg-black"></div>
        <div className="px-4 mx-auto relative z-10 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid items-start grid-cols-1 gap-y-12 lg:grid-cols-2 gap-x-16 pt-16">
            <div className="text-center lg:text-left">
              <h1
                className="font-bold text-white"
                style={{ fontFamily: "var(--font-oswald)", fontSize: "80px" }}
              >
                <span className="block">Brinda como</span>
                <span className="block">en Oktoberfest</span>
              </h1>
              <p
                className="mt-4 text-lg font-normal text-white sm:mt-8"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                Directo desde Múnich, esta cerveza de trigo alemana es un ícono
                de sabor y tradición.
              </p>

              <form
                action="#"
                method="POST"
                className="relative mt-8 rounded-full sm:mt-12"
              >
                <div className="relative">
                  <div className="absolute rounded-full -inset-px bg-gradient-to-r from-amber-500 to-orange-500"></div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-6">
                      <Search className="w-5 h-5 text-gray-500" />
                    </div>
                    <input
                      type="text"
                      name=""
                      id=""
                      placeholder="Cerveza Alemana, Paulaner"
                      className="block w-full py-4 pr-6 text-white placeholder-gray-500 bg-black border border-transparent rounded-full pl-14 sm:py-5 focus:border-transparent focus:ring-0"
                    />
                  </div>
                </div>
                <div className="sm:absolute flex sm:right-1.5 sm:inset-y-1.5 mt-4 sm:mt-0">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center w-full px-5 py-5 text-sm font-bold tracking-widest text-black uppercase transition-all duration-200 bg-white rounded-full sm:w-auto sm:py-3 hover:opacity-90"
                  >
                    ¡DESCÚBRELA AHORA!
                  </button>
                </div>
              </form>

              <div className="mt-8 sm:mt-12">
                <p
                  className="text-lg font-normal text-white text-center lg:text-left"
                  style={{ fontFamily: "var(--font-inter)" }}
                >
                  Calidad Premium
                </p>

                <div className="flex items-center mt-3 justify-center lg:justify-start">
                  <div className="flex">
                    {/* Star Rating */}
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.8586 4.71248C11.2178 3.60691 12.7819 3.60691 13.1412 4.71248L14.4246 8.66264C14.5853 9.15706 15.046 9.49182 15.5659 9.49182H19.7193C20.8818 9.49182 21.3651 10.9794 20.4247 11.6626L17.0645 14.104C16.6439 14.4095 16.4679 14.9512 16.6286 15.4456L17.912 19.3958C18.2713 20.5013 17.0059 21.4207 16.0654 20.7374L12.7052 18.2961C12.2846 17.9905 11.7151 17.9905 11.2945 18.2961L7.93434 20.7374C6.99388 21.4207 5.72851 20.5013 6.08773 19.3958L7.37121 15.4456C7.53186 14.9512 7.35587 14.4095 6.93529 14.104L3.57508 11.6626C2.63463 10.9794 3.11796 9.49182 4.28043 9.49182H8.43387C8.95374 9.49182 9.41448 9.15706 9.57513 8.66264L10.8586 4.71248Z"
                          fill="url(#star-gradient)"
                        />
                        <defs>
                          <linearGradient
                            id="star-gradient"
                            x1="3.07813"
                            y1="3.8833"
                            x2="23.0483"
                            y2="6.90161"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ea580c" />
                          </linearGradient>
                        </defs>
                      </svg>
                    ))}
                  </div>
                  <span
                    className="ml-2 text-base font-normal text-white"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    4.1/5
                  </span>
                  <span
                    className="ml-1 text-base font-normal text-gray-500"
                    style={{ fontFamily: "var(--font-inter)" }}
                  >
                    (14k Vistas)
                  </span>
                </div>
              </div>
            </div>

            <div className="relative min-h-[600px] hidden lg:block">
              {/* Fondo con texto PAULANER repetido en toda la sección derecha */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/images/banner/fondo-banner.png?v=7"
                  alt="Fondo PAULANER"
                  fill
                  className="object-contain paulaner-sparkle"
                  priority
                />
              </div>

              {/* Contenedor de la botella */}
              <div className="relative w-[273px] h-[741px] mx-auto">
                {/* Imagen de la botella original */}
                <div className="relative z-10 flex justify-center items-center h-full">
                  <Image
                    src="/images/banner/cerbeza-banner.png?v=4"
                    alt="Cerveza Premium"
                    width={273}
                    height={741}
                    className="object-contain drop-shadow-2xl"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
