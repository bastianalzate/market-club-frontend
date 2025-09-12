import { useState, useEffect } from 'react';
import { constants } from '@/config/constants';

// Tipo para los productos que vienen de la API
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string; // La API devuelve string
  sale_price: string | null;
  sku: string;
  stock_quantity: number;
  image: string | null;
  gallery: string | null;
  is_active: boolean;
  is_featured: boolean;
  category_id: number;
  attributes: any;
  created_at: string;
  updated_at: string;
  category: {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

// Tipo para los productos transformados que se usan en la tienda
export interface TiendaProduct extends Product {
  // Campos agregados por la transformación
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

// Tipo para la respuesta de la API de Laravel (con paginación)
interface ProductsResponse {
  current_page: number;
  data: Product[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Hook para manejar productos desde la API
export const useProducts = () => {
  const [products, setProducts] = useState<TiendaProduct[]>([]);
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
      
      if (data.data && Array.isArray(data.data)) {
        // Transformar los productos para que coincidan con la interfaz esperada
        const transformedProducts: TiendaProduct[] = data.data.map(product => ({
          ...product,
          // Agregar campos que faltan con valores por defecto
          brand: product.category.name, // Usar el nombre de la categoría como marca
          rating: 4.5, // Valor por defecto
          reviewCount: Math.floor(Math.random() * 200) + 50, // Valor aleatorio
          inStock: product.stock_quantity > 0,
          image: product.image || '/images/products/placeholder.jpg', // Imagen por defecto
        }));
        setProducts(transformedProducts);
      } else {
        throw new Error('No se encontraron productos en la respuesta');
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
      
      if (data.data && Array.isArray(data.data)) {
        // Transformar los productos para que coincidan con la interfaz esperada
        const transformedProducts: TiendaProduct[] = data.data.map(product => ({
          ...product,
          // Agregar campos que faltan con valores por defecto
          brand: product.category.name, // Usar el nombre de la categoría como marca
          rating: 4.5, // Valor por defecto
          reviewCount: Math.floor(Math.random() * 200) + 50, // Valor aleatorio
          inStock: product.stock_quantity > 0,
          image: product.image || '/images/products/placeholder.jpg', // Imagen por defecto
        }));
        setProducts(transformedProducts);
      } else {
        throw new Error('No se encontraron productos en la búsqueda');
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
  ];
}
