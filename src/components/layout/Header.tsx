"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import CartDrawer from "../../features/cart/components/CartDrawer";
import { useCart } from "../../features/cart/hooks/useCart";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const {
    items,
    isOpen,
    openCart,
    closeCart,
    updateQuantity,
    removeFromCart,
    checkout,
    totalItems,
  } = useCart();

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
                width={120}
                height={0}
                className="h-auto sm:w-[150px] md:w-[200px]"
                priority
              />
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Search */}
            <button className="p-2 text-gray-700 hover:text-gray-900 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={openCart}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Profile */}
            <Link
              href="/profile"
              className="p-2 bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors border border-gray-300"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
            >
              {!isMenuOpen ? (
                <Menu className="w-6 h-6" />
              ) : (
                <X className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden ml-20 mr-auto space-x-[30px] lg:ml-32 md:flex md:items-center md:justify-center">
            <Link
              href="/"
              title="Inicio"
              className={`transition-all duration-200 ${
                isActive("/") ? "" : "text-gray-900 hover:text-gray-600"
              }`}
              style={{
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0.2px",
                color: isActive("/") ? "#B58E31" : undefined,
              }}
            >
              Inicio
            </Link>

            <Link
              href="/tienda"
              title="Tienda"
              className={`transition-all duration-200 ${
                isActive("/tienda") ? "" : "text-gray-900 hover:text-gray-600"
              }`}
              style={{
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0.2px",
                color: isActive("/tienda") ? "#B58E31" : undefined,
              }}
            >
              Tienda
            </Link>

            <Link
              href="/gifts"
              title="Armá tu regalo"
              className={`transition-all duration-200 ${
                isActive("/gifts") ? "" : "text-gray-900 hover:text-gray-600"
              }`}
              style={{
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0.2px",
                color: isActive("/gifts") ? "#B58E31" : undefined,
              }}
            >
              Armá tu regalo
            </Link>

            <Link
              href="/kits"
              title="Kit"
              className={`transition-all duration-200 ${
                isActive("/kits") ? "" : "text-gray-900 hover:text-gray-600"
              }`}
              style={{
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0.2px",
                color: isActive("/kits") ? "#B58E31" : undefined,
              }}
            >
              Kit
            </Link>

            <Link
              href="/about"
              title="Market Club"
              className={`transition-all duration-200 ${
                isActive("/about") ? "" : "text-gray-900 hover:text-gray-600"
              }`}
              style={{
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0.2px",
                color: isActive("/about") ? "#B58E31" : undefined,
              }}
            >
              Market Club
            </Link>

            <Link
              href="/contact"
              title="Contacto"
              className={`transition-all duration-200 ${
                isActive("/contact") ? "" : "text-gray-900 hover:text-gray-600"
              }`}
              style={{
                fontFamily: "var(--font-oswald)",
                fontWeight: 700,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "0.2px",
                color: isActive("/contact") ? "#B58E31" : undefined,
              }}
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
            <button
              onClick={openCart}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

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
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <nav className="px-4 py-4">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  title="Inicio"
                  className={`text-base font-medium transition-all duration-200 py-2 ${
                    isActive("/") ? "" : "text-gray-900 hover:text-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-oswald)",
                    fontWeight: 700,
                    fontSize: "16px",
                    color: isActive("/") ? "#B58E31" : undefined,
                  }}
                >
                  Inicio
                </Link>

                <Link
                  href="/tienda"
                  title="Tienda"
                  className={`text-base font-medium transition-all duration-200 py-2 ${
                    isActive("/tienda")
                      ? ""
                      : "text-gray-900 hover:text-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-oswald)",
                    fontWeight: 700,
                    fontSize: "16px",
                    color: isActive("/tienda") ? "#B58E31" : undefined,
                  }}
                >
                  Tienda
                </Link>

                <Link
                  href="/gifts"
                  title="Armá tu regalo"
                  className={`text-base font-medium transition-all duration-200 py-2 ${
                    isActive("/gifts")
                      ? ""
                      : "text-gray-900 hover:text-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-oswald)",
                    fontWeight: 700,
                    fontSize: "16px",
                    color: isActive("/gifts") ? "#B58E31" : undefined,
                  }}
                >
                  Armá tu regalo
                </Link>

                <Link
                  href="/kits"
                  title="Kits"
                  className={`text-base font-medium transition-all duration-200 py-2 ${
                    isActive("/kits") ? "" : "text-gray-900 hover:text-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-oswald)",
                    fontWeight: 700,
                    fontSize: "16px",
                    color: isActive("/kits") ? "#B58E31" : undefined,
                  }}
                >
                  Kits
                </Link>

                <Link
                  href="/about"
                  title="Market Club"
                  className={`text-base font-medium transition-all duration-200 py-2 ${
                    isActive("/about")
                      ? ""
                      : "text-gray-900 hover:text-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-oswald)",
                    fontWeight: 700,
                    fontSize: "16px",
                    color: isActive("/about") ? "#B58E31" : undefined,
                  }}
                >
                  Market Club
                </Link>

                <Link
                  href="/contact"
                  title="Contacto"
                  className={`text-base font-medium transition-all duration-200 py-2 ${
                    isActive("/contact")
                      ? ""
                      : "text-gray-900 hover:text-gray-600"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontFamily: "var(--font-oswald)",
                    fontWeight: 700,
                    fontSize: "16px",
                    color: isActive("/contact") ? "#B58E31" : undefined,
                  }}
                >
                  Contacto
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isOpen}
        onClose={closeCart}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={checkout}
      />
    </header>
  );
}
