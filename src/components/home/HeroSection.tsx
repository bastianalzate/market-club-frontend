"use client";

import Link from "next/link";
import { Search, Menu, X, ShoppingCart, User } from "lucide-react";
import { useState } from "react";

export default function HeroSection() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="">
      {/* Header dentro del Hero */}
      <header className="py-4 bg-black sm:py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="shrink-0">
              <Link
                href="/"
                title="Market Club"
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 border-2 border-white rounded-sm flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
                </div>
                <div className="w-px h-8 bg-white"></div>
                <span className="text-2xl font-bold text-white uppercase tracking-wide">
                  Market Club
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                className="text-white"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
              >
                {!isMenuOpen ? (
                  <Menu className="w-7 h-7" />
                ) : (
                  <X className="w-7 h-7" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden ml-10 mr-auto space-x-10 lg:ml-20 lg:space-x-12 md:flex md:items-center md:justify-start">
              <Link
                href="/products"
                title="Tienda"
                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
              >
                Tienda
              </Link>

              <Link
                href="/gifts"
                title="Armá tu regalo"
                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
              >
                Armá tu regalo
              </Link>

              <Link
                href="/kits"
                title="Kits"
                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
              >
                Kits
              </Link>

              <Link
                href="/about"
                title="Market Club"
                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
              >
                Market Club
              </Link>

              <Link
                href="/contact"
                title="Contacto"
                className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
              >
                Contacto
              </Link>
            </nav>

            {/* Desktop Actions - Iconos */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              {/* Search */}
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
              </Link>

              {/* User Profile */}
              <Link
                href="/profile"
                className="p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav>
              <div className="flex flex-col pt-8 pb-4 space-y-6">
                <Link
                  href="/products"
                  title="Tienda"
                  className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tienda
                </Link>

                <Link
                  href="/gifts"
                  title="Armá tu regalo"
                  className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Armá tu regalo
                </Link>

                <Link
                  href="/kits"
                  title="Kits"
                  className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kits
                </Link>

                <Link
                  href="/about"
                  title="Market Club"
                  className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Market Club
                </Link>

                <Link
                  href="/contact"
                  title="Contacto"
                  className="text-base font-normal text-gray-400 transition-all duration-200 hover:text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </Link>

                {/* Mobile Actions - Iconos */}
                <div className="flex items-center space-x-4 pt-4 border-t border-gray-800">
                  <button className="p-2 text-gray-400 hover:text-white transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                  <Link
                    href="/cart"
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/profile"
                    className="p-2 bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 overflow-hidden bg-black sm:pb-16 lg:pb-20 xl:pb-24">
        <div className="px-4 mx-auto relative sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid items-center grid-cols-1 gap-y-12 lg:grid-cols-2 gap-x-16">
            <div>
              <h1 className="text-4xl font-normal text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                Descubre el Mundo de las Mejores Cervezas
              </h1>
              <p className="mt-4 text-lg font-normal text-gray-400 sm:mt-8">
                Desde cervezas artesanales locales hasta importadas premium. Tu
                destino para explorar sabores únicos y tradiciones cerveceras de
                todo el mundo.
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
                      placeholder="Busca IPA, Stout, Lager, etc."
                      className="block w-full py-4 pr-6 text-white placeholder-gray-500 bg-black border border-transparent rounded-full pl-14 sm:py-5 focus:border-transparent focus:ring-0"
                    />
                  </div>
                </div>
                <div className="sm:absolute flex sm:right-1.5 sm:inset-y-1.5 mt-4 sm:mt-0">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center w-full px-5 py-5 text-sm font-semibold tracking-widest text-black uppercase transition-all duration-200 bg-white rounded-full sm:w-auto sm:py-3 hover:opacity-90"
                  >
                    Buscar Cervezas
                  </button>
                </div>
              </form>

              <div className="mt-8 sm:mt-12">
                <p className="text-lg font-normal text-white">
                  Confían en nosotros 50k+ clientes
                </p>

                <div className="flex items-center mt-3">
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
                  <span className="ml-2 text-base font-normal text-white">
                    4.8/5
                  </span>
                  <span className="ml-1 text-base font-normal text-gray-500">
                    (14k Reseñas)
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0">
                <svg
                  className="blur-3xl filter opacity-70"
                  style={{ filter: "blur(64px)" }}
                  width="444"
                  height="536"
                  viewBox="0 0 444 536"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M225.919 112.719C343.98 64.6648 389.388 -70.487 437.442 47.574C485.496 165.635 253.266 481.381 135.205 529.435C17.1445 577.488 57.9596 339.654 9.9057 221.593C-38.1482 103.532 107.858 160.773 225.919 112.719Z"
                    fill="url(#hero-gradient)"
                  />
                  <defs>
                    <linearGradient
                      id="hero-gradient"
                      x1="82.7339"
                      y1="550.792"
                      x2="-39.945"
                      y2="118.965"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#ea580c" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="absolute inset-0">
                <div className="w-full h-full opacity-50 bg-gradient-to-br from-amber-500/20 to-orange-500/20"></div>
              </div>

              {/* Placeholder para imagen de cerveza */}
              <div className="relative w-full max-w-md mx-auto">
                <div className="w-full h-96 bg-gradient-to-br from-amber-200 to-orange-300 rounded-lg flex items-center justify-center">
                  <span className="text-6xl">🍺</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
