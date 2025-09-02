"use client";

import HeroSection from "@/components/home/HeroSection";
import BrandsCarousel from "@/components/home/BrandsCarousel";
import NewFlavorsSection from "@/components/home/NewFlavorsSection";
import ProductSlider from "@/components/home/ProductSlider";
import FavoriteProducts from "@/components/home/FavoriteProducts";
import ProductCard from "@/features/products/components/ProductCard";
import { Product } from "@/features/products/types/product";

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: 1,
    name: "IPA Artesanal Local",
    description:
      "Una IPA refrescante con notas cítricas y un amargor equilibrado",
    price: 8.99,
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=400&fit=crop",
    ],
    category: "IPA",
    brand: "Cervecería Local",
    alcoholContent: 6.5,
    volume: 355,
    style: "India Pale Ale",
    origin: "Local",
    inStock: true,
    stockQuantity: 50,
    rating: 4.5,
    reviewCount: 23,
    tags: ["artesanal", "local", "IPA"],
    featured: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Stout Imperial Premium",
    description: "Stout rico y cremoso con notas de chocolate y café",
    price: 12.99,
    image:
      "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&h=400&fit=crop",
    ],
    category: "Stout",
    brand: "Cervecería Premium",
    alcoholContent: 8.2,
    volume: 500,
    style: "Imperial Stout",
    origin: "Importada",
    inStock: true,
    stockQuantity: 25,
    rating: 4.8,
    reviewCount: 15,
    tags: ["premium", "importada", "stout"],
    featured: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: 3,
    name: "Lager Clásica",
    description: "Lager suave y refrescante, perfecta para cualquier ocasión",
    price: 6.99,
    image:
      "https://images.unsplash.com/photo-1566633806327-38e8c4d0a6b8?w=400&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1566633806327-38e8c4d0a6b8?w=400&h=400&fit=crop",
    ],
    category: "Lager",
    brand: "Cervecería Tradicional",
    alcoholContent: 4.8,
    volume: 330,
    style: "Pale Lager",
    origin: "Local",
    inStock: true,
    stockQuantity: 100,
    rating: 4.2,
    reviewCount: 45,
    tags: ["clásica", "refrescante", "lager"],
    featured: false,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

export default function HomePage() {
  const handleAddToCart = (product: Product) => {
    // TODO: Implementar lógica del carrito
    console.log("Agregar al carrito:", product);
  };

  const handleAddToWishlist = (product: Product) => {
    // TODO: Implementar lógica de wishlist
    console.log("Agregar a wishlist:", product);
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      <BrandsCarousel />
      <NewFlavorsSection />
      <ProductSlider />
      <FavoriteProducts />

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cervezas Destacadas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre nuestras selecciones más populares y las nuevas
              incorporaciones a nuestra colección de cervezas premium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 transition-colors"
            >
              Ver Todas las Cervezas
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Market Club?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofrecemos la mejor experiencia en compra de cervezas con calidad
              garantizada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Envío Rápido
              </h3>
              <p className="text-gray-600">
                Recibe tus cervezas en 24-48 horas con envío seguro y
                refrigerado
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Calidad Premium
              </h3>
              <p className="text-gray-600">
                Solo trabajamos con las mejores cervecerías y marcas reconocidas
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Soporte 24/7
              </h3>
              <p className="text-gray-600">
                Nuestro equipo está disponible para ayudarte en cualquier
                momento
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
