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
  product_type_id: number;
  attributes: any;
  product_specific_data: {
    alcohol_content?: string | number;
    beer_style?: string;
    brewery?: string;
    country_of_origin?: string;
    volume_ml?: string;
    packaging_type?: string;
  } | null;
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

// Tipo para productos transformados
export interface TransformedProduct extends Product {
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

// Hook para manejar productos desde la API con paginación real
export const useProducts = () => {
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
  });

  // Función helper para transformar un producto
  const transformProduct = (product: Product): TransformedProduct => ({
    ...product,
    // Agregar campos que faltan con valores por defecto
    brand: product.product_specific_data?.brewery || product.category.name,
    rating: 4.5, // Valor por defecto
    reviewCount: Math.floor(Math.random() * 200) + 50, // Valor aleatorio
    inStock: product.stock_quantity > 0,
    image: product.image ? `${constants.api_url.replace('/api', '')}/storage/${product.image}` : null,
  });

  // Función para obtener productos de una página específica
  const fetchProducts = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${constants.api_url}/products?page=${page}`, {
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
      
      if (!data.data || !Array.isArray(data.data)) {
      if (data.data && Array.isArray(data.data)) {
        // Transformar los productos para que coincidan con la interfaz esperada
        const transformedProducts = data.data.map(product => ({
          ...product,
          // Agregar campos que faltan con valores por defecto
          brand: product.category.name, // Usar el nombre de la categoría como marca
          rating: 4.5, // Valor por defecto
          reviewCount: Math.floor(Math.random() * 200) + 50, // Valor aleatorio
          inStock: product.stock_quantity > 0,
          image: product.image || '/images/products/placeholder.jpg', // Imagen por defecto
          category: product.category.name,
        }));
        setProducts(transformedProducts);
      } else {
        throw new Error('No se encontraron productos en la respuesta');
      }

      // Actualizar información de paginación
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
        perPage: data.per_page,
      });

      // Transformar solo los productos de la página actual
      const transformedProducts = data.data.map(transformProduct);
      setProducts(transformedProducts);
      
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para cambiar de página
  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.lastPage) {
      fetchProducts(page);
    }
  };

  // Función para ir a la página siguiente
  const nextPage = () => {
    if (pagination.currentPage < pagination.lastPage) {
      goToPage(pagination.currentPage + 1);
    }
  };

  // Función para ir a la página anterior
  const prevPage = () => {
    if (pagination.currentPage > 1) {
      goToPage(pagination.currentPage - 1);
    }
  };

  // Función para buscar productos
  const searchProducts = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      fetchProducts(1);
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
        const transformedProducts = data.data.map(product => ({
          ...product,
          // Agregar campos que faltan con valores por defecto
          brand: product.category.name, // Usar el nombre de la categoría como marca
          rating: 4.5, // Valor por defecto
          reviewCount: Math.floor(Math.random() * 200) + 50, // Valor aleatorio
          inStock: product.stock_quantity > 0,
          image: product.image || '/images/products/placeholder.jpg', // Imagen por defecto
          category: product.category.name,
        }));
        setProducts(transformedProducts);
        
        // Actualizar paginación para búsqueda
        setPagination({
          currentPage: data.current_page,
          lastPage: data.last_page,
          total: data.total,
          perPage: data.per_page,
        });
      } else {
        throw new Error('No se encontraron productos en la búsqueda');
      }
    } catch (err) {
      console.error('Error searching products:', err);
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts(1);
  }, []);

  return {
    products,
    loading,
    error,
    pagination,
    fetchProducts,
    searchProducts,
    goToPage,
    nextPage,
    prevPage,
  };
};