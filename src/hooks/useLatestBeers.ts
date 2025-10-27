"use client";

import { useState, useEffect } from "react";
import { constants } from "@/config/constants";
import { getAuthHeaders } from "@/utils/authHeaders";

export interface LatestBeer {
  id: number;
  name: string;
  price: number;
  sale_price: number | null;
  current_price: number;
  image_url: string;
  stock_quantity: number;
  packaging_type?: string | null;
  volume_ml?: string | null;
  created_at: string;
  product_specific_data?: {
    alcohol_content?: string | number;
    beer_style?: string;
    brewery?: string;
    country_of_origin?: string;
    volume_ml?: string;
    packaging_type?: string;
  } | null;
}

export const useLatestBeers = () => {
  const [beers, setBeers] = useState<LatestBeer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestBeers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching latest beers with auth headers');
      
      const response = await fetch(`${constants.api_url}/products/latest-beers`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: LatestBeer[] = await response.json();
      setBeers(data);

    } catch (err) {
      console.error('Error fetching latest beers:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setBeers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestBeers();
  }, []);

  return {
    beers,
    loading,
    error,
    refetch: fetchLatestBeers,
  };
};
