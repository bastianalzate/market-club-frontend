"use client";

import HeroSection from "@/components/home/HeroSection";
import BrandsCarousel from "@/components/home/BrandsCarousel";
import NewFlavorsSection from "@/components/home/NewFlavorsSection";
import ProductSlider from "@/components/home/ProductSlider";
import FavoriteProducts from "@/components/home/FavoriteProducts";
import MarketClubBanner from "@/components/home/MarketClubBanner";
import BeerClubSection from "@/components/home/BeerClubSection";
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
      <BeerClubSection />
      <MarketClubBanner />

      {/* Featured Products Section */}
    </div>
  );
}
