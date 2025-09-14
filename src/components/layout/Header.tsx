"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { useState, useMemo, useCallback, memo } from "react";
import { usePathname } from "next/navigation";
import CartDrawer from "../../features/cart/components/CartDrawer";
import { useCartContext } from "@/contexts/CartContext";
import LoginModal from "../auth/LoginModal";
import { useAuth } from "@/hooks/useAuth";

// Componente memoizado para los links de navegación
const NavLink = memo(
  ({
    href,
    title,
    children,
    isActive,
    baseStyle,
    activeStyle,
    onClick,
  }: {
    href: string;
    title: string;
    children: React.ReactNode;
    isActive: boolean;
    baseStyle: React.CSSProperties;
    activeStyle: React.CSSProperties;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      title={title}
      className={`transition-all duration-200 ${
        isActive ? "" : "text-gray-900 hover:text-gray-600"
      }`}
      style={isActive ? activeStyle : baseStyle}
      onClick={onClick}
      prefetch={true}
    >
      {children}
    </Link>
  )
);

NavLink.displayName = "NavLink";

// Componente memoizado para los links de navegación móvil
const MobileNavLink = memo(
  ({
    href,
    title,
    children,
    isActive,
    baseStyle,
    activeStyle,
    onClick,
  }: {
    href: string;
    title: string;
    children: React.ReactNode;
    isActive: boolean;
    baseStyle: React.CSSProperties;
    activeStyle: React.CSSProperties;
    onClick?: () => void;
  }) => (
    <Link
      href={href}
      title={title}
      className={`text-base font-medium transition-all duration-200 py-2 ${
        isActive ? "" : "text-gray-900 hover:text-gray-600"
      }`}
      style={isActive ? activeStyle : baseStyle}
      onClick={onClick}
      prefetch={true}
    >
      {children}
    </Link>
  )
);

MobileNavLink.displayName = "MobileNavLink";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  // Solo obtener lo que necesitamos del carrito para evitar re-renders innecesarios
  const { itemsCount } = useCartContext();

  // Log para debugging
  console.log("🛒 Header render:", { itemsCount });

  // Estado local para el carrito drawer
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Función optimizada para abrir el carrito
  const handleOpenCart = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  // Función optimizada para cerrar el carrito
  const handleCloseCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);
  const {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const toggleMenu = useCallback(
    () => setIsMenuOpen(!isMenuOpen),
    [isMenuOpen]
  );

  const isActive = useCallback(
    (path: string) => {
      if (path === "/") {
        return pathname === "/";
      }
      return pathname.startsWith(path);
    },
    [pathname]
  );

  // Memoizar estilos base para evitar recálculos
  const baseLinkStyle = useMemo(
    () => ({
      fontFamily: "var(--font-oswald)",
      fontWeight: 700,
      fontSize: "14px",
      lineHeight: "100%",
      letterSpacing: "0.2px",
    }),
    []
  );

  const activeLinkStyle = useMemo(
    () => ({
      ...baseLinkStyle,
      color: "#B58E31",
    }),
    [baseLinkStyle]
  );

  const mobileLinkStyle = useMemo(
    () => ({
      fontFamily: "var(--font-oswald)",
      fontWeight: 700,
      fontSize: "16px",
    }),
    []
  );

  const mobileActiveLinkStyle = useMemo(
    () => ({
      ...mobileLinkStyle,
      color: "#B58E31",
    }),
    [mobileLinkStyle]
  );

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Componente para el perfil del usuario
  const UserProfile = memo(() => {
    if (!isAuthenticated || !user) {
      return (
        <button
          onClick={openLoginModal}
          className="p-2 bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors border border-gray-300"
          aria-label="Iniciar sesión"
        >
          <User className="w-5 h-5" />
        </button>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <Link
          href="/perfil"
          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          aria-label="Ver perfil"
        >
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">{user.name}</span>
        </Link>
        <button
          onClick={logout}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    );
  });

  UserProfile.displayName = "UserProfile";

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
            <button
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={handleOpenCart}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <UserProfile />

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen ? "true" : "false"}
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
            <NavLink
              href="/"
              title="Inicio"
              isActive={isActive("/")}
              baseStyle={baseLinkStyle}
              activeStyle={activeLinkStyle}
            >
              Inicio
            </NavLink>

            <NavLink
              href="/tienda"
              title="Tienda"
              isActive={isActive("/tienda")}
              baseStyle={baseLinkStyle}
              activeStyle={activeLinkStyle}
            >
              Tienda
            </NavLink>

            <NavLink
              href="/gifts"
              title="Armá tu regalo"
              isActive={isActive("/gifts")}
              baseStyle={baseLinkStyle}
              activeStyle={activeLinkStyle}
            >
              Armá tu regalo
            </NavLink>

            {isAuthenticated && user?.is_wholesaler && (
              <NavLink
                href="/mayorista"
                title="Mayorista"
                isActive={isActive("/mayorista")}
                baseStyle={baseLinkStyle}
                activeStyle={activeLinkStyle}
              >
                Mayorista
              </NavLink>
            )}

            <NavLink
              href="/about"
              title="Market Club"
              isActive={isActive("/about")}
              baseStyle={baseLinkStyle}
              activeStyle={activeLinkStyle}
            >
              Market Club
            </NavLink>

            <NavLink
              href="/contacto"
              title="Contacto"
              isActive={isActive("/contacto")}
              baseStyle={baseLinkStyle}
              activeStyle={activeLinkStyle}
            >
              Contacto
            </NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Search */}
            <button
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={handleOpenCart}
              className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* User Profile */}
            <UserProfile />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <nav className="px-4 py-4">
              <div className="flex flex-col space-y-4">
                <MobileNavLink
                  href="/"
                  title="Inicio"
                  isActive={isActive("/")}
                  baseStyle={mobileLinkStyle}
                  activeStyle={mobileActiveLinkStyle}
                  onClick={closeMenu}
                >
                  Inicio
                </MobileNavLink>

                <MobileNavLink
                  href="/tienda"
                  title="Tienda"
                  isActive={isActive("/tienda")}
                  baseStyle={mobileLinkStyle}
                  activeStyle={mobileActiveLinkStyle}
                  onClick={closeMenu}
                >
                  Tienda
                </MobileNavLink>

                <MobileNavLink
                  href="/gifts"
                  title="Armá tu regalo"
                  isActive={isActive("/gifts")}
                  baseStyle={mobileLinkStyle}
                  activeStyle={mobileActiveLinkStyle}
                  onClick={closeMenu}
                >
                  Armá tu regalo
                </MobileNavLink>

                {isAuthenticated && user?.is_wholesaler && (
                  <MobileNavLink
                    href="/mayorista"
                    title="Mayorista"
                    isActive={isActive("/mayorista")}
                    baseStyle={mobileLinkStyle}
                    activeStyle={mobileActiveLinkStyle}
                    onClick={closeMenu}
                  >
                    Mayorista
                  </MobileNavLink>
                )}

                <MobileNavLink
                  href="/about"
                  title="Market Club"
                  isActive={isActive("/about")}
                  baseStyle={mobileLinkStyle}
                  activeStyle={mobileActiveLinkStyle}
                  onClick={closeMenu}
                >
                  Market Club
                </MobileNavLink>

                <MobileNavLink
                  href="/contacto"
                  title="Contacto"
                  isActive={isActive("/contacto")}
                  baseStyle={mobileLinkStyle}
                  activeStyle={mobileActiveLinkStyle}
                  onClick={closeMenu}
                >
                  Contacto
                </MobileNavLink>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={handleCloseCart} />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </header>
  );
}
