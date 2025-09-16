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
      className={`block transition-all duration-200 hover:bg-gray-50 ${
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
  const [isClosing, setIsClosing] = useState(false);
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

  const closeMenu = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsClosing(false);
    }, 300); // Duración de la animación de salida
  }, []);

  const toggleMenu = useCallback(() => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      setIsMenuOpen(true);
    }
  }, [isMenuOpen, closeMenu]);

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
      fontSize: "13px",
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
      fontSize: "18px",
      padding: "12px 16px",
      borderRadius: "8px",
      transition: "all 0.2s ease-in-out",
    }),
    []
  );

  const mobileActiveLinkStyle = useMemo(
    () => ({
      ...mobileLinkStyle,
      color: "#B58E31",
      backgroundColor: "#FEF3E2",
    }),
    [mobileLinkStyle]
  );

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
    <>
      <header className="py-3 bg-white shadow-sm border-b sm:py-4 md:py-6">
        <div className="px-3 mx-auto max-w-7xl sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="shrink-0">
              <Link href="/" title="Market Club" className="flex items-center">
                <Image
                  src="/images/logo/logo.png"
                  alt="Market Club Logo"
                  width={120}
                  height={0}
                  className="h-auto w-[100px] xs:w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] xl:w-[200px]"
                  priority
                />
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:hidden">
              {/* Search */}
              <button
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={handleOpenCart}
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                {itemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center text-[10px] sm:text-xs">
                    {itemsCount}
                  </span>
                )}
              </button>

              {/* User Profile */}
              <div className="hidden sm:block">
                <UserProfile />
              </div>

              {/* Mobile Menu Button */}
              <button
                type="button"
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
                onClick={toggleMenu}
                aria-controls="mobile-menu"
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {!isMenuOpen ? (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:items-center lg:justify-center lg:ml-8 xl:ml-12 2xl:ml-20">
              <div className="flex items-center space-x-4 xl:space-x-6 2xl:space-x-8">
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
              </div>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex lg:items-center lg:space-x-3 xl:space-x-4">
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
            <>
              {/* Overlay de fondo */}
              <div
                className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
                  isClosing ? "opacity-0" : "opacity-50"
                }`}
                onClick={closeMenu}
              />

              {/* Menú móvil */}
              <div
                id="mobile-menu"
                className={`fixed inset-0 z-50 bg-white transform transition-all duration-300 ease-out ${
                  isClosing
                    ? "animate-[slideOutToRight_0.3s_ease-in_forwards]"
                    : "animate-[slideInFromRight_0.3s_ease-out_forwards]"
                }`}
              >
                {/* Header del menú móvil */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <Image
                      src="/images/logo/logo.png"
                      alt="Market Club Logo"
                      width={120}
                      height={0}
                      className="h-auto w-[120px]"
                    />
                  </div>

                  {/* Sección de usuario en el header */}
                  <div className="flex items-center space-x-2">
                    {isAuthenticated && user ? (
                      <>
                        <div className="flex items-center space-x-2 px-2 py-1.5 bg-gray-50 rounded-full max-w-[120px]">
                          <User className="w-4 h-4 text-gray-600 flex-shrink-0" />
                          <span className="text-xs font-medium text-gray-900 truncate">
                            {user.name.split(" ")[0]}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            closeMenu();
                          }}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                          title="Cerrar sesión"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          openLoginModal();
                          closeMenu();
                        }}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-[#B58E31] text-white rounded-full hover:bg-[#A67D2A] transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-xs font-medium">Login</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="p-2 text-gray-700 hover:text-gray-900 transition-colors"
                      onClick={closeMenu}
                      aria-label="Cerrar menú"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Contenido del menú */}
                <div className="px-4 py-6 h-full overflow-y-auto">
                  <nav className="flex flex-col space-y-1">
                    <div
                      className={`opacity-0 ${
                        isClosing
                          ? "animate-[slideOutLeft_0.2s_ease-in_0s_forwards]"
                          : "animate-[slideInLeft_0.3s_ease-out_0.1s_forwards]"
                      }`}
                    >
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
                    </div>

                    <div
                      className={`opacity-0 ${
                        isClosing
                          ? "animate-[slideOutLeft_0.2s_ease-in_0.05s_forwards]"
                          : "animate-[slideInLeft_0.3s_ease-out_0.15s_forwards]"
                      }`}
                    >
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
                    </div>

                    <div
                      className={`opacity-0 ${
                        isClosing
                          ? "animate-[slideOutLeft_0.2s_ease-in_0.1s_forwards]"
                          : "animate-[slideInLeft_0.3s_ease-out_0.2s_forwards]"
                      }`}
                    >
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
                    </div>

                    {isAuthenticated && user?.is_wholesaler && (
                      <div
                        className={`opacity-0 ${
                          isClosing
                            ? "animate-[slideOutLeft_0.2s_ease-in_0.15s_forwards]"
                            : "animate-[slideInLeft_0.3s_ease-out_0.25s_forwards]"
                        }`}
                      >
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
                      </div>
                    )}

                    <div
                      className={`opacity-0 ${
                        isClosing
                          ? "animate-[slideOutLeft_0.2s_ease-in_0.2s_forwards]"
                          : "animate-[slideInLeft_0.3s_ease-out_0.3s_forwards]"
                      }`}
                    >
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
                    </div>

                    <div
                      className={`opacity-0 ${
                        isClosing
                          ? "animate-[slideOutLeft_0.2s_ease-in_0.25s_forwards]"
                          : "animate-[slideInLeft_0.3s_ease-out_0.35s_forwards]"
                      }`}
                    >
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
              </div>
            </>
          )}
        </div>

        {/* Cart Drawer */}
        <CartDrawer isOpen={isCartOpen} onClose={handleCloseCart} />

        {/* Login Modal */}
        <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      </header>
    </>
  );
}
