"use client";

import { useState } from "react";
import CategoryIcons from "./CategoryIcons";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";
import MarketClubBanner from "@/components/home/MarketClubBanner";

// Mock data para productos - Solo cervezas con duplicados para mostrar más cantidad
const products = [
  {
    id: 1,
    name: "PAULANER WEISSBIER",
    brand: "Paulaner",
    price: 17000,
    image: "/images/cervezas/bottella-06.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
  },
  {
    id: 2,
    name: "ERDINGER",
    brand: "Erdinger",
    price: 19000,
    image: "/images/cervezas/bottella-07.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.2,
    reviewCount: 89,
  },
  {
    id: 3,
    name: "LIEFMANS FRUITESSE",
    brand: "Liefmans",
    price: 23000,
    image: "/images/cervezas/bottella-08.png",
    category: "Fruit Beer",
    inStock: true,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: 4,
    name: "PAULANER WEISSBIER",
    brand: "Paulaner",
    price: 17000,
    image: "/images/cervezas/bottella-06.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.3,
    reviewCount: 203,
  },
  {
    id: 5,
    name: "ERDINGER",
    brand: "Erdinger",
    price: 19000,
    image: "/images/cervezas/bottella-07.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.1,
    reviewCount: 167,
  },
  {
    id: 6,
    name: "LIEFMANS FRUITESSE",
    brand: "Liefmans",
    price: 23000,
    image: "/images/cervezas/bottella-08.png",
    category: "Fruit Beer",
    inStock: true,
    rating: 4.4,
    reviewCount: 134,
  },
  {
    id: 7,
    name: "PAULANER WEISSBIER",
    brand: "Paulaner",
    price: 17000,
    image: "/images/cervezas/bottella-06.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.6,
    reviewCount: 98,
  },
  {
    id: 8,
    name: "ERDINGER",
    brand: "Erdinger",
    price: 19000,
    image: "/images/cervezas/bottella-07.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.0,
    reviewCount: 76,
  },
  {
    id: 9,
    name: "LIEFMANS FRUITESSE",
    brand: "Liefmans",
    price: 23000,
    image: "/images/cervezas/bottella-08.png",
    category: "Fruit Beer",
    inStock: true,
    rating: 4.8,
    reviewCount: 65,
  },
  {
    id: 10,
    name: "PAULANER WEISSBIER",
    brand: "Paulaner",
    price: 17000,
    image: "/images/cervezas/bottella-06.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.2,
    reviewCount: 234,
  },
  {
    id: 11,
    name: "ERDINGER",
    brand: "Erdinger",
    price: 19000,
    image: "/images/cervezas/bottella-07.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.4,
    reviewCount: 189,
  },
  {
    id: 12,
    name: "LIEFMANS FRUITESSE",
    brand: "Liefmans",
    price: 23000,
    image: "/images/cervezas/bottella-08.png",
    category: "Fruit Beer",
    inStock: false,
    rating: 4.1,
    reviewCount: 112,
  },
  {
    id: 13,
    name: "PAULANER WEISSBIER",
    brand: "Paulaner",
    price: 17000,
    image: "/images/cervezas/bottella-06.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.7,
    reviewCount: 145,
  },
  {
    id: 14,
    name: "ERDINGER",
    brand: "Erdinger",
    price: 19000,
    image: "/images/cervezas/bottella-07.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.3,
    reviewCount: 87,
  },
  {
    id: 15,
    name: "LIEFMANS FRUITESSE",
    brand: "Liefmans",
    price: 23000,
    image: "/images/cervezas/bottella-08.png",
    category: "Fruit Beer",
    inStock: true,
    rating: 4.5,
    reviewCount: 73,
  },
  {
    id: 16,
    name: "PAULANER WEISSBIER",
    brand: "Paulaner",
    price: 17000,
    image: "/images/cervezas/bottella-06.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.1,
    reviewCount: 56,
  },
  {
    id: 17,
    name: "ERDINGER",
    brand: "Erdinger",
    price: 19000,
    image: "/images/cervezas/bottella-07.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.6,
    reviewCount: 94,
  },
  {
    id: 18,
    name: "LIEFMANS FRUITESSE",
    brand: "Liefmans",
    price: 23000,
    image: "/images/cervezas/bottella-08.png",
    category: "Fruit Beer",
    inStock: true,
    rating: 4.2,
    reviewCount: 128,
  },
  {
    id: 19,
    name: "PAULANER WEISSBIER",
    brand: "Paulaner",
    price: 17000,
    image: "/images/cervezas/bottella-06.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.4,
    reviewCount: 67,
  },
  {
    id: 20,
    name: "ERDINGER",
    brand: "Erdinger",
    price: 19000,
    image: "/images/cervezas/bottella-07.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.0,
    reviewCount: 89,
  },
  {
    id: 21,
    name: "LIEFMANS FRUITESSE",
    brand: "Liefmans",
    price: 23000,
    image: "/images/cervezas/bottella-08.png",
    category: "Fruit Beer",
    inStock: true,
    rating: 4.3,
    reviewCount: 78,
  },
  {
    id: 22,
    name: "PAULANER WEISSBIER",
    brand: "Paulaner",
    price: 17000,
    image: "/images/cervezas/bottella-06.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.5,
    reviewCount: 103,
  },
  {
    id: 23,
    name: "ERDINGER",
    brand: "Erdinger",
    price: 19000,
    image: "/images/cervezas/bottella-07.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.2,
    reviewCount: 82,
  },
  {
    id: 24,
    name: "LIEFMANS FRUITESSE",
    brand: "Liefmans",
    price: 23000,
    image: "/images/cervezas/bottella-08.png",
    category: "Fruit Beer",
    inStock: true,
    rating: 4.7,
    reviewCount: 95,
  },
  {
    id: 25,
    name: "PAULANER WEISSBIER",
    brand: "Paulaner",
    price: 17000,
    image: "/images/cervezas/bottella-06.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 4.1,
    reviewCount: 71,
  },
];

export default function TiendaContent() {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar productos basándose en el término de búsqueda
  const filteredProducts = products.filter((product) => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.brand.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen">
      {/* Sección con fondo negro hasta el MarketClubBanner */}
      <div className="bg-black">
        {/* Iconos de categorías */}
        <CategoryIcons />

        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar de filtros */}
            <ProductFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />

            {/* Contenido principal */}
            <ProductGrid products={filteredProducts} />
          </div>
        </div>

        {/* Market Club Banner */}
        <MarketClubBanner />
      </div>

      {/* Sección con fondo gris después del MarketClubBanner */}
      <div className="bg-gray-50">
      </div>
    </div>
  );
}
