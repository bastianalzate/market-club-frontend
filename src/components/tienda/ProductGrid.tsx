"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { useCartContext } from "@/contexts/CartContext";
import { useToast } from "@/hooks/useToast";
import { Product } from "@/features/products/types/product";
import { TransformedProduct } from "@/hooks/useProducts";
import ProductSkeleton from "@/components/shared/ProductSkeleton";
import ProductCardSkeleton from "@/components/shared/ProductCardSkeleton";
import LazyImage from "@/components/shared/LazyImage";
import Toast from "@/components/shared/Toast";

interface TiendaProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  sale_price: string | null;
  sku: string;
  stock_quantity: number;
  image: string | null;
  gallery: string | null;
  is_active: boolean;
  is_featured: boolean;
  category_id: number;
  product_type_id: number;
  attributes: any;
  product_specific_data: {
    alcohol_content?: string | number;
    beer_style?: string;
    brewery?: string;
    country_of_origin?: string;
    volume_ml?: string;
    packaging_type?: string;
  } | null;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  // Campos agregados por la transformación
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

interface ProductGridProps {
  products: TransformedProduct[];
  loading?: boolean;
  totalProducts?: number;
  pagination?: {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
  };
  onPageChange?: (page: number) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
}

export default function ProductGrid({
  products,
  loading = false,
  totalProducts = 0,
  pagination,
  onPageChange,
  onNextPage,
  onPrevPage,
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(pagination?.currentPage || 1);

  // Sincronizar currentPage con la paginación del servidor
  useEffect(() => {
    if (pagination?.currentPage) {
      setCurrentPage(pagination.currentPage);
    }
  }, [pagination?.currentPage]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const {
    addToCart,
    updateQuantity,
    removeFromCart,
    getProductQuantity,
    isInCart,
    loading: cartLoading,
  } = useCartContext();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Las funciones getProductQuantity e isInCart ahora vienen del hook useCart

  // Manejar incremento de cantidad
  const handleIncreaseQuantity = async (tiendaProduct: TransformedProduct) => {
    const currentQuantity = getProductQuantity(tiendaProduct.id);
    await updateQuantity({
      productId: tiendaProduct.id,
      quantity: currentQuantity + 1,
    });
  };

  // Manejar decremento de cantidad
  const handleDecreaseQuantity = async (productId: number) => {
    const currentQuantity = getProductQuantity(productId);
    if (currentQuantity > 1) {
      await updateQuantity({ productId, quantity: currentQuantity - 1 });
    } else {
      await removeFromCart({ productId });
    }
  };

  // Convertir producto de tienda al formato del store
  const convertToStoreProduct = (
    tiendaProduct: TransformedProduct
  ): Product => {
    return {
      id: tiendaProduct.id,
      name: tiendaProduct.name,
      description:
        tiendaProduct.description ||
        `${tiendaProduct.brand} - ${tiendaProduct.category.name}`,
      price: parseFloat(tiendaProduct.price),
      image: tiendaProduct.image || "/images/products/placeholder.jpg",
      images: [tiendaProduct.image || "/images/products/placeholder.jpg"],
      category: tiendaProduct.category.name,
      brand: tiendaProduct.brand,
      alcoholContent: 5.0,
      volume: 500,
      style: tiendaProduct.category.name,
      origin: "Importada",
      inStock: tiendaProduct.stock_quantity > 0,
      stockQuantity: tiendaProduct.stock_quantity,
      rating: tiendaProduct.rating,
      reviewCount: tiendaProduct.reviewCount,
      tags: [tiendaProduct.category.name.toLowerCase()],
      featured: tiendaProduct.is_featured,
      createdAt: tiendaProduct.created_at,
      updatedAt: tiendaProduct.updated_at,
    };
  };

  const handleAddToCart = async (tiendaProduct: TransformedProduct) => {
    // Verificar que el producto tenga stock antes de intentar agregarlo
    if (tiendaProduct.stock_quantity === 0) {
      showError(
        "Producto agotado",
        `"${tiendaProduct.name}" no está disponible en este momento.`
      );
      return;
    }

    setAddingToCart(tiendaProduct.id);

    try {
      const result = await addToCart({
        productId: tiendaProduct.id,
        quantity: 1,
      });

      if (result.success) {
        setJustAdded(tiendaProduct.id);
        showSuccess(
          "¡Producto agregado! 🍺",
          `"${tiendaProduct.name}" se agregó al carrito exitosamente.`
        );
        // Limpiar el estado de "just added" después de 2 segundos
        setTimeout(() => {
          setJustAdded(null);
        }, 2000);
      } else {
        showError(
          "Error al agregar producto",
          result.message || "No se pudo agregar el producto al carrito"
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError(
        "Error al agregar producto",
        "Ocurrió un error inesperado. Intenta nuevamente."
      );
    } finally {
      setAddingToCart(null);
    }
  };

  // Configuración de paginación - usar la paginación del servidor si está disponible
  const totalPages = pagination?.lastPage || Math.ceil(products.length / 9);
  const currentProducts = pagination
    ? products
    : products.slice((currentPage - 1) * 9, currentPage * 9);

  // Para mostrar información de paginación
  const startIndex = pagination
    ? (pagination.currentPage - 1) * pagination.perPage + 1
    : (currentPage - 1) * 9 + 1;
  const endIndex = pagination
    ? Math.min(pagination.currentPage * pagination.perPage, pagination.total)
    : Math.min(currentPage * 9, products.length);

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numericPrice);
  };

  const goToPage = (page: number) => {
    // Scroll hacia arriba primero para mejor UX
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (onPageChange) {
      onPageChange(page);
    } else {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    // Scroll hacia arriba primero
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (onNextPage) {
      onNextPage();
    } else if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    // Scroll hacia arriba primero
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (onPrevPage) {
      onPrevPage();
    } else if (currentPage > 1) {
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
          Mostrando {startIndex}-{endIndex} de{" "}
          {pagination?.total || totalProducts || products.length} productos
        </div>
      </div>

      {/* Grid de productos */}
      {loading ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {/* Mostrar 9 skeletons para simular la carga */}
          {Array.from({ length: 9 }, (_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      ) : currentProducts.length === 0 ? (
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
                  className="overflow-hidden pt-4"
                  style={{ height: "354px" }}
                >
                  <LazyImage
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-full ${
                      product.stock_quantity === 0 ? "grayscale opacity-60" : ""
                    }`}
                  />
                </div>
                
                {/* Etiqueta de Agotado */}
                {product.stock_quantity === 0 && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                    AGOTADO
                  </div>
                )}
                
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
                      MARKET CLUB
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
                  {/* Botón de carrito cuadrado con contador - Solo visual */}
                  <div
                    className="relative p-3 rounded-lg"
                    style={{
                      backgroundColor: "transparent",
                      borderColor: "#D0D5DD",
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                    aria-label="Contador del carrito"
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
                  </div>

                  {/* Botón principal "Añadir al carrito" */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addingToCart === product.id || product.stock_quantity === 0}
                    className="flex-1 flex items-center justify-center space-x-2 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    style={{ 
                      backgroundColor: product.stock_quantity === 0 ? "#6B7280" : "#B58E31" 
                    }}
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
                        : product.stock_quantity === 0
                        ? "Agotado"
                        : isInCart(product.id)
                        ? "Agregar más"
                        : "Añadir al carrito"}
                    </span>
                    {addingToCart !== product.id && product.stock_quantity > 0 && (
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
            {/* Botón anterior - solo mostrar si no estamos en la página inicial */}
            {(pagination?.currentPage || currentPage) > 1 && (
              <button
                onClick={goToPrevPage}
                className="p-2 rounded-lg transition-colors text-white hover:text-gray-300 hover:bg-gray-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Números de página */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  const activePage = pagination?.currentPage || currentPage;

                  // Mostrar solo algunas páginas para evitar demasiados botones
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= activePage - 1 && page <= activePage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          page === activePage
                            ? "text-white"
                            : "text-white hover:text-gray-300 hover:bg-gray-800"
                        }`}
                        style={
                          page === activePage
                            ? { backgroundColor: "#B58E31" }
                            : {}
                        }
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === activePage - 2 ||
                    page === activePage + 2
                  ) {
                    return (
                      <span key={page} className="px-2 text-white">
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
              disabled={(pagination?.currentPage || currentPage) === totalPages}
              className={`p-2 rounded-lg transition-colors ${
                (pagination?.currentPage || currentPage) === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-white hover:text-gray-300 hover:bg-gray-800"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Toast de notificaciones */}
      <Toast
        isVisible={toast.isVisible}
        onClose={hideToast}
        title={toast.title}
        message={toast.message}
        type={toast.type}
      />
    </div>
  );
}
