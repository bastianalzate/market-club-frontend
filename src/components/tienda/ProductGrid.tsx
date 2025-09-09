"use client";

import { useState } from "react";
import {
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  ArrowRight,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/features/products/types/product";

interface TiendaProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

interface ProductGridProps {
  products: TiendaProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const { addToCart, updateQuantity, removeFromCart, items } = useCart();

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Obtener la cantidad de un producto en el carrito
  const getProductQuantity = (productId: number) => {
    const cartItem = items.find((item) => item.product.id === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId: number) => {
    return items.some((item) => item.product.id === productId);
  };

  // Manejar incremento de cantidad
  const handleIncreaseQuantity = (tiendaProduct: TiendaProduct) => {
    const product: Product = convertToStoreProduct(tiendaProduct);
    const currentQuantity = getProductQuantity(tiendaProduct.id);
    updateQuantity(tiendaProduct.id.toString(), currentQuantity + 1);
  };

  // Manejar decremento de cantidad
  const handleDecreaseQuantity = (productId: number) => {
    const currentQuantity = getProductQuantity(productId);
    if (currentQuantity > 1) {
      updateQuantity(productId.toString(), currentQuantity - 1);
    } else {
      removeFromCart(productId.toString());
    }
  };

  // Convertir producto de tienda al formato del store
  const convertToStoreProduct = (tiendaProduct: TiendaProduct): Product => {
    return {
      id: tiendaProduct.id,
      name: tiendaProduct.name,
      description: `${tiendaProduct.brand} - ${tiendaProduct.category}`,
      price: tiendaProduct.price,
      image: tiendaProduct.image,
      images: [tiendaProduct.image],
      category: tiendaProduct.category,
      brand: tiendaProduct.brand,
      alcoholContent: 5.0,
      volume: 500,
      style: tiendaProduct.category,
      origin: "Importada",
      inStock: tiendaProduct.inStock,
      stockQuantity: 100,
      rating: tiendaProduct.rating,
      reviewCount: tiendaProduct.reviewCount,
      tags: [tiendaProduct.category.toLowerCase()],
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleAddToCart = async (tiendaProduct: TiendaProduct) => {
    setAddingToCart(tiendaProduct.id);

    const product = convertToStoreProduct(tiendaProduct);
    addToCart(product, 1);

    // Simular una pequeña animación
    setTimeout(() => {
      setAddingToCart(null);
      setJustAdded(tiendaProduct.id);

      // Limpiar el estado de "just added" después de 2 segundos
      setTimeout(() => {
        setJustAdded(null);
      }, 2000);
    }, 500);
  };

  // Configuración de paginación
  const productsPerPage = 9;
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Obtener productos de la página actual
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll hacia arriba para ver los productos
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

  return (
    <div className="flex-1">
      {/* Controles de vista y paginación */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${
              viewMode === "grid" ? "" : "text-gray-400 hover:text-gray-600"
            }`}
            style={
              viewMode === "grid"
                ? { backgroundColor: "#B58E31", color: "white" }
                : {}
            }
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list" ? "" : "text-gray-400 hover:text-gray-600"
            }`}
            style={
              viewMode === "list"
                ? { backgroundColor: "#B58E31", color: "white" }
                : {}
            }
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm text-gray-500">
          Mostrando {startIndex + 1}-{Math.min(endIndex, products.length)} de{" "}
          {products.length} productos
        </div>
      </div>

      {/* Grid de productos */}
      {currentProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">
            No se encontraron productos
          </div>
          <div className="text-gray-400 text-sm">
            Intenta con otros términos de búsqueda
          </div>
        </div>
      ) : (
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          }`}
        >
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg overflow-hidden shadow-lg ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              {/* Imagen del producto con botón de favorito */}
              <div
                className={`relative ${
                  viewMode === "list" ? "w-48 flex-shrink-0" : "w-full"
                }`}
              >
                <div
                  className={`${
                    viewMode === "list"
                      ? "aspect-w-1 aspect-h-1"
                      : "aspect-w-1 aspect-h-1"
                  } overflow-hidden pt-4`}
                >
                  <img
                    className="object-cover w-full h-full transition-all duration-300 hover:scale-105"
                    src={product.image}
                    alt={product.name}
                  />
                </div>
                {/* Botón de corazón (favorito) */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                  aria-label="Agregar a favoritos"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              </div>

              {/* Información del producto */}
              <div
                className={`p-6 ${
                  viewMode === "list"
                    ? "flex-1 flex flex-col justify-between"
                    : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 font-medium">
                      BOTELLA 500ML
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {product.name}
                  </h3>
                </div>

                {/* Botones de acción */}
                <div className="flex items-center space-x-3">
                  {/* Botón de carrito cuadrado con contador */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id || !product.inStock}
                    className="relative p-3 rounded-lg transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "transparent",
                      borderColor: "#D0D5DD",
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                    aria-label="Agregar al carrito"
                  >
                    <ShoppingCart
                      className="w-5 h-5"
                      style={{ color: "#B58E31" }}
                    />
                    {/* Contador en el ícono del carrito */}
                    {isInCart(product.id) && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {getProductQuantity(product.id)}
                      </span>
                    )}
                  </button>

                  {/* Botón principal "Añadir al carrito" */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id || !product.inStock}
                    className="flex-1 flex items-center justify-center space-x-2 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#B58E31" }}
                    onMouseEnter={(e) =>
                      !e.currentTarget.disabled &&
                      (e.currentTarget.style.backgroundColor = "#A07D2A")
                    }
                    onMouseLeave={(e) =>
                      !e.currentTarget.disabled &&
                      (e.currentTarget.style.backgroundColor = "#B58E31")
                    }
                  >
                    <span>
                      {addingToCart === product.id
                        ? "Agregando..."
                        : !product.inStock
                        ? "Sin Stock"
                        : isInCart(product.id)
                        ? "Agregar más"
                        : "Añadir al carrito"}
                    </span>
                    {addingToCart !== product.id && product.inStock && (
                      <ArrowRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            {/* Botón anterior */}
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Números de página */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Mostrar solo algunas páginas para evitar demasiados botones
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          page === currentPage
                            ? "text-white"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                        style={
                          page === currentPage
                            ? { backgroundColor: "#B58E31" }
                            : {}
                        }
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                }
              )}
            </div>

            {/* Botón siguiente */}
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
