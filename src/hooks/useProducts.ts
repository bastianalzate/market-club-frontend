import { useState, useEffect } from 'react';
import { constants } from '@/config/constants';

// Tipo para los productos que vienen de la API
export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  description?: string;
  volume?: string;
  alcoholContent?: string;
  country?: string;
}

// Tipo para la respuesta de la API
interface ProductsResponse {
  success: boolean;
  data: Product[];
  message?: string;
}

// Hook para manejar productos desde la API
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener productos desde la API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${constants.api_url}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ProductsResponse = await response.json();
      
      if (data.success && data.data) {
        setProducts(data.data);
      } else {
        throw new Error(data.message || 'Error al obtener los productos');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      
      // En caso de error, usar datos mock como fallback
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  // Función para buscar productos
  const searchProducts = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${constants.api_url}/products/search?q=${encodeURIComponent(searchTerm)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ProductsResponse = await response.json();
      
      if (data.success && data.data) {
        setProducts(data.data);
      } else {
        throw new Error(data.message || 'Error al buscar productos');
      }
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
      
      // Fallback: filtrar productos mock localmente
      const mockProducts = getMockProducts();
      const filtered = mockProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProducts(filtered);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    searchProducts,
  };
};

// Datos mock como fallback
function getMockProducts(): Product[] {
  return [
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
      description: "Cerveza de trigo alemana tradicional",
      volume: "500ml",
      alcoholContent: "5.5%",
      country: "Alemania",
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
      description: "Cerveza de trigo bávara",
      volume: "500ml",
      alcoholContent: "5.3%",
      country: "Alemania",
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
      description: "Cerveza de frutas belga",
      volume: "250ml",
      alcoholContent: "3.8%",
      country: "Bélgica",
    },
  ];
}
