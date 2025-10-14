"use client";

import { useState, useEffect } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { useProducts } from "@/hooks/useProducts";
import { TransformedProduct } from "@/hooks/useProducts";
import ProductCard from "@/features/products/components/ProductCard";
import AddToCartButton from "@/features/cart/components/AddToCartButton";
import { Product } from "@/features/products/types/product";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function FavoritosPage() {
  const { wishlistItems, loading: wishlistLoading } = useWishlist({
    showSuccess: () => {},
    showError: () => {},
    onProductFavoriteUpdate: () => {},
  });
  const { products: allProducts } = useProducts();
  const [favoriteProducts, setFavoriteProducts] = useState<TransformedProduct[]>([]);

  useEffect(() => {
    if (wishlistItems.length > 0 && allProducts.length > 0) {
      const favoriteProductsData = allProducts.filter(product =>
        wishlistItems.some(item => item.product_id === product.id)
      );
      setFavoriteProducts(favoriteProductsData);
    } else {
      setFavoriteProducts([]);
    }
  }, [wishlistItems, allProducts]);

  const handleAddToWishlist = (product: Product) => {
    // Esta función se maneja desde el contexto
    console.log("Toggle wishlist:", product);
  };

  if (wishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-oswald)" }}>
            Mis Favoritos
          </h1>
          <p className="text-gray-600">
            {favoriteProducts.length > 0 
              ? `${favoriteProducts.length} producto${favoriteProducts.length !== 1 ? 's' : ''} en tu lista de favoritos`
              : "No tienes productos favoritos aún"
            }
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: "var(--font-oswald)" }}>
              No tienes favoritos aún
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Cuando agregues productos a tus favoritos, aparecerán aquí para que puedas encontrarlos fácilmente.
            </p>
            <Link
              href="/tienda"
              className="inline-flex items-center px-6 py-3 bg-[#B58E31] text-white font-medium rounded-lg hover:bg-[#A07D2A] transition-colors"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Explorar Productos
            </Link>
          </div>
        ) : (
          <>
            {/* Grid de productos favoritos */}
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {favoriteProducts.map((product) => {
                // Convertir a formato Product para el componente ProductCard
                const productForCard: Product = {
                  id: product.id,
                  name: product.name,
                  description: product.description || `${product.brand} - ${product.category.name}`,
                  price: parseFloat(product.price),
                  image: product.image || "/images/products/placeholder.jpg",
                  images: [product.image || "/images/products/placeholder.jpg"],
                  category: product.category.name,
                  brand: product.brand,
                  alcoholContent: 5.0,
                  volume: 500,
                  style: product.category.name,
                  origin: "Importada",
                  inStock: product.stock_quantity > 0,
                  stockQuantity: product.stock_quantity,
                  rating: product.rating,
                  reviewCount: product.reviewCount,
                  tags: [product.category.name.toLowerCase()],
                  featured: product.is_featured,
                  createdAt: product.created_at,
                  updatedAt: product.updated_at,
                };

                return (
                  <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <ProductCard
                      product={productForCard}
                      onAddToWishlist={handleAddToWishlist}
                      isInWishlist={true}
                    />
                  </div>
                );
              })}
            </div>

            {/* Botón para ir a la tienda */}
            <div className="text-center mt-12">
              <Link
                href="/tienda"
                className="inline-flex items-center px-6 py-3 bg-[#B58E31] text-white font-medium rounded-lg hover:bg-[#A07D2A] transition-colors"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Ver Más Productos
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
