import { useState, useEffect } from 'react';
import { constants } from '@/config/constants';
import { getAuthHeaders } from '@/utils/authHeaders';

// Tipo para las categorías que vienen del backend
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Hook para obtener categorías desde el backend
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener categorías del backend
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Fetching categories from backend...');
      
      const response = await fetch(`${constants.api_url}/categories`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data && Array.isArray(data)) {
        setCategories(data);
      } else {
        throw new Error('No se encontraron categorías en la respuesta');
      }
      
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar categorías');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
};
