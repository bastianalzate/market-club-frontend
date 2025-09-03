"use client";

import { useState } from "react";
import ProductFilters from "./ProductFilters";
import ProductGrid from "./ProductGrid";

// Mock data para productos
const products = [
  {
    id: 1,
    name: "Peroni Nastro Azzurro",
    brand: "Peroni",
    price: 25000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-1.png",
    category: "Lager",
    inStock: true,
    rating: 4.5,
    reviewCount: 128,
  },
  {
    id: 2,
    name: "Bitburger 0.0",
    brand: "Bitburger",
    price: 19000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-2.png",
    category: "Sin Alcohol",
    inStock: true,
    rating: 4.2,
    reviewCount: 89,
  },
  {
    id: 3,
    name: "Asahi Super Dry",
    brand: "Asahi",
    price: 19000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-3.png",
    category: "Lager",
    inStock: false,
    rating: 4.7,
    reviewCount: 156,
  },
  {
    id: 4,
    name: "Stella Artois",
    brand: "Stella Artois",
    price: 22000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-4.png",
    category: "Lager",
    inStock: true,
    rating: 4.3,
    reviewCount: 203,
  },
  {
    id: 5,
    name: "Heineken Premium",
    brand: "Heineken",
    price: 18000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-5.png",
    category: "Lager",
    inStock: true,
    rating: 4.1,
    reviewCount: 167,
  },
  {
    id: 6,
    name: "Corona Extra",
    brand: "Corona",
    price: 21000,
    image:
      "https://cdn.rareblocks.xyz/collection/clarity-ecommerce/images/item-cards/8/product-6.png",
    category: "Lager",
    inStock: true,
    rating: 4.4,
    reviewCount: 134,
  },
];

export default function TiendaContent() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
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
    </div>
  );
}
