"use client";

import HeroSection from "@/components/home/HeroSection";
import BrandsCarousel from "@/components/home/BrandsCarousel";
import NewFlavorsSection from "@/components/home/NewFlavorsSection";
import ProductSlider from "@/components/home/ProductSlider";
import FavoriteProducts from "@/components/home/FavoriteProducts";
import MarketClubBanner from "@/components/home/MarketClubBanner";
import BeerClubSection from "@/components/home/BeerClubSection";
import BeerCarousel from "@/components/home/BeerCarousel";
import ProductCard from "@/features/products/components/ProductCard";
import AddToCartButton from "@/features/cart/components/AddToCartButton";
// import CartDebugger from "@/components/debug/CartDebugger";
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

      {/* Debug component - solo en desarrollo */}
      {/* <CartDebugger /> */}
    </div>
  );
}
