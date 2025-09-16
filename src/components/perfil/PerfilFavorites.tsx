"use client";

import {
  Heart,
  ShoppingCart,
  Trash2,
  Search,
  Grid,
  List,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useNotification } from "@/hooks/useNotification";
import { useUserFavorites } from "@/hooks/useUserProfile";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isGuest: boolean;
}

interface PerfilFavoritesProps {
  user: User;
}

export default function PerfilFavorites({ user }: PerfilFavoritesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const { addToCart, updateQuantity, removeFromCart } = useCart();
  const { showSuccess, showError } = useNotification();
  const {
    favorites,
    pagination,
    loading,
    error,
    loadFavorites,
    removeFromFavorites,
  } = useUserFavorites();

  // Cargar favoritos al montar el componente
  useEffect(() => {
    loadFavorites({
      page: currentPage,
      per_page: 12,
      search: searchTerm || undefined,
    });
  }, [currentPage, searchTerm, loadFavorites]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadFavorites({
      page: 1,
      per_page: 12,
      search: searchTerm || undefined,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddToCart = async (product: any) => {
    try {
      const result = await addToCart({
        productId: product.product.id,
        quantity: 1,
      });

      if (result.success) {
        showSuccess(
          "¡Producto agregado! 🍺",
          `"${product.product.name}" se agregó al carrito exitosamente.`
        );
      } else {
        showError("Error", result.message || "Error al agregar producto");
      }
    } catch (error) {
      showError("Error", "Error al agregar producto al carrito");
    }
  };

  const handleRemoveFromFavorites = async (productId: number) => {
    try {
      const result = await removeFromFavorites(productId);

      if (result.success) {
        showSuccess(
          "Producto removido",
          "El producto se removió de tus favoritos"
        );
      } else {
        showError("Error", result.message || "Error al remover de favoritos");
      }
    } catch (error) {
      showError("Error", "Error al remover de favoritos");
    }
  };

  const filteredProducts = favorites.filter(
    (favorite) =>
      favorite.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      favorite.product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && favorites.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-600 mx-auto mb-4" />
            <p className="text-gray-600">Cargando productos favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar los favoritos
              </h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Favoritos</h1>
          <p className="text-gray-600">
            Productos que has guardado para comprar más tarde
          </p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Búsqueda */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar en favoritos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Vista */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg ${
                viewMode === "grid"
                  ? "bg-yellow-100 text-yellow-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg ${
                viewMode === "list"
                  ? "bg-yellow-100 text-yellow-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Favoritos */}
      {favorites.length > 0 ? (
        <>
          <div
            className={`grid gap-6 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1"
            }`}
          >
            {filteredProducts.map((favorite) => (
              <div
                key={favorite.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${
                  viewMode === "list" ? "flex" : ""
                }`}
              >
                {/* Imagen del Producto */}
                <div
                  className={`${
                    viewMode === "list"
                      ? "w-32 h-32 flex-shrink-0"
                      : "aspect-square"
                  }`}
                >
                  <img
                    src={
                      favorite.product.image_url ||
                      favorite.product.image ||
                      "/images/cervezas/bottella-01.png"
                    }
                    alt={favorite.product.name}
                    className={`w-full h-full object-cover ${
                      viewMode === "list" ? "" : "rounded-t-xl"
                    }`}
                  />
                </div>

                {/* Información del Producto */}
                <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {favorite.product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {favorite.product.brand}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoveFromFavorites(favorite.product.id)
                      }
                      className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(
                          favorite.product.current_price ||
                            favorite.product.price
                        )}
                      </p>
                      {favorite.product.current_price !==
                        favorite.product.price && (
                        <p className="text-sm text-gray-500 line-through">
                          {formatPrice(favorite.product.price)}
                        </p>
                      )}
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        favorite.product.in_stock
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {favorite.product.in_stock ? "Disponible" : "Agotado"}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3">
                    Agregado el {formatDate(favorite.added_at)}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(favorite)}
                      disabled={!favorite.product.in_stock}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Agregar al carrito
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {pagination && pagination.last_page > 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando{" "}
                  {(pagination.current_page - 1) * pagination.per_page + 1} a{" "}
                  {Math.min(
                    pagination.current_page * pagination.per_page,
                    pagination.total
                  )}{" "}
                  de {pagination.total} productos
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-3 py-2 text-sm font-medium text-gray-700">
                    Página {currentPage} de {pagination.last_page}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.last_page}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes productos favoritos
            </h3>
            <p className="text-gray-500 mb-6">
              Cuando agregues productos a tus favoritos, aparecerán aquí.
            </p>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-lg hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2">
              Explorar productos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
