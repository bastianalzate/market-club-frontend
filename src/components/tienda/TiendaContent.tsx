"use client";

import { useState } from "react";
import CategoryIcons from "./CategoryIcons";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";
import MarketClubBanner from "@/components/home/MarketClubBanner";
import ServicesBanner from "@/components/home/ServicesBanner";
import CountriesBanner from "./CountriesBanner";

// Mock data para productos - Expandido para validar paginación
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
    name: "Budweiser",
    brand: "Anheuser-Busch",
    price: 16000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-1.png",
    category: "Lager",
    inStock: true,
    rating: 3.8,
    reviewCount: 98,
  },
  {
    id: 8,
    name: "Miller Lite",
    brand: "MillerCoors",
    price: 17000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-2.png",
    category: "Lager",
    inStock: true,
    rating: 3.9,
    reviewCount: 76,
  },
  {
    id: 9,
    name: "Coors Light",
    brand: "Molson Coors",
    price: 17500,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-3.png",
    category: "Lager",
    inStock: true,
    rating: 3.7,
    reviewCount: 65,
  },
  {
    id: 10,
    name: "Guinness Draught",
    brand: "Diageo",
    price: 28000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-4.png",
    category: "Stout",
    inStock: true,
    rating: 4.8,
    reviewCount: 234,
  },
  {
    id: 11,
    name: "Sierra Nevada Pale Ale",
    brand: "Sierra Nevada",
    price: 32000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-5.png",
    category: "IPA",
    inStock: true,
    rating: 4.6,
    reviewCount: 189,
  },
  {
    id: 12,
    name: "Blue Moon Belgian White",
    brand: "Molson Coors",
    price: 26000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-6.png",
    category: "Wheat Beer",
    inStock: false,
    rating: 4.2,
    reviewCount: 112,
  },
  {
    id: 13,
    name: "Samuel Adams Boston Lager",
    brand: "Boston Beer Company",
    price: 24000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-1.png",
    category: "Lager",
    inStock: true,
    rating: 4.3,
    reviewCount: 145,
  },
  {
    id: 14,
    name: "Newcastle Brown Ale",
    brand: "Heineken",
    price: 29000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-2.png",
    category: "Brown Ale",
    inStock: true,
    rating: 4.1,
    reviewCount: 87,
  },
  {
    id: 15,
    name: "Bass Pale Ale",
    brand: "Anheuser-Busch",
    price: 25000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-3.png",
    category: "Pale Ale",
    inStock: true,
    rating: 4.0,
    reviewCount: 73,
  },
  {
    id: 16,
    name: "Harp Lager",
    brand: "Diageo",
    price: 23000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-4.png",
    category: "Lager",
    inStock: true,
    rating: 3.9,
    reviewCount: 56,
  },
  {
    id: 17,
    name: "Killian's Irish Red",
    brand: "Molson Coors",
    price: 27000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-5.png",
    category: "Red Ale",
    inStock: true,
    rating: 4.2,
    reviewCount: 94,
  },
  {
    id: 18,
    name: "Leinenkugel's Summer Shandy",
    brand: "Molson Coors",
    price: 31000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-6.png",
    category: "Shandy",
    inStock: true,
    rating: 4.4,
    reviewCount: 128,
  },
  {
    id: 19,
    name: "Shock Top Belgian White",
    brand: "Anheuser-Busch",
    price: 22000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-1.png",
    category: "Wheat Beer",
    inStock: true,
    rating: 3.8,
    reviewCount: 67,
  },
  {
    id: 20,
    name: "Michelob Ultra",
    brand: "Anheuser-Busch",
    price: 20000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-2.png",
    category: "Light Beer",
    inStock: true,
    rating: 3.6,
    reviewCount: 89,
  },
  {
    id: 21,
    name: "Amstel Light",
    brand: "Heineken",
    price: 21000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-3.png",
    category: "Light Beer",
    inStock: true,
    rating: 3.9,
    reviewCount: 78,
  },
  {
    id: 22,
    name: "Beck's",
    brand: "Anheuser-Busch",
    price: 24000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-4.png",
    category: "Lager",
    inStock: true,
    rating: 4.0,
    reviewCount: 103,
  },
  {
    id: 23,
    name: "Foster's",
    brand: "Heineken",
    price: 19000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-5.png",
    category: "Lager",
    inStock: true,
    rating: 3.7,
    reviewCount: 82,
  },
  {
    id: 24,
    name: "Dos Equis Lager",
    brand: "Heineken",
    price: 23000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-6.png",
    category: "Lager",
    inStock: true,
    rating: 4.1,
    reviewCount: 95,
  },
  {
    id: 25,
    name: "Tecate",
    brand: "Heineken",
    price: 18000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-1.png",
    category: "Lager",
    inStock: true,
    rating: 3.8,
    reviewCount: 71,
  },
];

export default function TiendaContent() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
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
          <ProductGrid products={products} />
        </div>
      </div>

      {/* Market Club Banner */}
      <MarketClubBanner />

      {/* Countries Banner */}
      <CountriesBanner />

      {/* Services Banner */}
      <ServicesBanner />
    </div>
  );
}
