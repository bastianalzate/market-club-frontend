"use client";

import { useState, useEffect } from "react";
import { constants } from "@/config/constants";

export interface LatestBeer {
  id: number;
  name: string;
  price: number;
  sale_price: number | null;
  current_price: number;
  image_url: string;
  created_at: string;
}

export const useLatestBeers = () => {
  const [beers, setBeers] = useState<LatestBeer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestBeers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${constants.api_url}/products/latest-beers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
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
