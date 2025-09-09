"use client";

import HeroSection from "@/components/home/HeroSection";
import BrandsCarousel from "@/components/home/BrandsCarousel";
import NewFlavorsSection from "@/components/home/NewFlavorsSection";
import ProductSlider from "@/components/home/ProductSlider";
import FavoriteProducts from "@/components/home/FavoriteProducts";
import MarketClubBanner from "@/components/home/MarketClubBanner";
import BeerClubSection from "@/components/home/BeerClubSection";
import BeerCarousel from "@/components/home/BeerCarousel";
import ServicesBanner from "@/components/home/ServicesBanner";
import ProductCard from "@/features/products/components/ProductCard";
import AddToCartButton from "@/features/cart/components/AddToCartButton";
import { Product } from "@/features/products/types/product";
import { mockProducts } from "@/features/products/data/mockProducts";

export default function HomePage() {
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
      <MarketClubBanner backgroundColor="#FFFFFF" textColor="#000000" />
      <BeerClubSection />
      <MarketClubBanner backgroundColor="#000000" textColor="#FFFFFF" />
      {/* <BeerCarousel /> */}
      <ServicesBanner />

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-lg text-gray-600">
              Descubre nuestras cervezas más populares
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-amber-600">
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.brand}
                    </span>
                  </div>
                  <AddToCartButton product={product} className="w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
