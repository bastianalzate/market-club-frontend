"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import { useState, useMemo, useCallback, memo, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Funciones para manejar el buscador
  const handleOpenSearch = useCallback(() => {
    setIsSearchOpen(true);
    // Focus en el input después de que se abra
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchTerm("");
  }, []);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchTerm.trim()) {
        router.push(`/tienda?search=${encodeURIComponent(searchTerm.trim())}`);
        handleCloseSearch();
      }
    },
    [searchTerm, router, handleCloseSearch]
  );

  // Cerrar buscador con ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isSearchOpen) {
        handleCloseSearch();
      }
    };

    if (isSearchOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isSearchOpen, handleCloseSearch]);
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
      fontSize: "16px",
      lineHeight: "100%",
      letterSpacing: "0.1px",
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
          className="p-2 bg-gray-100 text-gray-700 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors border border-gray-300 cursor-pointer"
          aria-label="Iniciar sesión"
        >
          <User className="w-5 h-5" />
        </button>
      );
    }

    return (
      <div className="flex items-center space-x-1">
        <Link
          href="/perfil"
          className="flex items-center space-x-1.5 px-2 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
          aria-label="Ver perfil"
        >
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-xs font-medium text-gray-900 max-w-32 truncate">{user.name}</span>
        </Link>
        <button
          onClick={logout}
          className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
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
        <div className="px-2 mx-auto max-w-7xl sm:px-3 md:px-4 lg:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="shrink-0">
              <Link href="/" title="Market Club" className="flex items-center">
                <Image
                  src="/images/logo/logo.png"
                  alt="Market Club Logo"
                  width={120}
                  height={0}
                  className="h-auto w-[80px] xs:w-[90px] sm:w-[100px] md:w-[110px] lg:w-[120px] xl:w-[130px]"
                  priority
                />
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:hidden">
              {/* Search */}
              <button
                onClick={handleOpenSearch}
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={handleOpenCart}
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative cursor-pointer"
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
                className="p-2 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
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
            <nav className="hidden lg:flex lg:items-center lg:justify-center lg:ml-6 xl:ml-8 2xl:ml-12">
              <div className="flex items-center space-x-2 xl:space-x-3 2xl:space-x-4">
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
                  href="/arma-tu-regalo"
                  title="Armá tu regalo"
                  isActive={isActive("/gifts")}
                  baseStyle={baseLinkStyle}
                  activeStyle={activeLinkStyle}
                >
                  Armá tu regalo
                </NavLink>

                <NavLink
                  href="/quienes-somos"
                  title="Quiénes somos"
                  isActive={isActive("/quienes-somos")}
                  baseStyle={baseLinkStyle}
                  activeStyle={activeLinkStyle}
                >
                  Quiénes somos
                </NavLink>

                <NavLink
                  href="/faq"
                  title="FAQ"
                  isActive={isActive("/faq")}
                  baseStyle={baseLinkStyle}
                  activeStyle={activeLinkStyle}
                >
                  FAQ
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
                  href="/club-socios"
                  title="Club de socios"
                  isActive={isActive("/market-club")}
                  baseStyle={baseLinkStyle}
                  activeStyle={activeLinkStyle}
                >
                  Club de socios
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
            <div className="hidden lg:flex lg:items-center lg:space-x-2 xl:space-x-3">
              {/* Search */}
              <button
                onClick={handleOpenSearch}
                className="p-1.5 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <button
                onClick={handleOpenCart}
                className="p-1.5 text-gray-700 hover:text-gray-900 transition-colors relative cursor-pointer"
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
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
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
                        className="flex items-center space-x-1 px-3 py-1.5 bg-[#B58E31] text-white rounded-full hover:bg-[#A67D2A] transition-colors cursor-pointer"
                      >
                        <User className="w-4 h-4" />
                        <span className="text-xs font-medium">Login</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="p-2 text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
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
                        href="/arma-tu-regalo"
                        title="Armá tu regalo"
                        isActive={isActive("/gifts")}
                        baseStyle={mobileLinkStyle}
                        activeStyle={mobileActiveLinkStyle}
                        onClick={closeMenu}
                      >
                        Armá tu regalo
                      </MobileNavLink>
                    </div>

                    <div
                      className={`opacity-0 ${
                        isClosing
                          ? "animate-[slideOutLeft_0.2s_ease-in_0.15s_forwards]"
                          : "animate-[slideInLeft_0.3s_ease-out_0.25s_forwards]"
                      }`}
                    >
                      <MobileNavLink
                        href="/quienes-somos"
                        title="Quiénes somos"
                        isActive={isActive("/quienes-somos")}
                        baseStyle={mobileLinkStyle}
                        activeStyle={mobileActiveLinkStyle}
                        onClick={closeMenu}
                      >
                        Quiénes somos
                      </MobileNavLink>
                    </div>

                    <div
                      className={`opacity-0 ${
                        isClosing
                          ? "animate-[slideOutLeft_0.2s_ease-in_0.2s_forwards]"
                          : "animate-[slideInLeft_0.3s_ease-out_0.3s_forwards]"
                      }`}
                    >
                      <MobileNavLink
                        href="/faq"
                        title="FAQ"
                        isActive={isActive("/faq")}
                        baseStyle={mobileLinkStyle}
                        activeStyle={mobileActiveLinkStyle}
                        onClick={closeMenu}
                      >
                        FAQ
                      </MobileNavLink>
                    </div>

                    {isAuthenticated && user?.is_wholesaler && (
                      <div
                        className={`opacity-0 ${
                          isClosing
                            ? "animate-[slideOutLeft_0.2s_ease-in_0.25s_forwards]"
                            : "animate-[slideInLeft_0.3s_ease-out_0.35s_forwards]"
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
                          ? "animate-[slideOutLeft_0.2s_ease-in_0.3s_forwards]"
                          : "animate-[slideInLeft_0.3s_ease-out_0.4s_forwards]"
                      }`}
                    >
                      <MobileNavLink
                        href="/club-socios"
                        title="Club de socios"
                        isActive={isActive("/market-club")}
                        baseStyle={mobileLinkStyle}
                        activeStyle={mobileActiveLinkStyle}
                        onClick={closeMenu}
                      >
                        Club de socios
                      </MobileNavLink>
                    </div>

                    <div
                      className={`opacity-0 ${
                        isClosing
                          ? "animate-[slideOutLeft_0.2s_ease-in_0.35s_forwards]"
                          : "animate-[slideInLeft_0.3s_ease-out_0.45s_forwards]"
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

        {/* Search Modal */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
              onClick={handleCloseSearch}
            ></div>

            {/* Modal */}
            <div className="flex min-h-full items-start justify-center p-4 pt-16">
              <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Search className="w-6 h-6 text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Buscar Productos
                    </h2>
                  </div>
                  <button
                    onClick={handleCloseSearch}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>

                {/* Search Form */}
                <div className="p-6">
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Busca tu cerveza favorita (ej: Corona, Erdinger, Paulaner)"
                        className="w-full pl-12 pr-4 py-4 text-gray-900 placeholder-gray-500 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex justify-end mt-6 space-x-3">
                      <button
                        type="button"
                        onClick={handleCloseSearch}
                        className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={!searchTerm.trim()}
                        className="px-6 py-3 text-white bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer"
                      >
                        Buscar
                      </button>
                    </div>
                  </form>
                </div>

                {/* Tips */}
                <div className="px-6 pb-6">
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">💡 Tip:</span> Puedes buscar
                      por nombre de cerveza, marca o país de origen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
