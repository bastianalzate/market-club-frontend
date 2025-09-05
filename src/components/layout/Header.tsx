"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  return (
    <header className="py-4 bg-white shadow-sm border-b sm:py-6">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" title="Market Club" className="flex items-center">
              <Image
                src="/images/logo/logo.png"
                alt="Market Club Logo"
                width={200}
                height={0}
                className="h-auto"
                priority
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="text-gray-700"
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
              href="/"
              title="Inicio"
              className={`text-base font-normal transition-all duration-200 ${
                isActive("/")
                  ? "text-amber-600"
                  : "text-gray-900 hover:text-gray-600"
              }`}
            >
              Inicio
            </Link>

            <Link
              href="/tienda"
              title="Tienda"
              className={`text-base font-normal transition-all duration-200 ${
                isActive("/tienda")
                  ? "text-amber-600"
                  : "text-gray-900 hover:text-gray-600"
              }`}
            >
              Tienda
            </Link>

            <Link
              href="/gifts"
              title="Armá tu regalo"
              className={`text-base font-normal transition-all duration-200 ${
                isActive("/gifts")
                  ? "text-amber-600"
                  : "text-gray-900 hover:text-gray-600"
              }`}
            >
              Armá tu regalo
            </Link>

            <Link
              href="/kits"
              title="Kit"
              className={`text-base font-normal transition-all duration-200 ${
                isActive("/kits")
                  ? "text-amber-600"
                  : "text-gray-900 hover:text-gray-600"
              }`}
            >
              Kit
            </Link>

            <Link
              href="/about"
              title="Market Club"
              className={`text-base font-normal transition-all duration-200 ${
                isActive("/about")
                  ? "text-amber-600"
                  : "text-gray-900 hover:text-gray-600"
              }`}
            >
              Market Club
            </Link>

            <Link
              href="/contact"
              title="Contacto"
              className={`text-base font-normal transition-all duration-200 ${
                isActive("/contact")
                  ? "text-amber-600"
                  : "text-gray-900 hover:text-gray-600"
              }`}
            >
              Contacto
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Search */}
            <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {/* User Profile */}
            <Link
              href="/profile"
              className="p-2 bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors border border-gray-300"
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
                href="/"
                title="Inicio"
                className={`text-base font-normal transition-all duration-200 ${
                  isActive("/")
                    ? "text-amber-600"
                    : "text-gray-900 hover:text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>

              <Link
                href="/tienda"
                title="Tienda"
                className={`text-base font-normal transition-all duration-200 ${
                  isActive("/tienda")
                    ? "text-amber-600"
                    : "text-gray-900 hover:text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Tienda
              </Link>

              <Link
                href="/gifts"
                title="Armá tu regalo"
                className={`text-base font-normal transition-all duration-200 ${
                  isActive("/gifts")
                    ? "text-amber-600"
                    : "text-gray-900 hover:text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Armá tu regalo
              </Link>

              <Link
                href="/kits"
                title="Kits"
                className={`text-base font-normal transition-all duration-200 ${
                  isActive("/kits")
                    ? "text-amber-600"
                    : "text-gray-900 hover:text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Kits
              </Link>

              <Link
                href="/about"
                title="Market Club"
                className={`text-base font-normal transition-all duration-200 ${
                  isActive("/about")
                    ? "text-amber-600"
                    : "text-gray-900 hover:text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Market Club
              </Link>

              <Link
                href="/contact"
                title="Contacto"
                className={`text-base font-normal transition-all duration-200 ${
                  isActive("/contact")
                    ? "text-amber-600"
                    : "text-gray-900 hover:text-gray-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
