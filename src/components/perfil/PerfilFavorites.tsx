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
} from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useNotification } from "@/hooks/useNotification";

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

interface FavoriteProduct {
  id: number;
  name: string;
  price: number;
  image?: string;
  brand: string;
  inStock: boolean;
  addedAt: string;
}

export default function PerfilFavorites({ user }: PerfilFavoritesProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<number[]>([1, 2, 3, 4, 5]);
  const { addToCart, updateQuantity, removeFromCart } = useCart();
  const { showSuccess, showError } = useNotification();

  // Datos mock para demostración
  const favoriteProducts: FavoriteProduct[] = [
    {
      id: 1,
      name: "CERVEZA ERDINGER WEIBBIER",
      price: 22000,
      image: "products/2025/09/0375e709-667d-4e74-9947-be5afd6eb8f7.png",
      brand: "ERDINGER",
      inStock: true,
      addedAt: "2024-01-15",
    },
    {
      id: 2,
      name: "CERVEZA ESTRELLA GALICIA XUND",
      price: 17000,
      brand: "ESTRELLA GALICIA",
      inStock: true,
      addedAt: "2024-01-14",
    },
    {
      id: 3,
      name: "CERVEZA IRON MAIDEN X 500 ML",
      price: 22000,
      brand: "IRON MAIDEN",
      inStock: true,
      addedAt: "2024-01-13",
    },
    {
      id: 4,
      name: "CERVEZA GULDEN DRAAK X UND",
      price: 34000,
      brand: "GULDEN DRAAK",
      inStock: false,
      addedAt: "2024-01-12",
    },
    {
      id: 5,
      name: "CERVEZA HOLLANDIA PREMIUM",
      price: 14000,
      brand: "HOLLANDIA",
      inStock: true,
      addedAt: "2024-01-11",
    },
  ];

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

  const filteredProducts = favoriteProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToCart = (product: FavoriteProduct) => {
    try {
      const cartProduct = {
        id: product.id,
        name: product.name,
        description: `${product.brand} - Cerveza premium`,
        price: product.price,
        image: product.image || "/images/products/placeholder.jpg",
        images: [product.image || "/images/products/placeholder.jpg"],
        category: "Bebidas Alcohólicas",
        brand: product.brand,
        rating: 4.5,
        reviewCount: 150,
        inStock: product.inStock,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      addToCart(cartProduct, 1);
      showSuccess(`${product.name} agregado al carrito`);
    } catch (error) {
      showError("Error al agregar el producto al carrito");
    }
  };

  const handleRemoveFavorite = (productId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== productId));
    showSuccess("Producto eliminado de favoritos");
  };

  const getProductQuantity = (productId: number) => {
    // Mock function - en una implementación real, esto vendría del hook useCart
    return 0;
  };

  const isInCart = (productId: number) => {
    return getProductQuantity(productId) > 0;
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mis Favoritos</h2>
            <p className="text-gray-600 mt-1">
              {filteredProducts.length} productos guardados
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar favoritos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            {/* Toggle de vista */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-yellow-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-yellow-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de productos favoritos */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes productos favoritos
          </h3>
          <p className="text-gray-600 mb-6">
            Explora nuestros productos y agrega tus favoritos
          </p>
          <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-colors">
            Explorar Productos
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              {/* Imagen del producto */}
              <div
                className={`${
                  viewMode === "list"
                    ? "w-32 h-32 flex-shrink-0"
                    : "w-full h-48"
                } bg-gray-100 relative`}
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Heart className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-xs text-gray-500">Sin imagen</p>
                    </div>
                  </div>
                )}

                {/* Botón de eliminar favorito */}
                <button
                  onClick={() => handleRemoveFavorite(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {/* Información del producto */}
              <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-sm font-medium ${
                      product.inStock ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.inStock ? "En stock" : "Agotado"}
                  </span>
                  <span className="text-xs text-gray-500">
                    Agregado el {formatDate(product.addedAt)}
                  </span>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                  {isInCart(product.id) ? (
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        onClick={() =>
                          updateQuantity(
                            product.id.toString(),
                            getProductQuantity(product.id) - 1
                          )
                        }
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="flex-1 text-center font-medium">
                        {getProductQuantity(product.id)} en carrito
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            product.id.toString(),
                            getProductQuantity(product.id) + 1
                          )
                        }
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${
                        product.inStock
                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {product.inStock ? "Agregar al carrito" : "Agotado"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
