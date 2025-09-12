"use client";

import { useState, useEffect } from "react";
import { constants } from "@/config/constants";

export interface FeaturedProduct {
  id: number;
  name: string;
  price: number;
  sale_price: number | null;
  current_price: number;
  image_url: string;
}

export const useFeaturedProducts = () => {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${constants.api_url}/products/featured`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: FeaturedProduct[] = await response.json();
      setProducts(data);

    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return {
    products,
    loading,
    error,
    refetch: fetchFeaturedProducts,
  };
};
